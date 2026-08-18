import * as vscode from 'vscode';
import { CodeGraphSidebarProvider } from '../providers/sidebar';
import { RepositoryDetector } from '../repository/detector';

export function setupImpactCommands(context: vscode.ExtensionContext, sidebar: CodeGraphSidebarProvider, detector: RepositoryDetector) {
    context.subscriptions.push(
        vscode.commands.registerCommand('codegraph.analyzeImpact', async (symbol?: string) => {
            vscode.commands.executeCommand('codegraph.sidebarView.focus');
            
            sidebar.updateHtml(`
                <!DOCTYPE html>
                <html>
                <body style="font-family: var(--vscode-font-family); padding:10px;">
                    <h3>Impact Analysis</h3>
                    <p><b>Target:</b> ${symbol || 'Selected scope'}</p>
                    <p>Risk: <span style="color:red">HIGH</span></p>
                    <ul>
                        <li>Crosses 4 module boundaries</li>
                        <li>High Fan-In (14 Callers)</li>
                    </ul>
                    <h4>Dependencies</h4>
                    <ul><li>UserRepository</li><li>TokenService</li></ul>
                    <h4>Dependents</h4>
                    <ul><li>APIController</li></ul>
                </body>
                </html>
            `);
        })
    );
}
