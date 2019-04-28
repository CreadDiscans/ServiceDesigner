import { Singletone } from "../utils/singletone";
import { LayoutManager } from "./layout.manager";
import { FolderManager } from "./folder.manager";
import { ColorManager } from './color.manager';
import { AssetManager } from './asset.manager';
import { CssManager } from './css.manager';
import { HistoryService } from '../service/history.service';
import ReactStrapService from '../controllers/library/reactstrap.service';
import Utils from '../utils/utils';
import { ElementManager } from "./element.manager";
import template from '../resource/template.json';
import { ReactNativeService } from "../controllers/library/react-native.service";
import { ReactIconsService } from "../controllers/library/react-icons.service";
import { ReactNativeVectorIconsService } from "../controllers/library/react-native-vector-icons.service";
declare var window:any;
// const { remote } = window.require('electron')
// const fs = window.require('fs')
export class DataManager extends Singletone<DataManager> {

    data:any;
    page:any;
    savePath:any;
    projectType:any;
    cssCache = {};

    static libTable:any = {
        reactstrap: ReactStrapService,
        'react-native': ReactNativeService,
        'react-icons': ReactIconsService,
        'react-native-vector-icons': ReactNativeVectorIconsService
    }

    initialize(data:any) {
        const historyService:HistoryService = HistoryService.getInstance(HistoryService);
        const layoutManager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        const folderManager:FolderManager = FolderManager.getInstance(FolderManager);
        this.data = data;
        this.page = Object.keys(data)[0];
        historyService.flush();
        layoutManager.initialize(this.data[this.page]);
        folderManager.initialize(this.getFolder());
    }

    openJs(page:any) {
        this.page = page;
        const layoutManager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        layoutManager.initialize(this.data[this.page]);
    }

