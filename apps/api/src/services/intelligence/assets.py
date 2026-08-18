import os
from typing import List, Dict, Any
from .dto import AssetDTO

IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")

class AssetAnalyzer:
    """
    Discovers real repository visual assets (screenshots, diagrams, UI assets) and resolves previews.
    """
    def __init__(self, neo4j_driver, raw_github_base: str = ""):
        self.driver = neo4j_driver
        self.raw_github_base = raw_github_base

    def analyze(self, version_id: str, readme_assets: List[AssetDTO]) -> List[AssetDTO]:
        discovered_assets: List[AssetDTO] = list(readme_assets)
        seen_paths = set(a.repository_path for a in readme_assets)

        with self.driver.session() as session:
            # Query files matching image extensions
            query = """
            MATCH (f:GraphNode {repository_version_id: $version_id, type: "File"})
            WHERE f.file_path =~ ".*\\.(png|jpg|jpeg|webp|gif|svg)$"
            RETURN f.file_path AS file_path, f.name AS name
            LIMIT 20
            """
            results = session.run(query, version_id=version_id)
            
            for r in results:
                path = r["file_path"]
                name = r["name"]
                
                # Skip tiny favicon/icons or node_modules
                if "node_modules" in path or "favicon" in path.lower():
                    continue
                if path in seen_paths:
                    continue
                    
                preview = path
                if not path.startswith("http") and self.raw_github_base:
                    preview = f"{self.raw_github_base}/{path.lstrip('/')}"
                    
                asset_type = "screenshot" if "screenshot" in path.lower() or "demo" in path.lower() else "asset"
                
                discovered_assets.append(AssetDTO(
                    filename=name,
                    repository_path=path,
                    asset_type=asset_type,
                    preview_url=preview,
                    source_reference=path
                ))
                seen_paths.add(path)

        return discovered_assets[:12]
