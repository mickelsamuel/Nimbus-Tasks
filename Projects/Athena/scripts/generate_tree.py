#!/usr/bin/env python3
"""
Repository Tree Generator
Generates a clean repository structure tree for documentation.
"""

import os
import sys
from pathlib import Path
from typing import Set, List


class TreeGenerator:
    """Generates repository tree structure."""

    def __init__(self, root_path: Path, max_depth: int = 3):
        self.root_path = root_path
        self.max_depth = max_depth
        self.ignore_patterns = {
            "__pycache__", ".pytest_cache", ".ruff_cache", ".mypy_cache",
            "venv", ".venv", "node_modules", ".git", ".DS_Store",
            "*.pyc", "*.pyo", "*.log", "*.tmp"
        }

    def should_ignore(self, path: Path) -> bool:
        """Check if path should be ignored."""
        name = path.name

        # Check ignore patterns
        for pattern in self.ignore_patterns:
            if pattern.startswith("*"):
                if name.endswith(pattern[1:]):
                    return True
            elif name == pattern:
                return True

        # Ignore hidden files/dirs (except important ones)
        if name.startswith(".") and name not in {".github", ".pre-commit-config.yaml", ".env.example"}:
            return True

        return False

    def generate_tree(self, output_file: str = None) -> str:
        """Generate repository tree structure."""
        lines = [f"# Repository Structure\n"]
        lines.append(f"Generated: {Path.cwd().name}/\n")
        lines.append("```")

        def add_tree_lines(path: Path, prefix: str = "", depth: int = 0):
            if depth >= self.max_depth:
                return

            try:
                entries = sorted([p for p in path.iterdir() if not self.should_ignore(p)])
            except PermissionError:
                return

            # Separate directories and files
            dirs = [p for p in entries if p.is_dir()]
            files = [p for p in entries if p.is_file()]

            # Process directories first
            for i, entry in enumerate(dirs):
                is_last_dir = i == len(dirs) - 1 and len(files) == 0
                connector = "└── " if is_last_dir else "├── "
                lines.append(f"{prefix}{connector}{entry.name}/")

                extension = "    " if is_last_dir else "│   "
                add_tree_lines(entry, prefix + extension, depth + 1)

            # Then process files (only show important ones at depth > 1)
            if depth <= 1:
                for i, entry in enumerate(files):
                    is_last = i == len(files) - 1
                    connector = "└── " if is_last else "├── "
                    lines.append(f"{prefix}{connector}{entry.name}")
            elif files:
                # Just show count for deeper levels
                lines.append(f"{prefix}└── ... ({len(files)} files)")

        add_tree_lines(self.root_path)
        lines.append("```")

        tree_content = "\n".join(lines)

        if output_file:
            output_path = self.root_path / output_file
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(tree_content)
            print(f"Tree generated: {output_file}")

        return tree_content

    def generate_flat_structure(self) -> List[str]:
        """Generate flat file listing for analysis."""
        files = []

        for root, dirs, filenames in os.walk(self.root_path):
            # Filter out ignored directories
            dirs[:] = [d for d in dirs if not self.should_ignore(Path(root) / d)]

            for filename in filenames:
                file_path = Path(root) / filename
                if not self.should_ignore(file_path):
                    rel_path = file_path.relative_to(self.root_path)
                    files.append(str(rel_path))

        return sorted(files)


def main():
    """Generate repository tree."""
    repo_root = Path.cwd()

    print("🌳 Generating repository tree structure...")

    generator = TreeGenerator(repo_root, max_depth=3)

    # Generate tree for documentation
    tree_content = generator.generate_tree("docs/repo_tree.md")

    # Also generate flat listing for analysis
    files = generator.generate_flat_structure()

    print(f"📁 Repository contains {len(files)} files")
    print(f"📄 Tree saved to: docs/repo_tree.md")

    return 0


if __name__ == "__main__":
    sys.exit(main())