    getFolder() {
        const createNode = (parent:any, name:any) => {
            let target = null
            parent.children.forEach((item:any)=> {
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
        const layoutManager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        const assetManager:AssetManager = AssetManager.getInstance(AssetManager);
        const colorManager:ColorManager = ColorManager.getInstance(ColorManager);
        const cssManager:CssManager = CssManager.getInstance(CssManager);
        const selected_id = layoutManager.selected;
        const imports:any = {}
        const parseProperty = (key:any, value:any) => {
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
                } else if (key === 'icon' && this.projectType === 'react') {
                } else {
                    value = '"' + String(value) + '"'
                }
            }
            return value;
        }

        const parseStyle = (id:any, value:any, origin={}) => {
            let style:any = this.convertCssToStyle(Utils.deepcopy(value), 'style');
            if (id === selected_id && !exporting) {
                if (this.projectType === 'react') {
                    style.border = 'solid 1px red';
                } else {
                    style.borderColor = 'red';
                    style.borderWidth = 1;
                }
            }
            style = Utils.merge(origin, style);
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
            // console.log(stringStyle);
            return stringStyle;
        }
        const parse = (item:any) => {
            if (!this.isValidIcon(item)) {
                if (this.projectType === 'react') {
                    return 'no icon';
                } else {
                    if (!('react-native' in imports)) {
                        imports['react-native'] = [];
                    }
                    imports['react-native'].push('Text');
                    return '<Text>no icon</Text>'
                }
            }        

            item.import.forEach((imp:any)=> {
                if (!(imp.from in imports)) {
                    imports[imp.from] = []
                }
                imp.items.forEach((it:any)=> {
                    if (imports[imp.from].indexOf(it) === -1) {
                        imports[imp.from].push(it)
                    }
                })
            })
            let code = item.code
            let children = ''
            item.children.forEach((child:any)=> {
                children += parse(child)
            })
            let styles = {};
            Object.keys(item.property).forEach(prop=> {
                if (this.projectType === 'react-native' && prop === 'class') {
                    const className = item.property[prop];
                    className.split(' ').forEach((cls:any)=> {
                        styles = Utils.merge(styles, this.convertCssToStyle(cssManager.data[cls], cls));
                    });
                } else {
                    code = code.replace('{'+prop+'}', parseProperty(prop, item.property[prop]))
                }
            });

            if (item.import.length > 0 && item.import[0].from.indexOf('react-native-vector-icons') !== -1) {
                if (exporting) {
                    code = code.replace('<Icon', '<'+item.import[0].items[0]);
                } else {
                    styles={'width':30, 'height':30, backgroundColor:'#777'}
                    code = code.replace('<Icon', '<View');
                }
            }
            code = code.replace('{style}', parseStyle(item.id, item.style, styles))
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
        const convertImport = () => {
            const out:any = []
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

    convertCssToStyle(css:any, key:any) {
        if (css === undefined) {
            return {}
        } 
        try {
            this.cssCache = Utils.transform(css)[key];
        } catch(e) {
            console.log(e);
        }
        return this.cssCache;
    }

    export(save=false) {
        const elementManager:ElementManager = ElementManager.getInstance(ElementManager);
        const colorManager:ColorManager = ColorManager.getInstance(ColorManager);
        const cssManager:CssManager = CssManager.getInstance(CssManager);
        if (!this.projectType) return;
        const js = this.getReactJs();
        const output = {
            data: this.getSaveForm(), 
            components: elementManager.data,
            colors: colorManager.data,
            css: cssManager.data,
            projectType : this.projectType
        }
        let dirs;
        if (save && this.savePath) {
            dirs = [this.savePath];
        } else {
            // dirs = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
        }
        // if (dirs) {
        //     this.savePath = dirs[0];
        //     fs.writeFile(dirs[0]+'/design.json', JSON.stringify(output), (err:any)=> {
        //         if (err) {
        //             return console.log(err)
        //         }
        //         console.log('saved json')
        //         document.getElementsByTagName('title')[0].innerText = 'Service Designer';
        //     });
        //     fs.writeFile(dirs[0]+'/design.js', js, (err:any)=> {
        //         if (err) {
        //             return console.log(err)
        //         }
        //         console.log('saved js')
        //     });
        //     if (this.projectType === 'react') {
        //         fs.writeFile(dirs[0]+'/design.css', cssManager.getCssFile(), (err:any)=> {
        //             if (err) {
        //                 return console.log(err);
        //             }
        //             console.log('saved css');
        //         });
        //     }
        // }
    }

    isValidIcon(item:any) {
        if (item.import.length > 0 && item.import[0].from.indexOf('react-icons') !== -1) {
            const icon = item.property.icon;
            const froms = item.import[0].from.split('/');
            const lib = DataManager.libTable[froms[0]].lib[froms[1]];
            if (icon in lib) {
                item.import[0].items = [icon];
                return true;
            } else {
                return false;
            }
        } else if (item.import.length > 0 && item.import[0].from.indexOf('react-native-vector-icons') !== -1) {
            const icon = item.property.icon;
            const froms = item.import[0].from.split('/');
            const lib = DataManager.libTable[froms[0]].lib[froms[1]];
            if (lib.indexOf(icon) === -1) {
                return false;
            } else {
                item.import[0].items = [froms[1]];
                return true;
            }
        }
        return true;
    }

    import() {
        const elementManager:ElementManager = ElementManager.getInstance(ElementManager);
        const colorManager:ColorManager = ColorManager.getInstance(ColorManager);
        const cssManager:CssManager = CssManager.getInstance(CssManager);
        // const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
        // if (file) {
        //     this.savePath = file[0].replace('/design.json');
        //     fs.readFile(file[0], (err:any, data:any)=> {
        //         if (err) throw err
        //         try {
        //             const json = JSON.parse(data.toString())
        //             this.initialize(json.data);
        //             elementManager.initialize(json.components);
        //             colorManager.initialize(json.colors);
        //             cssManager.initialize(json.css);
        //             this.projectType = json.projectType;
        //         }catch(e) {console.log(e)}
        //     })
        // }
    }

    getSaveForm() {
        const form = Utils.deepcopy(this.data)
        const removeCollapse = (item:any) => {
            delete item.collapse
            item.children.forEach((child:any)=>removeCollapse(child))
        }
        Object.keys(form).forEach(key=> removeCollapse(form[key]))
        return form
    }

    getReactJs() {
        const colorManager:ColorManager = ColorManager.getInstance(ColorManager);
        const assetManager:AssetManager = AssetManager.getInstance(AssetManager);
        let js = '';
        let impjs = '';
        if (this.projectType === 'react') {
            impjs += 'import \'./design.css\';\n';
        }
        const imps:any = {};
        const classes:any = [];
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
            target.imports.forEach((imp:any)=> {
                if (!(imp.libname in imps)) {
                    imps[imp.libname] = [];
                }
                imp.items.forEach((item:any)=> {
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
            if (from.indexOf('react-native-vector-icons') === -1) {
                impjs +='import { '
                imps[from].forEach((item:any, i:number)=> {
                    impjs += item;
                    if (imps[from].length -1 !== i) {
                        impjs += ', '
                    }
                });
                impjs += ' } from \''+from+'\';\n';
            } else {
                impjs +='import '
                imps[from].forEach((item:any, i:number)=> {
                    impjs += item;
                    if (imps[from].length -1 !== i) {
                        impjs += ', '
                    }
                });
                impjs += ' from \''+from+'\';\n';
            }
        });

        js = template.import.replace('{import}', impjs);
        js += '\n'+template.colors.replace('{color}', toColorClass());
        js += '\n'+template.assets.replace('{asset}', toAssetClass());
        js += '\n'+template.abstract;
        classes.forEach((com:any)=> {
            js += '\n' + com;
        });
        return js;
    }
}