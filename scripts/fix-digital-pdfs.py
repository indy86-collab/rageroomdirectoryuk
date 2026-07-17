#!/usr/bin/env python3
"""Fix known quality issues in paid digital-download PDFs.

Fixes:
1. Party Planner — remove seller-facing "Commercial tip" from page 2;
   replace with a customer-facing planning tip.
2. Corporate Toolkit — rebuild cover with a single text/button layer
   (removes duplicated title/badge overlays and unused cover image).
3. Corporate Toolkit — clean duplicate Q7–Q12 text/cards on the safety page.

Safe to re-run: restores from backup if present, then re-applies fixes.
"""

from __future__ import annotations

import shutil
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / "private" / "digital-downloads"
BACKUP = PRIVATE / ".backup-before-pdf-fix"

PARTY = PRIVATE / "rage-room-party-planner-pack.pdf"
CORP = PRIVATE / "corporate-rage-room-team-building-toolkit.pdf"

ORANGE = (0.941176, 0.352941, 0.156863)
ORANGE_SOFT = (0.956863, 0.772549, 0.258824)
NAVY = (0.12, 0.16, 0.22)
WHITE = (1, 1, 1)
NEAR_BLACK = (0.07, 0.08, 0.1)
MUTED = (0.36, 0.38, 0.42)
CARD_STROKE = (0.843, 0.863, 0.886)
LIGHT_TEXT = (0.92, 0.92, 0.94)


def backup(path: Path) -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    dest = BACKUP / path.name
    if not dest.exists():
        shutil.copy2(path, dest)
        print(f"Backed up {path.name} -> {dest.relative_to(ROOT)}")
    else:
        print(f"Backup already exists for {path.name}")


def restore_from_backup(path: Path) -> None:
    src = BACKUP / path.name
    if src.exists():
        shutil.copy2(src, path)
        print(f"Restored {path.name} from backup before re-applying fixes")


def fix_party_planner(path: Path) -> None:
    doc = fitz.open(path)
    page = doc[1]

    tip_rect = fitz.Rect(42.0, 649.8897705078125, 553.2755737304688, 711.8897705078125)
    page.add_redact_annot(tip_rect, fill=WHITE)
    page.apply_redactions(
        images=fitz.PDF_REDACT_IMAGE_NONE,
        graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
    )

    page.draw_rect(tip_rect, color=(0.953, 0.702, 0.647), fill=(1.0, 0.969, 0.957), width=1)
    page.draw_rect(
        fitz.Rect(tip_rect.x0, tip_rect.y0, tip_rect.x0 + 6, tip_rect.y1),
        color=None,
        fill=ORANGE_SOFT,
        width=0,
    )
    page.insert_text(
        fitz.Point(56, 670),
        "Planning tip",
        fontsize=10,
        fontname="hebo",
        color=NEAR_BLACK,
    )
    page.insert_textbox(
        fitz.Rect(56, 677, 528, 706),
        "Share the What to Wear and Safety page with guests before the day. "
        "Clear footwear rules prevent last-minute delays at check-in.",
        fontsize=8.2,
        fontname="helv",
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )

    assert "Commercial tip" not in page.get_text()
    assert "Sell this as a practical kit" not in page.get_text()

    tmp = path.with_suffix(".fixed.pdf")
    doc.save(tmp, garbage=4, deflate=True, clean=True)
    doc.close()
    tmp.replace(path)
    print(f"Fixed party planner: removed seller tip on page 2 ({path.stat().st_size / 1e6:.1f} MB)")


