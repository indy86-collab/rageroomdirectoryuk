#!/usr/bin/env python3
"""Generate the Rage Room First Visit Prep Pack PDF (A4, brand-matched)."""

from __future__ import annotations

from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "private" / "digital-downloads" / "assets" / "first-visit"
OUT = ROOT / "private" / "digital-downloads" / "rage-room-first-visit-prep-pack.pdf"

# A4
W, H = 595.2755737304688, 841.8897705078125
MARGIN = 42.0

ORANGE = (0.941176, 0.352941, 0.156863)
ORANGE_SOFT = (0.956863, 0.772549, 0.258824)
BLACK = (0.066667, 0.066667, 0.066667)
NEAR_BLACK = (0.068, 0.068, 0.068)
MUTED = (0.36, 0.38, 0.42)
WHITE = (1, 1, 1)
CALLOUT_BG = (1.0, 0.968627, 0.956863)
CALLOUT_EDGE = (0.952941, 0.701961, 0.647059)
LINE = (0.84, 0.85, 0.87)
TABLE_HEAD = (0.12, 0.14, 0.18)
NAVY = (0.12, 0.16, 0.22)
FOOTER = "Printable prep toolkit - follow venue rules and safety instructions"
PACK = "RAGE ROOM FIRST VISIT PREP PACK"
TOTAL_PAGES = 12

FONT = "helv"
FONT_B = "hebo"


def rgb_int(color: tuple[float, float, float]) -> int:
    r, g, b = [int(c * 255) for c in color]
    return (r << 16) + (g << 8) + b


def new_doc() -> fitz.Document:
    return fitz.open()


def add_page(doc: fitz.Document) -> fitz.Page:
    return doc.new_page(width=W, height=H)


def draw_hazard_stripe(page: fitz.Page, y0: float = 38.0, y1: float = 52.0) -> None:
    """Diagonal black/orange hazard band under the header (matches party pack)."""
    page.draw_rect(fitz.Rect(0, y0, W, y1), color=None, fill=BLACK, width=0)
    band_h = y1 - y0
    # Classic caution tape: repeating diagonal orange bars
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
    page.draw_rect(fitz.Rect(0, 0, W, 52), color=None, fill=BLACK, width=0)
    page.insert_text(fitz.Point(MARGIN, 28), PACK, fontsize=9.5, fontname=FONT_B, color=WHITE)
    tw = fitz.get_text_length(section, fontname=FONT, fontsize=8.5)
    page.insert_text(
        fitz.Point(W - MARGIN - tw, 28),
        section,
        fontsize=8.5,
        fontname=FONT,
        color=(0.72, 0.74, 0.78),
    )
    draw_hazard_stripe(page)


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


