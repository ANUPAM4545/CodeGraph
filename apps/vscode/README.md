# CodeGraph VS Code Extension

CodeGraph provides developer-native architectural intelligence directly in your editor.

## Features

- **Architectural Hovers**: Hover over symbols to see real-time impact radius, risk scores, and architectural context.
- **Impact Analysis**: Use CodeLens or commands to instantly trace dependencies and dependents for any function.
- **AI Copilot**: An intelligent chat sidebar that understands your repository's structure and can explain complex code.
- **Source Navigation**: Click on citations in the AI chat to instantly jump to the exact local file and line.

## Getting Started

1. Open the CodeGraph command palette (`Cmd/Ctrl+Shift+P`).
2. Run `CodeGraph: Login`.
3. Paste your CodeGraph Developer API Key (starts with `cg_live_`).
4. Ensure you are in a Git repository connected to CodeGraph.
5. Start exploring!

## Architecture

This extension communicates directly with the CodeGraph FastAPI backend using an established IDE-agnostic JSON protocol.

- Uses standard `vscode.HoverProvider` and `vscode.CodeLensProvider`.
- Communicates securely using `DeveloperApiKey` stored in VS Code `SecretStorage`.
- Connects to CodeGraph's WebSocket infrastructure to receive instantaneous `VERSION_READY` events, keeping intelligence perfectly in sync with your local edits.
