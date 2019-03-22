import initJson from '../resource/init.json'
import comData from '../resource/components.json'
import PubsubService from './pubsub.service.js';
import ReactStrapService from './reactstrap.service.js';
import Utils from '../service/utils';
import template from '../resource/template.json';

export default class DataService {

    static data
    static components
    static page
    static folder

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

    static get(page, selected_id=-1, currentPage=true) {
        if (currentPage) DataService.page = page
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
                    items: imports[lib],
                    libname: lib
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

        let id = 1
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
        DataService.folder = hierarchy
        return DataService.folder
    }

    static getLayout(page) {
        const convertForm = (item) => {
            item.collapse = true
            item.children.forEach(child=>convertForm(child))
        }
        convertForm(DataService.data[page])
        return DataService.data[page]
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

    static getReactJs() {
        let js = '';
        let impjs = '';
        const imps = {};
        const classes = [];

        Object.keys(DataService.data).forEach(page=> {
            const target = DataService.get(page, -1, false);
            target.imports.forEach(imp=> {
                if (!(imp.libname in imps)) {
                    imps[imp.libname] = [];
                }
                imp.items.forEach(item=> {
                    if (imps[imp.libname].indexOf(item) === -1) {
                        imps[imp.libname].push(item);
                    }
                });
            });
            let className = 'Designed';
            page.slice(0, page.length-3).split('/').forEach(path=> {
                if (path.length > 0) {
                    className += path[0].toUpperCase() + path.slice(1, path.length);
                }
            })
            classes.push(template.class.replace('{code}', target.code).replace('{classname}', className));
        });
        Object.keys(imps).forEach(from=> {
            impjs +='import { '
            imps[from].forEach((item, i)=> {
                impjs += item;
                if (imps[from].length -1 !== i) {
                    impjs += ', '
                }
            });
            impjs += ' } from \''+from+'\';\n';
        })
        js = template.abstract.replace('{import}', impjs);
        
        classes.forEach(com=> {
            js += '\n' + com;
        });
        return js;
    }
} 