"""
Icon design for כסף גדול (Kesef Gadol) — v2.

Concept: a coin with a small sprout (two leaves + a bud) growing from its
top edge. Rebuilt after v1's leaf geometry was wrong. This version composes
the sprout as simple, robust shapes (circles + polygons) rather than fragile
trig-based tapered leaves, and is checked at each stage.
"""

from PIL import Image, ImageDraw
import math

GREEN_900 = (31, 58, 34)
GREEN_800 = (39, 74, 43)
GREEN_700 = (53, 107, 59)
GREEN_600 = (65, 125, 68)
GREEN_500 = (79, 145, 81)
GOLD = (216, 163, 57)
GOLD_LIGHT = (235, 195, 118)
GOLD_DARK = (170, 122, 36)
CREAM = (251, 247, 238)

SS = 8


def leaf_polygon(base, tip, width):
    """A simple symmetric leaf/almond shape from base point to tip point."""
    bx, by = base
    tx, ty = tip
    dx, dy = tx - bx, ty - by
    length = math.hypot(dx, dy)
    if length == 0:
        return [base, base, base]
    ux, uy = dx / length, dy / length         # unit vector base->tip
    px, py = -uy, ux                            # perpendicular unit vector

    mid_x = bx + dx * 0.55
    mid_y = by + dy * 0.55
    half_w = width / 2

    return [
        (bx, by),
        (mid_x + px * half_w, mid_y + py * half_w),
        (tx, ty),
        (mid_x - px * half_w, mid_y - py * half_w),
    ]


def build_icon(target_size, maskable=False, filename="icon.png", debug=False):
    S = target_size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx = S / 2

    # ---- Background ----
    if maskable:
        draw.rectangle([0, 0, S, S], fill=GREEN_900)
        safe_scale = 0.72
    else:
        radius = S * 0.225
        draw.rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=GREEN_900)
        safe_scale = 0.88

    # soft vertical gradient wash for depth
    grad = Image.new("L", (1, S))
    for y in range(S):
        grad.putpixel((0, y), int(22 * (1 - y / S)))
    grad = grad.resize((S, S))
    wash = Image.new("RGBA", (S, S), GREEN_600 + (0,))
    wash.putalpha(grad)
    img.alpha_composite(wash)
    draw = ImageDraw.Draw(img)

    # ---- Layout anchors ----
    # Coin + sprout form one visual group, vertically centered as a unit
    # within the safe zone (not just the coin) so nothing clips and nothing
    # feels bottom-heavy.
    coin_r = S * 0.24 * safe_scale
    stem_h = coin_r * 1.05
    leaf_span = coin_r * 0.85

    group_h = stem_h + leaf_span + coin_r * 2
    group_top = S / 2 - group_h / 2 + S * 0.03

    stem_tip_y = group_top + leaf_span * 0.55
    coin_cy = group_top + leaf_span * 0.55 + stem_h + coin_r
    coin_top_y = coin_cy - coin_r

    stem_base = (cx, coin_top_y + coin_r * 0.08)
    stem_tip = (cx, stem_tip_y)

    # ---- Coin (drawn first, sprout drawn after so it visually emerges from it) ----
    draw.ellipse(
        [cx - coin_r, coin_cy - coin_r, cx + coin_r, coin_cy + coin_r],
        fill=GOLD_DARK,
    )
    inset = coin_r * 0.10
    draw.ellipse(
        [cx - coin_r + inset, coin_cy - coin_r + inset, cx + coin_r - inset, coin_cy + coin_r - inset],
        fill=GOLD,
    )
    inset2 = coin_r * 0.24
    draw.ellipse(
        [cx - coin_r + inset2, coin_cy - coin_r + inset2, cx + coin_r - inset2, coin_cy + coin_r - inset2],
        outline=GOLD_DARK,
        width=max(1, int(coin_r * 0.05)),
    )

    # ---- Stem ----
    stem_w = max(2, S * 0.016)
    draw.line([stem_base, stem_tip], fill=GREEN_700, width=int(stem_w))
    draw.ellipse(
        [stem_tip[0] - stem_w / 2, stem_tip[1] - stem_w / 2,
         stem_tip[0] + stem_w / 2, stem_tip[1] + stem_w / 2],
        fill=GREEN_700,
    )

    # ---- Leaves ----
    leaf_len = leaf_span
    leaf_w = coin_r * 0.62
    leaf_origin_y = stem_base[1] - stem_h * 0.35

    left_tip = (cx - leaf_len * 1.05, leaf_origin_y - leaf_len * 0.35)
    right_tip = (cx + leaf_len * 1.05, leaf_origin_y - leaf_len * 0.35)
    origin = (cx, leaf_origin_y)

    draw.polygon(leaf_polygon(origin, left_tip, leaf_w), fill=GREEN_500)
    draw.polygon(leaf_polygon(origin, right_tip, leaf_w), fill=GREEN_600)

    # small center leaflet at the very top of the stem
    top_tip = (cx, stem_tip[1] - leaf_len * 0.45)
    draw.polygon(leaf_polygon(stem_tip, top_tip, leaf_w * 0.65), fill=GREEN_500)

    # ---- Coin highlight (drawn last, on top, additive glow feel) ----
    hl_r = coin_r * 0.5
    hl_cx = cx - coin_r * 0.30
    hl_cy = coin_cy - coin_r * 0.32
    highlight = Image.new("RGBA", (int(hl_r * 2), int(hl_r * 2)), (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(highlight)
    hdraw.ellipse([0, 0, hl_r * 2, hl_r * 2], fill=GOLD_LIGHT + (90,))
    img.alpha_composite(highlight, (int(hl_cx - hl_r), int(hl_cy - hl_r)))

    final = img.resize((target_size, target_size), Image.LANCZOS)
    final.save(filename)
    print(f"saved {filename} ({target_size}x{target_size}{', maskable' if maskable else ''})")


if __name__ == "__main__":
    build_icon(192, maskable=False, filename="icon-192.png")
    build_icon(512, maskable=False, filename="icon-512.png")
    build_icon(512, maskable=True, filename="icon-512-maskable.png")
    build_icon(180, maskable=False, filename="apple-touch-icon.png")
    build_icon(32, maskable=False, filename="favicon-32.png")
