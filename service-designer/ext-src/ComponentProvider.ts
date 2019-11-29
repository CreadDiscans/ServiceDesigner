import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataManager } from './DataManager';
import { ElementProvider } from './ElementProvider';
import { Uri } from 'vscode';
import { ReactPanel } from './ReactPanel';

export class CompoentProvider implements vscode.TreeDataProvider<Component> {

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    
    source!:string;
    rootPath!:string;
    manager!:DataManager;
    panel?:vscode.WebviewPanel;

    constructor(rootPath:string,
        public elemProvider: ElementProvider) {
        this.rootPath = rootPath || '';
        this.source = vscode.workspace.getConfiguration().get('servicedesigner.source') || '';
        this.manager = DataManager.getInstance();
    }

    getTreeItem(element:Component) {
        return element;
    }

    getChildren(element?:Component): Thenable<Component[]> {
        const makeComps = (parent:any) => {
            const comps:Component[] = [];
            parent.forEach((comp:any)=> {
                if (comp.children.length > 0) {
                    comps.push(new Component(comp.name, vscode.TreeItemCollapsibleState.Collapsed, comp.children))
                } else {
                    comps.push(new Component(comp.name, vscode.TreeItemCollapsibleState.None, comp.children, {
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
            if (this.source === null) {
                return Promise.resolve([])
            } else {
                const json:any = fs.readFileSync(this.rootPath+'/'+this.source)
                const data = JSON.parse(json);
                this.manager.init(data);
                return Promise.resolve(makeComps(this.manager.data.components));
            }
        }
    }

    async loadSource() {
        const path = (await vscode.window.showInputBox({ prompt: 'design path', placeHolder: '', value: '' })) || '';
        if(path == '') {
            this._onDidChangeTreeData.fire();
            return;
        }
        try {
            fs.readFileSync(this.rootPath+'/'+path)
            vscode.workspace.getConfiguration().update('servicedesigner.source', path, vscode.ConfigurationTarget.Workspace)
            this.source = path
            this._onDidChangeTreeData.fire();
        } catch(e) {
            vscode.window.showErrorMessage('Fail to load design.save.json');
        }
    }

    selectCompoenet(args:any) {
        this.manager.selectComponent(args)
        this.elemProvider.refresh()
        // if (!this.panel) {
        //     this.panel = vscode.window.createWebviewPanel(
        //         'desinger',
        //         'Designer',
        //         vscode.ViewColumn.One,
        //         {}
        //     )
        //     this.panel.onDidDispose(()=> {
        //         this.panel = undefined;
        //     })
        // } else if(!this.panel.active) {
        //     this.panel.reveal()
        // }
        // this.panel.webview.html = this.manager.getWebViewContent();
        // console.log(this.panel.webview.html)
    }
}

export class Component extends vscode.TreeItem {

    iconPath:any;

    constructor(
        public label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
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
            return path.join(__filename, '..', 'media', 'react.png')
    }
    
}
