
import { Controller } from './controller';
import { File, FileType } from '../models/file';
import Utils from '../utils/utils';
import { Element } from '../models/element';
import { Library } from '../models/library';
declare var window:any;

export class ExportController extends Controller {

    private static TEMPLATE_CLASS = "export class {classname} extends DesignComponent {\n\t{state}\n\trender() {\n\t\treturn {code}\n\t}\n}\n";
    private static TEMPLATE_IMPORT = "import React from 'react';\n{import}\n";
    private static TEMPLATE_ABSTRACT = "class DesignComponent extends React.Component {\n\thandleClick = (e) => {};\n\thandleChange = (e) => {};\n\trenderPart = (name) => {}\n}\n";
    private cachePath:string|undefined;

    export(root:File, useCache:boolean) {
        const js = this.makeReactJs(root);
        const json = {
            root: root.toJson(),
            platform: this.main.getPlatform(),
        }
        try {
            const { remote } = window.require('electron')
            const fs = window.require('fs')
            if (!this.cachePath || !useCache) {
                this.cachePath = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
            }
            
            fs.writeFile(this.cachePath+'/design.json', JSON.stringify(json), (err:any)=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved json')
                document.getElementsByTagName('title')[0].innerText = 'Service Designer';
            });
            fs.writeFile(this.cachePath+'/design.js', js, (err:any)=> {
                if (err) {
                    return console.log(err)
                }
                console.log('saved js')
            });
        } catch(e) {
            console.log('not electron platfrom');
            console.log(js, json);
            return;
        }
    }

    setCachePath(path:string) {
        this.cachePath = path;
    }

    private makeReactJs(root:File) {
        let js = '';
        let impjs = '';
        const classes:Array<string> = [];
        const imp:{[s:string]: Array<string>;} = {};
        Utils.loop(root, (file:File, stack:Array<File>)=> {
            if (file.type === FileType.FILE) {
                Utils.loop(file.element, (elem:Element)=> {
                    if (elem.library) { 
                        elem.library.forEach((lib:Library)=> {
                            if (!(lib.dependency in imp)) {
                                imp[lib.dependency] = [];
                            }     
                            lib.items.forEach((item:string)=> {
                                if (imp[lib.dependency].indexOf(item) === -1) {
                                    imp[lib.dependency].push(item);
                                }
                            })
                        })
                    }
                });

                let className = 'Designed';
                stack.forEach((st:File)=> {
                    if (st.type !== FileType.ROOT)
                        className += st.name[0].toUpperCase() + st.name.slice(1, st.name.length);
                })
                const data = this.main.getRenderData(file);
                let classJs = ExportController.TEMPLATE_CLASS.replace('{code}', data.code);
                classJs = classJs.replace('{classname}', className);
                classJs = classJs.replace('{state}', 'state='+JSON.stringify(data.state));
                classes.push(classJs);
            } 
        });

        Object.keys(imp).forEach((from:any)=> {
            if (from.indexOf('react-native-vector-icons') !== -1) {
                impjs += 'import '
            } else  {
                impjs += 'import { '
            }
            imp[from].forEach((item:string, i:number)=> {
                impjs += item;
                if (imp[from].length -1 !== i) {
                    impjs += ', '
                } 
            })
            if (from.indexOf('react-native-vector-icons') !== -1) {
                impjs += ' from \'' + from + '\';\n';
            } else {
                impjs += ' } from \'' + from + '\';\n';
            }
        });

        js = ExportController.TEMPLATE_IMPORT.replace('{import}', impjs);
        js += '\n'+ExportController.TEMPLATE_ABSTRACT;
        classes.forEach((com:string)=> js += '\n' + com);
        return js;
    }
}