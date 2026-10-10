"""Build a v5 case study page from a content module.

Usage:  python3 templates/case-study-v5/build_case.py cases/<slug>/content.py
Writes  cases/<slug>/index.html  (next to the content file).

The hero, side rail, lightbox and the whole page script are taken verbatim from
reference-trips/index.html, so every case keeps identical behaviour (reels, TOC, reveal,
before/after slider, lightbox). Only copy, visuals and reel steps come from content.py.
Rules: see TEMPLATE.md. No em dashes anywhere (the build fails if it finds one).
"""
import html
import importlib.util
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
REF = (HERE / "reference-trips" / "index.html").read_text(encoding="utf-8")

INTER = "'Inter',sans-serif"
UI = "'Mier B02',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
BODY = f"font:400 clamp(17px,1.5vw,19px)/1.75 {INTER};color:#55524D;text-wrap:pretty"


def e(s):
    """Escape plain text. Content may opt into markup with a leading '!' (trusted, authored by us)."""
    if isinstance(s, str) and s.startswith("!"):
        return s[1:]
    return html.escape(s, quote=False)


# ── layout helpers ──────────────────────────────────────────────────────────

def fit_min(n, minw, gap="20px", ks=None):
    """Width of one column so a row holds k items, k being the largest of `ks` that fits at `minw`
    (default: the divisors of n, so rows are always full; for a prime n, any k that leaves at least two on the last
    row, so 5 goes 5 or 3+2, never 4+1), else one full-width column.
    Pure CSS, no media queries: each term switches on via calc((threshold - 100%) * 999)."""
    if n <= 1:
        return "100%"
    if not ks:
        ks = [k for k in range(n, 1, -1) if n % k == 0]
        if ks == [n]:
            ks += [k for k in range(n - 1, 1, -1) if n % k != 1]
    terms, prev = [], None
    for k in ks:
        col = f"calc((100% - {k - 1} * {gap}) / {k} - 1px)"
        terms.append(col if prev is None else f"min({col},max(0px,calc(({prev} - 100%) * 999)))")
        prev = f"{k * minw}px + {k - 1} * {gap}"
    terms.append(f"min(100%,max(0px,calc(({prev} - 100%) * 999)))")
    return f"max({','.join(terms)})"


def even_grid(n, minw, gap="20px", ks=None):
    """grid-template-columns for n items that wraps into balanced rows (2x2, 3+3, 4+4) instead of 3+1 or 4+1."""
    return f"repeat(auto-fit,minmax({fit_min(n, minw, gap, ks)},1fr))"


# ── primitives ──────────────────────────────────────────────────────────────

def h2(t):
    return (f'<h2 data-reveal="1" style="margin:0;font:600 clamp(32px,3.6vw,46px)/1.15 {INTER};'
            f'letter-spacing:-.025em;color:#1A1614;text-wrap:balance">{e(t)}</h2>')


def h3(t, margin="44px 0 0", color="#3A3632"):
    return (f'<h3 style="margin:{margin};font:600 clamp(22px,2.2vw,28px)/1.3 {INTER};'
            f'letter-spacing:-.015em;color:{color}">{e(t)}</h3>')


def p(t, margin="18px 0 0"):
    return f'<p style="margin:{margin};{BODY}">{e(t)}</p>'


def avatar(img, bg, size=150):
    """size is px, or any CSS length (e.g. a clamp() so the avatar shrinks on phones)."""
    size = f"{size}px" if isinstance(size, int) else size
    return (f'<span style="flex:none;display:block;width:{size};height:{size};border-radius:50%;overflow:hidden;background:{bg}">'
            f'<img src="assets/cs/{img}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;'
            f'mix-blend-mode:multiply;filter:saturate(0) contrast(1.3)"></span>')


def quote(t, by=None):
    cite = (f'<span style="display:block;margin-top:10px;font:400 15px {INTER};color:#8A8680">{e(by)}</span>' if by else "")
    return (f'<blockquote data-reveal="1" style="margin:56px 0 0;padding:4px 0 4px 28px;border-left:4px solid #7A1E2C;'
            f'font:600 clamp(20px,2vw,25px)/1.5 {INTER};color:#1A1614;letter-spacing:-.01em">{e(t)}{cite}</blockquote>')


def labelled_list(items, margin="8px 0 0"):
    lis = "".join(
        f'<li style="margin-top:22px;padding-left:4px"><div style="font:600 19px {INTER};color:#3A3632">{e(k)}</div>'
        f'<div style="margin-top:6px;font:400 clamp(17px,1.5vw,19px)/1.7 {INTER};color:#55524D">{e(v)}</div></li>'
        for k, v in items)
    return f'<ul style="margin:{margin};padding-left:22px;color:#8A8680">{lis}</ul>'


def grid_labels(items):
    cells = "".join(
        f'<div style="padding:20px 22px;border-radius:16px;background:{"#1A1614" if i == 2 else "#F4F3F1"}">'
        f'<div style="font:600 12px {INTER};letter-spacing:.12em;text-transform:uppercase;color:{"#BDB8B1" if i == 2 else "#7A1E2C"}">{e(k)}</div>'
        f'<div style="margin-top:8px;font:400 17px/1.6 {INTER};color:{"#fff" if i == 2 else "#3A3632"}">{e(v)}</div></div>'
        for i, (k, v) in enumerate(items))
    return f'<div style="margin-top:24px;display:grid;grid-template-columns:{even_grid(len(items), 300, "12px")};gap:12px">{cells}</div>'


def numbered_cards(items, minw=300, label_color="#7A1E2C", pad=32):
    cards = "".join(
        f'<div data-reveal="1" style="padding:{pad}px;border:1px solid #E6E3DE;border-radius:18px;background:#fff">'
        f'<div style="font:600 15px {INTER};letter-spacing:.06em;color:{label_color}">{i+1:02d}</div>'
        f'<div style="margin-top:14px;font:600 22px/1.3 {INTER};letter-spacing:-.01em;color:#1A1614">{e(t)}</div>'
        f'<div style="margin-top:14px;font:400 18px/1.65 {INTER};color:#55524D">{e(b)}</div></div>'
        for i, (t, b) in enumerate(items))
    return (f'<div style="margin-top:20px;display:grid;grid-template-columns:{even_grid(len(items), max(minw, 240))};'
            f'gap:20px">{cards}</div>')


# ── reels ───────────────────────────────────────────────────────────────────

BLUE_BG = "linear-gradient(180deg,#2F78CF 0%,#1556B0 55%,#0E449A 100%)"
DARK_BG = "radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px) 0 0/4px 4px,linear-gradient(180deg,#1B1B1B 0%,#121212 100%)"
DOTS = "radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px) 0 0/4px 4px,"
# Frame colours per case (Pranita, 2026-10-08: four cases, four colours). "hero" is the header gradient (the header
# draws its own dot texture), "bg" is used for reels, phone panels and problem rows.
THEMES = {
    "blue": {"hero": BLUE_BG, "bg": BLUE_BG},
    "dark": {"hero": "linear-gradient(180deg,#1B1B1B 0%,#121212 100%)", "bg": DARK_BG},
    "navy": {"hero": "linear-gradient(180deg,#14275A 0%,#0C1A40 55%,#081230 100%)",
             "bg": DOTS + "linear-gradient(180deg,#14275A 0%,#0C1A40 55%,#081230 100%)"},
    "violet": {"hero": "linear-gradient(135deg,#3446D8 0%,#5A3DD3 50%,#3A1B8C 100%)",
               "bg": DOTS + "linear-gradient(135deg,#3446D8 0%,#5A3DD3 50%,#3A1B8C 100%)"},
}
THEME = {"bg": BLUE_BG}


