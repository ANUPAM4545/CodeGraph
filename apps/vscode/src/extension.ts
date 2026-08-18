import * as vscode from 'vscode';
import { setupAuthCommands } from './auth/session';
import { HoverProvider } from './providers/hover';
import { CodeLensProvider } from './providers/codeLens';
import { CodeGraphSidebarProvider } from './providers/sidebar';
import { setupExplanationCommands } from './commands/explain';
import { setupImpactCommands } from './commands/impact';
import { CodeGraphStatusBar } from './providers/statusBar';
import { RealtimeClient } from './realtime/client';
import { RepositoryDetector } from './repository/detector';
import { ContextCache } from './cache/contextCache';

export async function activate(context: vscode.ExtensionContext) {
	console.log('CodeGraph extension activated.');

	// 1. Initialize Core Services
	const statusBar = new CodeGraphStatusBar();
	const cache = new ContextCache();
	const repoDetector = new RepositoryDetector();
	
	// 2. Setup Authentication Commands
	await setupAuthCommands(context, statusBar);

	// 3. Setup Providers
	const hoverProvider = new HoverProvider(context, cache, repoDetector);
	context.subscriptions.push(
		vscode.languages.registerHoverProvider({ scheme: 'file' }, hoverProvider)
	);

	const codeLensProvider = new CodeLensProvider(context, cache, repoDetector);
	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider({ scheme: 'file' }, codeLensProvider)
	);

	const sidebarProvider = new CodeGraphSidebarProvider(context, cache, repoDetector);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('codegraph.sidebarView', sidebarProvider)
	);

	// 4. Setup Commands
	setupExplanationCommands(context, sidebarProvider, repoDetector);
	setupImpactCommands(context, sidebarProvider, repoDetector);

	// 5. Setup Realtime Sync
	const realtime = new RealtimeClient(context, cache, statusBar);
	realtime.connectIfAuthenticated();
}

export function deactivate() {}
