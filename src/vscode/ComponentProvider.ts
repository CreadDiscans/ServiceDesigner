import * as vscode from 'vscode';
import * as fs from 'fs';

export class CompoentProvider implements vscode.TreeDataProvider<Component> {

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    
    source = null;
    rootPath = null;

    constructor(rootPath:string) {
        this.rootPath = rootPath;
        this.source = vscode.workspace.getConfiguration().get('servicedesigner.source')
    }

    getTreeItem(element:Component) {
        return element;
    }

    getChildren(element?:Component): Thenable<Component[]> {
        if(element) {
            return Promise.resolve([]);
        } else {
            if (this.source === null) {
                return Promise.resolve([])
            } else {
                const json:any = fs.readFileSync(this.rootPath+'/'+this.source+'/design.save.json')
                const data = JSON.parse(json);
                return Promise.resolve([new Component(this.source, vscode.TreeItemCollapsibleState.Collapsed)])
            }
        }
    }

    async loadSource() {
        const path = (await vscode.window.showInputBox({ prompt: 'design path', placeHolder: '', value: '' })) || '';
        vscode.workspace.getConfiguration().update('servicedesigner.source', path, vscode.ConfigurationTarget.Workspace)
        this.source = path
        try {
            fs.readFileSync(this.rootPath+'/'+this.source+'/design.save.json')
            this._onDidChangeTreeData.fire();
        } catch(e) {
            fs.writeFile(this.rootPath+'/'+this.source+'/design.save.json', new Uint8Array(Buffer.from('{}')), ()=> {
                this._onDidChangeTreeData.fire();
            })
        }
    }
}

export class Component extends vscode.TreeItem {

    constructor(
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState)
    }

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '';
	}
}
