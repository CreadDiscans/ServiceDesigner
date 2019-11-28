import * as vscode from 'vscode';
import { DataManager } from './DataManager';
import * as path from 'path';
import { ElementType } from './constant';

export class ElementProvider implements vscode.TreeDataProvider<Element> {

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    manager!:DataManager;

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
                    elem.children.length === 0 ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed, elem.children, {
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
        console.log(this.manager.selectedComponent)
        this._onDidChangeTreeData.fire();
    }

    selectElement(id:number) {
        console.log(id);
    }
}

export class Element extends vscode.TreeItem {

    iconPath:any;

    constructor(
        public label: string,
        public lib: string,
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
        if (this.lib === ElementType.Html) {
            return path.join(__filename, '..', '..', 'media', 'html.png')
        } else if (this.lib == ElementType.ReactIcons) {
            return path.join(__filename, '..', '..', 'media', 'react-icons.svg')
        } else if (this.lib == ElementType.ReactNative) {
            return path.join(__filename, '..', '..', 'media', 'react.png')
        } else if (this.lib == ElementType.ReactNativeElements) {
            return path.join(__filename, '..', '..', 'media', 'react.png')
        } else if (this.lib == ElementType.Reactstrap) {
            return path.join(__filename, '..', '..', 'media', 'bootstrap.png')
        }
    }
    
}
