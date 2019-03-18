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
        const internalKeys = ['children', 'code', 'component', 'id', 'import']

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
            Object.keys(item).forEach(prop=> {
                if (internalKeys.indexOf(prop) === -1) {
                    let value = String(item[prop])
                    if (typeof(item[prop]) === 'object') {
                        value = JSON.stringify(item[prop])
                    } else if (typeof(item[prop]) === 'string') {
                        value = '"' + String(item[prop]) + '"'
                    }
                    code = code.replace('{'+prop+'}', value)
                }
            })
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
        return Object.keys(DataService.data)
    }
}