def reel(rid, proto, steps, ratio=940):
    pq = proto.replace(" ", "%20")
    vp = (f'<figure data-reveal="1" style="margin:40px 0 0"><div data-reel="{rid}"><div style="padding:clamp(14px,3.2vw,40px) '
          f'clamp(14px,3.2vw,40px) 0;border-radius:22px;background:{THEME["bg"]};'
          f'box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)"><div style="padding:6px;border-radius:17px;background:rgba(255,255,255,.2);'
          f'box-shadow:0 30px 60px -24px rgba(0,20,60,.55)"><div style="border-radius:11px;overflow:hidden;background:#fff">'
          f'<div data-vp="1" style="position:relative;aspect-ratio:1280/{ratio};overflow:hidden;background:#F2F5FA"><span data-url="1" style="display:none"></span>'
          f'<div data-scale="1" data-w="1280" style="position:absolute;left:0;top:0;width:1280px;height:{ratio}px;transform-origin:0 0">'
          f'<div data-cam="1" style="position:absolute;left:0;top:0;width:1280px;height:{ratio}px;transform-origin:0 0">'
          f'<iframe data-proto="1" src="{pq}" title="Prototype" tabindex="-1" style="position:absolute;left:0;top:0;width:1280px;'
          f'height:{ratio}px;border:0;pointer-events:none;background:#F2F5FA"></iframe>'
          f'<div data-ring="1" style="position:absolute;left:0;top:0;width:10px;height:10px;opacity:0;border-radius:12px;pointer-events:none"><div data-tag="1" style="display:none"></div></div>'
          f'<div data-ripple="1" style="position:absolute;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(21,86,176,.28);opacity:0;pointer-events:none"></div>'
          f'<div data-cursor="1" style="position:absolute;left:760px;top:740px;opacity:0;pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.28));'
          f'transition:left 1s cubic-bezier(.77,0,.18,1),top 1s cubic-bezier(.77,0,.18,1),opacity .35s,transform .18s cubic-bezier(.3,1.4,.5,1)">'
          f'<svg width="34" height="40" viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17.5 15 Z" fill="#1A1614" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"></path></svg>'
          f'</div></div></div></div></div></div>\n')
    dots = ""
    for i, s in enumerate(steps):
        attrs = f'data-dot="{i}" data-scene="{s["scene"]}" data-sel="{s["sel"]}"'
        for k in ("click", "pre", "u"):
            if s.get(k):
                attrs += f' data-{k}="{s[k]}"'
        t = html.escape(s["t"])
        dots += (f'<button {attrs} aria-label="{t}" style="flex:1;padding:8px 0;border:0;background:none;cursor:pointer">'
                 f'<span style="display:block;height:4px;border-radius:2px;background:rgba(255,255,255,.28);overflow:hidden">'
                 f'<span data-seg="1" style="display:block;height:100%;width:0;background:#fff;border-radius:2px"></span></span>'
                 f'<span data-t="1" style="display:none">{t}</span></button>')
    ctrl = (f'<div style="padding:16px 2px clamp(16px,2.6vw,26px);display:grid;gap:10px"><div style="display:flex;gap:6px">{dots}</div>'
            f'<div style="display:flex;align-items:center;gap:14px;min-height:32px"><div data-cap="1" style="flex:1;min-width:0;display:flex;gap:12px;'
            f'align-items:baseline;color:#fff;opacity:0;transition:opacity .4s ease,transform .5s cubic-bezier(.2,.8,.2,1)">'
            f'<span data-capn="1" style="flex:none;font:600 13px {INTER};opacity:.65;font-variant-numeric:tabular-nums"></span>'
            f'<span data-capt="1" style="font:500 clamp(15px,1.6vw,19px)/1.4 {INTER};text-wrap:pretty"></span></div>'
            f'<span style="flex:none;display:flex;align-items:center;gap:7px;font:600 11px {INTER};letter-spacing:.1em;color:rgba(255,255,255,.75)">'
            f'<span data-live="1" style="width:6px;height:6px;border-radius:50%;background:#fff;animation:omPulse 1.6s ease-in-out infinite"></span>'
            f'<span data-livet="1">AUTOPLAY</span></span><button data-pp="1" aria-label="Pause" style="flex:none;width:32px;height:32px;border-radius:50%;'
            f'border:0;background:rgba(255,255,255,.16);display:grid;place-items:center;cursor:pointer;padding:0">'
            f'<svg data-ico-pause="1" width="10" height="10" viewBox="0 0 10 10"><rect x="1.5" y="1" width="2.4" height="8" rx=".6" fill="#fff"></rect>'
            f'<rect x="6.1" y="1" width="2.4" height="8" rx=".6" fill="#fff"></rect></svg><svg data-ico-play="1" width="10" height="10" viewBox="0 0 10 10" '
            f'style="display:none"><path d="M2 1.2v7.6L8.8 5z" fill="#fff"></path></svg></button></div></div></div></div></figure>')
    return vp + ctrl


# ── sections ────────────────────────────────────────────────────────────────

def overview(c):
    o = c["overview"]
    if V(c, "overview") == "split":
        return overview_split(c)
    out = f'<section id="overview" style="padding-top:96px">{h2(o.get("h2", "First, a little context"))}\n'
    out += h3(o["about_title"]) + p(o["about"])
    out += h3(o.get("overview_title", "What I designed"), "40px 0 0") + p(o["overview"])
    if o.get("truck_strip"):
        out += ('<div aria-hidden="true" style="position:relative;margin-top:28px;height:165px;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);'
                'mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)"><div style="position:absolute;left:0;bottom:6px;width:231px;animation:truckDrive 11s linear infinite;will-change:left">'
                + "".join(f'<span style="position:absolute;top:{t}px;left:{l}px;width:{w}px;height:2px;border-radius:2px;background:#1A1614;transform-origin:100% 50%;opacity:0;animation:speedLine 1.1s cubic-bezier(.3,.6,.4,1) {d}s infinite"></span>'
                          for t, l, w, d in ((14, -26, 46, 0), (30, -8, 58, 0.35), (48, -34, 40, 0.7)))
                + '<img src="assets/cs/ill-truck-nolines.png" alt="" style="display:block;width:231px;height:auto;mix-blend-mode:multiply;transform-origin:50% 100%;animation:truckBob 1.6s linear infinite"></div>'
                  '<span style="position:absolute;left:0;right:0;bottom:6px;height:1.5px;background:repeating-linear-gradient(90deg,#1A1614 0 18px,transparent 18px 34px);opacity:.25"></span></div>\n')
    team = "".join(
        f'<div style="display:flex;align-items:center;gap:12px"><span style="width:30px;height:30px;border-radius:8px;background:{bg};display:grid;place-items:center;'
        f'font:600 11px {INTER};color:{fg}">{e(ab)}</span><span style="font:400 18px {INTER};color:#55524D"><b style="font-weight:600;color:#3A3632">{e(n)}</b> '
        f'<span style="color:#8A8680">({e(note)})</span></span></div>' for ab, bg, fg, n, note in o["team"])
    out += (f'<div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:40px">'
            f'<div>{h3("My role", "0 0 0")}<p style="margin:18px 0 0;{BODY}">{e(o["role"])}</p></div>'
            f'<div>{h3("Team", "0 0 0")}<div style="margin-top:20px;display:grid;gap:14px">{team}</div></div></div>\n')
    stats = "".join(
        f'<div data-reveal="1" style="padding:24px 26px;border:1px solid #E6E3DE;border-radius:16px;background:#fff"><div style="font:600 24px {INTER};'
        f'letter-spacing:-.02em;color:#1A1614">{e(v)}</div><div style="margin-top:8px;font:400 17px/1.5 {INTER};color:#8A8680">{e(l)}</div></div>'
        for v, l in o["outcomes"])
    out += (f'{h3("Outcomes", "64px 0 0")}<div style="margin-top:24px;display:grid;grid-template-columns:{even_grid(len(o["outcomes"]), 200, "16px")};gap:16px">'
            f'{stats}</div></section>')
    return out


def V(c, section):
    return c.get("variants", {}).get(section, "default")


def overview_split(c):
    o = c["overview"]
    facts = "".join(
        f'<div style="padding:14px 0;{"border-top:1px solid #E6E3DE" if i else ""}"><div style="font:600 12px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#8A8680">{e(k)}</div>'
        f'<div style="margin-top:6px;font:500 17px/1.5 {INTER};color:#1A1614">{e(v)}</div></div>' for i, (k, v) in enumerate(o["facts"]))
    out = (f'<section id="overview" style="padding-top:96px">{h2(o.get("h2", "First, a little context"))}\n'
           f'<div style="margin-top:44px;display:flex;flex-wrap:wrap;gap:clamp(28px,4vw,56px);align-items:flex-start">'
           f'<div style="flex:1.6 1 360px;min-width:0">{h3(o["about_title"], "0")}{p(o["about"])}{h3(o.get("overview_title", "What I designed"), "36px 0 0")}{p(o["overview"])}</div>'
           f'<aside data-reveal="1" style="flex:1 1 240px;min-width:0;padding:6px 24px 10px;border-radius:18px;background:#F4F3F1;border:1px solid #E6E3DE">{facts}</aside></div>\n')
    nums = "".join(
        f'<div data-reveal="1" style="padding-top:18px;border-top:2px solid #1A1614"><div style="font:700 clamp(36px,4.4vw,56px)/1 {INTER};letter-spacing:-.04em;color:#1A1614">{e(v)}</div>'
        f'<div style="margin-top:10px;font:400 16px/1.5 {INTER};color:#55524D">{e(l)}</div></div>' for v, l in o["outcomes"])
    out += (f'<div style="margin-top:72px;font:600 13px {INTER};letter-spacing:.14em;text-transform:uppercase;color:#7A1E2C">Outcomes</div>'
            f'<div style="margin-top:20px;display:grid;grid-template-columns:{even_grid(len(o["outcomes"]), 180, "28px")};gap:28px">{nums}</div></section>')
    return out


