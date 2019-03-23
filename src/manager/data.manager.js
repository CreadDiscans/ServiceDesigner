import { Singletone } from "../service/singletone";
import { LayoutManager } from "./layout.manager";
import { FolderManager } from "./folder.manager";
import { HistoryService } from './../service/history.service';
import ReactStrapService from './../service/reactstrap.service';
import Utils from '../service/utils';
import { ElementManager } from "./element.manager";
import template from '../resource/template.json';

const { remote } = window.require('electron')
const fs = window.require('fs')
export class DataManager extends Singletone {

    data;
    page;

    static libTable = {
        reactstrap: ReactStrapService
    }

    initialize(data) {
        this.data = data;
        this.page = Object.keys(data)[0];
        HistoryService.getInstance(HistoryService).flush();
        LayoutManager.getInstance(LayoutManager).initialize(this.data[this.page]);
        FolderManager.getInstance(FolderManager).initialize(this.getFolder());
    }

    openJs(page) {
        this.page = page;
        LayoutManager.getInstance(LayoutManager).initialize(this.data[this.page]);
    }

    getFolder() {
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
        const paths = Object.keys(this.data).sort()
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
        return hierarchy;
    }

    render() {
        const selected_id = LayoutManager.getInstance(LayoutManager).selected;
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
                    library: DataManager.libTable[lib],
                    items: imports[lib],
                    libname: lib
                }
                out.push(item)
            })
            return out
        }
        const code = parse(this.data[this.page]);

        return {
            imports: convertImport(),
            code: code
        }
    }

    export() {
        const js = this.getReactJs();
        const output = {data: this.getSaveForm(), components: ElementManager.getInstance(ElementManager).data}
        const dirs = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
        if (dirs) {
            fs.writeFile(dirs[0]+'/design.json', JSON.stringify(output), err=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved json')
            });
            fs.writeFile(dirs[0]+'/design.js', js, err=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved js')
            });
        }
    }

    import() {
        const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
        if (file) {
            fs.readFile(file[0], (err, data)=> {
                if (err) throw err
                try {
                    const json = JSON.parse(data.toString())
                    this.initialize(json);
                    ElementManager.getInstance(ElementManager).initialize(json.components);
                }catch(e) {console.log(e)}
            })
        }
    }

    getSaveForm() {
        const form = Utils.deepcopy(this.data)
        const removeCollapse = (item) => {
            delete item.collapse
            item.children.forEach(child=>removeCollapse(child))
        }
        Object.keys(form).forEach(key=> removeCollapse(form[key]))
        return form
    }

    getReactJs() {
        let js = '';
        let impjs = '';
        const imps = {};
        const classes = [];

        Object.keys(this.data).forEach(page=> {
            const target = this.render();
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