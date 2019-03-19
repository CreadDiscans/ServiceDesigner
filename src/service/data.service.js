import initJson from '../resource/init.json'
import PubsubService from './pubsub.service.js';
import ReactStrapService from './reactstrap.service.js';

export default class DataService {

    static data

    static libTable = {
        reactstrap: ReactStrapService
    }

    static inialize() {
        DataService.data = initJson
        const page = Object.keys(DataService.data)[0]
        PubsubService.pub(PubsubService.KEY_LOAD_JSON, true)
        DataService.open(page)
    }

    static open(page) {
        PubsubService.pub(PubsubService.KEY_OPEN_PAGE, page)
    }

    static get(page) {
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
            code = code.replace('{style}', JSON.stringify(item.style))
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
}