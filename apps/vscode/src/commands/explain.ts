import * as vscode from 'vscode';
import { CodeGraphSidebarProvider } from '../providers/sidebar';
import { RepositoryDetector } from '../repository/detector';
import { CodeGraphClient } from '../api/client';

export function setupExplanationCommands(context: vscode.ExtensionContext, sidebar: CodeGraphSidebarProvider, detector: RepositoryDetector) {
    const client = new CodeGraphClient(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('codegraph.explainThis', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const repo = await detector.detect(client);
            if (!repo) {
                vscode.window.showErrorMessage('Repository not connected to CodeGraph.');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            vscode.commands.executeCommand('codegraph.sidebarView.focus');
            sidebar.updateHtml(`
                <!DOCTYPE html>
                <html>
                <body style="font-family: var(--vscode-font-family); padding:10px;">
                    <h3>AI Copilot</h3>
                    <p><i>Analyzing selected code...</i></p>
                </body>
                </html>
            `);

            try {
                // Call HybridRetriever AI API
                const result = await client.request(`/repositories/${repo.id}/versions/${repo.versionId}/ai/query`, 'POST', {
                    question: "Explain this code and its architectural impact",
                    context: {
                        file_path: vscode.workspace.asRelativePath(editor.document.uri),
                        line_start: selection.start.line + 1,
                        line_end: selection.end.line + 1,
                        symbol: text
                    }
                });

                sidebar.updateHtml(`
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: var(--vscode-font-family); padding:10px;">
                        <h3>AI Copilot</h3>
                        <div style="margin-bottom:15px; border-left:3px solid var(--vscode-button-background); padding-left:10px;">
                            ${result.answer.replace(/\n/g, '<br>')}
                        </div>
                        <h4>Sources</h4>
                        <ul>
                            ${result.citations.map((c: any) => 
                                `<li><a href="#" onclick="vscode.postMessage({command: 'openFile', file: '${c.file_path}', line: ${c.line_start}})">${c.file_path}:${c.line_start}</a></li>`
                            ).join('')}
                        </ul>
                        <script>
                            const vscode = acquireVsCodeApi();
                        </script>
                    </body>
                    </html>
                `);

            } catch (e) {
                sidebar.updateHtml(`<p style="color:red">Error: Failed to fetch AI explanation.</p>`);
            }
        })
    );
}
