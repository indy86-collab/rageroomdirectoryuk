#!/usr/bin/env python3
"""Generate the free Rage Room First-Timer Checklist PDF (A4, mobile-friendly print)."""

from __future__ import annotations

from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "private" / "digital-downloads" / "rage-room-first-timer-checklist.pdf"

W, H = 595.2755737304688, 841.8897705078125
MARGIN = 40.0

ORANGE = (0.941176, 0.352941, 0.156863)
BLACK = (0.066667, 0.066667, 0.066667)
NEAR_BLACK = (0.08, 0.08, 0.09)
MUTED = (0.36, 0.38, 0.42)
WHITE = (1, 1, 1)
LINE = (0.84, 0.85, 0.87)
SOFT = (0.98, 0.98, 0.985)
CALLOUT_BG = (1.0, 0.968627, 0.956863)

FONT = "helv"
FONT_B = "hebo"
TOTAL_PAGES = 3
FOOTER = "RageRoom Directory · Free first-timer checklist · Confirm venue-specific rules"


def add_page(doc: fitz.Document) -> fitz.Page:
    return doc.new_page(width=W, height=H)


def draw_hazard(page: fitz.Page, y0: float = 36.0, y1: float = 48.0) -> None:
    page.draw_rect(fitz.Rect(0, y0, W, y1), color=None, fill=BLACK, width=0)
    band_h = y1 - y0
    step = 16.0
    x = -band_h
    while x < W + band_h:
        shape = page.new_shape()
        shape.draw_quad(
            fitz.Quad(
                fitz.Point(x, y0),
                fitz.Point(x + 8, y0),
                fitz.Point(x + 8 + band_h, y1),
                fitz.Point(x + band_h, y1),
            )
        )
        shape.finish(color=None, fill=ORANGE, width=0)
        shape.commit()
        x += step


def header(page: fitz.Page, section: str) -> None:
    page.draw_rect(fitz.Rect(0, 0, W, 48), color=None, fill=BLACK, width=0)
    page.insert_text(
        fitz.Point(MARGIN, 24),
        "RAGE ROOM FIRST-TIMER CHECKLIST",
        fontsize=9.5,
        fontname=FONT_B,
        color=WHITE,
    )
    tw = fitz.get_text_length(section, fontname=FONT, fontsize=8.5)
    page.insert_text(
        fitz.Point(W - MARGIN - tw, 24),
        section,
        fontsize=8.5,
        fontname=FONT,
        color=(0.72, 0.74, 0.78),
    )
    draw_hazard(page)


def footer(page: fitz.Page, page_no: int) -> None:
    page.draw_line(
        fitz.Point(MARGIN, H - 34),
        fitz.Point(W - MARGIN, H - 34),
        color=LINE,
        width=0.6,
    )
    page.insert_text(
        fitz.Point(MARGIN, H - 18),
        FOOTER,
        fontsize=7.5,
        fontname=FONT,
        color=MUTED,
    )
    label = f"Page {page_no} of {TOTAL_PAGES}"
    tw = fitz.get_text_length(label, fontname=FONT, fontsize=7.5)
    page.insert_text(
        fitz.Point(W - MARGIN - tw, H - 18),
        label,
        fontsize=7.5,
        fontname=FONT,
        color=MUTED,
    )


def section_heading(page: fitz.Page, title: str, y: float) -> float:
    page.draw_rect(
        fitz.Rect(MARGIN, y, MARGIN + 4, y + 18),
        color=None,
        fill=ORANGE,
        width=0,
    )
    page.insert_text(
        fitz.Point(MARGIN + 12, y + 14),
        title.upper(),
        fontsize=12,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    return y + 28


def note(page: fitz.Page, text: str, y: float) -> float:
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 28),
        text,
        fontsize=8.5,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    return y + 30


