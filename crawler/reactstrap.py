from bs4 import BeautifulSoup as bs4
import requests
import json
import re

def getLinks():
    links = []
    r = requests.get('https://reactstrap.github.io/components/alerts/')
    soup = bs4(r.text, 'html.parser')
    for line in soup.find('ul', {'class':'flex-column'}).find_all('li', {'class': 'nav-item'}):
        path = line.find('a')['href']
        url = 'https://reactstrap.github.io'+path
        links.append(url)
    return links

def readApi(link):
    group = []
    soup = bs4(requests.get(link).text, 'html.parser')
    titles = soup.find_all(text=re.compile('.*Properties'))
    if len(titles) == 0:
        print(link, 'is manual')
        return group
    for title in titles:
        code = title.findNext('pre').text
        for block in code.split(';'):
            if '.propTypes' in block:
                data = {'prop':{}, 'name': block.split('.propTypes')[0].strip()}
                for line in block.split('\n'):
                    default = False
                    if '//' in line:
                        comment = line.split('//')[1]
                        if 'default: ' in comment:
                            default = comment.split(': ')[1].split(')')[0]
                        line = line.split('//')[0]
                    if ':' in line and not '$$typeof' in line:
                        key = line.split(':')[0].strip()
                        if 'children' in key or key == '' or key == 'className' or key == 'cssModule' or key == 'innerRef': continue
                        value = line.split(':')[1]
                        data['prop'][key] = {}
                        if 'PropTypes.string' in value:
                            data['prop'][key]['type'] = 'string'
                        elif 'PropTypes.bool' in value:
                            data['prop'][key]['type'] = 'bool'
                        elif 'PropTypes.func' in value:
                            data['prop'][key]['type'] = 'func'
                        elif 'PropTypes.oneOfType' in value:
                            data['prop'][key]['type'] = 'string'
                        elif 'PropTypes.object' in value:
                            data['prop'][key]['type'] = 'object'
                        elif 'PropTypes.oneOf' in value:
                            data['prop'][key]['type'] = 'enum'
                            data['prop'][key]['select'] = []
                            for item in value.split('[')[1].split(']')[0].split(','):
                                data['prop'][key]['select'].append(item.replace('\'',''))
                            print(data['name'], key, value)
                        else:
                            print(data['name'], key, value)
                        
                        if default:
                            data['prop'][key]['default'] = default
                group.append(data)
    return group

def start():
    links = getLinks()
    data = []
    for i, link in enumerate(links):
        data.extend(readApi(link))
        print(i,'/',len(links))
    with open('reactstrap.json', 'w', encoding='utf8') as f:
        f.write(json.dumps(data, indent=2).encode('utf8').decode('unicode_escape'))

if __name__ == '__main__':
    start()