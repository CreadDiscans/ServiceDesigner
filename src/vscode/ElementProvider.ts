import * as vscode from 'vscode';

export class ElementProvider implements vscode.TreeDataProvider<Element> {

    getChildren(element:Element) {
        return null;
    }

    getParent(element:Element) {
        return null;
    }

    getTreeItem(element:Element) {
        return null;
    }
}

export class Element extends vscode.TreeItem {


}