def checkbox_items(
    page: fitz.Page,
    items: list[str],
    y: float,
    *,
    col_gap: float | None = None,
) -> float:
    if col_gap:
        mid = MARGIN + col_gap
        left = items[::2]
        right = items[1::2]
        y0 = y
        for item in left:
            page.insert_text(
                fitz.Point(MARGIN, y),
                f"[ ]  {item}",
                fontsize=9,
                fontname=FONT,
                color=NEAR_BLACK,
            )
            y += 18
        y = y0
        for item in right:
            page.insert_text(
                fitz.Point(mid, y),
                f"[ ]  {item}",
                fontsize=9,
                fontname=FONT,
                color=NEAR_BLACK,
            )
            y += 18
        return y0 + 18 * max(len(left), len(right))

    for item in items:
        used = page.insert_textbox(
            fitz.Rect(MARGIN, y - 10, W - MARGIN, y + 24),
            f"[ ]  {item}",
            fontsize=9,
            fontname=FONT,
            color=NEAR_BLACK,
            align=fitz.TEXT_ALIGN_LEFT,
        )
        y += 18 if used >= 0 else 28
    return y


def numbered_flow(page: fitz.Page, steps: list[str], y: float) -> float:
    box_w = (W - 2 * MARGIN - 16) / 5
    for i, step in enumerate(steps):
        x0 = MARGIN + i * (box_w + 4)
        rect = fitz.Rect(x0, y, x0 + box_w, y + 54)
        page.draw_rect(rect, color=LINE, fill=SOFT, width=0.8)
        page.insert_text(
            fitz.Point(x0 + 8, y + 16),
            str(i + 1),
            fontsize=11,
            fontname=FONT_B,
            color=ORANGE,
        )
        page.insert_textbox(
            fitz.Rect(x0 + 8, y + 22, x0 + box_w - 8, y + 50),
            step,
            fontsize=8,
            fontname=FONT_B,
            color=NEAR_BLACK,
            align=fitz.TEXT_ALIGN_LEFT,
        )
    return y + 66


