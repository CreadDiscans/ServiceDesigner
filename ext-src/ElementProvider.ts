import * as vscode from 'vscode';
import { DataManager } from './DataManager';
import * as path from 'path';
import * as _ from 'lodash';
import { ElementType } from './constant';
import Utils from './Utils';
import { ReactPanel } from './ReactPanel';

export class ElementProvider implements vscode.TreeDataProvider<Element> {

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    manager!:DataManager;
    copiedElement;

    constructor() {
        this.manager = DataManager.getInstance();
    }

    getChildren(element:Element): Thenable<Element[]> {
        if (!this.manager.selectedComponent) {
            return Promise.resolve([])
        }
        const makeElems = (parent:any) => {
            const elems:Element[] = [];
            parent.children.forEach((elem:any)=> {
                elems.push(new Element(elem.tag, 
                    elem.lib,
                    elem.children.length === 0 ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed, 
                    elem.id,
                    elem.children, {
                        command: 'elementProvider.selectElement',
                        title: '',
                        arguments: [elem.id]
                    })
                )
            })
            return elems;
        }
        if(element) {
            return Promise.resolve(makeElems(element))
        } else {
            return Promise.resolve(makeElems(this.manager.selectedComponent.element))
        }
    }

    getTreeItem(element:Element) {
        return element;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
        ReactPanel.reload()
    }

    selectElement(id:number) {
        ReactPanel.currentPanel.postMessage({
            type:'element',
            id: id
        })
    }

    add(element, lib, tag) {
        if (this.manager.selectedComponent) {
            let maxId = 0;
            this.manager.selectedComponent.element.children.forEach((elem:any)=> Utils.loop(elem, (target:any, stack:any)=> {
                if (maxId < target.id) {
                    maxId = target.id
                }
            }));
            const newItem = {
                id: maxId + 1,
                tag: tag,
                lib: lib,
                prop: [],
                children: [],
                collapse: true
            }
            if (element) {
                const target = this.getTarget(element);
                target.children.push(newItem);
            } else {
                this.manager.selectedComponent.element.children.push(newItem)
            }
            this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
            this.refresh();
        } else {
            vscode.window.showErrorMessage('Component is not selected.')
        }
    }

    copy(element) {
        if (element && this.manager.selectedComponent) {
            this.copiedElement = this.getTarget(element);
            vscode.window.showInformationMessage('Element is copied.');
        }
    }

    paste(element) {
        if (element && this.manager.selectedComponent) {
            if (this.copiedElement) {
                let parent = this.getTarget(element);
                let maxId = 0;
                Utils.loop(this.manager.selectedComponent.element, (target, stack)=> {
                    if (maxId < target.id) {
                        maxId = target.id
                    }
                })
                
                let item = _.clone(this.copiedElement)
                Utils.loop(item, (_item, stack)=> {
                    delete _item.parent;
                })
                item = Utils.deepcopy(item);
                Utils.loop(item, (_item, stack)=> {
                    _item.id = maxId +1;
                    maxId += 1;
                })
                item.parent = parent;

                Utils.loop(item, (_item, _stack)=> {
                    if (_stack.length != 0) {
                        _item.parent = _stack[_stack.length-1]
                    }
                })
                parent.children.push(item);
                this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                this.refresh();
            } else {
                vscode.window.showInformationMessage('There is no copied element.')
            }
        }
    }

    delete(element) {
        if(element && this.manager.selectedComponent) {
            const item = this.getTarget(element);
            if (item) {
                if(item.parent) {
                    item.parent.children.splice(item.parent.children.indexOf(item), 1)
                } else {
                    this.manager.selectedComponent.element.children.splice(this.manager.selectedComponent.element.children.indexOf(item), 1)
                }
                this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                this.refresh()
            } else {
                vscode.window.showErrorMessage('component not selected') 
            }
        }
    }

    async rename(element) {
        if(element && this.manager.selectedComponent) {
            const name = (await vscode.window.showInputBox({ prompt: 'element rename', placeHolder: '', value: element.label })) || '';
            if(name == '') {
                return;
            }
            const item = this.getTarget(element);
            item.tag = name;
            this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
            this.refresh()
        }
    }

    getTarget(element:Element) {
        let _item = null;
        this.manager.selectedComponent.element.children.forEach((elem:any)=> {
            Utils.loop(elem, (item:any, stack:any)=> {
                if (element.id == item.id) {
                    _item = item;
                }
            })
        })
        return _item;
    }
}

export class Element extends vscode.TreeItem {

    iconPath:any;

    constructor(
        public label: string,
        public lib: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public id:any,
        public children: any,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState)
        this.iconPath = this.getIconPath()
    }

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '';
    }
    
    getIconPath() {
        if (this.lib === ElementType.Html) {
            return path.join(__filename, '..','..', '..', 'media', 'html.png')
        } else if (this.lib == ElementType.ReactIcons) {
            return path.join(__filename, '..','..', '..', 'media', 'react-icons.svg')
        } else if (this.lib == ElementType.ReactNative) {
            return path.join(__filename, '..','..', '..', 'media', 'react.png')
        } else if (this.lib == ElementType.ReactNativeElements) {
            return path.join(__filename, '..','..', '..', 'media', 'react.png')
        } else if (this.lib == ElementType.Reactstrap) {
            return path.join(__filename, '..','..', '..', 'media', 'bootstrap.png')
        }
    }
    
    contextValue = 'element';
}