def context(c):
    x = c["context"]
    out = f'<section id="context" style="padding-top:120px">{h2(x["h2"])}\n{p(x["lead"], "24px 0 0")}\n'
    if V(c, "personas") == "cards":
        pers = "".join(
            f'<div data-reveal="1" style="display:flex;gap:20px;align-items:center;padding:22px;border-radius:20px;border:1px solid #E6E3DE;background:#fff">{avatar(img, bg, 96)}'
            f'<div><div style="font:600 20px {INTER};color:#1A1614">{e(n)}</div><div style="margin-top:6px;font:400 16px/1.55 {INTER};color:#55524D">{e(d)}</div></div></div>'
            for img, bg, n, d in x["personas"])
        out += f'<div style="margin-top:48px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px">{pers}</div>\n'
        pers = None
    else:
        pers = "".join(
        f'<div data-reveal="1" style="display:grid;justify-items:center;align-content:start;text-align:center;gap:14px">{avatar(img, bg)}'
        f'<div style="font:600 20px {INTER};color:#3A3632">{e(n)}</div><div style="font:400 17px/1.55 {INTER};color:#55524D;max-width:340px">{e(d)}</div></div>'
        for img, bg, n, d in x["personas"])
    if pers:
        out += f'<div style="margin-top:64px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:48px">{pers}</div>\n'
    out += f'<div style="margin-top:88px;font:600 clamp(20px,2vw,24px)/1.4 {INTER};color:#3A3632">{e(x["leadin"])}</div>\n'
    for i, (t, b, img) in enumerate(x["rows"]):
        rev = ";flex-direction:row-reverse" if i % 2 else ""
        out += (f'<div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:24px 40px;align-items:center{rev}"><div style="flex:1 1 360px;min-width:0">'
                f'<div style="font:600 19px/1.4 {INTER};color:#1A1614">{e(t)}</div><p style="margin:6px 0 0;{BODY}">{e(b)}</p></div>'
                f'<div data-reveal="1" style="flex:0 1 240px;display:grid;place-items:center"><img src="assets/cs/{img}" alt="" style="display:block;width:100%;'
                f'max-width:240px;height:auto;mix-blend-mode:multiply"></div></div>\n')
    if x.get("diagram"):
        d = x["diagram"]
        srcs = "".join(
            f'<div style="display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06),0 0 0 1px #E6E3DE">'
            f'<span style="flex:none;width:26px;height:26px;border-radius:50%;background:#7A1E2C;color:#fff;display:grid;place-items:center;font:600 12px {INTER}">{chr(65+i)}</span>'
            f'<div><div style="font:600 15px {INTER};color:#1A1614">{e(t)}</div><div style="font:400 13px {INTER};color:#8A8680">{e(s)}</div></div></div>'
            for i, (t, s) in enumerate(d["sources"]))
        letter = chr(65 + len(d["sources"]))
        out += (f'<figure data-reveal="1" style="margin:40px 0 0;padding:clamp(24px,4vw,48px);border-radius:20px;background:#F4F3F1;border:1px solid #E6E3DE">'
                f'<div style="font:600 clamp(20px,2.2vw,24px) {INTER};letter-spacing:-.015em;color:#1A1614;margin-bottom:24px">{e(d["title"])}</div>'
                f'<div style="display:grid;grid-template-columns:minmax(0,1fr) 60px minmax(0,1fr);gap:12px;align-items:center"><div style="display:grid;gap:10px">'
                f'<div style="font:600 13px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#8A8680">{e(d["left_label"])}</div>{srcs}</div>'
                f'<svg viewBox="0 0 60 200" style="width:60px;height:200px" preserveAspectRatio="none"><path d="M2 30C30 30 30 100 56 100M2 75C30 75 30 100 56 100M2 125C30 125 30 100 56 100M2 170C30 170 30 100 56 100" '
                f'fill="none" stroke="#7A1E2C" stroke-width="1.6" stroke-dasharray="3 5" style="animation:dashflow 1.4s linear infinite"></path><path d="M50 95l7 5-7 5" fill="none" stroke="#7A1E2C" stroke-width="1.6"></path></svg>'
                f'<div style="display:grid;gap:10px"><div style="font:600 13px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#8A8680">{e(d["right_label"])}</div>'
                f'<div style="padding:18px;border-radius:14px;background:#1A1614;color:#fff;display:grid;gap:6px"><span style="width:26px;height:26px;border-radius:50%;background:#fff;color:#1A1614;'
                f'display:grid;place-items:center;font:600 12px {INTER}">{letter}</span><span style="font:600 17px {INTER}">{e(d["sink"])}</span>'
                f'<span style="font:400 14px/1.5 {INTER};color:#BDB8B1">{e(d["sink_note"])}</span></div></div></div></figure>\n')
    out += quote(x["pullquote"]) + "</section>"
    return out


def problem(c):
    x = c["problem"]
    out = f'<section id="problem" style="padding-top:120px">{h2(x["h2"])}\n{p(x["lead"], "24px 0 0")}\n'
    img, bg = x["avatar"]
    # The avatar shrinks on phones so the statement keeps a readable measure beside it (it used to wrap 1 to 2 words a line at 390px).
    out += (f'<div data-reveal="1" style="margin-top:72px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(16px,3vw,32px);align-items:center">{avatar(img, bg, "clamp(64px,18vw,150px)")}'
            f'<div style="position:relative;padding:clamp(18px,3.4vw,28px) clamp(18px,3.8vw,32px);border-radius:24px;background:#F4F3F1;border:1.5px solid #E6E3DE"><span style="position:absolute;left:-14px;top:50%;'
            f'width:26px;height:26px;background:#F4F3F1;border-left:1.5px solid #E6E3DE;border-bottom:1.5px solid #E6E3DE;transform:translateY(-50%) rotate(45deg)"></span>'
            f'<div style="font:600 13px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#7A1E2C">Problem statement</div>'
            f'<div style="margin-top:14px;font:600 clamp(20px,2.2vw,28px)/1.4 {INTER};letter-spacing:-.015em;color:#1A1614">{e(x["statement"])}</div>'
            f'<div style="margin-top:14px;font:400 15px {INTER};color:#8A8680">{e(x["statement_src"])}</div></div></div>\n')
    out += h3(x["issues_title"], "88px 0 0") + "\n"
    if V(c, "problem") == "rows":
        rows = ""
        for i, (lab, mock, t, b) in enumerate(x["issues"]):
            rev = "row-reverse" if i % 2 else "row"
            rows += (f'<div data-reveal="1" style="margin-top:40px;display:flex;flex-wrap:wrap;flex-direction:{rev};gap:24px 40px;align-items:center">'
                     f'<div style="flex:1 1 300px;min-width:0"><div style="font:600 13px {INTER};letter-spacing:.14em;color:#7A1E2C">{i+1:02d} · {e(lab)}</div>'
                     f'<div style="margin-top:12px;font:600 clamp(22px,2.2vw,28px)/1.25 {INTER};letter-spacing:-.015em;color:#1A1614">{e(t)}</div>'
                     f'<div style="margin-top:10px;font:400 18px/1.6 {INTER};color:#55524D">{e(b)}</div></div>'
                     f'<div style="flex:0 1 380px;min-width:0;padding:22px;border-radius:20px;background:{THEME["bg"]}">'
                     f'<div style="border-radius:12px;background:#fff;padding:12px;display:grid;gap:8px">{mock}</div></div></div>\n')
        return out + rows + "</section>"
    cards = ""
    for lab, mock, t, b in x["issues"]:
        cards += (f'<div data-reveal="1"><div style="padding:28px 24px 32px;border-radius:20px;background:linear-gradient(165deg,#D23E57 0%,#B42D42 50%,#97222F 100%);'
                  f'height:330px;box-sizing:border-box;overflow:hidden;display:grid;align-content:start;gap:24px"><div style="justify-self:center;font:600 14px {INTER};'
                  f'letter-spacing:.16em;color:#fff;padding-bottom:4px;border-bottom:1.5px solid rgba(255,255,255,.7)">{e(lab)}</div>'
                  f'<div style="padding:6px;border-radius:14px;background:rgba(255,255,255,.18)"><div style="border-radius:10px;background:#fff;padding:12px;display:grid;gap:8px">{mock}</div></div></div>'
                  f'<div style="margin-top:22px;min-height:2.5em;font:600 clamp(20px,2vw,24px)/1.25 {INTER};letter-spacing:-.015em;color:#1A1614">{e(t)}</div>'
                  f'<div style="margin-top:8px;font:400 18px/1.55 {INTER};color:#8A8680">{e(b)}</div></div>\n')
    out += (f'<div style="margin-top:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,{x.get("card_min",340)}px),1fr));gap:48px 28px">\n{cards}</div></section>')
    return out


def mock_row(a, b, color="#999"):
    return (f'<div style="display:grid;gap:2px;padding:8px 10px;border-radius:8px;background:#FAFAFA;text-align:left;font:400 12px {INTER};color:#333">'
            f'<span>{e(a)}</span><span style="color:{color}">{e(b)}</span></div>')


def research(c):
    x = c["research"]
    out = (f'<section id="research" style="padding-top:120px">{h2(x["h2"])}<img src="assets/cs/{x.get("img", "ill-bubbles.png")}" alt="" style="float:right;width:min(34%,210px);'
           f'margin:8px 0 8px 28px;mix-blend-mode:multiply">\n')
    out += p(x["p1"], "24px 0 0") + "\n" + p(x["p2"]) + "\n"
    cols = ""
    rots = (-0.6, 0.4, -0.3, 0.5)
    for (title, bg, notes) in x["notes"]:
        ns = "".join(
            f'<div data-reveal="1" style="padding:26px 28px;background:{bg};box-shadow:0 10px 24px -14px rgba(0,0,0,.25),0 1px 0 rgba(0,0,0,.04);transform:rotate({rots[i % 4]}deg)">'
            f'<div style="font:600 12px {INTER};letter-spacing:.14em;color:rgba(0,0,0,.45)">{e(x["note_label"])}</div>'
            f'<div style="margin-top:12px;font:400 22px/1.45 \'Kalam\',cursive;color:#1F1F1F">{e(n)}</div></div>' for i, n in enumerate(notes))
        cols += (f'<div><div style="font:600 22px {INTER};color:#1A1614">{e(title)}</div><div style="margin-top:20px;display:grid;gap:18px">{ns}</div></div>\n')
    if V(c, "research") == "wall":
        wall = ""
        k = 0
        for (title, bg, notes) in x["notes"]:
            for n in notes:
                wall += (f'<div data-reveal="1" style="padding:22px 22px 24px;background:{bg};box-shadow:0 10px 24px -14px rgba(0,0,0,.25);transform:rotate({rots[k % 4]}deg)">'
                         f'<div style="font:600 11px {INTER};letter-spacing:.14em;color:rgba(0,0,0,.45)">{e(title.upper())}</div>'
                         f'<div style="margin-top:10px;font:400 20px/1.4 \'Kalam\',cursive;color:#1F1F1F">{e(n)}</div></div>')
                k += 1
        cols = None
        n_notes = sum(len(ns) for _, _, ns in x["notes"])
        out += f'<div style="margin-top:48px;display:grid;grid-template-columns:{even_grid(n_notes, 190, "18px")};gap:18px">{wall}</div>\n'
    else:
        out += f'<div style="margin-top:48px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px">\n{cols}</div>\n'
    out += quote(x["quote"], x["quote_by"]) + "\n"
    out += (f'<div style="margin-top:56px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap">{h3(x.get("constraints_title", "Constraints I had to work with"), "0")}'
            f'<div data-reveal="1" style="flex:0 1 {x.get("constraints_img_w", 150)}px;margin-bottom:-8px"><img src="assets/cs/{x.get("constraints_img", "ill-clock.png")}" alt="" style="display:block;width:100%;max-width:{x.get("constraints_img_w", 150)}px;height:auto;mix-blend-mode:multiply"></div></div>\n')
    out += numbered_cards(x["constraints"]) + "</section>"
    return out


