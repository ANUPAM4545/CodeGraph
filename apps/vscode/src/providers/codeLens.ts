import * as vscode from 'vscode';
import { ContextCache } from '../cache/contextCache';
import { RepositoryDetector } from '../repository/detector';

export class CodeLensProvider implements vscode.CodeLensProvider {
    private onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

    constructor(
        private context: vscode.ExtensionContext, 
        private cache: ContextCache,
        private repoDetector: RepositoryDetector
    ) {
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('codegraph.enableCodeLens')) {
                this.onDidChangeCodeLensesEmitter.fire();
            }
        });
    }

    async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const config = vscode.workspace.getConfiguration('codegraph');
        if (!config.get<boolean>('enableCodeLens', true)) {
            return [];
        }

        // For scaffolding, we place a fake CodeLens on the first function-like line
        const lenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const regex = /def\s+([a-zA-Z_]\w*)\s*\(/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const line = document.positionAt(match.index).line;
            const range = new vscode.Range(line, 0, line, 0);
            
            const lens = new vscode.CodeLens(range, {
                title: `CodeGraph · 14 callers · High Risk`,
                command: 'codegraph.analyzeImpact',
                arguments: [match[1]]
            });
            lenses.push(lens);
        }

        return lenses;
    }
}
