#!/usr/bin/env python3
"""
Generate watermarked 3-page sample PDFs from the paid digital downloads.

Run:
  python3 scripts/generate-preview-pdfs.py

Or regenerate sample PDFs + matching page PNGs together:
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
WATERMARK = "SAMPLE / PREVIEW ONLY"
FOOTER = "Sample preview - purchase for the full download."
GIFT_CATALOGUE = "rage_voucher_pack/rage-room-gift-voucher-pack-catalogue.pdf"


def _diagonal_watermark(page: fitz.Page, y_frac: float, fontsize: float) -> None:
    """Draw diagonal watermark via TextWriter morph (Page.insert_text only allows 90-deg steps)."""
    rect = page.rect
    font = fitz.Font("helv")
    text_len = font.text_length(WATERMARK, fontsize=fontsize)
    tw = fitz.TextWriter(rect, color=(0.78, 0.1, 0.1), opacity=0.42)
    tw.append(fitz.Point(-text_len / 2, fontsize * 0.35), WATERMARK, font=font, fontsize=fontsize)
    pivot = fitz.Point(rect.width / 2, rect.height * y_frac)
    tw.write_text(page, morph=(pivot, fitz.Matrix(45)))


def stamp_page(page: fitz.Page) -> None:
    rect = page.rect

    # Strong horizontal banners (always readable / extractable).
    # Avoid fill_opacity on insert_textbox — it can fail to fit on image-heavy pages.
    for y0 in (rect.height * 0.16, rect.height * 0.80):
        rc = page.insert_textbox(
            fitz.Rect(24, y0, rect.width - 24, y0 + 40),
            WATERMARK,
            fontsize=20,
            fontname="helv",
            color=(0.82, 0.12, 0.12),
            align=fitz.TEXT_ALIGN_CENTER,
            overlay=True,
        )
        if rc < 0:
            page.insert_text(
                fitz.Point(48, y0 + 28),
                WATERMARK,
                fontsize=20,
                fontname="helv",
                color=(0.82, 0.12, 0.12),
                overlay=True,
            )

    # Diagonal repeats across the middle
    for y_frac, size in ((0.38, 40), (0.52, 52), (0.66, 40)):
        _diagonal_watermark(page, y_frac, size)

    footer_rect = fitz.Rect(36, rect.height - 40, rect.width - 36, rect.height - 12)
    page.insert_textbox(
        footer_rect,
        FOOTER,
        fontsize=9,
        fontname="helv",
        color=(0.15, 0.15, 0.15),
        align=fitz.TEXT_ALIGN_CENTER,
        overlay=True,
    )


def watermark_pages(source: fitz.Document, out_path: Path, pages: int = PAGE_COUNT) -> None:
    take = min(pages, source.page_count)
    if take < 1:
        raise RuntimeError(f"Source has no pages for {out_path.name}")

    preview = fitz.open()
    preview.insert_pdf(source, from_page=0, to_page=take - 1)

    for page in preview:
        stamp_page(page)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(out_path, garbage=4, deflate=True)
    preview.close()
    print(f"Wrote {out_path.relative_to(ROOT)} ({take} pages)")


def open_gift_catalogue() -> fitz.Document:
    zip_path = PRIVATE / "rage-room-gift-voucher-template-pack.zip"
    with zipfile.ZipFile(zip_path) as zf:
        data = zf.read(GIFT_CATALOGUE)
    return fitz.open(stream=data, filetype="pdf")


def main() -> None:
    sources: list[tuple[fitz.Document, Path]] = [
        (
            fitz.open(PRIVATE / "rage-room-party-planner-pack.pdf"),
            PUBLIC / "rage-room-party-planner-pack-sample.pdf",
        ),
        (
            fitz.open(PRIVATE / "corporate-rage-room-team-building-toolkit.pdf"),
            PUBLIC / "corporate-rage-room-team-building-toolkit-sample.pdf",
        ),
        (
            fitz.open(PRIVATE / "rage-room-first-visit-prep-pack.pdf"),
            PUBLIC / "rage-room-first-visit-prep-pack-sample.pdf",
        ),
        (
            open_gift_catalogue(),
            PUBLIC / "rage-room-gift-voucher-template-pack-sample.pdf",
        ),
    ]

    try:
        for source, out_path in sources:
            watermark_pages(source, out_path)
    finally:
        for source, _ in sources:
            if not source.is_closed:
                source.close()


if __name__ == "__main__":
    main()