def stepper(labels, dark):
    circ = "rgba(255,255,255,.12)" if dark else "#1A1614"
    col = "#E9EDEF" if dark else "#1A1614"
    return ('<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px">' + "".join(
        f'<div style="display:grid;justify-items:center;gap:8px"><span style="width:26px;height:26px;border-radius:50%;background:{circ};color:#fff;display:grid;'
        f'place-items:center;font:600 12px {INTER}">{i+1}</span><span style="font:600 13px {INTER};color:{col}">{e(l)}</span></div>'
        for i, l in enumerate(labels)) + "</div>")


def bubble(text, when, out=False):
    bg, side = ("#005C4B", "end") if out else ("#202C33", "start")
    return (f'<div style="justify-self:{side};max-width:100%;padding:8px 10px 6px;border-radius:10px;background:{bg};color:#E9EDEF;font:400 12.5px/1.4 {INTER}">'
            f'{e(text)}<div style="margin-top:3px;text-align:right;font-size:10px;color:#8696A0">{e(when)}</div></div>')


def missed_call(who, note):
    return (f'<div style="padding:10px;border-radius:10px;background:#202C33;display:grid;gap:6px"><span style="display:flex;align-items:center;gap:8px;color:#E9EDEF;font:600 12.5px {INTER}">'
            f'<span style="width:24px;height:24px;border-radius:50%;background:#F15C6D;display:grid;place-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">'
            f'<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"></path></svg></span>{e(who)}</span>'
            f'<span style="color:#F15C6D;font:400 11.5px {INTER}">{e(note)}</span></div>')


def email(meta, subj, body):
    return (f'<div style="padding:10px;border-radius:10px;background:#202C33;color:#E9EDEF;font:400 12px/1.45 {INTER};display:grid;gap:4px">'
            f'<span style="color:#8696A0;font-size:10.5px">{e(meta)}</span><b style="font-weight:600">{e(subj)}</b><span style="color:#AEBAC1">{e(body)}</span></div>')


def pill_note(t):
    return f'<div style="justify-self:center;padding:4px 10px;border-radius:8px;background:#182229;color:#8696A0;font:500 10.5px {INTER}">{e(t)}</div>'


def panel_card(title, middle_html, button, disabled=False):
    btn = (f'<span style="justify-self:start;padding:6px 14px;border-radius:4px;border:1px solid rgb(195,201,212);color:rgb(142,150,163);font-size:12.5px">{e(button)}</span>'
           if disabled else
           f'<span style="justify-self:start;padding:6px 14px;border-radius:4px;background:rgb(0,63,152);color:#fff;font-weight:600;font-size:12.5px">{e(button)}</span>')
    return (f'<div style="padding:12px;border-radius:8px;background:#fff;box-shadow:0 0 0 1px rgb(230,235,242);display:grid;gap:10px;font:500 13px/1.4 {UI};color:rgb(39,40,41)">'
            f'<span style="font-weight:600">{e(title)}</span>{middle_html}{btn}</div>')


def design(c):
    x = c["design"]
    out = f'<section id="design" style="padding-top:120px">{h2(x["h2"])}\n{p(x["lead"], "24px 0 0")}\n'
    pr = "".join(
        f'<div data-reveal="1" style="padding:28px;border:1px solid #E6E3DE;border-radius:18px;background:#fff"><div style="font:600 26px {INTER};color:#1A1614">{i+1:02d}</div>'
        f'<div style="margin-top:12px;font:400 19px/1.5 {INTER};color:#55524D">{e(t)}</div></div>' for i, t in enumerate(x["principles"]))
    out += f'<div style="margin-top:32px;display:grid;grid-template-columns:{even_grid(len(x["principles"]), 200, "16px")};gap:16px">{pr}</div>\n'
    ba = x["before_after"]
    before_cols = "".join(f'<div style="display:grid;gap:8px">{col}</div>' for col in ba["before"])
    after_cols = "".join(ba["after"])
    out += (f'<figure data-reveal="1" style="margin:64px 0 0"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap">'
            f'<div style="font:600 clamp(20px,2.2vw,26px) {INTER};letter-spacing:-.015em;color:#1A1614">{e(ba["title"])}</div><div style="font:500 14px {INTER};color:#8A8680">Drag to compare</div></div>\n'
            f'<div style="margin-top:20px;overflow-x:auto;border-radius:20px"><div data-ba="1" style="--x:50%;position:relative;min-width:760px;display:grid;border-radius:20px;overflow:hidden;'
            f'box-shadow:0 0 0 1px #E6E3DE,0 30px 60px -30px rgba(0,0,0,.35);user-select:none;touch-action:pan-y;cursor:ew-resize">\n'
            f'<div style="grid-area:1/1;padding:26px 22px 60px;display:grid;gap:22px;align-content:start;background:#0B141A">{stepper(ba["stages"], True)}'
            f'<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;align-items:start">{before_cols}</div></div>\n'
            f'<div data-ba-after="1" style="grid-area:1/1;display:grid;clip-path:inset(0 0 0 var(--x));"><div style="grid-area:1/1;padding:26px 22px 28px;display:grid;gap:22px;'
            f'align-content:start;background:rgb(242,245,250)">{stepper(ba["stages"], False)}<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;'
            f'align-items:start">{after_cols}</div></div></div>\n'
            f'<span style="position:absolute;left:16px;bottom:14px;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.1);color:#E9EDEF;font:600 11px {INTER};'
            f'letter-spacing:.12em;pointer-events:none">{e(ba["before_badge"])}</span>\n'
            f'<span style="position:absolute;right:16px;bottom:14px;padding:5px 12px;border-radius:999px;background:#fff;color:rgb(0,63,152);font:600 11px {INTER};letter-spacing:.12em;'
            f'box-shadow:0 0 0 1px rgb(214,227,247);pointer-events:none">{e(ba["after_badge"])}</span>\n'
            '<div data-ba-handle="1" role="slider" tabindex="0" aria-label="Compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="position:absolute;top:0;bottom:0;left:var(--x);width:0;outline:none">'
            '<span style="position:absolute;top:0;bottom:0;left:-1.5px;width:3px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.35)"></span><span style="position:absolute;left:-22px;top:50%;width:44px;height:44px;margin-top:-22px;'
            'border-radius:50%;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.3);display:grid;place-items:center"><svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="#1A1614" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round"><path d="M7 2 2 7l5 5M15 2l5 5-5 5"></path></svg></span></div>\n'
            f'</div></div><figcaption style="margin-top:16px;font:400 15px/1.6 {INTER};color:#8A8680">{e(ba["caption"])}</figcaption></figure>')
    pq = c["proto"].replace(" ", "%20")
    pr = c.get("reel_ratio", 820)
    out += (f'<figure style="margin:56px 0 0"><button data-openproto="1" aria-label="Open the interactive prototype" style="display:block;width:100%;padding:0;border:0;background:none;'
            f'cursor:zoom-in;text-align:left"><div style="border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px #E6E3DE"><div data-vp="1" style="position:relative;aspect-ratio:1280/{pr};'
            f'overflow:hidden;background:#F2F5FA"><div data-scale="1" data-w="1280" style="position:absolute;left:0;top:0;width:1280px;height:{pr}px;transform-origin:0 0">'
            f'<iframe src="{pq}" title="Prototype preview" tabindex="-1" style="width:1280px;height:{pr}px;border:0;display:block;pointer-events:none"></iframe></div></div></div></button>'
            f'<figcaption style="margin-top:16px;font:400 17px/1.6 {INTER};color:#8A8680">{e(x["live_caption"])}</figcaption></figure></section>')
    return out


def persona_bubble(quote_text, img, bg, side):
    tail = "left:28px" if side == "left" else "right:28px"
    just = "start" if side == "left" else "end"
    return (f'<div data-reveal="1" style="display:grid;gap:12px;justify-items:{just};max-width:240px"><div style="position:relative;padding:16px 18px;border-radius:16px;background:#fff;'
            f'box-shadow:0 0 0 1px #E6E3DE,0 12px 24px -16px rgba(0,0,0,.25)"><div style="font:600 11px {INTER};letter-spacing:.12em;color:#7A1E2C">WHY IT FAILED</div>'
            f'<div style="margin-top:8px;font:500 16px/1.45 {INTER};color:#1A1614">{e(quote_text)}</div><span style="position:absolute;bottom:-7px;{tail};width:14px;height:14px;'
            f'background:#fff;transform:rotate(45deg);box-shadow:1px 1px 0 #E6E3DE"></span></div>{avatar(img, bg, 64)}</div>')


def mock_window(inner):
    return (f'<div style="flex:1 1 440px;min-width:0;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px #E6E3DE,0 30px 60px -30px rgba(0,0,0,.3)">'
            f'<div style="height:30px;display:flex;align-items:center;gap:6px;padding:0 12px;background:#F6F6F4;border-bottom:1px solid #E6E3DE"><span style="width:9px;height:9px;'
            f'border-radius:50%;background:#FF5F57"></span><span style="width:9px;height:9px;border-radius:50%;background:#FEBC2E"></span><span style="width:9px;height:9px;'
            f'border-radius:50%;background:#28C840"></span><span style="margin-left:auto;margin-right:auto;font:500 11px {INTER};color:#8A8680">Earlier exploration</span></div>'
            f'<div data-mockbody="1" style="position:relative;padding:18px;background:rgb(242,245,250);font:500 13px/1.45 {UI};color:rgb(39,40,41)">{inner}</div></div>')


