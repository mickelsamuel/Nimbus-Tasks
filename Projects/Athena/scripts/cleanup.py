#!/usr/bin/env python3
"""
Athena Repository Cleanup Tool
Performs safe, audited cleanup of temporary files, logs, and documentation reorganization.
"""

import json
import os
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Tuple

# Protected paths that should never be deleted
PROTECTED_PATHS = {
    "athena/", "tests/", "docker/", ".github/", "scripts/", "Makefile",
    "pyproject.toml", "poetry.lock", ".pre-commit-config.yaml", ".env.example",
    "README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md", "PLAYBOOKS.md",
    "ATHENA_PORTFOLIO_REPORT.md", "artifacts/"
}

# File patterns that can be safely deleted
TEMP_PATTERNS = {
    "*.log", "*.tmp", "*.bak", "*.old", "*.swp", ".DS_Store"
}

# Cache directories that can be safely deleted
CACHE_DIRS = {
    "__pycache__", ".pytest_cache", ".ruff_cache", ".mypy_cache", ".venv", "venv"
}

# Canonical documentation files to keep in root
CANONICAL_DOCS = {
    "README.md", "CONTRIBUTING.md", "SECURITY.md", "ATHENA_PORTFOLIO_REPORT.md", "PLAYBOOKS.md"
}


