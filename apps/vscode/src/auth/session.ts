import * as vscode from 'vscode';
import { CodeGraphStatusBar } from '../providers/statusBar';

const AUTH_SECRET_KEY = 'codegraph_api_key';

export async function setupAuthCommands(context: vscode.ExtensionContext, statusBar: CodeGraphStatusBar) {
    context.subscriptions.push(
        vscode.commands.registerCommand('codegraph.login', async () => {
            const apiKey = await vscode.window.showInputBox({
                prompt: 'Enter your CodeGraph Developer API Key (cg_live_...)',
                password: true,
                ignoreFocusOut: true
            });

            if (apiKey) {
                await context.secrets.store(AUTH_SECRET_KEY, apiKey);
                vscode.window.showInformationMessage('CodeGraph: Logged in successfully.');
                statusBar.updateState('Connected');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('codegraph.logout', async () => {
            await context.secrets.delete(AUTH_SECRET_KEY);
            vscode.window.showInformationMessage('CodeGraph: Logged out.');
            statusBar.updateState('Offline');
        })
    );

    // Initial check
    const existingKey = await getApiKey(context);
    if (existingKey) {
        statusBar.updateState('Connected');
    }
}

export async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    return context.secrets.get(AUTH_SECRET_KEY);
}