def iterations(c):
    x = c["iterations"]
    faces = x.get("faces", (("av-beard.png", "#6FD6F2"), ("av-glasses.png", "#FCE46B")))
    out = (f'<section id="iterations" style="margin:120px calc(-1 * clamp(20px,4vw,48px)) 0;padding:96px clamp(20px,4vw,48px) 104px;background:#F4F3F1;border-radius:28px">'
           f'{h2(x["h2"])}<p style="margin:24px 0 0;font:400 clamp(17px,1.5vw,19px)/1.75 {INTER};color:#55524D">{e(x["lead"])}</p>\n')
    for it in x["items"]:
        out += (f'<article style="padding-top:88px"><h3 style="margin:0;font:600 clamp(22px,2.2vw,28px)/1.3 {INTER};letter-spacing:-.015em;color:#1A1614">{e(it["title"])}'
                f'<svg width="26" height="26" viewBox="0 0 24 24" style="flex:none;vertical-align:-4px;margin-left:8px"><path d="M5 5l14 14M19 5 5 19" stroke="#E5252A" stroke-width="3.4" '
                f'stroke-linecap="round"></path></svg></h3><p style="margin:14px 0 0;{BODY}">{e(it["why"])}</p>'
                f'<div style="margin-top:36px;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:center">'
                f'{persona_bubble(it["left"], *faces[0], "left")}{mock_window(it["mock"])}'
                f'{persona_bubble(it["right"], *faces[1], "right")}</div></article>\n')
    return out + "</section>"


def final(c):
    x = c["final"]
    out = f'<section id="final" style="padding-top:120px">{h2(x["h2"])}'
    for i, m in enumerate(x["moments"]):
        pad = "56px" if i == 0 else "104px"
        out += (f'<article id="m{i+1}" data-screen-label="Final {i+1}" style="padding-top:{pad}">{h3(f"{i+1}. " + m["title"], "0 0 0")}'
                + (grid_labels([("Problem", m["problem"]), ("Ruled out", m["ruled_out"]), ("Decision", m["did"]), ("Key detail", m["detail"])])
                   if V(c, "moments") == "grid" else
                   labelled_list([("Problem", m["problem"]), ("Ruled out", m["ruled_out"]), ("Decision", m["did"]), ("Key detail", m["detail"])]))
                + reel(f"m{i+1}", c["proto"], m["reel"], c.get("reel_ratio", 940)) + "</article>\n")
    ed = x["edge"]
    out += (f'<div style="padding-top:120px">{h2(ed["h2"])}<p style="margin:24px 0 0;{BODY}">{e(ed["lead"])}</p></div>\n')
    n = len(x["moments"]) + 1
    out += (f'<article id="edge" style="padding-top:48px">{h3(f"{n}. " + ed["title"], "0 0 0")}{labelled_list(ed["items"])}'
            + reel("edge", c["proto"], ed["reel"], c.get("reel_ratio", 940))
            + (f'<figcaption style="margin-top:14px;font:400 15px/1.6 {INTER};color:#8A8680">{e(ed["caption"])}</figcaption>' if ed.get("caption") else "")
            + "</article>\n")
    for j, (t, b) in enumerate(ed["more"]):
        out += (f'<article style="padding-top:{104 if j == 0 else 72}px">{h3(f"{n+1+j}. " + t, "0 0 0")}<p style="margin:16px 0 0;{BODY}">{e(b)}</p></article>\n')
    return out + "</section>"


def impact(c):
    x = c["impact"]

    def block(label, items, big):
        size = "clamp(38px,4.4vw,56px)" if big else "clamp(22px,2.2vw,28px)"
        cells = "".join(
            f'<div style="padding:0 clamp(16px,2.5vw,32px);border-left:1px solid rgba(255,255,255,.14)"><div style="font:600 {size}/1.1 {INTER};letter-spacing:-.03em;color:#fff">{e(v)}</div>'
            f'<div style="margin-top:14px;font:400 17px/1.6 {INTER};color:#B9B3AC">{e(l)}</div></div>' for v, l in items)
        return (f'<div style="padding:clamp(28px,4vw,48px)"><div style="font:600 13px {INTER};letter-spacing:.14em;color:#9C958D">{e(label)}</div>'
                f'<div style="margin-top:28px;margin-left:calc(-1 * clamp(16px,2.5vw,32px));display:grid;grid-template-columns:{even_grid(len(items), 150, "0px")};gap:40px 0">{cells}</div></div>')
    if V(c, "impact") == "light":
        def lblock(label, items, big):
            size = "clamp(38px,4.4vw,56px)" if big else "clamp(22px,2.2vw,28px)"
            cells = "".join(
                f'<div style="padding-top:16px;border-top:1px solid #D9D5CF"><div style="font:700 {size}/1.05 {INTER};letter-spacing:-.035em;color:#1A1614">{e(v)}</div>'
                f'<div style="margin-top:10px;font:400 16px/1.55 {INTER};color:#55524D">{e(l)}</div></div>' for v, l in items)
            # Wrapped in one div so the label sits 20px above its own numbers; as two grid children the 48px block gap
            # also landed between label and numbers, leaving each label closer to the block above it.
            return (f'<div><div style="font:600 13px {INTER};letter-spacing:.14em;color:#7A1E2C">{e(label)}</div>'
                    f'<div style="margin-top:20px;display:grid;grid-template-columns:{even_grid(len(items), 140, "24px")};gap:24px">{cells}</div></div>')
        return (f'<section id="impact" style="padding-top:120px">{h2(x["h2"])}<div data-reveal="1" style="margin-top:32px;padding:clamp(28px,4vw,48px);border-radius:24px;'
                f'background:#F4F3F1;border:1px solid #E6E3DE;display:grid;gap:48px">{lblock(x["big_label"], x["big"], True)}{lblock(x["small_label"], x["small"], False)}</div>\n'
                f'<p style="margin:32px 0 0;{BODY}">{e(x["closing"])}</p></section>')
    return (f'<section id="impact" style="padding-top:120px">{h2(x["h2"])}<div data-reveal="1" style="margin-top:32px;border-radius:24px;background:#1A1614;overflow:hidden">'
            f'{block(x["big_label"], x["big"], True)}<div style="height:1px;background:rgba(255,255,255,.12)"></div>{block(x["small_label"], x["small"], False)}</div>\n'
            f'<p style="margin:32px 0 0;{BODY}">{e(x["closing"])}</p></section>')


def lessons_next_footer(c):
    x = c["lessons"]
    nx = c["next"]
    return (f'<section id="lessons" style="padding-top:120px">{h2(x["h2"])}{labelled_list(x["items"], "16px 0 0")}\n'
            f'<div style="margin-top:96px">{h3("Next project", "0 0 0")}<a href="#" data-next="1" data-reveal="1" style="margin-top:20px;display:grid;gap:10px;padding:clamp(24px,4vw,36px);'
            f'border-radius:20px;border:1px solid #E6E3DE;background:#F4F3F1;color:#1A1614;text-decoration:none"><span style="font:600 13px {INTER};letter-spacing:.12em;color:#7A1E2C">'
            f'{e(nx["eyebrow"])}</span><span style="font:600 clamp(22px,2.4vw,28px)/1.3 {INTER};letter-spacing:-.02em">{e(nx["title"])}</span><span style="font:600 16px {INTER};'
            f'color:#7A1E2C">View full case study →</span></a></div>\n'
            f'<footer style="margin:96px 0 64px;font:400 14px {INTER};color:#8A8680">Screens redrawn with sample data. No client data shown.</footer></section></div></div>\n')


# ── blocks mode: cases without a prototype (TEMPLATE.md §11) ────────────────
# A case that sets "sections" (and no "proto") is built from generic blocks: the hero shows phone
# screens instead of the live prototype, the TOC is built from the sections, and the lightbox and
# "View prototype" buttons are removed. Use it for work that only exists as screens and boards.

LABEL = f"font:600 13px {INTER};letter-spacing:.14em;text-transform:uppercase;color:#7A1E2C"
SMALL = f"font:400 16px/1.6 {INTER};color:#55524D"


def phone(img, alt="", w=None, tilt=0):
    """A screen inside a plain black device frame. Screens are cropped inside their original bezel (no slivers),
    so the frame here is the only bezel and nothing is clipped."""
    st = f"width:{w}px;" if w else "width:100%;"
    rot = f"transform:rotate({tilt}deg);" if tilt else ""
    return (f'<div style="{st}max-width:100%;{rot}box-sizing:border-box;padding:3.2%;border-radius:13% / 6.2%;background:#0B0B0B;'
            f'box-shadow:0 0 0 1px rgba(255,255,255,.16),0 30px 60px -24px rgba(0,0,0,.6)">'
            f'<div style="border-radius:10% / 4.8%;overflow:hidden;background:#fff">'
            f'<img src="assets/{img}" alt="{html.escape(alt)}" loading="lazy" style="display:block;width:100%;height:auto"></div></div>')


def phones_panel(shots, cols=None, caption=None, minw=88):
    """A dot-textured panel holding rows of phone screens, each with an optional caption.
    `cols` is the most phones per row; on narrow screens rows drop to a divisor of the count (4 -> 2x2, 6 -> 3x2)
    and, with no `cols`, to the largest count that fits, with a short last row centred instead of left hanging.
    A single phone is capped at 280px and centred so it never fills a phone screen edge to edge."""
    n = len(shots)
    g = "var(--pg)"
    ks = ([k for k in range(cols, 1, -1) if n % k == 0] or [cols]) if cols else list(range(n, 1, -1))
    if ks[-1] != 2:
        ks.append(2)  # phones never stack one per row: at worst two, with an odd last one centred
    basis = fit_min(n, minw, g, ks) if n > 1 else "100%"
    one = "max-width:280px;" if n == 1 else ""
    cells = "".join(
        f'<figure style="margin:0;flex:0 0 {basis};{one}min-width:0;display:grid;gap:12px;align-content:start">{phone(img, cap or "")}'
        + (f'<figcaption style="font:400 14px/1.5 {INTER};color:rgba(255,255,255,.85)">{e(cap)}</figcaption>' if cap else "")
        + "</figure>" for img, cap in shots)
    out = (f'<figure data-reveal="1" style="margin:40px 0 0"><div style="padding:clamp(18px,3.4vw,44px);border-radius:22px;background:{THEME["bg"]};'
           f'box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)"><div style="--pg:clamp(14px,2.4vw,28px);display:flex;flex-wrap:wrap;justify-content:center;'
           f'gap:var(--pg);align-items:flex-start">{cells}</div></div>')
    if caption:
        out += f'<figcaption style="margin-top:14px;font:400 15px/1.6 {INTER};color:#8A8680">{e(caption)}</figcaption>'
    return out + "</figure>"


