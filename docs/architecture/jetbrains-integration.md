# JetBrains Integration Foundation

While Milestone 13 implements the VS Code extension, the architectural foundation and API protocol are designed to equally support a JetBrains (IntelliJ Platform) plugin in the future.

## Component Mapping

| CodeGraph Concept | VS Code Extension API | JetBrains IntelliJ Platform API |
|-------------------|-----------------------|---------------------------------|
| Compact Context | `HoverProvider` | `DocumentationProvider` |
| Inline Indicators | `CodeLensProvider` | `LineMarkerProvider` / `InlayHintsProvider` |
| Sidebar View | `WebviewViewProvider` (Activity Bar) | `ToolWindow` (ToolWindowFactory) |
| Impact/AI Trigger | `commands.registerCommand` | `AnAction` |
| Git Context | `simple-git` / `workspace.workspaceFolders` | `ProjectLevelVcsManager` / Git4Idea |
| Realtime Updates | Node.js `ws` library | Java `WebSocketClient` (e.g. OkHttp) |
| Auth Storage | `ExtensionContext.secrets` | `PasswordSafe` |
| Source Navigation | `vscode.workspace.openTextDocument` | `OpenFileDescriptor.navigate()` |

## Implementation Strategy

The JetBrains plugin will use:
- **Language**: Kotlin
- **Build System**: Gradle (`intellij` plugin)
- **UI**: Kotlin UI DSL / Swing, with JCEF (Chromium Embedded Framework) exclusively for the AI Chat Panel.
- **Protocol**: Uses the identical HTTP (`DeveloperContext` DTO) and WebSocket (Ticket auth) protocol established in `ide-protocol.md`.
