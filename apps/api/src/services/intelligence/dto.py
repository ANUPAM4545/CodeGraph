from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class SourceReferenceDTO:
    file_path: str
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    description: Optional[str] = None

@dataclass
class GitHubMetadataDTO:
    name: str
    full_name: str
    description: Optional[str] = None
    visibility: str = "public"
    stars: int = 0
    forks: int = 0
    default_branch: str = "main"
    license: Optional[str] = None
    html_url: Optional[str] = None
    last_commit_sha: Optional[str] = None
    last_commit_date: Optional[str] = None

@dataclass
class TechStackItemDTO:
    name: str
    category: str  # Frontend, Backend, Database, Infrastructure, DevOps, Tooling
    version: Optional[str] = None
    source_file: str = "Not available"
    icon_slug: Optional[str] = None

@dataclass
class ApiEndpointDTO:
    method: str  # GET, POST, PUT, DELETE, PATCH, WS
    path: str
    handler: str
    source_file: str
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    summary: Optional[str] = None

@dataclass
class DbModelDTO:
    name: str
    table_name: Optional[str] = None
    orm_framework: str = "Not detected"  # SQLAlchemy, Prisma, Django, TypeORM, etc.
    fields: List[str] = field(default_factory=list)
    relationships: List[str] = field(default_factory=list)
    source_file: str = "Not available"
    line_start: Optional[int] = None

@dataclass
class FeatureDTO:
    name: str
    description: str
    confidence: str = "HIGH"  # HIGH, MEDIUM
    evidence_files: List[str] = field(default_factory=list)
    category: Optional[str] = None

@dataclass
class SubsystemDTO:
    name: str
    responsibility: str
    files_count: int = 0
    symbols_count: int = 0
    coupling_ratio: float = 0.0
    status: str = "LOW_COUPLING"
    sample_files: List[str] = field(default_factory=list)

@dataclass
class AssetDTO:
    filename: str
    repository_path: str
    asset_type: str  # image, diagram, screenshot, badge
    preview_url: Optional[str] = None
    source_reference: str = "README.md"

@dataclass
class DevelopmentSetupDTO:
    prerequisites: List[str] = field(default_factory=list)
    install_commands: List[str] = field(default_factory=list)
    dev_commands: List[str] = field(default_factory=list)
    build_commands: List[str] = field(default_factory=list)
    test_commands: List[str] = field(default_factory=list)
    environment_variables: List[Dict[str, str]] = field(default_factory=list)
    docker_instructions: Optional[str] = None
    sources: List[str] = field(default_factory=list)

@dataclass
class HealthMetricsDTO:
    total_files: int = 0
    total_functions: int = 0
    total_classes: int = 0
    total_ast_nodes: int = 0
    total_relationships: int = 0
    entry_points_count: int = 0
    circular_dependencies_count: int = 0
    health_score: int = 100
    health_grade: str = "A"

@dataclass
class RepoIntelligenceDTO:
    repository_id: str
    version_id: str
    commit_sha: str
    branch: str
    generated_at: str
    
    # Overview & Purpose
    name: str
    tagline: str
    summary: str
    purpose: str
    problem_statement: str
    solution_statement: str
    summary_sources: List[str] = field(default_factory=list)
    
    # Metadata & Tech
    github_metadata: Optional[GitHubMetadataDTO] = None
    technology_stack: List[TechStackItemDTO] = field(default_factory=list)
    primary_language: str = "Not detected"
    
    # Core Domain Analysis
    features: List[FeatureDTO] = field(default_factory=list)
    subsystems: List[SubsystemDTO] = field(default_factory=list)
    api_endpoints: List[ApiEndpointDTO] = field(default_factory=list)
    database_models: List[DbModelDTO] = field(default_factory=list)
    dependencies: List[TechStackItemDTO] = field(default_factory=list)
    
    # Media & Setup
    assets: List[AssetDTO] = field(default_factory=list)
    development_setup: Optional[DevelopmentSetupDTO] = None
    health_metrics: Optional[HealthMetricsDTO] = None
    
    # Provenance
    evidence_sources: List[str] = field(default_factory=list)
