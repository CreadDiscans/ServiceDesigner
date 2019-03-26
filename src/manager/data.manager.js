import { Singletone } from "../service/singletone";
import { LayoutManager } from "./layout.manager";
import { FolderManager } from "./folder.manager";
import { ColorManager } from './color.manager';
import { AssetManager } from './asset.manager';
import { CssManager } from './css.manager';
import { HistoryService } from './../service/history.service';
import ReactStrapService from './../service/reactstrap.service';
import Utils from '../service/utils';
import { ElementManager } from "./element.manager";
import template from '../resource/template.json';
import { ReactNativeService } from "../service/react-native.service";

const { remote } = window.require('electron')
const fs = window.require('fs')
export class DataManager extends Singletone {

    data;
    page;
    savePath;
    projectType;

    static libTable = {
        reactstrap: ReactStrapService,
        'react-native': ReactNativeService
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

    render(exporting=false) {
        const colorManager = ColorManager.getInstance(ColorManager);
        const assetManager = AssetManager.getInstance(AssetManager);
        const selected_id = LayoutManager.getInstance(LayoutManager).selected;
        const imports = {}
        const parseProperty = (value) => {
            if (typeof(value) === 'object') {
                value = JSON.stringify(value)
            } else if (typeof(value) === 'string') {
                if (value === '{item}' || 
                    (value.indexOf('{item.') === 0 && value[value.length-1] === '}' && value !== '{item.}') ||
                    (value.indexOf('{this.state.') === 0 && value[value.length-1] === '}' && value !== '{this.state.}')) {
                    value = value.slice(1, value.length-1)
                } else if (value.indexOf('Asset.') === 0) {
                    value = '';
                    Object.keys(assetManager.data).forEach(asset=> {
                        if (value === 'Asset.'+asset) {
                            if (exporting) {
                                value = 'DesignedAssets.'+ asset;
                            } else {
                                value = '"' + assetManager.data[asset] + '"';
                            }
                        }
                    });
                } else {
                    value = '"' + String(value) + '"'
                }
            }
            return value;
        }

        const parseStyle = (id, value) => {
            const style = Utils.deepcopy(value)
            if (id === selected_id) {
                if (this.projectType === 'react') {
                    style.border = 'solid 1px red';
                } else {
                    style.borderColor = 'red';
                    style.borderWidth = 1;
                }
            }
            let stringStyle = JSON.stringify(style);
            Object.keys(colorManager.data).forEach(color=> {
                const re = new RegExp('"Color.'+color+'"', 'g');
                if (exporting) {
                    stringStyle = stringStyle.replace(re, 'DesignedColors.'+color);
                } else {
                    stringStyle = stringStyle.replace(re, '"' + colorManager.data[color]+'"');
                }
            });
            Object.keys(assetManager.data).forEach(asset=> {
                const re = new RegExp('"Asset.'+asset+'"', 'g');
                if (exporting) {
                    stringStyle = stringStyle.replace(re, '"url("+DesignedAssets.'+asset+'+")"');
                } else {
                    stringStyle = stringStyle.replace(re, '"url('+assetManager.data[asset]+')"');
                }
            });
            return stringStyle;
        }
        const parse = (item) => {
            console.log(item.import)
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
                code = code.replace('{'+prop+'}', parseProperty(item.property[prop]))
            })
            code = code.replace('{style}', parseStyle(item.id, item.style))
            code = code.replace('{children}', children)
            let brace = false;
            if (item.property['for'] && item.property['for'] !== '') {
                code = code.replace('>', 'key={i} >');
                code = 'Array.isArray(this.state.'+item.property['for']+') && this.state.' 
                    + item.property['for'] + '.map((item, i)=> '+code+')';
                brace = true;
            }
            if (item.property['if'] && item.property['if'] !== '') {
                code = 'this.state.'+ item.property['if'] + ' && ' + code;
                brace = true;
            }
            if (brace) {
                code = '{ ' + code + ' }';
            }
            return code
        }
        console.log(imports)
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
            code: code,
            state: this.data[this.page].state
        }
    }

    export(save=false) {
        if (!this.projectType) return;
        const js = this.getReactJs();
        const output = {
            data: this.getSaveForm(), 
            components: ElementManager.getInstance(ElementManager).data,
            colors: ColorManager.getInstance(ColorManager).data,
            css: CssManager.getInstance(CssManager).data
        }
        let dirs;
        if (save && this.savePath) {
            dirs = [this.savePath];
        } else {
            dirs = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
        }
        if (dirs) {
            this.savePath = dirs[0];
            fs.writeFile(dirs[0]+'/design.json', JSON.stringify(output), err=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved json')
                document.getElementsByTagName('title')[0].innerText = 'Service Designer';
            });
            fs.writeFile(dirs[0]+'/design.js', js, err=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved js')
            });
            fs.writeFile(dirs[0]+'/design.css', CssManager.getInstance(CssManager).getCssFile(), err=> {
                if (err) {
                    return console.log(err);
                }
                console.log('saved css');
            });
        }
    }

    import() {
        const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
        if (file) {
            this.savePath = file[0].replace('/design.json');
            fs.readFile(file[0], (err, data)=> {
                if (err) throw err
                try {
                    const json = JSON.parse(data.toString())
                    this.initialize(json.data);
                    ElementManager.getInstance(ElementManager).initialize(json.components);
                    ColorManager.getInstance(ColorManager).initialize(json.colors);
                    CssManager.getInstance(CssManager).initialize(json.css);
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
        const colorManager = ColorManager.getInstance(ColorManager);
        const assetManager = AssetManager.getInstance(AssetManager);
        const form = 'static {name} = {value};\n';
        const toColorClass = () => {
            let out = '';
            Object.keys(colorManager.data).forEach(color=> {
                out += form.replace('{name}', color).replace('{value}', '"'+colorManager.data[color]+'"');
            });
            return out;
        }

        const toAssetClass = () => {
            let out = '';
            Object.keys(assetManager.data).forEach(color=> {
                out += form.replace('{name}', color).replace('{value}', '"'+assetManager.data[color]+'"');
            });
            return out;
        }

        Object.keys(this.data).forEach(page=> {
            const target = this.render(true);
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
            let templateJs = template.class.replace('{code}', target.code);
            templateJs = templateJs.replace('{classname}', className);
            templateJs = templateJs.replace('{state}', 'state='+JSON.stringify(target.state)+';')
            classes.push(templateJs);
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
        js = template.import.replace('{import}', impjs);
        js += '\n'+template.colors.replace('{color}', toColorClass());
        js += '\n'+template.assets.replace('{asset}', toAssetClass());
        js += '\n'+template.abstract;
        classes.forEach(com=> {
            js += '\n' + com;
        });
        return js;
    }
}