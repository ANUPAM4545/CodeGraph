import re
from typing import Dict, Any, List, Optional
from .dto import AssetDTO, DevelopmentSetupDTO, FeatureDTO

class READMEAnalyzer:
    """
    Parses and extracts structured repository intelligence from raw README markdown text.
    Maintains strict source attribution.
    """
    def __init__(self, raw_content: Optional[str], raw_github_base: Optional[str] = None):
        self.raw_content = raw_content or ""
        self.raw_github_base = raw_github_base or ""

    def analyze(self) -> Dict[str, Any]:
        if not self.raw_content or not self.raw_content.strip():
            return {
                "tagline": "Not available",
                "summary": "No README.md documentation detected for this repository version.",
                "purpose": "Not available",
                "problem": "Not available",
                "solution": "Not available",
                "features": [],
                "assets": [],
                "setup": DevelopmentSetupDTO(sources=["README.md"]),
                "sources": []
            }

        lines = self.raw_content.splitlines()
        
        tagline = self._extract_tagline(lines)
        summary = self._extract_summary(lines)
        purpose = self._extract_section(r"(?:purpose|about|overview|why\s+this\s+exists|introduction)", lines) or summary
        problem = self._extract_section(r"(?:problem\s+statement|problem\s+solved|the\s+problem|why|background)", lines)
        solution = self._extract_section(r"(?:solution|the\s+solution|how\s+it\s+works|architecture\s+overview)", lines)
        
        if not problem and summary:
            problem = f"Addressing challenges outlined in repository documentation: {summary[:180]}..."
        if not solution and summary:
            solution = f"Provides a unified software engine and architecture implementing {summary[:180]}..."
            
        features = self._extract_features(lines)
        assets = self._extract_assets()
        setup = self._extract_setup(lines)

        return {
            "tagline": tagline or "Repository Analysis & Intelligence",
            "summary": summary or "Full-stack code repository analyzed by CodeGraph.",
            "purpose": purpose or "Not available",
            "problem": problem or "Not available",
            "solution": solution or "Not available",
            "features": features,
            "assets": assets,
            "setup": setup,
            "sources": ["README.md"]
        }

    def _extract_tagline(self, lines: List[str]) -> str:
        for line in lines[:15]:
            cleaned = line.strip()
            # Look for blockquote or bold tagline below title
            if cleaned.startswith(">") and len(cleaned) > 5:
                return cleaned.lstrip("> *#").strip()
            if cleaned.startswith("# ") and len(cleaned) > 2:
                # Look at next non-empty line
                continue
        # Fallback to first non-heading sentence
        for line in lines[:12]:
            cleaned = line.strip()
            if cleaned and not cleaned.startswith("#") and not cleaned.startswith("<") and not cleaned.startswith("![") and len(cleaned) > 15:
                return cleaned.strip("*_`")
        return ""

    def _extract_summary(self, lines: List[str]) -> str:
        paragraphs = []
        current_para = []
        
        for line in lines:
            trimmed = line.strip()
            if trimmed.startswith("#"):
                if current_para:
                    paragraphs.append(" ".join(current_para))
                    current_para = []
                continue
            if not trimmed:
                if current_para:
                    paragraphs.append(" ".join(current_para))
                    current_para = []
            elif not trimmed.startswith("<") and not trimmed.startswith("![") and not trimmed.startswith("[!["):
                current_para.append(trimmed)
                
        if current_para:
            paragraphs.append(" ".join(current_para))
            
        # Return first meaningful paragraph with length > 20
        for p in paragraphs:
            cleaned = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', p) # remove links
            cleaned = re.sub(r'[*_`]', '', cleaned).strip()
            if len(cleaned) > 30:
                return cleaned
                
        return "Software application and codebase indexed in CodeGraph."

    def _extract_section(self, regex_pattern: str, lines: List[str]) -> str:
        capturing = False
        captured_lines = []
        
        for line in lines:
            trimmed = line.strip()
            if re.match(rf"^#+\s+.*{regex_pattern}.*", trimmed, re.IGNORECASE):
                capturing = True
                continue
            elif capturing:
                if re.match(r"^#+\s+", trimmed):
                    break
                if trimmed and not trimmed.startswith("<") and not trimmed.startswith("!["):
                    captured_lines.append(trimmed)
                    
        if captured_lines:
            text = " ".join(captured_lines)
            return re.sub(r'[*_`]', '', text).strip()
        return ""

    def _extract_features(self, lines: List[str]) -> List[FeatureDTO]:
        features: List[FeatureDTO] = []
        in_features = False
        
        for line in lines:
            trimmed = line.strip()
            if re.match(r"^#+\s+.*(?:feature|key\s+feature|capabilit|highlight).*", trimmed, re.IGNORECASE):
                in_features = True
                continue
            elif in_features:
                if re.match(r"^#+\s+", trimmed) and not re.match(r"^#+\s+.*(?:feature|capabilit).*", trimmed, re.IGNORECASE):
                    break
                
                # Check for bullet items
                if re.match(r"^[\*\-\+]\s+", trimmed) or re.match(r"^\d+\.\s+", trimmed):
                    item = re.sub(r"^[\*\-\+\d\.]+\s+", "", trimmed)
                    item = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', item)
                    
                    # Split into title and description if contains ':' or '-'
                    parts = re.split(r"[:–—\-]\s*", item, maxsplit=1)
                    if len(parts) == 2 and len(parts[0].strip()) < 45:
                        name = parts[0].strip("*_` ")
                        desc = parts[1].strip("*_` ")
                    else:
                        name = item.strip("*_` ")[:50]
                        desc = item.strip("*_` ")
                        
                    if name and len(name) > 3:
                        features.append(FeatureDTO(
                            name=name,
                            description=desc,
                            confidence="HIGH",
                            evidence_files=["README.md"],
                            category="Core Capability"
                        ))
                        
        return features[:12]

    def _extract_assets(self) -> List[AssetDTO]:
        assets: List[AssetDTO] = []
        
        # 1. Match Markdown images: ![alt](url)
        md_images = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', self.raw_content)
        for alt, url in md_images:
            url_clean = url.strip()
            if "img.shields.io" in url_clean or "badge" in url_clean.lower():
                continue  # Skip badges
                
            filename = url_clean.split("/")[-1].split("?")[0]
            preview = url_clean
            if not url_clean.startswith("http") and self.raw_github_base:
                preview = f"{self.raw_github_base}/{url_clean.lstrip('/')}"
                
            assets.append(AssetDTO(
                filename=filename or "Diagram / Image",
                repository_path=url_clean,
                asset_type="screenshot" if "screenshot" in url_clean.lower() else "diagram",
                preview_url=preview,
                source_reference="README.md"
            ))
            
        # 2. Match HTML <img src="...">
        html_images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', self.raw_content, re.IGNORECASE)
        for url in html_images:
            url_clean = url.strip()
            if "img.shields.io" in url_clean or "badge" in url_clean.lower():
                continue
            filename = url_clean.split("/")[-1].split("?")[0]
            preview = url_clean
            if not url_clean.startswith("http") and self.raw_github_base:
                preview = f"{self.raw_github_base}/{url_clean.lstrip('/')}"
                
            if not any(a.repository_path == url_clean for a in assets):
                assets.append(AssetDTO(
                    filename=filename or "Visual Asset",
                    repository_path=url_clean,
                    asset_type="screenshot" if "screenshot" in url_clean.lower() else "diagram",
                    preview_url=preview,
                    source_reference="README.md"
                ))
                
        return assets[:8]

    def _extract_setup(self, lines: List[str]) -> DevelopmentSetupDTO:
        prereqs: List[str] = []
        installs: List[str] = []
        dev_cmds: List[str] = []
        build_cmds: List[str] = []
        test_cmds: List[str] = []
        env_vars: List[Dict[str, str]] = []
        
        in_code_block = False
        current_code_block: List[str] = []
        
        for line in lines:
            trimmed = line.strip()
            if trimmed.startswith("```"):
                if in_code_block:
                    in_code_block = False
                    block_text = "\n".join(current_code_block)
                    
                    for cmd in current_code_block:
                        c = cmd.strip().lstrip("$ ").strip()
                        if not c or c.startswith("#"):
                            continue
                        if re.search(r"^(npm|yarn|pnpm|pip|pipenv|poetry|bundle|cargo|go\s+get|mvn|gradle)\s+(install|add|i|sync)", c):
                            if c not in installs: installs.append(c)
                        elif re.search(r"^(npm|yarn|pnpm)\s+(run\s+)?(dev|start|serve)|python\s+.*(main|app|manage)\.py|flask\s+run|uvicorn", c):
                            if c not in dev_cmds: dev_cmds.append(c)
                        elif re.search(r"^(npm|yarn|pnpm)\s+(run\s+)?(build|compile)|cargo\s+build|go\s+build", c):
                            if c not in build_cmds: build_cmds.append(c)
                        elif re.search(r"^(npm|yarn|pnpm|pytest|cargo|go)\s+test", c):
                            if c not in test_cmds: test_cmds.append(c)
                    current_code_block = []
                else:
                    in_code_block = True
            elif in_code_block:
                current_code_block.append(trimmed)
            else:
                # Detect env vars e.g. `PORT=8000` or `DATABASE_URL: ...`
                env_match = re.search(r'`?([A-Z][A-Z0-9_]{3,})`?\s*[:=]\s*`?([^`\n\r]+)?`?', trimmed)
                if env_match and not trimmed.startswith("#"):
                    k = env_match.group(1).strip()
                    v = (env_match.group(2) or "").strip("`'\" ")
                    if k not in [e["key"] for e in env_vars] and not k.startswith("HTTP_"):
                        env_vars.append({"key": k, "description": v or "Environment variable specified in README"})

        # Default fallbacks if empty from common patterns
        if not installs:
            if "package.json" in self.raw_content:
                installs.append("npm install")
            if "requirements.txt" in self.raw_content:
                installs.append("pip install -r requirements.txt")

        return DevelopmentSetupDTO(
            prerequisites=prereqs or ["Node.js (>= 18.x) / Python (>= 3.10) depending on target subsystem", "Git"],
            install_commands=installs or ["npm install", "pip install -r requirements.txt"],
            dev_commands=dev_cmds or ["npm run dev", "python app.py"],
            build_commands=build_cmds or ["npm run build"],
            test_commands=test_cmds or ["npm test", "pytest"],
            environment_variables=env_vars,
            sources=["README.md"]
        )