def section_title(page: fitz.Page, num: str, title: str, subtitle: str, y: float = 72) -> float:
    badge = fitz.Rect(MARGIN, y, MARGIN + 36, y + 26)
    page.draw_rect(badge, color=None, fill=ORANGE, width=0)
    tw = fitz.get_text_length(num, fontname=FONT_B, fontsize=11)
    page.insert_text(
        fitz.Point(badge.x0 + (badge.width - tw) / 2, y + 18),
        num,
        fontsize=11,
        fontname=FONT_B,
        color=WHITE,
    )
    page.insert_text(
        fitz.Point(MARGIN + 48, y + 20),
        title,
        fontsize=20,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    page.insert_text(
        fitz.Point(MARGIN, y + 42),
        subtitle,
        fontsize=8.5,
        fontname=FONT,
        color=MUTED,
    )
    return y + 62


def callout(
    page: fitz.Page,
    rect: fitz.Rect,
    title: str,
    body: str,
    accent: tuple[float, float, float] = ORANGE,
) -> None:
    page.draw_rect(rect, color=CALLOUT_EDGE, fill=CALLOUT_BG, width=1)
    page.draw_rect(
        fitz.Rect(rect.x0, rect.y0, rect.x0 + 6, rect.y1),
        color=None,
        fill=accent,
        width=0,
    )
    page.insert_text(
        fitz.Point(rect.x0 + 14, rect.y0 + 16),
        title,
        fontsize=10,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    page.insert_textbox(
        fitz.Rect(rect.x0 + 14, rect.y0 + 22, rect.x1 - 12, rect.y1 - 8),
        body,
        fontsize=8.2,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )


def checkbox_list(
    page: fitz.Page,
    items: list[str],
    x: float,
    y: float,
    width: float = 240,
    line_h: float = 18,
) -> float:
    for item in items:
        page.insert_text(
            fitz.Point(x, y),
            f"[ ]  {item}",
            fontsize=8.6,
            fontname=FONT,
            color=NEAR_BLACK,
        )
        y += line_h
    return y


def field_row(page: fitz.Page, label: str, x: float, y: float, w: float) -> None:
    page.insert_text(fitz.Point(x, y), label, fontsize=8.5, fontname=FONT_B, color=MUTED)
    page.draw_line(
        fitz.Point(x, y + 18),
        fitz.Point(x + w, y + 18),
        color=LINE,
        width=0.8,
    )


def card(
    page: fitz.Page,
    rect: fitz.Rect,
    title: str,
    body: str,
    num: str | None = None,
) -> None:
    page.draw_rect(rect, color=LINE, fill=WHITE, width=0.8)
    tx = rect.x0 + 12
    if num:
        page.insert_text(
            fitz.Point(tx, rect.y0 + 18),
            num,
            fontsize=10,
            fontname=FONT_B,
            color=ORANGE,
        )
        tx += 28
    page.insert_text(
        fitz.Point(tx, rect.y0 + 18),
        title,
        fontsize=10,
        fontname=FONT_B,
        color=NEAR_BLACK,
    )
    page.insert_textbox(
        fitz.Rect(rect.x0 + 12, rect.y0 + 26, rect.x1 - 12, rect.y1 - 8),
        body,
        fontsize=8.2,
        fontname=FONT,
        color=MUTED,
        align=fitz.TEXT_ALIGN_LEFT,
    )


def insert_img(page: fitz.Page, path: Path, rect: fitz.Rect) -> None:
    page.insert_image(rect, filename=str(path), keep_proportion=True)


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------


def page_cover(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=BLACK, width=0)
    insert_img(page, ASSETS / "first-visit-cover.png", fitz.Rect(0, 0, W, H))

    # Dark left scrim for readability
    shape = page.new_shape()
    shape.draw_rect(fitz.Rect(0, 0, W * 0.72, H))
    shape.finish(color=None, fill=(0.05, 0.05, 0.06), fill_opacity=0.62)
    shape.commit()

    # Top hazard strip
    draw_hazard_stripe(page, 0, 18)

    page.insert_text(fitz.Point(56, 90), "UK EDITION", fontsize=12, fontname=FONT_B, color=ORANGE)
    page.insert_text(fitz.Point(56, 140), "RAGE ROOM", fontsize=36, fontname=FONT_B, color=WHITE)
    page.insert_text(fitz.Point(56, 182), "FIRST VISIT", fontsize=36, fontname=FONT_B, color=WHITE)
    page.insert_text(fitz.Point(56, 224), "PREP PACK", fontsize=36, fontname=FONT_B, color=ORANGE)

    page.insert_textbox(
        fitz.Rect(56, 250, 360, 290),
        "Arrive ready for your first smash session - what happens, what to wear, and what to ask before you book.",
        fontsize=11,
        fontname=FONT,
        color=WHITE,
        align=fitz.TEXT_ALIGN_LEFT,
    )

    box = fitz.Rect(56, 320, 340, 470)
    page.draw_rect(box, color=ORANGE, fill=(0.08, 0.08, 0.09), width=1.5)
    page.insert_text(fitz.Point(72, 345), "WHAT'S INSIDE", fontsize=11, fontname=FONT_B, color=ORANGE)
    items_l = ["What happens steps", "What to wear & bring", "Can I take part?"]
    items_r = ["Venue questions", "Waiver & arrival", "Final prep checklist"]
    y = 370
    for a, b in zip(items_l, items_r):
        page.insert_text(fitz.Point(72, y), f"- {a}", fontsize=9.5, fontname=FONT, color=WHITE)
        page.insert_text(fitz.Point(210, y), f"- {b}", fontsize=9.5, fontname=FONT, color=WHITE)
        y += 22

    badges = [
        (fitz.Rect(56, 520, 170, 548), "FIRST TIMER", True),
        (fitz.Rect(182, 520, 296, 548), "A4 READY", False),
        (fitz.Rect(308, 520, 430, 548), "PRINTABLE", False),
    ]
    for rect, label, primary in badges:
        page.draw_rect(rect, color=None, fill=ORANGE if primary else NAVY, width=0)
        tw = fitz.get_text_length(label, fontname=FONT_B, fontsize=9)
        page.insert_text(
            fitz.Point(rect.x0 + (rect.width - tw) / 2, rect.y0 + 19),
            label,
            fontsize=9,
            fontname=FONT_B,
            color=WHITE,
        )

    page.insert_text(
        fitz.Point(56, H - 36),
        "Entertainment planning aid only. Always follow your chosen venue's rules and safety instructions.",
        fontsize=7.5,
        fontname=FONT,
        color=(0.85, 0.85, 0.88),
    )
    # Bottom hazard
    draw_hazard_stripe(page, H - 18, H)


def page_quick_start(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Quick Start")
    y = section_title(
        page,
        "01",
        "QUICK START",
        "Use this pack before you book and again the day before your session.",
    )

    callout(
        page,
        fitz.Rect(MARGIN, y, W - MARGIN, y + 58),
        "The promise",
        "By the end, you should know what happens, what to wear, whether you can take part, "
        "which questions to ask the venue, and exactly how to arrive prepared.",
    )
    y += 74

    # Two columns
    page.insert_text(fitz.Point(MARGIN, y), "Best way to use this", fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
    page.insert_text(fitz.Point(320, y), "Contents", fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
    y += 20

    left = [
        "Read What Happens so nothing surprises you.",
        "Complete the Can I Take Part? checks.",
        "Ask venue questions before paying.",
        "Fill the Booking Snapshot once confirmed.",
        "Screenshot Arrival Checklist for the day.",
    ]
    contents = [
        "03  What Happens",
        "04  What to Wear and Bring",
        "05  Can I Take Part?",
        "06  Venue Questions",
        "07  Booking Snapshot",
        "08  Waiver and Arrival",
        "09  Day-Of Timeline",
        "10  Common Mistakes",
        "11  After Your Session",
        "12  Final Prep Checklist",
    ]
    ly, ry = y, y
    for item in left:
        page.insert_text(fitz.Point(MARGIN, ly), f"[ ]  {item}", fontsize=8.4, fontname=FONT, color=NEAR_BLACK)
        ly += 18
    for item in contents:
        page.insert_text(fitz.Point(320, ry), item, fontsize=8.4, fontname=FONT, color=MUTED)
        ry += 16

    insert_img(
        page,
        ASSETS / "first-visit-hero-illustration.png",
        fitz.Rect(MARGIN, 430, W - MARGIN, 620),
    )

    callout(
        page,
        fitz.Rect(MARGIN, 640, W - MARGIN, 710),
        "First-timer tip",
        "Venues differ. Treat this pack as preparation, not a substitute for the venue's briefing, "
        "waivers, age rules or staff instructions on the day.",
        accent=ORANGE_SOFT,
    )
    footer(page, 2)


def page_what_happens(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "What Happens")
    y = section_title(
        page,
        "02",
        "WHAT HAPPENS",
        "A typical first visit, from arrival to the final briefing. Exact timings vary by venue.",
    )

    steps = [
        ("1", "Arrive early", "Most venues ask you to arrive 10-15 minutes before your session for check-in and waivers."),
        ("2", "Check in & waivers", "Confirm booking, show ID if asked, and complete any liability waiver."),
        ("3", "Suit up", "Put on venue PPE: typically overalls/cover, gloves, eye protection and sometimes a helmet."),
        ("4", "Safety briefing", "Staff explain rules, stance, what you can smash, and what is off-limits."),
        ("5", "Smash session", "Supervised time in the room - usually around 15-30 minutes depending on package."),
        ("6", "Wrap up", "Return gear, take photos if allowed, and leave when staff clear the room."),
    ]

    col_w = (W - 2 * MARGIN - 12) / 2
    for i, (num, title, body) in enumerate(steps):
        col = i % 2
        row = i // 2
        x0 = MARGIN + col * (col_w + 12)
        top = y + row * 95
        card(page, fitz.Rect(x0, top, x0 + col_w, top + 85), title, body, num=num)

    insert_img(
        page,
        ASSETS / "first-visit-smash-moment.png",
        fitz.Rect(MARGIN, 520, W - MARGIN, 700),
    )

    callout(
        page,
        fitz.Rect(MARGIN, 715, W - MARGIN, 770),
        "Reality check",
        "It is loud, physical and supervised. You do not need to be angry - most first-timers are there for fun, novelty or stress release.",
    )
    footer(page, 3)


def page_what_to_wear(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "What to Wear and Bring")
    y = section_title(
        page,
        "03",
        "WHAT TO WEAR & BRING",
        "Send this to anyone joining you. Venue rules always come first.",
    )

    # Three columns wear / avoid / bring
    cols = [
        (
            "Wear",
            [
                "Closed-toe, closed-heel shoes",
                "Comfortable clothes you can move in",
                "Long trousers where possible",
                "Hair tied back",
                "Venue-provided PPE over clothes",
            ],
        ),
        (
            "Avoid",
            [
                "Sandals, heels or open shoes",
                "Dangling jewellery",
                "Loose scarves or long chains",
                "Fragile or expensive outfits",
                "Anything that reduces grip",
            ],
        ),
        (
            "Bring",
            [
                "Photo ID if required",
                "Booking confirmation",
                "Water bottle",
                "Hair tie / spare clips",
                "Phone with a secure pocket",
            ],
        ),
    ]
    col_w = (W - 2 * MARGIN - 16) / 3
    for i, (title, items) in enumerate(cols):
        x0 = MARGIN + i * (col_w + 8)
        box = fitz.Rect(x0, y, x0 + col_w, y + 200)
        page.draw_rect(box, color=LINE, fill=(0.98, 0.98, 0.985), width=0.8)
        page.insert_text(
            fitz.Point(x0 + 12, y + 22),
            title.upper(),
            fontsize=11,
            fontname=FONT_B,
            color=ORANGE if title != "Avoid" else NEAR_BLACK,
        )
        checkbox_list(page, items, x0 + 12, y + 48, width=col_w - 20, line_h=26)

    insert_img(
        page,
        ASSETS / "first-visit-gear-flatlay.png",
        fitz.Rect(MARGIN, 420, W - MARGIN, 620),
    )

    callout(
        page,
        fitz.Rect(MARGIN, 640, W - MARGIN, 720),
        "Guest reminder message",
        "Reminder for [Venue] on [Date]: please arrive by [Time], wear closed-toe shoes and comfy clothes, "
        "and follow all venue safety instructions. Bring ID if requested and expect to sign a waiver.",
        accent=ORANGE_SOFT,
    )
    page.insert_text(
        fitz.Point(MARGIN, 745),
        "Important: this pack does not replace venue rules, waivers or staff instructions.",
        fontsize=8,
        fontname=FONT,
        color=MUTED,
    )
    footer(page, 4)


def page_can_i_take_part(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Can I Take Part?")
    y = section_title(
        page,
        "04",
        "CAN I TAKE PART?",
        "A practical self-check before you book. If unsure, contact the venue - do not guess.",
    )

    callout(
        page,
        fitz.Rect(MARGIN, y, W - MARGIN, y + 52),
        "Not medical advice",
        "This is a planning checklist only. Venues set their own health, age and access rules. "
        "If you have a medical condition or injury, ask the venue before booking.",
    )
    y += 70

    checks = [
        "I meet the venue's minimum age (or have a guardian if required).",
        "I can wear closed-toe shoes and stand for the session.",
        "I am comfortable with loud noise and physical activity.",
        "I do not have an injury that swinging a bat/hammer would worsen.",
        "I understand I must follow staff instructions at all times.",
        "I am happy to sign a waiver if the venue requires one.",
        "I have checked pregnancy / health restrictions with the venue if relevant.",
        "Anyone in my group who is unsure will contact the venue directly.",
    ]
    page.insert_text(fitz.Point(MARGIN, y), "Self-check", fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
    y += 22
    for item in checks:
        page.draw_rect(fitz.Rect(MARGIN, y - 12, W - MARGIN, y + 10), color=LINE, fill=WHITE, width=0.5)
        page.insert_text(
            fitz.Point(MARGIN + 10, y + 2),
            f"[ ]  {item}",
            fontsize=8.5,
            fontname=FONT,
            color=NEAR_BLACK,
        )
        y += 28

    y += 8
    page.insert_text(fitz.Point(MARGIN, y), "If you answer no / unsure", fontsize=11, fontname=FONT_B, color=NEAR_BLACK)
    y += 18
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 60),
        "Email or call the venue with a short description of your concern before you pay. "
        "Ask about age limits, pregnancy policy, accessibility, and whether a spectator option exists.",
        fontsize=8.5,
        fontname=FONT,
        color=MUTED,
    )

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "Decision rule",
        "If the venue cannot clearly answer your safety or access question, shortlist another venue before booking.",
        accent=ORANGE_SOFT,
    )
    footer(page, 5)


def page_venue_questions(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Venue Questions")
    y = section_title(
        page,
        "05",
        "VENUE QUESTIONS",
        "Ask before paying. Copy/paste the opener at the bottom.",
    )

    groups = [
        (
            "Booking basics",
            [
                "What exactly is included in the price?",
                "How long is the smash session?",
                "What is the deposit and cancellation policy?",
                "Is pricing per person or per room?",
            ],
        ),
        (
            "Safety & access",
            [
                "What PPE is provided?",
                "What footwear is mandatory?",
                "What age / health restrictions apply?",
                "Can I review the waiver before arrival?",
            ],
        ),
        (
            "On the day",
            [
                "When should we arrive?",
                "Are photos/videos allowed?",
                "Is there parking or nearby transport?",
                "Is there space for bags/coats?",
            ],
        ),
    ]

    for title, qs in groups:
        page.insert_text(fitz.Point(MARGIN, y), title, fontsize=11, fontname=FONT_B, color=ORANGE)
        y += 18
        for q in qs:
            page.insert_text(
                fitz.Point(MARGIN, y),
                f"[ ]  {q}",
                fontsize=8.6,
                fontname=FONT,
                color=NEAR_BLACK,
            )
            y += 17
        y += 10

    page.insert_text(fitz.Point(MARGIN, y), "Copy/paste opener", fontsize=11, fontname=FONT_B, color=NEAR_BLACK)
    y += 14
    box = fitz.Rect(MARGIN, y, W - MARGIN, y + 90)
    page.draw_rect(box, color=LINE, fill=(0.98, 0.98, 0.985), width=0.8)
    page.insert_textbox(
        box + (12, 10, -12, -10),
        "Hi, I am booking a first-time rage room session for [number] people on [date]. "
        "Could you confirm package options, session length, PPE, footwear rules, age restrictions, "
        "arrival time, waiver process and cancellation policy? Thanks.",
        fontsize=8.5,
        fontname=FONT,
        color=NEAR_BLACK,
    )

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "Red flags",
        "Vague pricing, unclear age rules, no cancellation details, poor replies, or safety rules that only appear after payment.",
    )
    footer(page, 6)


def page_booking_snapshot(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Booking Snapshot")
    y = section_title(
        page,
        "06",
        "BOOKING SNAPSHOT",
        "Fill this in once the booking is confirmed. Keep a screenshot on your phone.",
    )

    fields = [
        ("VENUE NAME", "PACKAGE / SESSION"),
        ("DATE", "ARRIVAL TIME"),
        ("SESSION START", "GROUP SIZE"),
        ("TOTAL PAID £", "DEPOSIT £"),
        ("BOOKING REF", "CONTACT PHONE"),
        ("ADDRESS", "TRAVEL / PARKING"),
    ]
    col_w = (W - 2 * MARGIN - 16) / 2
    row_h = 52
    for i, (left, right) in enumerate(fields):
        top = y + i * row_h
        field_row(page, left, MARGIN, top, col_w)
        field_row(page, right, MARGIN + col_w + 16, top, col_w)

    y = y + len(fields) * row_h + 20
    page.insert_text(fitz.Point(MARGIN, y), "Notes for the day", fontsize=11, fontname=FONT_B, color=NEAR_BLACK)
    y += 10
    notes = fitz.Rect(MARGIN, y, W - MARGIN, y + 120)
    page.draw_rect(notes, color=LINE, fill=WHITE, width=0.8)
    for i in range(4):
        yy = notes.y0 + 28 + i * 22
        page.draw_line(fitz.Point(notes.x0 + 12, yy), fitz.Point(notes.x1 - 12, yy), color=LINE, width=0.6)

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "Save proof",
        "Keep the confirmation email, payment receipt and any waiver links together. "
        "If plans change, contact the venue as early as their policy allows.",
        accent=ORANGE_SOFT,
    )
    footer(page, 7)


def page_waiver_arrival(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Waiver and Arrival")
    y = section_title(
        page,
        "07",
        "WAIVER & ARRIVAL",
        "Use this the day before and again as you leave for the venue.",
    )

    blocks = [
        (
            "Before you leave home",
            [
                "Booking confirmation saved offline / screenshot",
                "Closed-toe shoes on",
                "Hair ties packed if needed",
                "Travel route checked (buffer for delays)",
                "Know the arrival time (not just session start)",
            ],
        ),
        (
            "At check-in",
            [
                "Arrive 10-15 minutes early",
                "Complete waiver calmly - read key terms",
                "Tell staff about any access needs",
                "Store bags/valuables as directed",
                "Listen fully to the safety briefing",
            ],
        ),
        (
            "In the room",
            [
                "Wear all PPE correctly",
                "Follow staff spacing and turn-taking",
                "Only smash approved items",
                "Stop immediately if staff say stop",
                "Keep phones secured if allowed at all",
            ],
        ),
    ]

    for title, items in blocks:
        page.insert_text(fitz.Point(MARGIN, y), title, fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
        y += 18
        for item in items:
            page.insert_text(
                fitz.Point(MARGIN, y),
                f"[ ]  {item}",
                fontsize=8.8,
                fontname=FONT,
                color=NEAR_BLACK,
            )
            y += 18
        y += 12

    callout(
        page,
        fitz.Rect(MARGIN, 640, W - MARGIN, 720),
        "Waiver tip",
        "If the venue emails the waiver in advance, complete it before you arrive. "
        "It reduces queue time and last-minute stress for first-timers.",
    )
    page.insert_textbox(
        fitz.Rect(MARGIN, 735, W - MARGIN, 780),
        "Staff instructions override this checklist. If anything feels unclear, ask before the session starts.",
        fontsize=8.2,
        fontname=FONT,
        color=MUTED,
    )
    footer(page, 8)


def page_timeline(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Day-Of Timeline")
    y = section_title(
        page,
        "08",
        "DAY-OF TIMELINE",
        "Sample timing for a first visit. Adjust to your booking confirmation.",
    )

    # Table header
    cols = [("Time", 70), ("Activity", 160), ("Owner", 90), ("Notes", 180)]
    x = MARGIN
    head = fitz.Rect(MARGIN, y, W - MARGIN, y + 24)
    page.draw_rect(head, color=None, fill=TABLE_HEAD, width=0)
    for label, w in cols:
        page.insert_text(fitz.Point(x + 8, y + 16), label, fontsize=8.5, fontname=FONT_B, color=WHITE)
        x += w
    y += 24

    rows = [
        ("-45 min", "Leave home / travel", "You", "Build buffer for traffic"),
        ("-15 min", "Arrive & check in", "You", "Waivers + store bags"),
        ("-5 min", "Suit up / PPE", "You + staff", "Follow staff guidance"),
        ("0", "Safety briefing", "Venue staff", "Listen fully"),
        ("+10", "Smash session", "You + staff", "Typical window varies"),
        ("+30", "Photos / exit", "You", "Only if venue allows"),
        ("+40", "Food / decompress", "Optional", "Nearby cafe or home"),
    ]
    for i, (time, activity, owner, notes) in enumerate(rows):
        h = 36
        bg = (0.98, 0.98, 0.985) if i % 2 == 0 else WHITE
        row = fitz.Rect(MARGIN, y, W - MARGIN, y + h)
        page.draw_rect(row, color=LINE, fill=bg, width=0.5)
        vals = [time, activity, owner, notes]
        x = MARGIN
        for val, (_, w) in zip(vals, cols):
            page.insert_text(
                fitz.Point(x + 8, y + 22),
                val,
                fontsize=8.2,
                fontname=FONT_B if _ == "Time" else FONT,
                color=ORANGE if _ == "Time" else NEAR_BLACK,
            )
            x += w
        y += h

    y += 20
    callout(
        page,
        fitz.Rect(MARGIN, y, W - MARGIN, y + 70),
        "Timing tip",
        "First visits run late when people underestimate travel, footwear changes or waiver time. "
        "Aim to be early rather than exactly on time.",
    )
    y += 90

    page.insert_text(fitz.Point(MARGIN, y), "My times", fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
    y += 20
    for label in ["LEAVE HOME", "ARRIVE BY", "SESSION START", "AFTER PLAN"]:
        field_row(page, label, MARGIN, y, W - 2 * MARGIN)
        y += 48

    footer(page, 9)


def page_mistakes(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Common Mistakes")
    y = section_title(
        page,
        "09",
        "COMMON MISTAKES",
        "Avoid these first-timer pitfalls so the session stays fun and safe.",
    )

    mistakes = [
        ("Wrong shoes", "Open shoes are the most common reason people are turned away or delayed."),
        ("Arriving exactly on time", "You need check-in + waiver time before the session clock starts."),
        ("Skipping the briefing", "Rules protect you and others. Listen even if you have been before elsewhere."),
        ("Assuming all venues match", "PPE, items, photo rules and age limits differ - always confirm."),
        ("Overpacking jewellery", "Remove dangling jewellery before you suit up."),
        ("Booking without asking", "If anyone in the group has access/health questions, ask first."),
        ("No payment / ID ready", "Have confirmation and ID available to avoid awkward delays."),
        ("Expecting therapy", "This is entertainment. Enjoy it as a novel, supervised activity."),
    ]

    col_w = (W - 2 * MARGIN - 12) / 2
    for i, (title, body) in enumerate(mistakes):
        col = i % 2
        row = i // 2
        x0 = MARGIN + col * (col_w + 12)
        top = y + row * 78
        card(page, fitz.Rect(x0, top, x0 + col_w, top + 68), title, body, num=str(i + 1))

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "Mindset for first-timers",
        "You do not need to smash harder than everyone else. Focus on safety, listening to staff, and enjoying the novelty.",
        accent=ORANGE_SOFT,
    )
    footer(page, 10)


def page_after(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "After Your Session")
    y = section_title(
        page,
        "10",
        "AFTER YOUR SESSION",
        "Optional prompts if you want to capture the experience - keep it light.",
    )

    prompts = [
        "What surprised you most?",
        "What would you tell a friend going for the first time?",
        "Would you go again - solo, couple or group?",
        "Any venue tips worth saving for next time?",
    ]
    for i, prompt in enumerate(prompts):
        top = y + i * 70
        page.insert_text(
            fitz.Point(MARGIN, top),
            f"{i + 1}.  {prompt}",
            fontsize=10,
            fontname=FONT_B,
            color=NEAR_BLACK,
        )
        box = fitz.Rect(MARGIN, top + 10, W - MARGIN, top + 55)
        page.draw_rect(box, color=LINE, fill=WHITE, width=0.7)
        for li in range(2):
            yy = box.y0 + 22 + li * 16
            page.draw_line(fitz.Point(box.x0 + 10, yy), fitz.Point(box.x1 - 10, yy), color=LINE, width=0.5)

    y = y + 4 * 70 + 10
    page.insert_text(fitz.Point(MARGIN, y), "Share carefully", fontsize=11, fontname=FONT_B, color=NEAR_BLACK)
    y += 16
    checkbox_list(
        page,
        [
            "Check the venue photo/video policy before posting",
            "Do not tag people who prefer privacy",
            "Credit the venue only if appropriate",
        ],
        MARGIN,
        y,
        width=400,
        line_h=20,
    )

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "Next step",
        "If you loved it, consider gifting a session or planning a group night with the Party Planner Pack.",
        accent=ORANGE_SOFT,
    )
    footer(page, 11)


def page_final(doc: fitz.Document) -> None:
    page = add_page(doc)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE, width=0)
    header(page, "Final Prep Checklist")
    y = section_title(
        page,
        "11",
        "FINAL PREP CHECKLIST",
        "Tick everything before you leave for the venue.",
    )

    items = [
        "Venue booked and confirmation saved",
        "Arrival time and address shared with anyone joining",
        "Closed-toe shoes ready",
        "Comfortable clothes chosen",
        "Hair tie / ID / water packed if needed",
        "Travel plan includes a time buffer",
        "Venue footwear, age and PPE rules re-checked",
        "Waiver completed in advance if available",
        "Questions about access/health already asked (if any)",
        "Phone charged; booking screenshot offline",
        "After-session plan decided (optional)",
        "Everyone knows: listen to staff, follow PPE rules",
    ]
    for item in items:
        page.draw_rect(fitz.Rect(MARGIN, y - 10, W - MARGIN, y + 12), color=LINE, fill=WHITE, width=0.5)
        page.insert_text(
            fitz.Point(MARGIN + 10, y + 4),
            f"[ ]  {item}",
            fontsize=9,
            fontname=FONT,
            color=NEAR_BLACK,
        )
        y += 28

    y += 8
    page.insert_text(fitz.Point(MARGIN, y), "Final note", fontsize=12, fontname=FONT_B, color=NEAR_BLACK)
    y += 16
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 50),
        "A first rage room visit works best when the admin is handled early. "
        "Arrive ready, listen to the briefing, and leave the chaos for the room.",
        fontsize=9,
        fontname=FONT,
        color=MUTED,
    )

    callout(
        page,
        fitz.Rect(MARGIN, 700, W - MARGIN, 770),
        "You're ready",
        "Plan well. Stay safe. Enjoy the smash.",
        accent=ORANGE,
    )
    footer(page, 12)


def main() -> None:
    for name in [
        "first-visit-cover.png",
        "first-visit-gear-flatlay.png",
        "first-visit-hero-illustration.png",
        "first-visit-smash-moment.png",
    ]:
        path = ASSETS / name
        if not path.exists():
            raise SystemExit(f"Missing asset: {path}")

    doc = new_doc()
    page_cover(doc)
    page_quick_start(doc)
    page_what_happens(doc)
    page_what_to_wear(doc)
    page_can_i_take_part(doc)
    page_venue_questions(doc)
    page_booking_snapshot(doc)
    page_waiver_arrival(doc)
    page_timeline(doc)
    page_mistakes(doc)
    page_after(doc)
    page_final(doc)

    assert doc.page_count == TOTAL_PAGES
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT, garbage=4, deflate=True, clean=True)
    doc.close()
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1e6:.1f} MB, {TOTAL_PAGES} pages)")


if __name__ == "__main__":
    main()
