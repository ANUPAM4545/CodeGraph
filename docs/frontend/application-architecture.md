# Application Architecture

## Framework
- **Core**: Next.js 15 (App Router)
- **UI React**: React 19
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Route Structure
- `/dashboard`: Main metrics overview, recent repositories, background activity.
- `/repositories`: Grid/list view of accessible codebases.
- `/repositories/[id]`: Central workspace for a specific repository.
  - Sub-tabs rendered dynamically: Overview, Explorer, Architecture, AI Assistant, History, Settings.
- `/architecture`: Global architectural health and cross-repo dependencies.
- `/impact-analysis`: Global impact assessment across services.
- `/search`: Full codebase text/symbol search.
- `/analytics`: Global AI and usage analytics.
- `/settings`: Organization and User settings.

## Global Shell
- `AppShell`: Wraps the entire `(dashboard)` route group.
- `Sidebar`: Collapsible, keyboard-accessible main navigation.
- `TopNav`: Command Palette trigger (`CMD+K`) and User Profile.

## State Management
- Complex states (e.g., React Flow nodes/edges, R3F cameras) are managed locally within their heavy wrapper components.
- Real-time updates (via WebSocket) are broadcasted via `RealtimeProvider` and consumed locally where necessary to append timelines or refresh queries without destroying layouts.

## API Adapters
Where backend endpoints are missing (e.g., `/api/v1/analytics/global`), strict typed adapter functions are exported in `lib/api/` with `MOCK DATA` flags for easy replacement during backend implementation phases.
