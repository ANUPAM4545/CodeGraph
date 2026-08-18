import * as vscode from 'vscode';
import { ContextCache } from '../cache/contextCache';
import { RepositoryDetector } from '../repository/detector';

export class CodeGraphSidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly cache: ContextCache,
        private readonly repoDetector: RepositoryDetector
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        this.updateHtml();
        
        webviewView.webview.onDidReceiveMessage(message => {
            if (message.command === 'openFile') {
                const uri = vscode.Uri.file(vscode.workspace.rootPath + '/' + message.file);
                vscode.workspace.openTextDocument(uri).then(doc => {
                    vscode.window.showTextDocument(doc, {
                        selection: new vscode.Range(message.line - 1, 0, message.line - 1, 0)
                    });
                });
            }
        });
    }

    public updateHtml(content?: string) {
        if (!this._view) return;
        
        const html = content || `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CodeGraph Sidebar</title>
                <style>
                    body { font-family: var(--vscode-font-family); color: var(--vscode-editor-foreground); padding: 10px; }
                    .card { background: var(--vscode-editor-background); padding: 10px; border: 1px solid var(--vscode-widget-border); margin-bottom: 10px; }
                    .title { font-weight: bold; margin-bottom: 5px; }
                    .link { color: var(--vscode-textLink-foreground); cursor: pointer; text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="title">CodeGraph Intelligence</div>
                    <p>Select a symbol or run a CodeGraph command to see architectural context here.</p>
                </div>
            </body>
            </html>
        `;
        
        this._view.webview.html = html;
    }
}
