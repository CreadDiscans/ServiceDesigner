// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CompoentProvider, Component } from './ComponentProvider';
import { ElementProvider } from './ElementProvider';
import { ReactPanel } from './ReactPanel';
import { ElementType } from './constant';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const folders = vscode.workspace.workspaceFolders;
	if(folders && folders.length > 0) {
		const elementProvider = new ElementProvider(folders[0].uri.fsPath);
		const componentProvider = new CompoentProvider(folders[0].uri.fsPath, elementProvider);
		vscode.window.registerTreeDataProvider('components', componentProvider)
		vscode.window.registerTreeDataProvider('elements', elementProvider);
		vscode.commands.registerCommand('componentProvider.loadSource', ()=> componentProvider.loadSource());
		vscode.commands.registerCommand('componentProvider.createComponent', (component:Component)=> componentProvider.createComponent(component));
		vscode.commands.registerCommand('componentProvider.createGroup', (component)=> componentProvider.createGroup(component))
		vscode.commands.registerCommand('componentProvider.rename', (component)=> componentProvider.rename(component))
		vscode.commands.registerCommand('componentProvider.delete', (component)=> componentProvider.delete(component))
		vscode.commands.registerCommand('componentProvider.selectComponent', (args)=> {
			componentProvider.selectCompoenet(args)
			ReactPanel.createOrShow(context.extensionPath);
		});
		vscode.commands.registerCommand('elementProvider.selectElement', (args)=> elementProvider.selectElement(args));
		vscode.commands.registerCommand('elementProvider.addHTML', element=> elementProvider.add(element, ElementType.Html, 'div'));
		vscode.commands.registerCommand('elementProvider.addReactstrap', element=> elementProvider.add(element, ElementType.Reactstrap, 'Col'));
		vscode.commands.registerCommand('elementProvider.addReactIcons', element=> elementProvider.add(element, ElementType.ReactIcons, 'FaCheck'));
		vscode.commands.registerCommand('elementProvider.addReactNative', element=> elementProvider.add(element, ElementType.ReactNative, 'View'));
		vscode.commands.registerCommand('elementProvider.addRNElement', element=> elementProvider.add(element, ElementType.ReactNativeElements, 'Text'));
		vscode.commands.registerCommand('elementProvider.copy', element=> elementProvider.copy(element));
		vscode.commands.registerCommand('elementProvider.paste', element=> elementProvider.paste(element));
		vscode.commands.registerCommand('elementProvider.delete', element=> elementProvider.delete(element));
		vscode.commands.registerCommand('elementProvider.rename', element=> elementProvider.rename(element))
		
	} else {
		vscode.window.showErrorMessage('Project not selected');
	}
	
}