def blk(b):
    k = b[0]
    if k == "p":
        return p(b[1])
    if k == "lead":
        return p(b[1], "24px 0 0")
    if k == "h3":
        return h3(b[1])
    if k == "label":
        return f'<div style="margin-top:48px;{LABEL}">{e(b[1])}</div>'
    if k == "quote":
        return quote(b[1], b[2] if len(b) > 2 else None)
    if k == "cards":
        return numbered_cards(b[1], b[2] if len(b) > 2 else 300, pad=26)
    if k == "list":
        return labelled_list(b[1])
    if k == "bullets":
        lis = "".join(f'<li style="margin-top:12px;padding-left:4px;{BODY}">{e(t)}</li>' for t in b[1])
        return f'<ul style="margin:12px 0 0;padding-left:22px">{lis}</ul>'
    if k == "chips":
        cs = "".join(f'<span style="padding:8px 14px;border-radius:999px;background:#F4F3F1;border:1px solid #E6E3DE;font:500 15px {INTER};color:#3A3632">{e(t)}</span>' for t in b[1])
        return f'<div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:10px">{cs}</div>'
    if k == "stats":
        nums = "".join(
            f'<div data-reveal="1" style="padding-top:18px;border-top:2px solid #1A1614"><div style="font:700 clamp(36px,4.4vw,56px)/1 {INTER};letter-spacing:-.04em;color:#1A1614">{e(v)}</div>'
            f'<div style="margin-top:10px;{SMALL}">{e(l)}</div></div>' for v, l in b[1])
        return f'<div style="margin-top:40px;display:grid;grid-template-columns:{even_grid(len(b[1]), 140, "28px")};gap:28px">{nums}</div>'
    if k == "facts":
        fs = "".join(
            f'<div style="padding:14px 0;{"border-top:1px solid #E6E3DE" if i else ""}"><div style="font:600 12px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#8A8680">{e(a)}</div>'
            f'<div style="margin-top:6px;font:500 17px/1.5 {INTER};color:#1A1614">{e(v)}</div></div>' for i, (a, v) in enumerate(b[1]))
        return f'<aside data-reveal="1" style="margin-top:32px;padding:6px 24px 10px;border-radius:18px;background:#F4F3F1;border:1px solid #E6E3DE">{fs}</aside>'
    if k == "split":  # ("split", [left blocks], [right blocks], ratio)
        r = b[3] if len(b) > 3 else (1.5, 1)
        return (f'<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:clamp(24px,4vw,56px);align-items:flex-start">'
                f'<div style="flex:{r[0]} 1 340px;min-width:0">{"".join(blk(x) for x in b[1])}</div>'
                f'<div style="flex:{r[1]} 1 240px;min-width:0">{"".join(blk(x) for x in b[2])}</div></div>')
    if k == "personas":  # (initials or a face image file, disc colour, name, one line, [(label, text)])
        cards = ""
        for ini, bg, n, line, rows in b[1]:
            face = ini.lower().endswith((".png", ".webp", ".jpg"))
            det = "".join(f'<div style="margin-top:16px"><div style="font:600 12px {INTER};letter-spacing:.12em;text-transform:uppercase;color:#8A8680">{e(a)}</div>'
                          f'<div style="margin-top:6px;font:400 16px/1.6 {INTER};color:#3A3632">{e(v)}</div></div>' for a, v in rows)
            # 22px padding and a 52px disc keep a "Name, 22" line on one row when three cards share the 900px column.
            cards += (f'<div data-reveal="1" style="padding:22px;border-radius:20px;border:1px solid #E6E3DE;background:#fff">'
                      f'<div style="display:flex;gap:14px;align-items:center">'
                      + (f'<img src="assets/{ini}" alt="" style="flex:none;width:52px;height:52px;border-radius:50%;object-fit:cover;background:{bg};box-shadow:0 0 0 1px #E6E3DE">' if face else
                         f'<span style="flex:none;width:52px;height:52px;border-radius:50%;background:{bg};display:grid;place-items:center;font:600 18px {INTER};color:#1A1614">{e(ini)}</span>')
                      + f'<div><div style="font:600 20px {INTER};color:#1A1614">{e(n)}</div>'
                      f'<div style="margin-top:4px;font:400 15px/1.5 {INTER};color:#55524D">{e(line)}</div></div></div>{det}</div>')
        return f'<div style="margin-top:40px;display:grid;grid-template-columns:{even_grid(len(b[1]), 260)};gap:20px">{cards}</div>'
    if k == "notes":  # sticky-note wall: [(tag, colour, text)]
        rots = (-0.6, 0.4, -0.3, 0.5)
        ns = "".join(
            f'<div data-reveal="1" style="padding:22px 22px 24px;background:{bg};box-shadow:0 10px 24px -14px rgba(0,0,0,.25);transform:rotate({rots[i % 4]}deg)">'
            f'<div style="font:600 11px {INTER};letter-spacing:.14em;color:rgba(0,0,0,.45)">{e(tag.upper())}</div>'
            f'<div style="margin-top:10px;font:400 20px/1.4 \'Kalam\',cursive;color:#1F1F1F">{e(t)}</div></div>' for i, (tag, bg, t) in enumerate(b[1]))
        return f'<div style="margin-top:40px;display:grid;grid-template-columns:{even_grid(len(b[1]), 200, "18px")};gap:18px">{ns}</div>'
    if k == "columns":  # [(title, [items])], e.g. SWOT, KANO, inventory
        cols = "".join(
            f'<div data-reveal="1" style="padding:22px 24px;border-radius:18px;background:#F4F3F1;border:1px solid #E6E3DE"><div style="font:600 18px {INTER};color:#1A1614">{e(t)}</div>'
            f'<ul style="margin:12px 0 0;padding-left:18px;color:#8A8680">' + "".join(f'<li style="margin-top:8px;font:400 15.5px/1.55 {INTER};color:#3A3632">{e(it)}</li>' for it in items)
            + "</ul></div>" for t, items in b[1])
        minw = b[2] if len(b) > 2 else 230
        return f'<div style="margin-top:32px;display:grid;grid-template-columns:{even_grid(len(b[1]), minw, "16px")};gap:16px">{cols}</div>'
    if k == "steps":  # a horizontal journey / flow: [(title, text)]
        n = len(b[1])
        cells = "".join(
            f'<div data-reveal="1" style="position:relative;padding:22px 20px;border-radius:18px;background:#1A1614;color:#fff">'
            f'<div style="font:600 13px {INTER};letter-spacing:.1em;color:#BDB8B1">{i+1:02d}</div><div style="margin-top:10px;font:600 18px/1.3 {INTER}">{e(t)}</div>'
            + (f'<div style="margin-top:8px;font:400 15px/1.55 {INTER};color:#BDB8B1">{e(d)}</div>' if d else "") + "</div>"
            for i, (t, d) in enumerate(b[1]))
        return f'<div style="margin-top:32px;display:grid;grid-template-columns:{even_grid(n, 170 if n > 4 else 210, "12px")};gap:12px">{cells}</div>'
    if k == "tree":  # IA / flow as a root and branches: (root, [(branch, [leaves])])
        root, branches = b[1], b[2]
        br = "".join(
            f'<div style="padding:16px 18px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px #E6E3DE"><div style="font:600 16px {INTER};color:#1A1614">{e(t)}</div>'
            + ("".join(f'<div style="margin-top:6px;font:400 14.5px/1.5 {INTER};color:#55524D">{e(x)}</div>' for x in leaves)) + "</div>"
            for t, leaves in branches)
        return (f'<figure data-reveal="1" style="margin:32px 0 0;padding:clamp(20px,3.4vw,40px);border-radius:20px;background:#F4F3F1;border:1px solid #E6E3DE">'
                f'<div style="display:inline-block;padding:10px 16px;border-radius:12px;background:#1A1614;color:#fff;font:600 15px {INTER}">{e(root)}</div>'
                f'<div style="margin:14px 0 0 18px;padding-left:18px;border-left:2px dashed #C9C4BD;display:grid;grid-template-columns:{even_grid(len(branches), 190, "12px")};gap:12px">{br}</div></figure>')
    if k == "palette":  # [(hex, name, note)]
        sw = "".join(
            f'<div data-reveal="1"><div style="height:88px;border-radius:14px;background:{hx};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></div>'
            f'<div style="margin-top:10px;font:600 15px {INTER};color:#1A1614">{e(n)}</div><div style="font:500 13px {INTER};color:#8A8680">{e(hx.upper())}</div>'
            + (f'<div style="margin-top:6px;font:400 14px/1.5 {INTER};color:#55524D">{e(note)}</div>' if note else "") + "</div>"
            for hx, n, note in b[1])
        return f'<div style="margin-top:28px;display:grid;grid-template-columns:{even_grid(len(b[1]), 96, "20px")};gap:20px">{sw}</div>'
    if k == "phones":  # ("phones", [(img, caption)], cols, caption)
        return phones_panel(b[1], b[2] if len(b) > 2 else None, b[3] if len(b) > 3 else None)
    if k == "row":  # text beside one or two phones: ("row", [blocks], [(img, cap)], reverse)
        rev = "row-reverse" if len(b) > 3 and b[3] else "row"
        ph = phones_panel(b[2], len(b[2])).replace('margin:40px 0 0', 'margin:0', 1)
        return (f'<div style="margin-top:40px;display:flex;flex-wrap:wrap;flex-direction:{rev};gap:28px clamp(28px,4vw,56px);align-items:center">'
                f'<div style="flex:1.2 1 320px;min-width:0">{"".join(blk(x) for x in b[1])}</div>'
                f'<div style="flex:1 1 {260 if len(b[2]) == 1 else 360}px;min-width:0;max-width:{380 if len(b[2]) == 1 else 560}px">{ph}</div></div>')
    if k == "moment":  # ("moment", title, [(label, text)], [(img, cap)])
        return (f'<article data-reveal="1" style="padding-top:88px">{h3(b[1], "0 0 0")}{grid_labels(b[2])}'
                + phones_panel(b[3], b[4] if len(b) > 4 else None) + "</article>")
    if k == "ill":  # ("ill", image, max width px): a decorative line illustration, centred
        w = b[2] if len(b) > 2 else 280
        return (f'<figure data-reveal="1" style="margin:40px auto 0;max-width:{w}px"><img src="assets/{b[1]}" alt="" '
                f'style="display:block;width:100%;height:auto;mix-blend-mode:multiply"></figure>')
    if k == "aside":  # ("aside", [text blocks], image, width px): text with a line illustration beside it, centred on it
        w = b[3] if len(b) > 3 else 240
        first = 'style="margin-top:' in "".join(blk(x) for x in b[1][:1])
        return (f'<div style="margin-top:28px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:24px clamp(28px,4vw,56px)">'
                f'<div class="cs-aside-text" style="flex:1 1 380px;min-width:0">{"".join(blk(x) for x in b[1])}</div>'
                f'<img data-reveal="1" src="assets/{b[2]}" alt="" style="flex:0 1 {w}px;width:{w}px;max-width:min(100%,64vw);height:auto;mix-blend-mode:multiply"></div>'
                '<style>.cs-aside-text>:first-child{margin-top:0!important}</style>')
    if k == "html":
        return b[1]
    raise SystemExit(f"Unknown block type {k!r}")


