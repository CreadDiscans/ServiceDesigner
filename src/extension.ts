import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('servicedesigner.start', () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        'servicedesigner',
        'Designer',
        vscode.ViewColumn.One,
        {}
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent();
    })
  );
}

function getWebviewContent() {
  return fs.readFileSync('../../build/index.html').toString();
}