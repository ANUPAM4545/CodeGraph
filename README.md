<div align="center">
  <h1>CodeGraph</h1>
  <p><strong>AI-Powered Code Intelligence that Turns Repositories into Living Architectural Knowledge Graphs</strong></p>
  
  <p>
    <a href="#core-capabilities">Capabilities</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#intelligence-pipeline">Pipeline</a> •
    <a href="#repository-intelligence">Repository Intelligence</a> •
    <a href="#ide-integration">IDE Copilot</a> •
    <a href="#local-development">Getting Started</a> •
    <a href="#security">Security</a>
  </p>
</div>

---

## 📖 What is CodeGraph?

**CodeGraph** is a developer-native code intelligence and architecture platform. It parses raw source code repositories into semantic AST graphs, persists relationships inside Neo4j, generates hybrid vector embeddings in Qdrant, and provides developers, architects, and engineering leaders with real-time architectural insights, blast-radius simulation, interactive 3D codebase navigation, and grounded AI assistance.

---

## 🎯 Why CodeGraph?

- **Understanding Large Codebases**: Modern applications span hundreds of files, microservices, and dependencies. CodeGraph automatically extracts architectural layers, entry points, and domain boundaries.
- **Architectural Drift & Hidden Coupling**: Codebase changes often cross architectural boundaries silently. CodeGraph measures fan-in, fan-out, and cross-subsystem coupling in real-time.
- **Blast-Radius & Impact Simulation**: Changing a shared utility or model can break unseen callers. CodeGraph simulates multi-hop upstream and downstream dependencies before you merge.
- **Grounded AI Without Hallucinations**: Traditional AI code assistants lack full-repo topological context. CodeGraph grounds LLMs with hybrid graph-traversal evidence and semantic code chunks.

---

## ⚡ Core Capabilities

| Capability | Description |
| :--- | :--- |
| **🧠 Knowledge Graph Engine** | AST-level extraction of Files, Classes, Functions, Methods, and Packages with typed relationships (`CALLS`, `IMPORTS`, `INHERITS`, `DEFINES`, `CONTAINS`). |
| **⭐ Repository Intelligence** | Automated extraction of purpose, domain features, tech stack manifests, REST API routes, database ORM models, dev setup guides, and deterministic health metrics. |
| **🕸️ Interactive Graph Explorer** | Progressive React Flow canvas with node filtering, neighbor expansion, cyclic dependency detection, and file path inspection. |
| **🪐 3D Codebase Universe** | WebGL/Three.js-powered 3D planetary visualization mapping modules to planetary bodies with density-based gravitational clustering. |
| **💥 Change Impact Simulator** | Multi-depth blast radius calculation that computes direct callers, callees, affected subsystems, and risk signals (0–100 score). |
| **💬 Grounded AI Assistant** | Multi-turn AI chat powered by Hybrid Retrieval (Cypher AST queries + Qdrant semantic vector search) with source citations. |
| **🔄 Continuous Analysis** | GitHub webhook ingestion with deterministic commit SHAs, incremental AST change detection, and background RQ queue workers. |
| **⚡ Real-time Developer Sync** | Low-latency WebSockets streaming live repository ingestion status and AST change pulses to connected clients. |
| **🏢 Enterprise Tenancy & RBAC** | Multi-organization tenancy, hashed API key management (`cg_live_...`), member roles (Owner, Admin, Member), and audit logging. |
| **💻 VS Code Developer Copilot** | Native IDE extension offering architectural CodeLens, symbol hover cards, live blast radius inspection, and sidebar intelligence. |

---

## 🏗️ System Architecture

```text
                                  +-----------------------------+
                                  |     Developer / Client      |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +---------------------------+                               +-------------+
         |   Next.js Web Frontend    |                               |   VS Code   |
         | (React 18 / Tailwind CSS) |                               |  Extension  |
         +-------------+-------------+                               +------+------+
                       |                                                    |
                       |       REST API / WebSockets (JSON / WS)            |
                       +-------------------------+--------------------------+
                                                 |
                                                 v
                               +-----------------------------------+
                               |       FastAPI Core Gateway        |
                               | (Auth, Tenancy, Deps, API Routes) |
                               +-----------------+-----------------+
                                                 |
         +-----------------------+---------------+-----------------------+
         |                       |                                       |
         v                       v                                       v
+-----------------+     +-----------------+                     +-----------------+
|   PostgreSQL    |     |  Neo4j Graph DB |                     | Qdrant Vectors  |
|  (Users, Orgs,  |     |  (AST Nodes &   |                     | (Code Chunks &  |
| Repos, Audits)  |     |  Relationships) |                     |   Embeddings)   |
+-----------------+     +--------+--------+                     +-----------------+
                                 |
                                 v
                       +-------------------+
                       |    Redis & RQ     |
                       | (Task Queues & WS)|
                       +---------+---------+
                                 |
                                 v
                       +-------------------+
                       |  Analysis Worker  |
                       | (Tree-sitter AST) |
                       +-------------------+
```

---

## 🔍 Intelligence Pipeline

```text
Repository Source
       │
       ▼
GitHub Source Provider (Tarball Streaming & Extraction)
       │
       ▼
Tree-Sitter Language Parsers (Python, TypeScript, JavaScript)
       │
       ▼
Canonical Graph Construction (Nodes, Edges & Unresolved Symbols)
       │
       ▼
Symbol Resolution & Scope Linking (Resolves Imports, Calls & Inheritance)
       │
       ├──► Neo4j Storage (Nodes, Relationships & Architecture Metrics)
       │
       └──► Vector Chunking & Embedding ──► Qdrant Vector Storage
                                                    │
                                                    ▼
                                    Hybrid Graph-RAG Retrieval
                                                    │
                                                    ▼
                                     Grounded AI Synthesis (LLM)
```