def page_one(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "FREE TOOL")
    y = 68
    page.insert_text(
        fitz.Point(MARGIN, y),
        "FREE Rage Room First-Timer Checklist",
        fontsize=18,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    y += 22
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 36),
        "Everything you need before your first smash session — in one quick checklist. "
        "Know what to wear, what to bring, what to check with the venue and what to expect.",
        fontsize=10,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    y += 42
    callout = fitz.Rect(MARGIN, y, W - MARGIN, y + 42)
    page.draw_rect(callout, color=ORANGE, fill=CALLOUT_BG, width=1)
    page.insert_textbox(
        fitz.Rect(callout.x0 + 12, callout.y0 + 10, callout.x1 - 12, callout.y1 - 8),
        "Free. Takes about 2 minutes to read. Keep this open on your phone before you visit. "
        "Always verify venue-specific rules — processes differ.",
        fontsize=8.5,
        fontname=FONT,
        color=NEAR_BLACK,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    y = callout.y1 + 18

    y = section_heading(page, "1. Before you book", y)
    y = note(page, "Confirm these with the venue before you pay a deposit.", y)
    y = checkbox_items(
        page,
        [
            "Minimum age (and any under-18 / guardian rules)",
            "Session duration and on-site time to allow",
            "What’s included (PPE, breakables, briefing)",
            "Whether breakables are provided",
            "Group size limits for your booking",
            "Accessibility requirements",
            "Cancellation / rescheduling policy",
        ],
        y,
    )
    y += 10
    y = section_heading(page, "2. What to wear", y)
    y = note(
        page,
        "Comfortable clothes for physical activity. PPE and dress codes vary by venue.",
        y,
    )
    y = checkbox_items(
        page,
        [
            "Closed-toe footwear (usually required)",
            "Comfortable clothing you can move in",
            "Expect venue PPE (overalls, gloves, eye protection)",
            "Avoid open-toe shoes, loose jewellery, unsuitable clothes",
            "Ask the venue about any clothing rules before you go",
        ],
        y,
    )
    footer(page, 1)


def page_two(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "DAY OF")
    y = 68
    y = section_heading(page, "3. Before you leave home", y)
    y = checkbox_items(
        page,
        [
            "Booking confirmation (email, reference, or ticket)",
            "Photo ID if the venue requires it",
            "Travel plan + parking / public transport details",
            "Arrival time (many venues want you early for briefing)",
            "Venue contact number saved on your phone",
        ],
        y,
    )
    y += 14
    y = section_heading(page, "4. What to expect", y)
    y = note(
        page,
        "A typical first-timer journey. Individual venue processes differ.",
        y,
    )
    y = numbered_flow(
        page,
        ["Arrival", "Check-in", "Safety briefing / PPE", "Smash session", "Finish / debrief"],
        y,
    )
    y += 8
    page.draw_rect(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 48),
        color=LINE,
        fill=SOFT,
        width=0.8,
    )
    page.insert_textbox(
        fitz.Rect(MARGIN + 12, y + 10, W - MARGIN - 12, y + 42),
        "Tip: Arrive a little early, listen to the briefing, and ask staff if anything is unclear. "
        "This checklist is a planning aid — not medical or safety advice.",
        fontsize=8.5,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    y += 64
    y = section_heading(page, "5. Quick questions to ask your venue", y)
    y = note(page, "Useful prompts if you’re booking or confirming details.", y)
    y = checkbox_items(
        page,
        [
            "What is the minimum age and do under-18s need a guardian?",
            "How long is the session, and when should we arrive?",
            "Is PPE included, and what should we wear underneath?",
            "Are breakables included, and can we bring anything?",
            "How many people can smash at once in our room?",
            "What is your cancellation or reschedule policy?",
            "Is there parking or a recommended station / bus stop?",
            "Do you need ID, a waiver, or anything completed in advance?",
        ],
        y,
    )
    footer(page, 2)


def page_three(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "QUICK REF")
    y = 68
    page.insert_text(
        fitz.Point(MARGIN, y),
        "Phone-friendly quick reference",
        fontsize=16,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    y += 24
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 30),
        "Screenshot or print this page. Tick as you go on the day of your visit.",
        fontsize=9.5,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    y += 36

    blocks = [
        (
            "Kit check",
            [
                "Closed-toe shoes",
                "Comfy clothes",
                "Booking confirmation",
                "ID (if required)",
                "Venue contact saved",
            ],
        ),
        (
            "Arrival check",
            [
                "On time / early",
                "Waiver ready",
                "Jewellery off",
                "Listen to briefing",
                "Ask if unsure",
            ],
        ),
    ]
    col_w = (W - 2 * MARGIN - 16) / 2
    for i, (title, items) in enumerate(blocks):
        x0 = MARGIN + i * (col_w + 16)
        page.draw_rect(
            fitz.Rect(x0, y, x0 + col_w, y + 160),
            color=LINE,
            fill=SOFT,
            width=0.8,
        )
        page.insert_text(
            fitz.Point(x0 + 12, y + 22),
            title.upper(),
            fontsize=11,
            fontname=FONT_B,
            color=ORANGE,
        )
        iy = y + 44
        for item in items:
            page.insert_text(
                fitz.Point(x0 + 12, iy),
                f"[ ]  {item}",
                fontsize=10,
                fontname=FONT,
                color=NEAR_BLACK,
            )
            iy += 22

    y += 180
    page.draw_rect(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 90),
        color=ORANGE,
        fill=CALLOUT_BG,
        width=1.2,
    )
    page.insert_text(
        fitz.Point(MARGIN + 14, y + 24),
        "Find a rage room",
        fontsize=12,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    page.insert_textbox(
        fitz.Rect(MARGIN + 14, y + 34, W - MARGIN - 14, y + 80),
        "Browse UK venues, compare locations and plan your first session at "
        "www.rageroomdirectory.co.uk — free directory, no booking fee from us.",
        fontsize=9.5,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )
    footer(page, 3)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = fitz.open()
    page_one(doc)
    page_two(doc)
    page_three(doc)
    doc.save(OUT, garbage=4, deflate=True)
    doc.close()
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
