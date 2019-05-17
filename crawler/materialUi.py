from bs4 import BeautifulSoup as bs4
import requests
import json

def getLinks():
    links = []
    r = requests.get('https://material-ui.com/api/app-bar/')
    soup = bs4(r.text, 'html.parser')
    for line in soup.find_all('li', {'class': 'jhr3lg7'}):
        path = line.find('a')['href']
        if 'api' in path:
            url = 'https://material-ui.com'+path
            links.append(url)
    return links

def readApi(link):
    data = {'prop':{}}
    soup = bs4(requests.get(link).text, 'html.parser')
    data['name'] = soup.find('h6', {'class':'j1cwgun4'}).text
    for line in soup.find('table').find('tbody').find_all('tr'):
        tds = line.find_all('td')
        name = tds[0].text
        if 'children' in name: continue
        if 'classes' in name: continue
        if '*' in name:
            name = name[:-2]
        data['prop'][name] = {}
        type = tds[1].text
        if 'enum' in type:
            data['prop'][name]['type'] = 'enum'
            spliter = ','
            if '|' in type: spliter = '|'
            select = []
            for item in type.split(spliter):
                if '\'' in item:
                    select.append(item.split('\'')[1])
                elif '"' in item:
                    select.append(item.split('"')[1])
                else: 
                    select.append(item)
            data['prop'][name]['select'] = select
        elif 'union' in type:
            data['prop'][name]['type'] = 'any'
        else:
            data['prop'][name]['type'] = type
        default = tds[2].text
        if default and data['prop'][name]['type'] != 'any':
            if '\'' in default: default = default.split('\'')[1]
            data['prop'][name]['default'] = default
    return data

def start():
    links = getLinks()
    data = []
    for i, link in enumerate(links):
        data.append(readApi(link))
        print(i,'/',len(links))
    with open('materialUi.json', 'w', encoding='utf8') as f:
        f.write(json.dumps(data, indent=2).encode('utf8').decode('unicode_escape'))

if __name__ == '__main__':
    start()