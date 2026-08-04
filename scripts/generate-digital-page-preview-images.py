#!/usr/bin/env python3
"""
Rasterize real PDF sample pages to PNG thumbs for DigitalSampleStrip.

Run:
  python3 scripts/generate-digital-page-preview-images.py

Or regenerate sample PDFs + PNGs together:
  python3 scripts/generate-digital-previews.py
"""

from __future__ import annotations

import zipfile
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / "private" / "digital-downloads"
PUBLIC = ROOT / "public" / "digital-products"
PAGE_COUNT = 3
TARGET_WIDTH = 540
# Render at 2x for sharp thumbs on retina displays.
RENDER_SCALE = 2
WATERMARK = "SAMPLE"
GIFT_CATALOGUE = "rage_voucher_pack/rage-room-gift-voucher-pack-catalogue.pdf"

# stem -> output page PNG basename pattern (page-1.png …)
PRODUCTS: list[tuple[str, Path | None]] = [
    ("rage-room-party-planner-pack", PRIVATE / "rage-room-party-planner-pack.pdf"),
    (
        "corporate-rage-room-team-building-toolkit",
        PRIVATE / "corporate-rage-room-team-building-toolkit.pdf",
    ),
    (
        "rage-room-first-visit-prep-pack",
        PRIVATE / "rage-room-first-visit-prep-pack.pdf",
    ),
    ("rage-room-gift-voucher-template-pack", None),  # gift catalogue from ZIP
]


def open_gift_catalogue() -> fitz.Document:
    zip_path = PRIVATE / "rage-room-gift-voucher-template-pack.zip"
    with zipfile.ZipFile(zip_path) as zf:
        data = zf.read(GIFT_CATALOGUE)
    return fitz.open(stream=data, filetype="pdf")


def _diagonal_watermark(page: fitz.Page, y_frac: float, fontsize: float) -> None:
    rect = page.rect
    font = fitz.Font("helv")
    text_len = font.text_length(WATERMARK, fontsize=fontsize)
    tw = fitz.TextWriter(rect, color=(0.78, 0.1, 0.1), opacity=0.28)
    tw.append(
        fitz.Point(-text_len / 2, fontsize * 0.35),
        WATERMARK,
        font=font,
        fontsize=fontsize,
    )
    pivot = fitz.Point(rect.width / 2, rect.height * y_frac)
    tw.write_text(page, morph=(pivot, fitz.Matrix(45)))


def light_stamp(page: fitz.Page) -> None:
    """Light SAMPLE marks so thumbs are clearly previews, not the paid file."""
    # Diagonals only — avoid covering the black header title on the right.
    for y_frac, size in ((0.40, 34), (0.55, 40), (0.70, 34)):
        _diagonal_watermark(page, y_frac, size)


def render_page_png(source: fitz.Document, page_index: int, out_path: Path) -> None:
    if page_index >= source.page_count:
        raise RuntimeError(
            f"{out_path.name}: source has only {source.page_count} pages"
        )

    # Copy one page so stamping does not mutate the paid source document.
    temp = fitz.open()
    temp.insert_pdf(source, from_page=page_index, to_page=page_index)
    page = temp[0]
    light_stamp(page)

    zoom = (TARGET_WIDTH * RENDER_SCALE) / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(out_path)
    temp.close()

    height = round(pix.height / RENDER_SCALE) if RENDER_SCALE else pix.height
    print(
        f"Wrote {out_path.relative_to(ROOT)} "
        f"(source page {page_index + 1}, {TARGET_WIDTH}x{height}@2x)"
    )


def render_product(stem: str, source: fitz.Document) -> None:
    take = min(PAGE_COUNT, source.page_count)
    if take < 1:
        raise RuntimeError(f"{stem}: source has no pages")

    for i in range(take):
        out_path = PUBLIC / f"{stem}-page-{i + 1}.png"
        render_page_png(source, i, out_path)


def main() -> None:
    docs: list[fitz.Document] = []
    try:
        for stem, pdf_path in PRODUCTS:
            if pdf_path is None:
                source = open_gift_catalogue()
            else:
                source = fitz.open(pdf_path)
            docs.append(source)
            render_product(stem, source)
    finally:
        for doc in docs:
            if not doc.is_closed:
                doc.close()


if __name__ == "__main__":
    main()
