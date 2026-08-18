import * as vscode from 'vscode';
import { ContextCache } from '../cache/contextCache';
import { RepositoryDetector } from '../repository/detector';
import { CodeGraphClient } from '../api/client';

export class HoverProvider implements vscode.HoverProvider {
    private client: CodeGraphClient;

    constructor(
        private context: vscode.ExtensionContext, 
        private cache: ContextCache,
        private repoDetector: RepositoryDetector
    ) {
        this.client = new CodeGraphClient(context);
    }

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        const repo = await this.repoDetector.detect(this.client);
        if (!repo || !repo.versionId) return undefined;

        const range = document.getWordRangeAtPosition(position);
        if (!range) return undefined;

        const word = document.getText(range);
        // Only fetch context for typical symbols, simple heuristic
        if (!/^[a-zA-Z_]\w*$/.test(word)) return undefined;

        const cacheKey = `${repo.id}-${repo.versionId}-${document.fileName}-${word}`;
        let ctxData = this.cache.get(cacheKey);

        if (!ctxData) {
            try {
                // Fetch from CodeGraph
                ctxData = await this.client.request(`/repositories/${repo.id}/versions/${repo.versionId}/developer-context`, 'POST', {
                    file_path: vscode.workspace.asRelativePath(document.uri),
                    line_start: range.start.line + 1,
                    line_end: range.end.line + 1,
                    symbol_name: word
                });
                this.cache.set(cacheKey, ctxData);
            } catch (e) {
                return undefined;
            }
        }

        if (!ctxData) return undefined;

        const md = new vscode.MarkdownString();
        md.isTrusted = true;
        
        md.appendMarkdown(`**CODEGRAPH**\n\n`);
        md.appendMarkdown(`**${ctxData.symbol_name}**\n`);
        md.appendMarkdown(`${ctxData.symbol_type}\n\n`);
        md.appendMarkdown(`Risk &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**${ctxData.risk}**\n\n`);
        md.appendMarkdown(`Callers &nbsp;&nbsp;&nbsp;${ctxData.callers}\n\n`);
        md.appendMarkdown(`Callees &nbsp;&nbsp;&nbsp;${ctxData.callees}\n\n`);
        md.appendMarkdown(`Modules &nbsp;&nbsp;&nbsp;${ctxData.impact.affected_modules}\n\n`);
        md.appendMarkdown(`---\n`);
        md.appendMarkdown(`[Explain](command:codegraph.explainThis) | [Impact](command:codegraph.analyzeImpact)`);

        return new vscode.Hover(md);
    }
}
