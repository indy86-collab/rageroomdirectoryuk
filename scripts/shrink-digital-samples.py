#!/usr/bin/env python3
"""Regenerate 2-page watermarked sample PDFs from full digital packs."""

from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]

JOBS = [
    (
        ROOT / "private/digital-downloads/rage-room-first-visit-prep-pack.pdf",
        ROOT / "public/digital-products/rage-room-first-visit-prep-pack-sample.pdf",
        2,
    ),
    (
        ROOT / "private/digital-downloads/rage-room-party-planner-pack.pdf",
        ROOT / "public/digital-products/rage-room-party-planner-pack-sample.pdf",
        2,
    ),
    (
        ROOT
        / "private/digital-downloads/corporate-rage-room-team-building-toolkit.pdf",
        ROOT
        / "public/digital-products/corporate-rage-room-team-building-toolkit-sample.pdf",
        2,
    ),
]


def make_watermark(width: float, height: float) -> PdfReader:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    c.setFillColor(Color(0.85, 0.25, 0.1, alpha=0.18))
    c.saveState()
    c.translate(width / 2, height / 2)
    c.rotate(35)
    c.setFont("Helvetica-Bold", min(width, height) * 0.12)
    c.drawCentredString(0, 0, "SAMPLE PREVIEW")
    c.restoreState()
    c.setFillColor(Color(0.1, 0.1, 0.1, alpha=0.75))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(24, 28, "Sample only — full pack unlocks after purchase")
    c.save()
    buf.seek(0)
    return PdfReader(buf)


def shrink(src: Path, dest: Path, max_pages: int) -> None:
    reader = PdfReader(str(src))
    writer = PdfWriter()
    for i in range(min(max_pages, len(reader.pages))):
        page = reader.pages[i]
        box = page.mediabox
        stamp = make_watermark(float(box.width), float(box.height)).pages[0]
        page.merge_page(stamp)
        writer.add_page(page)
    tmp = dest.with_suffix(".tmp.pdf")
    with open(tmp, "wb") as f:
        writer.write(f)
    tmp.replace(dest)
    size_mb = dest.stat().st_size / (1024 * 1024)
    print(f"{dest.name}: {min(max_pages, len(reader.pages))} pages, {size_mb:.2f} MB")


def main() -> None:
    for src, dest, max_pages in JOBS:
        shrink(src, dest, max_pages)


if __name__ == "__main__":
    main()
