#!/usr/bin/env python3
"""
Regenerate all public digital-product previews from the paid downloads:

1. Watermarked 3-page sample PDFs
2. Matching page PNG thumbs (real PDF screenshots)

Run:
  python3 scripts/generate-digital-previews.py
"""

from __future__ import annotations

import runpy
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent


def main() -> None:
    print("=== Sample PDFs ===")
    runpy.run_path(str(SCRIPTS / "generate-preview-pdfs.py"), run_name="__main__")
    print("=== Page preview PNGs ===")
    runpy.run_path(
        str(SCRIPTS / "generate-digital-page-preview-images.py"), run_name="__main__"
    )
    print("Done.")


if __name__ == "__main__":
    main()
