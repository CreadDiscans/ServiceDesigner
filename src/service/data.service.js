import initJson from '../resource/init.json'
import comData from '../resource/components.json'
import PubsubService from './pubsub.service.js';
import ReactStrapService from './reactstrap.service.js';
import Utils from '../service/utils';

export default class DataService {

    static data
    static components

    static libTable = {
        reactstrap: ReactStrapService
    }

    static inialize() {
        DataService.components = comData
        DataService.setLoadData(initJson)
    }

    static open(page) {
        PubsubService.pub(PubsubService.KEY_OPEN_PAGE, page)
    }

    static get(page, selected_id=-1) {
        const imports = {}
        const parse = (item) => {
            item.import.forEach(imp=> {
                if (!(imp.from in imports)) {
                    imports[imp.from] = []
                }
                imp.items.forEach(it=> {
                    if (imports[imp.from].indexOf(it) === -1) {
                        imports[imp.from].push(it)
                    }
                })
            })
            let code = item.code
            let children = ''
            item.children.forEach(child=> {
                children += parse(child)
            })
            Object.keys(item.property).forEach(prop=> {
                let value = String(item.property[prop])
                if (typeof(item.property[prop]) === 'object') {
                    value = JSON.stringify(item.property[prop])
                } else if (prop !== 'text' && typeof(item.property[prop]) === 'string') {
                    value = '"' + String(item.property[prop]) + '"'
                }
                code = code.replace('{'+prop+'}', value)
            })
            const style = Utils.deepcopy(item.style)
            if (item.id === selected_id) {
                style.border = 'solid 1px red'
            } 
            code = code.replace('{style}', JSON.stringify(style))
            code = code.replace('{children}', children)
            return code
        }

        const convertImport = () => {
            const out = []
            Object.keys(imports).forEach(lib=> {
                const item = {
                    library: DataService.libTable[lib],
                    items: imports[lib]
                }
                out.push(item)
            })
            return out
        }
        const code = parse(DataService.data[page])

        return {
            imports: convertImport(),
            code: code
        }
    }

    static getFolder() {
        const createNode = (parent, name) => {
            let target = null
            parent.children.forEach(item=> {
                if (item.name === name) {
                    target = item
                }
            })
            if (target === null) {
                target = {
                    id: id,
                    name: name,
                    type: name.indexOf('.js') === -1 ? 'folder' : 'js',
                    collapse: true,
                    children: [] 
                }
                parent.children.push(target)
                id += 1
            }
            return target
        }

        let id = 0
        const paths = Object.keys(DataService.data).sort()
        const hierarchy = {
            id:0,
            name: '',
            type: 'root',
            collapse: true,
            children: [],
        }
        paths.forEach(item=> {
            const parts = item.split('/')
            let parent = {children:[hierarchy]}
            parts.forEach((name)=> {
                parent = createNode(parent, name)
            })
        })
        return hierarchy
    }

    static getLayout(page) {
        const convertForm = (item) => {
            item.collapse = true
            item.children.forEach(child=>convertForm(child))
        }
        convertForm(DataService.data[page])
        return DataService.data[page]
    }

    static insert(page, component, parent) {
        let maxId = 0
        const findMaxId = (item) => {
            if (maxId < item.id) {
                maxId = item.id
            }
            item.children.forEach(child=>findMaxId(child))
        }
        const convertImport = () => {
            const imp = []
            component.import.split('\n').forEach(line=> {
                line = line.replace(/;/gi, '')
                const lib = line.split('from')[1].replace(/ /, '').replace(/'/gi, '')
                const items = []
                line.split('{')[1].split('}')[0].split(',').forEach(it=> {
                    items.push(it.replace(/ /gi, ''))
                })
                imp.push({from:lib, items:items})
            })
            return imp
        }

        findMaxId(DataService.data[page])
        const prop = Utils.deepcopy(component.property)
        let style = {}
        if (prop.style) {
            style = prop.style
            delete prop.style
        }
        parent.children.push({
            id: maxId+1,
            component: component.name,
            import: convertImport(),
            code: component.code,
            style: style,
            property: prop,
            children: []
        })
    }

    static remove(page, item) {
        let target;
        const findParent = (parent) => {
            parent.children.forEach(child=> {
                if (target) {
                    return
                }
                if (child === item) {
                    target = parent
                } else {
                    findParent(child)
                }
            })
        }
        findParent(DataService.data[page])
        if (target) {
            const index = target.children.indexOf(item)
            target.children.splice(index, 1)
        }
    }

    static getSaveForm() {
        const form = Utils.deepcopy(DataService.data)
        const removeCollapse = (item) => {
            delete item.collapse
            item.children.forEach(child=>removeCollapse(child))
        }
        Object.keys(form).forEach(key=> removeCollapse(form[key]))
        return form
    }

    static setLoadData(json) {
        DataService.data = json
        const page = Object.keys(DataService.data)[0]
        PubsubService.pub(PubsubService.KEY_LOAD_JSON, true)
        DataService.open(page)
    }
}