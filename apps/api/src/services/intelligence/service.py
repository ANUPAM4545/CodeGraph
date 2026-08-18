import os
import httpx
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from .dto import (
    RepoIntelligenceDTO,
    GitHubMetadataDTO,
    DevelopmentSetupDTO,
    HealthMetricsDTO
)
from .readme import READMEAnalyzer
from .github import GitHubMetadataAnalyzer
from .api_routes import APIRouteAnalyzer
from .database_models import DatabaseModelAnalyzer
from .tech_stack import TechnologyStackAnalyzer
from .features import FeatureAnalyzer
from .architecture import ArchitectureAnalyzer
from .assets import AssetAnalyzer
from .health import HealthAnalyzer
from ..github import GitHubService
from ...db.models.repository import Repository, RepositoryVersion

logger = logging.getLogger(__name__)

class RepositoryIntelligenceService:
    """
    Orchestrates end-to-end repository intelligence extraction across documentation,
    GitHub metadata, and Neo4j AST graph models.
    """
    def __init__(self, neo4j_driver, github_token: Optional[str] = None):
        self.driver = neo4j_driver
        self.github_service = GitHubService(encrypted_token=github_token)
        self.github_analyzer = GitHubMetadataAnalyzer(self.github_service)
        self.api_analyzer = APIRouteAnalyzer(neo4j_driver)
        self.db_analyzer = DatabaseModelAnalyzer(neo4j_driver)
        self.tech_analyzer = TechnologyStackAnalyzer(neo4j_driver)
        self.feature_analyzer = FeatureAnalyzer(neo4j_driver)
        self.arch_analyzer = ArchitectureAnalyzer(neo4j_driver)
        self.health_analyzer = HealthAnalyzer(neo4j_driver)

    async def get_intelligence(
        self, 
        repository: Repository, 
        version: RepositoryVersion
    ) -> RepoIntelligenceDTO:
        repo_id = str(repository.id)
        version_id = str(version.id)
        commit_sha = version.commit_sha or "main"
        default_branch = repository.default_branch or "main"
        full_name = repository.full_name or repository.name

        # 1. Fetch Real GitHub Metadata & raw README
        github_meta: Optional[GitHubMetadataDTO] = None
        raw_readme_content = None
        raw_github_base = f"https://raw.githubusercontent.com/{full_name}/{commit_sha}"

        if "/" in full_name:
            owner, repo_name = full_name.split("/", 1)
            github_meta = await self.github_analyzer.analyze(full_name, fallback_branch=default_branch)
            
            # Fetch raw README
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo_name}/readme",
                        headers={**self.github_service.headers, "Accept": "application/vnd.github.raw"}
                    )
                    if resp.status_code == 200:
                        raw_readme_content = resp.text
            except Exception as e:
                logger.warning(f"Could not download README for {full_name}: {e}")

        # 2. README Analysis
        readme_analyzer = READMEAnalyzer(raw_readme_content, raw_github_base=raw_github_base)
        readme_data = readme_analyzer.analyze()

        # 3. Technology Stack & Language Extraction
        tech_stack, primary_lang = self.tech_analyzer.analyze(version_id)
        if primary_lang == "Not detected" and github_meta:
            primary_lang = "TypeScript / Python"

        # 4. AST API Route Extraction
        api_endpoints = self.api_analyzer.analyze(version_id)

        # 5. AST Database Models Extraction
        db_models = self.db_analyzer.analyze(version_id)

        # 6. Feature Extraction (Correlating README claims with real files)
        features = self.feature_analyzer.analyze(version_id, readme_data["features"])

        # 7. Subsystems & Architecture Decomposition
        subsystems = self.arch_analyzer.analyze(version_id)

        # 8. Asset Discovery (README diagrams & repo visual files)
        asset_analyzer = AssetAnalyzer(self.driver, raw_github_base=raw_github_base)
        assets = asset_analyzer.analyze(version_id, readme_data["assets"])

        # 9. Repository Health Metrics
        health = self.health_analyzer.analyze(version_id)

        # 10. Evidence Sources Attribution
        evidence_sources = ["Neo4j AST Graph"]
        if raw_readme_content:
            evidence_sources.append("README.md")
        if any("package.json" in t.source_file for t in tech_stack):
            evidence_sources.append("package.json")
        if any("requirements.txt" in t.source_file for t in tech_stack):
            evidence_sources.append("requirements.txt")
        if any("Dockerfile" in t.source_file for t in tech_stack):
            evidence_sources.append("Dockerfile")
        if api_endpoints:
            evidence_sources.append(f"Route Handlers ({len(api_endpoints)} discovered)")
        if db_models:
            evidence_sources.append(f"ORM Schemas ({len(db_models)} models)")

        tagline = readme_data["tagline"]
        if tagline == "Not available" and github_meta and github_meta.description:
            tagline = github_meta.description

        return RepoIntelligenceDTO(
            repository_id=repo_id,
            version_id=version_id,
            commit_sha=commit_sha,
            branch=default_branch,
            generated_at=datetime.now(timezone.utc).isoformat(),
            name=repository.name,
            tagline=tagline,
            summary=readme_data["summary"],
            purpose=readme_data["purpose"],
            problem_statement=readme_data["problem"],
            solution_statement=readme_data["solution"],
            summary_sources=readme_data["sources"],
            github_metadata=github_meta,
            technology_stack=tech_stack,
            primary_language=primary_lang,
            features=features,
            subsystems=subsystems,
            api_endpoints=api_endpoints,
            database_models=db_models,
            dependencies=tech_stack,
            assets=assets,
            development_setup=readme_data["setup"],
            health_metrics=health,
            evidence_sources=evidence_sources
        )