class RepositoryAnalyzer:
    """Analyzes repository structure and creates cleanup plan."""

    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.file_inventory = defaultdict(list)
        self.cleanup_plan = []
        self.orphaned_files = []
        self.duplicate_docs = []

    def analyze(self) -> Dict:
        """Perform comprehensive repository analysis."""
        print("🔍 Analyzing repository structure...")

        # Walk through all files
        for root, dirs, files in os.walk(self.repo_root):
            # Skip protected directories
            dirs[:] = [d for d in dirs if not self._is_protected_path(Path(root) / d)]

            for file in files:
                file_path = Path(root) / file
                rel_path = file_path.relative_to(self.repo_root)

                if self._is_protected_path(file_path):
                    continue

                file_type = self._classify_file(file_path)
                self.file_inventory[file_type].append(rel_path)

        # Analyze specific categories
        self._find_orphaned_code()
        self._find_duplicate_docs()
        self._create_cleanup_plan()

        return {
            "inventory": dict(self.file_inventory),
            "cleanup_plan": self.cleanup_plan,
            "orphaned_files": self.orphaned_files,
            "duplicate_docs": self.duplicate_docs
        }

    def _is_protected_path(self, path: Path) -> bool:
        """Check if path is protected from deletion."""
        rel_path = str(path.relative_to(self.repo_root))
        return any(rel_path.startswith(protected) for protected in PROTECTED_PATHS)

    def _classify_file(self, file_path: Path) -> str:
        """Classify file type based on extension and location."""
        suffix = file_path.suffix.lower()
        name = file_path.name

        # Temporary files
        if any(file_path.match(pattern) for pattern in TEMP_PATTERNS):
            return "temp"

        # Cache directories
        if any(part in CACHE_DIRS for part in file_path.parts):
            return "cache"

        # Documentation
        if suffix == ".md":
            return "docs"

        # Python code
        if suffix == ".py":
            return "code"

        # Configuration
        if suffix in {".toml", ".yaml", ".yml", ".json", ".cfg", ".ini"}:
            return "config"

        # Notebooks
        if suffix == ".ipynb":
            return "notebook"

        # Assets/Media
        if suffix in {".png", ".jpg", ".jpeg", ".gif", ".svg", ".pdf"}:
            return "asset"

        # Data files
        if suffix in {".csv", ".json", ".parquet", ".pickle", ".pkl"}:
            return "data"

        return "other"

    def _find_orphaned_code(self):
        """Find Python files that aren't imported or referenced."""
        print("🔍 Finding orphaned code files...")

        # Get all Python files
        python_files = [f for f in self.file_inventory["code"] if not self._is_test_file(f)]

        # Build import graph
        imports = set()
        cli_entrypoints = set()

        # Scan for imports in all Python files
        for py_file in python_files:
            try:
                content = (self.repo_root / py_file).read_text(encoding='utf-8')

                # Find imports
                import_matches = re.findall(r'from\s+athena\.[\w.]+\s+import|import\s+athena\.[\w.]+', content)
                for match in import_matches:
                    module = re.search(r'athena\.[\w.]+', match)
                    if module:
                        imports.add(module.group())

                # Find CLI entrypoints (Typer commands)
                if "app.command" in content or "@app.callback" in content:
                    cli_entrypoints.add(str(py_file))

            except Exception as e:
                print(f"Warning: Could not read {py_file}: {e}")

        # Find potentially orphaned files
        for py_file in python_files:
            file_module = str(py_file).replace("/", ".").replace(".py", "")
            if (not any(file_module in imp for imp in imports) and
                str(py_file) not in cli_entrypoints and
                not self._is_main_module(py_file)):
                self.orphaned_files.append(py_file)

    def _is_test_file(self, file_path: Path) -> bool:
        """Check if file is a test file."""
        return "test" in str(file_path) or str(file_path).startswith("tests/")

    def _is_main_module(self, file_path: Path) -> bool:
        """Check if file is a main module (__init__.py, __main__.py, etc.)."""
        return file_path.name in {"__init__.py", "__main__.py", "main.py"}

    def _find_duplicate_docs(self):
        """Find duplicate or overlapping markdown files."""
        print("🔍 Finding duplicate documentation...")

        doc_files = self.file_inventory["docs"]
        doc_titles = {}

        for doc_file in doc_files:
            if str(doc_file) in CANONICAL_DOCS:
                continue

            try:
                content = (self.repo_root / doc_file).read_text(encoding='utf-8')
                # Extract title from first H1 header
                title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
                if title_match:
                    title = title_match.group(1).strip()
                    if title in doc_titles:
                        self.duplicate_docs.append({
                            "title": title,
                            "files": [doc_titles[title], doc_file],
                            "action": "consolidate"
                        })
                    else:
                        doc_titles[title] = doc_file

            except Exception as e:
                print(f"Warning: Could not read {doc_file}: {e}")

    def _create_cleanup_plan(self):
        """Create comprehensive cleanup plan."""
        print("📋 Creating cleanup plan...")

        # Temporary files - delete
        for temp_file in self.file_inventory["temp"]:
            self.cleanup_plan.append({
                "action": "delete",
                "path": str(temp_file),
                "reason": "Temporary file",
                "type": "temp"
            })

        # Cache directories - delete
        for cache_file in self.file_inventory["cache"]:
            if any(cache_dir in str(cache_file) for cache_dir in CACHE_DIRS):
                self.cleanup_plan.append({
                    "action": "delete",
                    "path": str(cache_file),
                    "reason": "Cache directory",
                    "type": "cache"
                })

        # Orphaned code - move to archive
        for orphan in self.orphaned_files:
            self.cleanup_plan.append({
                "action": "move",
                "path": str(orphan),
                "destination": f"scripts/archive/{orphan.name}",
                "reason": "Potentially orphaned code",
                "type": "orphan"
            })

        # Non-canonical docs - move to docs/
        for doc_file in self.file_inventory["docs"]:
            if (str(doc_file) not in CANONICAL_DOCS and
                not str(doc_file).startswith("docs/") and
                not str(doc_file).startswith("artifacts/")):

                dest = f"docs/{doc_file.name}"
                if doc_file.name.startswith(("STEP_", "DEMO_", "HIRING_", "DELIVERY_", "VALIDATION_")):
                    dest = f"docs/archive/{doc_file.name}"

                self.cleanup_plan.append({
                    "action": "move",
                    "path": str(doc_file),
                    "destination": dest,
                    "reason": "Non-canonical documentation",
                    "type": "docs"
                })

        # Large files outside artifacts/ - move to artifacts/misc/
        for file_type in ["asset", "data", "other"]:
            for file_path in self.file_inventory[file_type]:
                if not str(file_path).startswith("artifacts/"):
                    file_size = (self.repo_root / file_path).stat().st_size
                    if file_size > 1024 * 1024:  # > 1MB
                        self.cleanup_plan.append({
                            "action": "move",
                            "path": str(file_path),
                            "destination": f"artifacts/misc/{file_path.name}",
                            "reason": f"Large file ({file_size // 1024 // 1024}MB) outside artifacts/",
                            "type": "large_file"
                        })

    def generate_reports(self):
        """Generate cleanup plan reports."""
        print("📊 Generating cleanup reports...")

        # Create directories if they don't exist
        (self.repo_root / "docs").mkdir(exist_ok=True)
        (self.repo_root / "docs/archive").mkdir(exist_ok=True)
        (self.repo_root / "scripts/archive").mkdir(exist_ok=True)
        (self.repo_root / "artifacts/misc").mkdir(exist_ok=True)

        # Generate JSON report
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "inventory": dict(self.file_inventory),
            "cleanup_plan": self.cleanup_plan,
            "summary": {
                "total_files": sum(len(files) for files in self.file_inventory.values()),
                "actions_planned": len(self.cleanup_plan),
                "files_to_delete": len([p for p in self.cleanup_plan if p["action"] == "delete"]),
                "files_to_move": len([p for p in self.cleanup_plan if p["action"] == "move"])
            }
        }

        with open(self.repo_root / "CLEANUP_PLAN.json", "w") as f:
            json.dump(report_data, f, indent=2, default=str)

        # Generate Markdown report
        self._generate_markdown_report(report_data)

        return report_data

    def _generate_markdown_report(self, data: Dict):
        """Generate markdown cleanup plan report."""
        md_content = f"""# Repository Cleanup Plan

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

- **Total files analyzed**: {data['summary']['total_files']:,}
- **Actions planned**: {data['summary']['actions_planned']:,}
- **Files to delete**: {data['summary']['files_to_delete']:,}
- **Files to move**: {data['summary']['files_to_move']:,}

## File Inventory

| Category | Count | Description |
|----------|-------|-------------|
"""

        for category, files in data['inventory'].items():
            count = len(files)
            if count > 0:
                md_content += f"| {category} | {count:,} | {self._get_category_description(category)} |\n"

        md_content += "\n## Planned Actions\n\n"

        # Group actions by type
        actions_by_type = defaultdict(list)
        for action in data['cleanup_plan'][:50]:  # Top 50 actions
            actions_by_type[action['type']].append(action)

        for action_type, actions in actions_by_type.items():
            md_content += f"\n### {action_type.title()} Files\n\n"
            md_content += "| Action | Path | Destination | Reason |\n"
            md_content += "|--------|------|-------------|--------|\n"

            for action in actions[:20]:  # Limit to 20 per type
                dest = action.get('destination', 'N/A')
                md_content += f"| {action['action']} | `{action['path']}` | `{dest}` | {action['reason']} |\n"

        with open(self.repo_root / "CLEANUP_PLAN.md", "w") as f:
            f.write(md_content)

    def _get_category_description(self, category: str) -> str:
        """Get description for file category."""
        descriptions = {
            "code": "Python source files",
            "docs": "Documentation files",
            "config": "Configuration files",
            "temp": "Temporary files",
            "cache": "Cache directories",
            "asset": "Images and media",
            "data": "Data files",
            "notebook": "Jupyter notebooks",
            "other": "Other files"
        }
        return descriptions.get(category, "Unknown")


def main():
    """Main cleanup analysis function."""
    repo_root = Path.cwd()

    print(f"🧹 Athena Repository Cleanup Tool")
    print(f"📁 Analyzing: {repo_root}")
    print(f"🛡️  Protected paths: {len(PROTECTED_PATHS)}")
    print()

    analyzer = RepositoryAnalyzer(repo_root)
    analysis_results = analyzer.analyze()
    report_data = analyzer.generate_reports()

    print(f"\n✅ Analysis complete!")
    print(f"📊 Reports generated: CLEANUP_PLAN.json, CLEANUP_PLAN.md")
    print(f"🎯 Ready for review and approval")

    return 0


if __name__ == "__main__":
    sys.exit(main())