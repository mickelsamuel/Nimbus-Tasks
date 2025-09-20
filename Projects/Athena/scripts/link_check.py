#!/usr/bin/env python3
"""
Link Checker for Documentation
Validates all links in README and documentation files.
"""

import re
import sys
import urllib.request
import urllib.parse
from pathlib import Path
from typing import Dict, List, Tuple
from urllib.error import URLError, HTTPError


class LinkChecker:
    """Checks links in markdown files."""

    def __init__(self, root_path: Path):
        self.root_path = root_path
        self.results = {
            "valid": [],
            "invalid": [],
            "local_missing": [],
            "external_errors": []
        }

    def check_all_docs(self) -> Dict:
        """Check all documentation files."""
        print("🔗 Checking documentation links...")

        # Find all markdown files
        md_files = list(self.root_path.glob("*.md"))
        md_files.extend(list(self.root_path.glob("docs/**/*.md")))

        for md_file in md_files:
            print(f"  📄 Checking {md_file.relative_to(self.root_path)}")
            self.check_file(md_file)

        return self.results

    def check_file(self, file_path: Path):
        """Check all links in a single file."""
        try:
            content = file_path.read_text(encoding='utf-8')
        except Exception as e:
            print(f"    ❌ Could not read file: {e}")
            return

        # Find all markdown links
        links = re.findall(r'\[([^\]]*)\]\(([^)]+)\)', content)

        for link_text, link_url in links:
            self.check_link(link_url, file_path, link_text)

    def check_link(self, url: str, source_file: Path, link_text: str):
        """Check a single link."""
        # Skip anchors and mail links
        if url.startswith(('#', 'mailto:')):
            return

        source_rel = source_file.relative_to(self.root_path)

        if url.startswith(('http://', 'https://')):
            # External link
            self.check_external_link(url, source_rel, link_text)
        else:
            # Local link
            self.check_local_link(url, source_file, source_rel, link_text)

    def check_local_link(self, url: str, source_file: Path, source_rel: Path, link_text: str):
        """Check local file link."""
        # Handle relative paths
        if url.startswith('./'):
            url = url[2:]

        # Resolve relative to source file
        target_path = (source_file.parent / url).resolve()

        # Check if it's within the repository
        try:
            rel_target = target_path.relative_to(self.root_path)
        except ValueError:
            # Outside repository
            self.results["invalid"].append({
                "type": "local_outside_repo",
                "url": url,
                "source": str(source_rel),
                "text": link_text,
                "resolved": str(target_path)
            })
            return

        if target_path.exists():
            self.results["valid"].append({
                "type": "local",
                "url": url,
                "source": str(source_rel),
                "text": link_text
            })
        else:
            self.results["local_missing"].append({
                "type": "local_missing",
                "url": url,
                "source": str(source_rel),
                "text": link_text,
                "resolved": str(target_path)
            })

    def check_external_link(self, url: str, source_rel: Path, link_text: str):
        """Check external HTTP link."""
        try:
            # Create request with proper headers
            req = urllib.request.Request(
                url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
                }
            )

            with urllib.request.urlopen(req, timeout=10) as response:
                if response.getcode() == 200:
                    self.results["valid"].append({
                        "type": "external",
                        "url": url,
                        "source": str(source_rel),
                        "text": link_text,
                        "status": response.getcode()
                    })
                else:
                    self.results["external_errors"].append({
                        "type": "external_error",
                        "url": url,
                        "source": str(source_rel),
                        "text": link_text,
                        "error": f"HTTP {response.getcode()}"
                    })

        except (URLError, HTTPError, TimeoutError) as e:
            self.results["external_errors"].append({
                "type": "external_error",
                "url": url,
                "source": str(source_rel),
                "text": link_text,
                "error": str(e)
            })

    def generate_report(self, output_file: str = None) -> str:
        """Generate link check report."""
        total_links = sum(len(v) for v in self.results.values())
        valid_links = len(self.results["valid"])
        invalid_links = total_links - valid_links

        report_lines = [
            "# Link Check Report\n",
            f"**Total links checked**: {total_links}",
            f"**Valid links**: {valid_links}",
            f"**Invalid links**: {invalid_links}",
            f"**Success rate**: {(valid_links/total_links*100):.1f}%" if total_links > 0 else "**Success rate**: 0%",
            ""
        ]

        # Missing local files
        if self.results["local_missing"]:
            report_lines.extend([
                "## ❌ Missing Local Files",
                ""
            ])
            for item in self.results["local_missing"]:
                report_lines.append(f"- `{item['url']}` in {item['source']} → `{item['resolved']}`")
            report_lines.append("")

        # External link errors
        if self.results["external_errors"]:
            report_lines.extend([
                "## 🌐 External Link Errors",
                ""
            ])
            for item in self.results["external_errors"]:
                report_lines.append(f"- `{item['url']}` in {item['source']} → {item['error']}")
            report_lines.append("")

        # Invalid links
        if self.results["invalid"]:
            report_lines.extend([
                "## ⚠️ Invalid Links",
                ""
            ])
            for item in self.results["invalid"]:
                report_lines.append(f"- `{item['url']}` in {item['source']} → {item.get('resolved', 'N/A')}")
            report_lines.append("")

        # Valid links summary
        if self.results["valid"]:
            report_lines.extend([
                f"## ✅ Valid Links ({len(self.results['valid'])})",
                ""
            ])

            # Group by source file
            by_source = {}
            for item in self.results["valid"]:
                source = item["source"]
                if source not in by_source:
                    by_source[source] = []
                by_source[source].append(item)

            for source, links in sorted(by_source.items()):
                report_lines.append(f"### {source} ({len(links)} links)")
                for link in links[:5]:  # Show first 5
                    report_lines.append(f"- ✅ `{link['url']}`")
                if len(links) > 5:
                    report_lines.append(f"- ... and {len(links) - 5} more")
                report_lines.append("")

        report_content = "\n".join(report_lines)

        if output_file:
            output_path = Path(output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(report_content)
            print(f"📋 Link report saved to: {output_file}")

        return report_content


def main():
    """Run link checker."""
    repo_root = Path.cwd()

    checker = LinkChecker(repo_root)
    results = checker.check_all_docs()

    # Generate report
    report = checker.generate_report("docs/link_check_report.md")

    # Print summary
    total = sum(len(v) for v in results.values())
    valid = len(results["valid"])
    print(f"\n📊 Link Check Summary:")
    print(f"   Total: {total}")
    print(f"   Valid: {valid}")
    print(f"   Invalid: {total - valid}")

    return 0 if total == valid else 1


if __name__ == "__main__":
    sys.exit(main())