def sections_body(c):
    out = ""
    for s in c["sections"]:
        style = "padding-top:120px"
        if s.get("panel"):
            style = ("margin:120px calc(-1 * clamp(20px,4vw,48px)) 0;padding:96px clamp(20px,4vw,48px) 104px;background:#F4F3F1;border-radius:28px")
        head = h2(s["h2"]) if s.get("h2") else ""
        if s.get("ill"):  # ("image", width px): a line illustration on the right of the section title
            img, w = s["ill"]
            head = (f'<div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 32px">'
                    f'<div style="flex:1 1 380px;min-width:0">{head}</div><img data-reveal="1" src="assets/{img}" alt="" '
                    f'style="flex:0 1 {w}px;width:{w}px;max-width:min(100%,62vw);height:auto;mix-blend-mode:multiply"></div>')
        out += (f'<section id="{s["id"]}" style="{style}">' + head
                + "".join(blk(b) for b in s["blocks"]) + "</section>\n")
    nx = c["next"]
    nxt = ""
    if nx:
        nxt = (f'<div style="margin-top:120px">{h3("Next project", "0 0 0")}<a href="#" data-next="1" data-reveal="1" style="margin-top:20px;display:grid;gap:10px;padding:clamp(24px,4vw,36px);'
               f'border-radius:20px;border:1px solid #E6E3DE;background:#F4F3F1;color:#1A1614;text-decoration:none"><span style="font:600 13px {INTER};letter-spacing:.12em;color:#7A1E2C">'
               f'{e(nx["eyebrow"])}</span><span style="font:600 clamp(22px,2.4vw,28px)/1.3 {INTER};letter-spacing:-.02em">{e(nx["title"])}</span><span style="font:600 16px {INTER};'
               f'color:#7A1E2C">View full case study →</span></a></div>\n')
    return (out + nxt + f'<footer style="margin:96px 0 64px;font:400 14px {INTER};color:#8A8680">{e(c.get("footer", "Screens redrawn with sample data. No client data shown."))}</footer></div></div>\n')


def blocks_head(head, c):
    """Swap the hero's live prototype for phone screens and rebuild the TOC from the sections."""
    shots = c["hero_phones"]
    n = len(shots)
    mid = n // 2
    ph = "".join(
        f'<div style="flex:0 1 {330 if i == mid else 290}px;min-width:0;margin-top:{0 if i == mid else 48}px">{phone(img, alt)}</div>'
        for i, (img, alt) in enumerate(shots))
    hero = (f'</h1></div>\n<div style="position:relative;max-width:1060px;margin:clamp(40px,6vw,72px) auto 0;display:flex;justify-content:center;align-items:flex-start;'
            f'gap:clamp(12px,2.6vw,32px);padding:0 4px;height:clamp(260px,46vw,560px);overflow:hidden">{ph}</div></header>')
    head = re.sub(r"</h1></div>\s*<div style=\"position:relative;max-width:1060px.*?</header>", lambda m: hero, head, count=1, flags=re.S)
    toc = [(s["id"], s["toc"]) for s in c["sections"] if s.get("toc")]

    def rebuild(m):
        one = re.search(r'<a href="#overview" data-toc="overview".*?</a>', m.group(0), re.S).group(0)
        return m.group(1) + "".join(one.replace("#overview", f"#{i}").replace('data-toc="overview"', f'data-toc="{i}"').replace("Overview</a>", f"{html.escape(t)}</a>")
                                    for i, t in toc) + "</nav>"
    head = re.sub(r'(<nav[^>]*>)<a href="#overview".*?</nav>', rebuild, head, flags=re.S)
    head = re.sub(r'<button data-openproto="1".*?</button>', "", head, flags=re.S)
    return head


SHOW = 0.6  # Pranita, 2026-10-08: the hero frame rises out of the bottom edge, about 60% of it visible


def crop_hero(head, ratio, show=SHOW):
    """Hero frame bleeds off the bottom of the header: open bottom edge, a window showing `show` of the full frame."""
    head = head.replace('margin:clamp(40px,6vw,72px) auto clamp(48px,6vw,88px)"><div style="padding:10px;border-radius:24px;',
                        'margin:clamp(40px,6vw,72px) auto 0"><div style="padding:10px 10px 0;border-radius:24px 24px 0 0;', 1)
    head = head.replace('border-radius:16px;overflow:hidden;background:#fff"><div data-hero-static',
                        'border-radius:16px 16px 0 0;overflow:hidden;background:#fff"><div data-hero-static', 1)
    head = head.replace('border-radius:16px 16px 0 0;overflow:hidden;background:#fff;max-height:clamp(260px,46vw,560px)',
                        'border-radius:16px 16px 0 0;overflow:hidden;background:#fff', 1)
    head = head.replace('border-radius:16px 16px 0 0;overflow:hidden;background:#fff"><div data-hero-static',
                        f'border-radius:16px 16px 0 0;overflow:hidden;background:#fff;aspect-ratio:1280/{round(ratio * show)}"><div data-hero-static', 1)
    i = head.index('<div data-hero-static="1">'); j = head.index('</header>', i)
    hero = head[i:j].replace('aspect-ratio:1280/720', f'aspect-ratio:1280/{ratio}').replace('height:720px', f'height:{ratio}px')
    return head[:i] + hero + head[j:]


def export_hero(head, ratio):
    """Pranita, 2026-10-09 (supersedes crop_hero/fold_hero): every case uses the hero from her Trips export exactly,
    which is the reference page's own hero: centred label at .75 white and H1, then a 1060px frame with a 10px translucent
    bezel, open at the bottom and cut by max-height clamp(260px,46vw,560px); the coloured header ends at the cut. Only
    the prototype canvas height changes per case."""
    i = head.index('<div data-hero-static="1">'); j = head.index('</header>', i)
    hero = head[i:j].replace('aspect-ratio:1280/720', f'aspect-ratio:1280/{ratio}').replace('height:720px', f'height:{ratio}px')
    return head[:i] + hero + head[j:]


HERO_W = "min(1440px,100%)"  # superseded 2026-10-09 by export_hero; kept for reference


def fold_hero(head):
    """Pranita, 2026-10-09 (supersedes the 2026-10-08 full-screen fold): every case opens on the same hero. Label and
    headline on the theme colour, then a wide mockup cut at 60% of its height; the coloured header ends exactly at
    that cut, on any screen size. Desktop frames get the 60% window from crop_hero; phone heroes size their window to
    60% of the centre phone."""
    # header: no full-viewport height, so the colour stops where the mockup is cut
    head = head.replace('overflow:hidden;padding:clamp(56px,7vw,96px) clamp(16px,4vw,48px) 0;text-align:center">',
                        'overflow:hidden;padding:clamp(48px,8vh,112px) clamp(16px,4vw,48px) 0;text-align:center">', 1)
    # desktop frame: wider, thicker translucent bezel
    head = head.replace('<div style="position:relative;max-width:1060px;margin:clamp(40px,6vw,72px) auto 0"><div style="padding:10px 10px 0;',
                        f'<div style="position:relative;width:100%;max-width:{HERO_W};margin:clamp(32px,6vh,72px) auto 0">'
                        '<div style="padding:clamp(8px,1.2vw,16px) clamp(8px,1.2vw,16px) 0;', 1)
    # phone heroes: bigger phones; the window is 60% of the centre phone (phone frame is about 1:2.17)
    head = head.replace('max-width:1060px;margin:clamp(40px,6vw,72px) auto 0;display:flex;', 'max-width:1240px;width:100%;margin:clamp(32px,6vh,72px) auto 0;display:flex;', 1)
    head = head.replace('padding:0 4px;height:min(330px,36vw);overflow:hidden">', 'padding:0 4px;height:min(430px,37vw);overflow:hidden">', 1)
    head = head.replace('flex:0 1 210px;min-width:0;margin-top:40px', 'flex:0 1 290px;min-width:0;margin-top:clamp(24px,4vw,56px)')
    head = head.replace('flex:0 1 240px;min-width:0;margin-top:0px', 'flex:0 1 330px;min-width:0;margin-top:0px')
    # Tall frames (e.g. 1280x1010) would push the cut below the fold at full width: cap the width so the 60% window
    # is never taller than about half the screen.
    m = re.search(r'aspect-ratio:1280/(\d+)"><div data-hero-static', head)
    if m and int(m.group(1)) > 500:
        head = head.replace(f'max-width:{HERO_W};margin:clamp(32px,6vh,72px) auto 0">',
                            f'max-width:min({HERO_W},calc(52vh * 1280 / {m.group(1)}) + 32px);margin:clamp(32px,6vh,72px) auto 0">', 1)
    return head


