import * as vscode from 'vscode';

export class CodeGraphStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'codegraph.repositoryStatus';
        this.statusBarItem.show();
        this.updateState('Offline');
    }

    public updateState(state: 'Connected' | 'Syncing' | 'Ready' | 'Analyzing' | 'Degraded' | 'Offline') {
        const icons = {
            'Connected': '$(plug)',
            'Syncing': '$(sync~spin)',
            'Ready': '$(check)',
            'Analyzing': '$(search)',
            'Degraded': '$(warning)',
            'Offline': '$(x)'
        };
        
        this.statusBarItem.text = `${icons[state]} CodeGraph: ${state}`;
        this.statusBarItem.tooltip = `CodeGraph Status: ${state}`;
    }
}
