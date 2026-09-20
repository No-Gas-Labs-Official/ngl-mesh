#!/usr/bin/env python3
"""Create a deterministic, reviewable proof package for a bounded work product."""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_package(source_dir: Path, output_dir: Path, job: str, criteria: list[str]) -> Path:
    files = sorted(p for p in source_dir.rglob("*") if p.is_file())
    evidence = [
        {"path": str(p.relative_to(source_dir)), "sha256": sha256(p), "bytes": p.stat().st_size}
        for p in files
    ]
    package = {
        "schema": "ngl.proof-package.v1",
        "job": job,
        "acceptance_criteria": criteria,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "evidence": evidence,
        "checks": [
            {"name": "source_inventory", "status": "passed", "detail": f"{len(files)} file(s) hashed"},
            {"name": "human_acceptance", "status": "pending", "detail": "Awaiting reviewer decision"},
        ],
        "authority": {"model_proposals_authorize": False, "connector_responses_authorize": False},
        "acceptance": {"status": "pending", "reviewer": None, "notes": None},
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    target = output_dir / "proof-package.json"
    target.write_text(json.dumps(package, indent=2) + "\n", encoding="utf-8")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an NGL proof package from a bounded evidence folder")
    parser.add_argument("source", type=Path, help="folder containing source evidence")
    parser.add_argument("--out", type=Path, default=Path("proof-package"))
    parser.add_argument("--job", required=True)
    parser.add_argument("--criterion", action="append", default=[])
    args = parser.parse_args()
    target = build_package(args.source, args.out, args.job, args.criterion)
    print(f"created {target}")


if __name__ == "__main__":
    main()