AA_GREYS = (("#8A8680", "#6F6B66"), ("#A4A09A", "#726E69"))


LIVE_SITE = "https://gray-football-641289.framer.app"  # the published Framer site


TOP_NAV = """    if (a.hasAttribute("data-back") || a.hasAttribute("data-next")) {
      e.preventDefault();
      // The page usually runs inside the Framer site's iframe. Navigate that top window, using the parent's own
      // origin (document.referrer) so a domain change needs no rebuild; SITE is the fallback for direct visits.
      var framed = window.top !== window, base = SITE;
      try { if (framed && document.referrer) base = new URL(document.referrer).origin; } catch (_) {}
      var dest = a.hasAttribute("data-next") ? base + "NEXT_PATH" : base + "/#work";
      if (!framed && a.hasAttribute("data-back") && document.referrer && new URL(document.referrer).origin === base) { history.back(); return; }
      (framed ? window.top : window).location.href = dest;
    }"""


WIRING = """<script>
/* Portfolio wiring. Go back = the Framer site's main page; Next project = the next case. The links get real
   hrefs with target=_top, so they work even if a click handler never runs. The parent page's own origin
   (document.referrer) wins over SITE, so a domain change needs no rebuild; the Framer editor preview is ignored. */
(function(){
  var SITE = "__SITE__", NEXT = "__NEXT__", base = SITE;
  try {
    var r = document.referrer && new URL(document.referrer);
    if (r && /^https?:$/.test(r.protocol) && r.hostname !== location.hostname && !/(^|\\.)framer(canvas)?\\.com$/.test(r.hostname)) base = r.origin;
  } catch (_) {}
  function dest(a){ return a.hasAttribute("data-next") ? base + NEXT : base + "/"; }
  function wire(){ document.querySelectorAll("a[data-back],a[data-next]").forEach(function(a){ if (a.getAttribute("href") !== dest(a)) { a.href = dest(a); a.target = "_top"; } }); }
  wire();
  new MutationObserver(wire).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[data-back],a[data-next]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    e.stopPropagation();
    var href = dest(a);
    if (window.top === window) { location.href = href; return; }
    // The Framer frame (CaseStudyFrame) answers "pf-nav-ok" and switches the page without reloading the site.
    // No answer within 400ms (an older frame, the editor): load the whole page instead.
    var done = false;
    function ack(ev){ if (ev.data && ev.data.type === "pf-nav-ok") done = true; }
    window.addEventListener("message", ack);
    try { window.parent.postMessage({ type: "pf-nav", href: href }, "*"); } catch (_) {}
    setTimeout(function(){
      window.removeEventListener("message", ack);
      if (done) return;
      try { window.top.location.href = href; } catch (_) { window.open(href, "_top"); }
    }, 400);
  }, true);
})();
</script>"""


def finalize(page, site, next_path):
    """Last pass on a finished page (also run on the hosted Trips bundle): robust back/next wiring, and nothing
    heavy loads before it is needed. Only the first prototype frame (the hero) and the first two images load
    eagerly; the other prototype frames, each a full app, wait until they scroll near the screen."""
    m = re.search(r'<script>\s*/\* Portfolio wiring\..*?</script>', page, re.S)
    w = WIRING.replace("__SITE__", site).replace("__NEXT__", next_path)
    page = page[:m.start()] + w + page[m.end():] if m else page.replace("</body>", w + "\n</body>", 1)
    # Go back is a text link; give it a 44px-tall tap area without changing how it looks
    if 'id="pf-tap"' not in page:
        page = page.replace("</head>", '<style id="pf-tap">a[data-back]{display:inline-flex;align-items:center;min-height:44px}</style>\n</head>', 1)
    n = [0]
    def lazy_iframe(mm):
        n[0] += 1
        tag = mm.group(0)
        return tag if n[0] == 1 or "loading=" in tag else tag.replace("<iframe ", '<iframe loading="lazy" ', 1)
    page = re.sub(r"<iframe [^>]*>", lazy_iframe, page)
    k = [0]
    def lazy_img(mm):
        k[0] += 1
        tag = mm.group(0)
        return tag if k[0] <= 2 or "loading=" in tag else tag.replace("<img ", '<img loading="lazy" decoding="async" ', 1)
    page = re.sub(r"<img [^>]*>", lazy_img, page)
    return page


# ── assemble ────────────────────────────────────────────────────────────────

def build(content_path):
    content_path = pathlib.Path(content_path).resolve()
    spec = importlib.util.spec_from_file_location("content", content_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    c = mod.CASE

    start = REF.index('<div style="max-width:900px;min-width:0">') + len('<div style="max-width:900px;min-width:0">')
    end = REF.index('<div data-lightbox="1"')
    head, tail = REF[:start], REF[end:]

    blocks_mode = "sections" in c
    old_proto = "Valmo%20Trips%20Prototype.dc.html"
    if not blocks_mode:
        new_proto = c["proto"].replace(" ", "%20")
        head = head.replace(old_proto, new_proto)
        tail = tail.replace(old_proto, new_proto)
    else:
        tail = tail[tail.index("</main>"):]  # no prototype, so no lightbox
    # hero copy, page title, meta, unused hero dots
    head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(c['title'])}</title>", head, count=1)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(c["description"])}">', head, count=1)
    head = head.replace("VALMO · TRIPS PANEL FOR TRANSPORTERS", html.escape(c["eyebrow"]), 1)
    h1 = "<br>".join(html.escape(l) for l in c["h1_lines"]) if c.get("h1_lines") else html.escape(c["h1"])
    head = head.replace("Getting truck owners paid, without a single phone call", h1, 1)
    head = re.sub(r'<div style="display:none"><button data-dot=.*?</div></div></div></div></div></header>',
                  '</div></div></div></div></header>', head, count=1, flags=re.S)
    tail = tail.replace("Built from the Valmo Figma components, with sample data", html.escape(c.get("lightbox_sub", "")))
    tail = tail.replace("Valmo Trips prototype, full screen", "Prototype, full screen")
    head = head.replace('title="Valmo Trips prototype"', 'title="Prototype"')
    # Next-project target path for the wiring script
    nav_old = re.search(r'    if \(a\.hasAttribute\("data-back"\)\) \{.*?location\.href = SITE \+ "/contract-panel";\n    \}', tail, re.S)
    next_path = (c.get("next") or {}).get("path", "")
    tail = tail.replace(nav_old.group(0), TOP_NAV.replace("NEXT_PATH", next_path)) if nav_old else tail
    tail = tail.replace('var SITE = "";', f'var SITE = "{c.get("site", LIVE_SITE)}";', 1)

    if blocks_mode:
        head = blocks_head(head, c)
    else:
        head = export_hero(head, c.get("reel_ratio", 720))
    # Phones: the "Earlier exploration" mock windows are laid out for ~440px. Narrower than that they clipped their
    # right-hand column (buttons, amounts), so below 520px the mock is zoomed to fit instead of cut.
    head = head.replace("</style>", "\n@media (max-width:520px){[data-mockbody]{zoom:.78}}</style>", 1)
    th = THEMES.get(c.get("theme", "blue"), THEMES["blue"])
    THEME["bg"] = th["bg"]
    head = head.replace("background:linear-gradient(180deg,#2F78CF 0%,#1556B0 55%,#0E449A 100%)", "background:" + th["hero"], 1)
    if V(c, "hero") == "left":
        head = head.replace("overflow:hidden;padding:clamp(56px,7vw,96px) clamp(16px,4vw,48px) 0;text-align:center", "overflow:hidden;padding:clamp(56px,7vw,96px) clamp(16px,4vw,48px) 0;text-align:left", 1)
        head = head.replace('<h1 style="margin:22px auto 0;max-width:980px;', '<h1 style="margin:22px 0 0;max-width:820px;', 1)
        # Left-aligned copy shares the device frame's 1060px column, so eyebrow, H1, meta and frame start on one edge
        # (with 1100px the text sat 20px left of the frame).
        head = head.replace('<div style="position:relative;max-width:1100px;margin:0 auto">', '<div style="position:relative;max-width:1060px;margin:0 auto">', 1)
        # Labels at .8 white: .55 measured 3.2:1 on the violet hero (fails AA for 11px text); .8 is 5.0:1 or better on every theme.
        # Below ~560px the items stack instead of wrapping 2+1.
        meta = "".join(f'<span style="display:grid;gap:4px;min-width:min(100%,max(0px,calc((560px - 100%) * 999)))"><span style="font:600 11px {INTER};letter-spacing:.14em;color:rgba(255,255,255,.8)">{html.escape(k.upper())}</span>'
                       f'<span style="font:500 15px {INTER};color:#fff">{html.escape(v)}</span></span>' for k, v in c.get("hero_meta", []))
        head = head.replace(html.escape(c["h1"]) + "</h1></div>", html.escape(c["h1"]) + f'</h1><div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:16px 40px">{meta}</div></div>', 1)
    if blocks_mode:
        body = sections_body(c)
    else:
        body = "".join([overview(c), context(c), problem(c), research(c), design(c), iterations(c), final(c), impact(c), lessons_next_footer(c)])
    page = head + body + tail
    # WCAG AA (Pranita's floor): the reference greys #8A8680 (3.6:1) and #A4A09A (2.6:1) fail for text.
    for a, b in AA_GREYS:
        page = page.replace(a, b)
    if "—" in page:
        bad = [m.start() for m in re.finditer("—", page)][:5]
        raise SystemExit(f"Em dash found at {bad}: {[page[max(0,i-60):i+20] for i in bad]}")
    page = finalize(page, c.get("site", LIVE_SITE), next_path)
    out = content_path.parent / "index.html"
    out.write_text(page, encoding="utf-8")
    print(f"wrote {out} ({len(page):,} bytes)")


if __name__ == "__main__":
    build(sys.argv[1])