def rebuild_corporate_cover(doc: fitz.Document) -> None:
    old = doc[0]
    photo_bytes = None
    best_score = -1
    for img in old.get_images(full=True):
        meta = doc.extract_image(img[0])
        score = meta["width"] * meta["height"] + (10_000_000 if meta["ext"] == "png" else 0)
        if score > best_score:
            best_score = score
            photo_bytes = meta["image"]

    if not photo_bytes:
        raise RuntimeError("Could not extract corporate cover photo")

    rect = old.rect
    page = doc.new_page(width=rect.width, height=rect.height, pno=0)
    page.draw_rect(rect, color=None, fill=(0.05, 0.06, 0.08), width=0)
    page.insert_image(rect, stream=photo_bytes)

    shape = page.new_shape()
    shape.draw_rect(fitz.Rect(0, 140, 400, 640))
    shape.finish(color=None, fill=(0.07, 0.08, 0.10), fill_opacity=0.72)
    shape.commit()

    y = 270
    page.insert_text(
        fitz.Point(56, y),
        "RAGE ROOM TEAM EXPERIENCE",
        fontsize=16,
        fontname="hebo",
        color=ORANGE,
    )
    page.insert_text(
        fitz.Point(56, y + 48),
        "CORPORATE",
        fontsize=38,
        fontname="hebo",
        color=WHITE,
    )
    page.insert_text(
        fitz.Point(56, y + 94),
        "RAGE ROOM",
        fontsize=38,
        fontname="hebo",
        color=ORANGE,
    )
    page.insert_text(
        fitz.Point(56, y + 138),
        "TEAM-BUILDING TOOLKIT",
        fontsize=24,
        fontname="hebo",
        color=WHITE,
    )
    page.insert_text(
        fitz.Point(56, y + 180),
        "A professional planning pack for HR teams, office managers, founders and team leads.",
        fontsize=11.5,
        fontname="helv",
        color=LIGHT_TEXT,
    )
    page.insert_text(
        fitz.Point(56, y + 198),
        "Plan the event, secure approval, manage safety questions and capture feedback.",
        fontsize=11.5,
        fontname="helv",
        color=LIGHT_TEXT,
    )

    badges = [
        (fitz.Rect(56, 582, 191, 612), "HR READY"),
        (fitz.Rect(213, 582, 348, 612), "BUDGET APPROVAL"),
        (fitz.Rect(370, 582, 505, 612), "SAFETY CHECKLISTS"),
    ]
    for badge_rect, label in badges:
        page.draw_rect(badge_rect, color=None, fill=NAVY, width=0)
        text_w = fitz.get_text_length(label, fontname="hebo", fontsize=8.5)
        page.insert_text(
            fitz.Point(badge_rect.x0 + (badge_rect.width - text_w) / 2, badge_rect.y0 + 20),
            label,
            fontsize=8.5,
            fontname="hebo",
            color=WHITE,
        )

    page.insert_text(
        fitz.Point(56, 790),
        "Entertainment planning aid only. Follow venue rules, HR policy, waivers and staff instructions.",
        fontsize=8,
        fontname="helv",
        color=(0.85, 0.85, 0.88),
    )

    doc.delete_page(1)
    print("Rebuilt corporate cover with a single text/button layer")


def fix_corporate_safety_page(doc: fitz.Document) -> None:
    page = doc[9]
    questions = [
        (7, "What is the maximum group size per room and\nper session?"),
        (8, "How are larger groups rotated safely?"),
        (9, "Are photos and videos allowed inside the room?"),
        (10, "What cancellation, rescheduling and refund\nterms apply?"),
        (11, "Do you hold public liability insurance?"),
        (12, "Can you support accessibility needs or\nreasonable adjustments?"),
    ]

    wipe = fitz.Rect(300, 175, 570, 510)
    page.add_redact_annot(wipe, fill=WHITE)
    page.apply_redactions(
        images=fitz.PDF_REDACT_IMAGE_NONE,
        graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
    )

    card_h = 40
    gap = 14
    y0 = 187.9
    for i, (num, text) in enumerate(questions):
        top = y0 + i * (card_h + gap)
        card = fitz.Rect(315, top, 550, top + card_h)
        page.draw_rect(card, color=CARD_STROKE, fill=WHITE, width=0.8)
        page.insert_text(
            fitz.Point(325, top + 16),
            f"Q{num}",
            fontsize=8,
            fontname="hebo",
            color=ORANGE,
        )
        page.insert_textbox(
            fitz.Rect(351, top + 8, 540, top + card_h - 6),
            text,
            fontsize=8.7,
            fontname="helv",
            color=NEAR_BLACK,
            align=fitz.TEXT_ALIGN_LEFT,
        )

    text = page.get_text()
    for num, _ in questions:
        assert text.count(f"Q{num}") == 1, f"Expected one Q{num}, got {text.count(f'Q{num}')}"
    assert text.count("How are larger groups rotated safely?") == 1
    print("Cleaned corporate safety page Q7–Q12 duplicates")


def fix_corporate_toolkit(path: Path) -> None:
    doc = fitz.open(path)
    rebuild_corporate_cover(doc)
    fix_corporate_safety_page(doc)

    cover_text = doc[0].get_text()
    assert cover_text.count("CORPORATE") == 1
    assert cover_text.count("TEAM-BUILDING TOOLKIT") == 1
    assert cover_text.count("HR READY") == 1
    assert "professional planning pack" in cover_text

    tmp = path.with_suffix(".fixed.pdf")
    doc.save(tmp, garbage=4, deflate=True, clean=True)
    doc.close()
    tmp.replace(path)
    print(f"Fixed corporate toolkit ({path.stat().st_size / 1e6:.1f} MB)")


def main() -> None:
    for path in (PARTY, CORP):
        if not path.exists():
            raise SystemExit(f"Missing {path}")
        backup(path)
        restore_from_backup(path)

    fix_party_planner(PARTY)
    fix_corporate_toolkit(CORP)
    print("Done.")


if __name__ == "__main__":
    main()
