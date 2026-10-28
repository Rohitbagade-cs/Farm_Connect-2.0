from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import imageio

W, H = 1920, 1080
FPS = 30
OUT = Path(__file__).resolve().parents[1]
WORK = OUT / 'work'
WORK.mkdir(exist_ok=True, parents=True)

GREEN_DARK = (26, 60, 46)
GREEN_MID = (45, 106, 79)
GREEN_LIGHT = (82, 183, 136)
GREEN_PALE = (216, 243, 220)
AMBER = (233, 168, 37)
AMBER_LIGHT = (254, 243, 199)
OFF_WHITE = (248, 249, 247)
TEXT = (42, 52, 42)
MUTED = (92, 107, 90)
WHITE = (255, 255, 255)
CARD = (255, 255, 255)
OUTLINE = (226, 230, 227)


def load_font(size, bold=False):
    candidates = [
        'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/calibril.ttf',
        'C:/Windows/Fonts/times.ttf',
        'C:/Windows/Fonts/segoeui.ttf',
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except Exception:
            pass
    return ImageFont.load_default()


def rounded_box(draw, xy, width, height, radius, fill, outline=None, outline_width=1):
    draw.rounded_rectangle((xy[0], xy[1], xy[0] + width, xy[1] + height), radius=radius, fill=fill, outline=outline, width=outline_width)


def gradient_background(base):
    img = np.zeros((H, W, 3), dtype=np.uint8)
    y = np.linspace(0, 1, H)[:, None]
    x = np.linspace(0, 1, W)[None, :]
    r = (base[0] * (1 - x * 0.25) + 255 * (x * 0.35)).astype(np.uint8)
    g = (base[1] * (1 - y * 0.25) + 255 * (y * 0.15)).astype(np.uint8)
    b = (base[2] * (1 - y * 0.15) + 255 * (0.12 + x * 0.08)).astype(np.uint8)
    img[:, :, 0] = r
    img[:, :, 1] = g
    img[:, :, 2] = b
    return Image.fromarray(img, 'RGB')


def make_scene_1(p):
    bg = gradient_background(np.array([216, 243, 220]))
    draw = ImageDraw.Draw(bg)
    # soft organic forms
    for i, (x, y, s, c) in enumerate([
        (1500, 180, 420, (255, 255, 255)),
        (1660, 770, 320, (255, 243, 199)),
        (300, 830, 280, (216, 243, 220)),
    ]):
        draw.ellipse((x - s // 2, y - s // 2, x + s // 2, y + s // 2), fill=c)

    title_font = load_font(140, bold=True)
    tag_font = load_font(28)
    body_font = load_font(42)
    cap_font = load_font(72)

    tag = '🌱 AGRICULTURAL PLATFORM'
    draw.text((122, 160), tag, font=tag_font, fill=GREEN_MID)

    # use real project naming
    draw.text((120, 220), 'Farm', font=title_font, fill=GREEN_DARK)
    draw.text((120, 330), 'Connect', font=title_font, fill=GREEN_LIGHT)
    draw.text((120, 510), 'Farm owners and suppliers', font=body_font, fill=MUTED)
    draw.text((120, 560), 'work from one connected system.', font=body_font, fill=MUTED)

    # CTA
    rounded_box(draw, (120, 660), 260, 70, 18, GREEN_MID)
    draw.text((170, 680), 'Get Started', font=load_font(28), fill=WHITE)
    rounded_box(draw, (400, 660), 220, 70, 18, (255, 255, 255), outline=(82, 183, 136), outline_width=3)
    draw.text((470, 680), 'Sign In', font=load_font(28), fill=GREEN_MID)

    # floating cards in right panel
    cards = [
        ('🐄', 'Livestock', 'Add & track herd'),
        ('🌾', 'Feeds', 'Supplier listings'),
        ('💊', 'Medicines', 'Inventory ready'),
        ('📋', 'Requests', 'Farm orders'),
    ]
    for idx, (emoji, title, sub) in enumerate(cards):
        offset = idx * 60
        x = 1220 + (idx % 2) * 270
        y = 170 + (idx // 2) * 180 + (np.sin((p + idx) * 4) * 16)
        rounded_box(draw, (int(x), int(y)), 220, 170, 26, WHITE, outline=OUTLINE, outline_width=2)
        draw.text((int(x + 80), int(y + 26)), emoji, font=load_font(60), fill=GREEN_MID)
        draw.text((int(x + 26), int(y + 108)), title, font=load_font(30, bold=True), fill=GREEN_DARK)
        draw.text((int(x + 26), int(y + 140)), sub, font=load_font(18), fill=MUTED)

    # large circle badge
    draw.ellipse((1450, 720, 1750, 1020), fill=(255, 255, 255))
    draw.text((1490, 770), '🌿', font=load_font(110), fill=GREEN_DARK)
    return bg


def make_scene_2(p):
    bg = gradient_background(np.array([248, 249, 247]))
    draw = ImageDraw.Draw(bg)
    # left text
    draw.text((110, 140), 'Owner dashboard', font=load_font(38, bold=True), fill=GREEN_DARK)
    draw.text((110, 210), 'Manage livestock,', font=load_font(82, bold=True), fill=GREEN_DARK)
    draw.text((110, 300), 'medicines, feeds and requests', font=load_font(70, bold=True), fill=GREEN_DARK)
    draw.text((110, 400), 'from one simple farm workspace.', font=load_font(36), fill=MUTED)

    # big pill
    rounded_box(draw, (110, 470), 330, 72, 22, GREEN_PALE)
    draw.text((160, 488), '✅ Track growth', font=load_font(28), fill=GREEN_MID)

    # mock dashboard panel on right
    panel = (760, 180, 1730, 930)
    rounded_box(draw, panel[:2], panel[2] - panel[0], panel[3] - panel[1], 36, WHITE, outline=OUTLINE, outline_width=2)
    draw.text((820, 220), 'FarmConnect', font=load_font(34, bold=True), fill=GREEN_DARK)
    rounded_box(draw, (820, 280), 200, 120, 20, GREEN_PALE)
    draw.text((872, 308), '🐄', font=load_font(54), fill=GREEN_MID)
    draw.text((820, 410), 'Livestock', font=load_font(28, bold=True), fill=GREEN_DARK)
    draw.text((820, 448), '12 active entries', font=load_font(20), fill=MUTED)

    rounded_box(draw, (1060, 280), 220, 120, 20, AMBER_LIGHT)
    draw.text((1120, 308), '🌾', font=load_font(54), fill=AMBER)
    draw.text((1060, 410), 'Feeds', font=load_font(28, bold=True), fill=GREEN_DARK)
    draw.text((1060, 448), '8 suppliers', font=load_font(20), fill=MUTED)

    rounded_box(draw, (1320, 280), 220, 120, 20, GREEN_PALE)
    draw.text((1380, 308), '💊', font=load_font(54), fill=GREEN_MID)
    draw.text((1320, 410), 'Medicines', font=load_font(28, bold=True), fill=GREEN_DARK)
    draw.text((1320, 448), '16 stocked', font=load_font(20), fill=MUTED)

    rounded_box(draw, (820, 560), 840, 270, 30, OFF_WHITE, outline=OUTLINE, outline_width=2)
    draw.text((860, 600), 'Request activity', font=load_font(28, bold=True), fill=GREEN_DARK)
    for idx, width in enumerate([200, 330, 280, 400]):
        x = 860 + idx * 5
        y = 660 + idx * 28
        rounded_box(draw, (x, y), width, 18, 12, (82, 183, 136) if idx % 2 else (216, 243, 220))
    return bg


def make_scene_3(p):
    bg = gradient_background(np.array([26, 60, 46]))
    draw = ImageDraw.Draw(bg)
    # dark-glass look for supplier portal
    draw.text((120, 120), 'Supplier portal', font=load_font(38), fill=(255, 255, 255, 180))
    draw.text((120, 180), 'Inventory, approvals', font=load_font(78, bold=True), fill=WHITE)
    draw.text((120, 285), 'and supply flow in one place.', font=load_font(68, bold=True), fill=(255, 255, 255, 200))

    grad = (255, 255, 255)
    panel = (930, 160, 1800, 960)
    rounded_box(draw, panel[:2], panel[2] - panel[0], panel[3] - panel[1], 36, (17, 31, 27), outline=(60, 94, 77), outline_width=2)

    # cards inside panel
    cards = [
        ('💊', 'Medicines', 'Add & edit stock', (82, 183, 136)),
        ('🌾', 'Feeds', 'Manage listings', (233, 168, 37)),
        ('📋', 'Requests', 'Approve orders', (142, 206, 255)),
        ('💬', 'Feedback', ' Monitor reviews', (255, 193, 131)),
    ]
    for idx, (emoji, title, sub, c) in enumerate(cards):
        x = 980 + (idx % 2) * 340
        y = 220 + (idx // 2) * 270
        rounded_box(draw, (x, y), 280, 190, 24, (255, 255, 255), outline=(70, 90, 80), outline_width=1)
        draw.text((x + 110, y + 32), emoji, font=load_font(64), fill=c)
        draw.text((x + 28, y + 122), title, font=load_font(30, bold=True), fill=GREEN_DARK)
        draw.text((x + 28, y + 158), sub, font=load_font(20), fill=MUTED)

    # left vertical text
    draw.rounded_rectangle((120, 420, 700, 700), radius=28, fill=(255, 255, 255))
    draw.text((170, 470), 'Operations', font=load_font(26), fill=WHITE)
    draw.text((170, 520), '• Track requests', font=load_font(36), fill=WHITE)
    draw.text((170, 580), '• Maintain stock', font=load_font(36), fill=WHITE)
    draw.text((170, 640), '• Support farmers', font=load_font(36), fill=WHITE)
    return bg


def make_scene_4(p):
    bg = gradient_background(np.array([216, 243, 220]))
    draw = ImageDraw.Draw(bg)
    # two-column login mockup
    panel = (420, 190, 1500, 930)
    rounded_box(draw, panel[:2], panel[2] - panel[0], panel[3] - panel[1], 36, WHITE, outline=OUTLINE, outline_width=2)

    draw.text((520, 250), 'Welcome back', font=load_font(56, bold=True), fill=GREEN_DARK)
    draw.text((520, 325), 'Sign in to Farm Connect', font=load_font(28), fill=MUTED)

    for i, label in enumerate(['Email Address', 'Password']):
        y = 420 + i * 180
        draw.text((520, y), label, font=load_font(24), fill=GREEN_DARK)
        rounded_box(draw, (520, y + 42, 1060, y + 110), 18, 68, 14, OFF_WHITE, outline=(214, 220, 216), outline_width=2)
        if i == 1:
            draw.text((560, y + 58), '••••••••', font=load_font(28), fill=TEXT)
        else:
            draw.text((560, y + 58), 'you@example.com', font=load_font(28), fill=TEXT)

    rounded_box(draw, (520, 810, 1060, 880), 18, 70, 18, GREEN_MID)
    draw.text((730, 830), 'Sign In →', font=load_font(30, bold=True), fill=WHITE)

    draw.text((520, 920), 'New to Farm Connect? Create an account', font=load_font(22), fill=MUTED)

    # success popup
    if p > 0.2:
        popup = (1110, 250, 1610, 640)
        rounded_box(draw, popup[:2], popup[2] - popup[0], popup[3] - popup[1], 28, WHITE, outline=(228, 233, 228), outline_width=2)
        draw.text((1260, 310), '✅', font=load_font(70), fill=GREEN_MID)
        draw.text((1210, 410), 'Login Successful!', font=load_font(34, bold=True), fill=GREEN_DARK)
        draw.text((1205, 465), 'Welcome back to FarmConnect.', font=load_font(24), fill=MUTED)
        rounded_box(draw, (1235, 515, 1500, 570), 18, 55, 18, GREEN_MID)
        draw.text((1310, 528), 'Continue', font=load_font(26, bold=True), fill=WHITE)
    return bg


def make_scene_5(p):
    bg = gradient_background(np.array([255, 247, 221]))
    draw = ImageDraw.Draw(bg)

    glow = (255, 255, 255)
    draw.ellipse((1340, 140, 1820, 620), fill=(255, 255, 255))
    draw.text((150, 180), 'One platform for', font=load_font(90, bold=True), fill=GREEN_DARK)
    draw.text((150, 300), 'healthier farms', font=load_font(90, bold=True), fill=GREEN_MID)
    draw.text((150, 430), 'and stronger supply chains.', font=load_font(82, bold=True), fill=GREEN_DARK)

    draw.text((150, 620), 'Livestock • Medicines • Feeds • Requests • Feedback', font=load_font(34), fill=MUTED)

    # cards at bottom
    items = [('🐄', 'Livestock'), ('🌾', 'Feeds'), ('💊', 'Medicines'), ('📋', 'Requests')]
    for idx, (emoji, title) in enumerate(items):
        x = 150 + idx * 330
        y = 710
        rounded_box(draw, (x, y), 250, 210, 26, WHITE, outline=OUTLINE, outline_width=2)
        draw.text((x + 90, y + 42), emoji, font=load_font(70), fill=GREEN_MID)
        draw.text((x + 42, y + 146), title, font=load_font(28, bold=True), fill=GREEN_DARK)

    draw.text((150, 960), 'FarmConnect — Connecting Farmers with Quality Suppliers', font=load_font(30, bold=True), fill=GREEN_DARK)
    return bg


def build_frames():
    scenes = [
        (make_scene_1, 4.5),
        (make_scene_2, 4.0),
        (make_scene_3, 4.0),
        (make_scene_4, 4.5),
        (make_scene_5, 4.0),
    ]
    frames = []
    for scene_fn, duration in scenes:
        for i in range(int(FPS * duration)):
            t = i / FPS / duration
            p = min(max((i / (FPS * duration)), 0), 1)
            frame = scene_fn(p)
            frames.append(np.array(frame))

    # poster frame with strong settled composition (start of the final scene)
    poster = frames[-180]
    Image.fromarray(poster).save(OUT / 'brag.jpg')
    return frames, poster


def write_plan():
    plan = '''# Brag plan for FarmConnect

## Angle
FarmConnect is a role-based agricultural management platform that gives farm owners and suppliers a clean way to manage livestock, feeds, medicines, requests, and feedback in one place.

## Hook
"A farm operation that finally feels connected."

## Highlights
1. Farm owners can manage livestock and orders without bouncing between tools.
2. Suppliers can track inventory, requests, and approvals from a single dashboard.
3. Secure login and role-based access keep the platform organized for each user type.

## Punchline
FarmConnect turns daily farm operations into a clearer, healthier workflow.

## Tone
Polished, practical, and warm with a modern agricultural brand palette.

## Visual identity
- Green, earthy palette with cream and amber accents
- Serif headings and clean sans-serif UI labels
- Floating farm icons and dashboard-style cards

## Storyboard
- 0:00-4.5s: FarmConnect hero and product positioning
- 4.5-8.5s: Owner dashboard overview
- 8.5-12.5s: Supplier portal and approvals
- 12.5-17.0s: Login flow and success state
- 17.0-21.0s: Final payoff with one-platform messaging
'''
    (OUT / 'brag-plan.md').write_text(plan, encoding='utf-8')


def write_share_copy():
    text = 'FarmConnect brings the farm workflow into one place: livestock, medicines, feeds, requests, and feedback all sit inside a clean role-based dashboard built for farmers and suppliers alike.\n\nBuilt for real agricultural operations, it turns fragmented admin work into one calmer system for healthier farms and faster decisions.'
    (OUT / 'share-copy.txt').write_text(text, encoding='utf-8')


if __name__ == '__main__':
    write_plan()
    write_share_copy()
    frames, poster = build_frames()
    final_frames = [np.array(poster)] + [np.asarray(frame) for frame in frames[1:]]
    writer = imageio.get_writer(str(OUT / 'brag.mp4'), fps=FPS, codec='libx264', quality=8)
    for frame in final_frames:
        writer.append_data(frame)
    writer.close()
    print(f'Video written to {OUT / "brag.mp4"}')
    print(f'Poster written to {OUT / "brag.jpg"}')
    print(f'Plan written to {OUT / "brag-plan.md"}')
    print(f'Share copy written to {OUT / "share-copy.txt"}')
