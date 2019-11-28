// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CompoentProvider } from './ComponentProvider';
import { ElementProvider } from './ElementProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const folders = vscode.workspace.workspaceFolders;
	if(folders && folders.length > 0) {
		const elementProvider = new ElementProvider();
		const componentProvider = new CompoentProvider(folders[0].uri.fsPath, elementProvider);
		vscode.window.registerTreeDataProvider('components', componentProvider)
		vscode.window.registerTreeDataProvider('elements', elementProvider);
		vscode.commands.registerCommand('componentProvider.loadSource', ()=> componentProvider.loadSource());
		vscode.commands.registerCommand('componentProvider.selectComponent', (args)=> componentProvider.selectCompoenet(args));
		vscode.commands.registerCommand('elementProvider.selectElement', (args)=> elementProvider.selectElement(args));
	} else {
		vscode.window.showErrorMessage('Project not selected');
	}
}

