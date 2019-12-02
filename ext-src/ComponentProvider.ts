import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataManager } from './DataManager';
import { ElementProvider } from './ElementProvider';
import Utils from './Utils';
import { FileType } from './constant';
import { ReactPanel } from './ReactPanel';

export class CompoentProvider implements vscode.TreeDataProvider<Component> {

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    
    manager!:DataManager;
    panel?:vscode.WebviewPanel;

    static id;

    constructor(rootPath:string,
        public elemProvider: ElementProvider) {
        ReactPanel.jsonPath = rootPath || '';
        ReactPanel.source = vscode.workspace.getConfiguration().get('servicedesigner.source') || '';
        this.manager = DataManager.getInstance();
    }

    getTreeItem(element:Component) {
        return element;
    }

    getChildren(element?:Component): Thenable<Component[]> {
        const makeComps = (parent:any) => {
            const comps:Component[] = [];
            parent.forEach((comp:any)=> {
                if (comp.type == FileType.FOLDER) {
                    comps.push(new Component(comp.name, vscode.TreeItemCollapsibleState.Collapsed, comp.id, comp.children))
                } else {
                    comps.push(new Component(comp.name, vscode.TreeItemCollapsibleState.None, comp.id, comp.children, {
						command: 'componentProvider.selectComponent',
						title: '',
						arguments: [comp.id]
					}))
                }
            })
            return comps
        }
        if(element) {
            return Promise.resolve(makeComps(element.children));
        } else {
            if (ReactPanel.source === null) {
                return Promise.resolve([])
            } else {
                const json:any = fs.readFileSync(ReactPanel.jsonPath+'/'+ReactPanel.source)
                const data = JSON.parse(json);
                this.manager.init(data);
                return Promise.resolve(makeComps(this.manager.data.components));
            }
        }
    }

    async loadSource() {
        const path = (await vscode.window.showInputBox({ prompt: 'design path', placeHolder: '', value: '' })) || '';
        if(path == '') {
            const json:any = fs.readFileSync(ReactPanel.jsonPath+'/'+ReactPanel.source)
            const data = JSON.parse(json);
            this.manager.init(data);
            this._onDidChangeTreeData.fire();
            this.elemProvider.refresh();
            return;
        }
        try {
            fs.readFileSync(ReactPanel.jsonPath+'/'+path)
            vscode.workspace.getConfiguration().update('servicedesigner.source', path, vscode.ConfigurationTarget.Workspace)
            ReactPanel.source = path
            this._onDidChangeTreeData.fire();
        } catch(e) {
            vscode.window.showErrorMessage('Fail to load design.save.json');
        }
    }

    selectCompoenet(id) {
        CompoentProvider.id = id;
        this.manager.selectComponent(id)
        this.elemProvider.refresh()
        ReactPanel.currentPanel.postMessage({
            type:"component",
            id:id
        });
    }

    createComponent(component:Component) {
        let maxId = 0;
        this.manager.data.components.forEach((comp:any)=> Utils.loop(comp, (target:any, stack:any)=> {
            if (maxId < target.id) {
                maxId = target.id
            }
        }));
        const newItem = {
            id: maxId + 1,
            name:'NewComponent', 
            type:FileType.FILE, 
            element: {
                id:0,
                tag:'root',
                children: []
            },
            collapse:false,
            parent: undefined,
            state:'{}',
            children:[]
        }
        if (component) {
            const {item, stack}:any = this.getTarget(component);
            if (item) {
                if (item.type == FileType.FILE) {
                    item.parent.children.push(newItem)
                    this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                    this._onDidChangeTreeData.fire();
                    ReactPanel.reload()
                } else if (item.type == FileType.FOLDER) {
                    item.children.push(newItem)
                    this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                    this._onDidChangeTreeData.fire();
                    ReactPanel.reload()
                } else {
                    vscode.window.showErrorMessage('type error')
                }
            } else {
                vscode.window.showErrorMessage('component not selected')
            }
        } else {
            this.manager.data.components.push(newItem)
            this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
            this._onDidChangeTreeData.fire();
            ReactPanel.reload()
        }
    }

    createGroup(component) {
        let maxId = 0;
        this.manager.data.components.forEach((comp:any)=> Utils.loop(comp, (target:any, stack:any)=> {
            if (maxId < target.id) {
                maxId = target.id
            }
        }));
        const newItem = {
            id: maxId + 1,
            name:'NewGroup', 
            type:FileType.FOLDER, 
            element: {},
            collapse:false,
            parent: undefined,
            state:'{}',
            children:[]
        }
        if (component) {
            const {item, stack}:any = this.getTarget(component);
            if (item) {
                if (item.type == FileType.FILE) {
                    item.parent.children.push(newItem)
                    this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                    this._onDidChangeTreeData.fire();
                    ReactPanel.reload()
                } else if (item.type == FileType.FOLDER) {
                    item.children.push(newItem)
                    this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
                    this._onDidChangeTreeData.fire();
                    ReactPanel.reload()
                } else {
                    vscode.window.showErrorMessage('type error')
                }
            } else {
                vscode.window.showErrorMessage('component not selected')
            }
        } else {
            this.manager.data.components.push(newItem);
            this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
            this._onDidChangeTreeData.fire();
            ReactPanel.reload()
        }
    }

    async rename(component) {
        const name = (await vscode.window.showInputBox({ prompt: 'component rename', placeHolder: '', value: component.label })) || '';
        if(name == '') {
            return;
        }
        const {item, stack}:any = this.getTarget(component);
        item.name = name;
        this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
        this._onDidChangeTreeData.fire();
        ReactPanel.reload()
    }

    delete(component) {
        const {item, stack}:any = this.getTarget(component);
        if (item) {
            if (item.id == CompoentProvider.id) {
                CompoentProvider.id = undefined;
            }
            if(item.parent) {
                item.parent.children.splice(item.parent.children.indexOf(item), 1)
            } else {
                this.manager.data.components.splice(this.manager.data.components.indexOf(item), 1)
            }
            this.manager.selectedComponent = null;
            this.manager.save(ReactPanel.jsonPath+'/'+ReactPanel.source)
            this._onDidChangeTreeData.fire();
            ReactPanel.reload()
        } else {
            vscode.window.showErrorMessage('component not selected') 
        }
    }

    getTarget(component:Component) {
        let _item = null, _stack = null;
        this.manager.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                if (component.id == item.id) {
                    _item = item;
                    _stack = stack;
                }
            })
        })
        return {
            item:_item,
            stack:_stack
        };
    }
}

export class Component extends vscode.TreeItem {

    iconPath:any;

    constructor(
        public label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public id: any,
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
        if (this.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) 
            return null;
        else 
            return path.join(__filename, '..', '..', '..', 'media', 'react.png')
    }

    contextValue = 'component';
}