> [!NOTE]
> **AI Grounding Guarantee**: The CodeGraph AI assistant is strictly grounded in retrieved graph and vector evidence. It cites exact file paths and symbol lines.

---

## 🌐 Graph Intelligence Schema

CodeGraph persists a structured code graph with the following node and relationship types:

### Node Types
- `File`: Source code file within the repository.
- `Directory`: Hierarchical directory boundary.
- `Class`: Class, interface, or struct declaration.
- `Function` / `Method`: Executable function or class method.
- `Parameter`: Function or method parameter definition.
- `ExternalPackage`: Third-party imported package or manifest dependency.

### Relationship Types
- `CONTAINS`: Structural hierarchy (`Directory` → `File` or `File` → `Function`).
- `DEFINES`: Symbol definition boundary (`Class` → `Method`).
- `CALLS`: Method/function invocation edge (`Function` → `Function`).
- `IMPORTS`: Cross-file module import dependency (`File` → `ExternalPackage` or `File`).
- `INHERITS`: Class inheritance or interface implementation (`Class` → `Class`).

---

## 💻 IDE Integration (VS Code Extension)

The `codegraph-vscode` extension delivers ambient architectural context directly inside the code editor:

- **Architectural CodeLens**: Displays caller count, direct dependencies, and blast-radius score above function declarations.
- **Symbol Hover Provider**: Rich markdown tooltip displaying subsystem ownership, incoming calls, and circular loop warnings.
- **AI Architectural Sidebar**: Chat with repository graph AI without leaving VS Code.
- **Context API Gateway**: Powered by `POST /api/v1/ide/context` and WebSocket event streams.

---

## 🗂️ Monorepo Structure

```text
CodeGraph/
├── apps/
│   ├── api/                  # FastAPI Backend Server
│   │   ├── src/
│   │   │   ├── api/v1/       # REST Routes (Repos, Graph, Architecture, Intelligence, AI, IDE)
│   │   │   ├── core/         # Settings & Configuration
│   │   │   ├── db/           # SQLAlchemy Session, Models & Migrations
│   │   │   └── services/     # Intelligence, AI, Security, Realtime, Storage Services
│   │   └── tests/            # Pytest test suites
│   ├── vscode/               # VS Code Extension (TypeScript)
│   └── web/                  # Next.js 14 Web Application (App Router, React Flow, Three.js)
├── services/
│   └── analysis/             # AST Extraction, Resolvers, Neo4j & Qdrant Loaders, RQ Worker
├── infrastructure/           # Docker configuration & scripts
├── docs/                     # Technical specifications & architecture guides
├── docker-compose.yml        # Multi-container orchestration definition
├── pyproject.toml            # Python configuration
└── package.json              # Monorepo root workspace configuration
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Docker** and **Docker Compose**
- **Node.js** (v18.x or v20.x)
- **Python** (3.10+ or 3.11)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/ANUPAM4545/CodeGraph.git
cd CodeGraph

# Copy environment template
cp .env.example .env
```

### 2. Start Full Infrastructure Stack with Docker Compose
```bash
docker-compose up -d --build
```

This boots:
- **Web Dashboard**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- **Neo4j Graph Browser**: `http://localhost:7474`
- **Qdrant Vector DB**: `http://localhost:6333`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **RQ Analysis Worker**: Background worker processing analysis jobs

---

## 🔐 Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `POSTGRES_USER` | PostgreSQL Username | `codegraph` |
| `POSTGRES_PASSWORD` | PostgreSQL Password | `codegraph_password` |
| `POSTGRES_DB` | PostgreSQL Database Name | `codegraph_db` |
| `NEO4J_URI` | Neo4j Bolt Connection URI | `bolt://localhost:7687` |
| `NEO4J_USER` | Neo4j Username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j Password | `codegraph_neo4j` |
| `QDRANT_HOST` | Qdrant Host | `localhost` |
| `QDRANT_PORT` | Qdrant Port | `6333` |
| `REDIS_HOST` | Redis Host | `localhost` |
| `REDIS_PORT` | Redis Port | `6379` |
| `JWT_SECRET` | Secret key for session tokens | *(Set strong random string in production)* |
| `ENCRYPTION_KEY` | 32 URL-safe base64 encryption key | *(Set 32-byte base64 key)* |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | *(From GitHub Developer Settings)* |
| `GITHUB_CLIENT_SECRET`| GitHub OAuth Client Secret | *(From GitHub Developer Settings)* |
| `GITHUB_TOKEN` | Optional GitHub Personal Access Token | *(For private repo access & high rate limits)* |

---

## 🧪 Verification & Testing Suite

### Backend Unit & Integration Tests
```bash
# Run pytest across all suites
PYTHONPATH=apps/api:apps/api/src:services/analysis:. pytest apps/api/tests
```

### Frontend Build & Typecheck
```bash
cd apps/web
npm run build
```

### VS Code Extension Typecheck
```bash
cd apps/vscode
npm run check-types
```

---

## 🛡️ Security Architecture

- **HttpOnly Secure Session Cookies**: Session tokens stored with `HttpOnly; SameSite=Lax; Path=/` to prevent XSS credential theft.
- **Hashed API Keys**: IDE developer keys (`cg_live_...`) are hashed using SHA-256 before storage in PostgreSQL.
- **Encrypted Credential Store**: OAuth tokens and secrets encrypted using AES-128-CBC / Fernet symmetric encryption.
- **Tenant & Version Isolation**: Every Cypher query and Vector search strictly filters by `repository_version_id` and verified user organization tenancy.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
