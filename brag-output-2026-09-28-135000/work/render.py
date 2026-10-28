from pathlib import Path
import math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio.v2 as imageio
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'work'
W, H, FPS, SECONDS = 1280, 720, 30, 20
BG = (248, 249, 247); GREEN = (26, 60, 46); MID = (45, 106, 79)
LIME = (82, 183, 136); PALE = (216, 243, 220); AMBER = (233, 168, 37)
INK = (42, 52, 42); MUTED = (92, 107, 90); LINE = (226, 230, 227); WHITE = (255,255,255)
FONT_DIR = Path('C:/Windows/Fonts')
REG = ImageFont.truetype(str(FONT_DIR/'segoeui.ttf'), 20)
BOLD = ImageFont.truetype(str(FONT_DIR/'segoeuib.ttf'), 20)
SMALL = ImageFont.truetype(str(FONT_DIR/'segoeui.ttf'), 15)
MED = ImageFont.truetype(str(FONT_DIR/'segoeui.ttf'), 24)
HEAD = ImageFont.truetype(str(FONT_DIR/'georgia.ttf'), 64)
HEAD2 = ImageFont.truetype(str(FONT_DIR/'georgiab.ttf'), 50)

def ease(x):
    x=max(0,min(1,x)); return x*x*(3-2*x)
def box(d, xy, r=14, fill=WHITE, outline=None, width=1):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)
def label(d,xy,text,font=REG,fill=INK): d.text(xy,text,font=font,fill=fill)
def base(dark=False):
    im=Image.new('RGB',(W,H),GREEN if dark else BG); return im,ImageDraw.Draw(im)
def card(d,xy,title,sub,color=PALE,icon=None):
    box(d,xy,18,WHITE,LINE,1); x,y=xy[:2]
    box(d,(x+18,y+18,x+64,y+64),13,color)
    if icon: label(d,(x+29,y+25),icon,BOLD,MID)
    label(d,(x+18,y+78),title,BOLD,GREEN)
    label(d,(x+18,y+110),sub,SMALL,MUTED)
def topbar(d,role):
    d.rectangle((0,0,W,62),fill=WHITE); d.line((0,61,W,61),fill=LINE,width=1)
    label(d,(50,17),'Farm',BOLD,GREEN); label(d,(97,17),'Connect',BOLD,MID)
    box(d,(1030,15,1225,47),16,PALE); label(d,(1053,21),role,SMALL,MID)
def owner_scene(p):
    im,d=base(); topbar(d,'OWNER WORKSPACE')
    d.rectangle((0,62,W,348),fill=GREEN)
    # Subtle moving harvest lines echo the source palette.
    for i in range(8):
        x=810+i*77+int(18*math.sin(p*math.pi*2+i*.6))
        d.arc((x-150,100,x+150,420),200,340,fill=(43,84,62),width=2)
    label(d,(70,108),'FarmConnect',SMALL,(177,224,193))
    label(d,(70,147),'Your farm,',HEAD,WHITE); label(d,(70,220),'one connected workspace.',HEAD,WHITE)
    label(d,(72,306),'Manage livestock, browse supplies and track requests.',REG,(223,239,226))
    # dashboard cards slide upward in staggered order
    entries=[('Livestock','Add & view your herd',PALE,'L'),('Feeds','Browse available feeds',(254,243,199),'F'),('Medicines','Find farm medicines',(232,243,238),'M'),('Requests','Track request status',(229,238,250),'R')]
    for i,(a,b,c,icon) in enumerate(entries):
        y=397+int((1-ease((p*1.3-i*.11)))*25)
        card(d,(70+i*292,y,70+i*292+260,y+154),a,b,c,icon)
    label(d,(72,603),'Livestock  /  Feeds  /  Medicines  /  Requests',SMALL,MUTED)
    return im
def table_screen(title,subtitle,columns,rows,role='OWNER WORKSPACE',p=0,button=None):
    im,d=base(); topbar(d,role)
    label(d,(72,96),title,HEAD2,GREEN); label(d,(74,158),subtitle,REG,MUTED)
    x0,y0=72,223; box(d,(x0,y0,1208,630),18,WHITE,LINE,1)
    d.rounded_rectangle((x0,y0,1208,y0+60),radius=16,fill=GREEN); d.rectangle((x0,y0+38,1208,y0+60),fill=GREEN)
    xs=np.linspace(98,1110,len(columns)).astype(int)
    for x,t in zip(xs,columns): label(d,(int(x),y0+20),t,SMALL,WHITE)
    for i,row in enumerate(rows):
        y=y0+105+i*92
        if i: d.line((94,y-24,1186,y-24),fill=LINE,width=1)
        lift=int((1-ease(p*1.4-i*.1))*13)
        for j,(x,value) in enumerate(zip(xs,row)):
            if button and j==len(row)-1:
                box(d,(int(x),y-13+lift,int(x)+112,y+31+lift),9,MID)
                label(d,(int(x)+12,y-2+lift),button,SMALL,WHITE)
            else: label(d,(int(x),y+lift),value,BOLD if j==0 else SMALL,GREEN if j==0 else MUTED)
    return im
def livestock_scene(p):
    return table_screen('Livestock','Add and manage livestock details.',
      ['NAME','SPECIES','HEALTH CONDITION','LOCATION','VACCINATION','ACTION'],
      [['Livestock record','Species','Health condition','Location','Vaccination status','Edit']],p=p,button='Edit')
def medicine_scene(p):
    return table_screen('Available Medicines','Search by name, brand or category.',
      ['MEDICINE NAME','BRAND','CATEGORY','DESCRIPTION','PRICE / UNIT','ACTION'],
      [['Medicine listing','Brand','Category','Description','—','Request']],p=p,button='Request')
def supplies_scene(p):
    im,d=base(); topbar(d,'OWNER WORKSPACE')
    label(d,(72,98),'Browse what your farm needs',HEAD2,GREEN)
    label(d,(74,162),'Available feeds · Search, compare, request',REG,MUTED)
    # Product table modeled on the real owner feed component and shared table styles.
    x0,y0=72,232; box(d,(x0,y0,1208,640),18,WHITE,LINE,1)
    d.rounded_rectangle((x0,y0,1208,y0+58),radius=16,fill=GREEN)
    d.rectangle((x0,y0+34,1208,y0+58),fill=GREEN)
    for x,t in [(100,'FEED NAME'),(354,'DESCRIPTION'),(750,'QUANTITY'),(875,'UNIT'),(985,'PRICE / UNIT'),(1094,'ACTION')]: label(d,(x,y0+18),t,SMALL,WHITE)
    rows=[('Feed listing','Supplier provided details','—','—','—')]
    for i,row in enumerate(rows):
        y=y0+95+i*96
        if i: d.line((x0+22,y-17,1188,y-17),fill=LINE,width=1)
        label(d,(100,y),row[0],BOLD,GREEN); label(d,(354,y),row[1],SMALL,MUTED)
        label(d,(750,y),row[2],SMALL,MUTED); label(d,(875,y),row[3],SMALL,MUTED); label(d,(985,y),row[4],SMALL,MUTED)
        bx=1050+int(30*ease((p-i*.18)))
        box(d,(bx,y-8,1182,y+34),10,MID)
        label(d,(bx+15,y), 'Request',SMALL,WHITE)
    # moving pointer and click ring indicate the primary action without claiming a real transaction
    q=ease((p-.45)/.35); cx,cy=1110,344
    if p>.45:
        d.ellipse((cx-22,cy-22,cx+22,cy+22),outline=(233,168,37),width=max(2,int(5*(1-q))+1))
        d.ellipse((cx-5,cy-5,cx+5,cy+5),fill=AMBER)
    box(d,(74,584,465,628),20,PALE); label(d,(96,596),'Tap Request to create a supply request',SMALL,MID)
    return im
def supplier_scene(p):
    im,d=base(); topbar(d,'SUPPLIER PORTAL')
    label(d,(72,99),'Requests, with a clear next step.',HEAD2,GREEN)
    label(d,(74,162),'Suppliers manage incoming requests and choose an action.',REG,MUTED)
    x0,y0=72,232; box(d,(x0,y0,1208,620),18,WHITE,LINE,1)
    d.rounded_rectangle((x0,y0,1208,y0+58),radius=16,fill=GREEN); d.rectangle((x0,y0+34,1208,y0+58),fill=GREEN)
    for x,t in [(100,'REQUEST'),(365,'OWNER'),(592,'ITEM'),(815,'STATUS'),(985,'ACTIONS')]: label(d,(x,y0+18),t,SMALL,WHITE)
    for j in range(2):
        y=330+j*106
        if j: d.line((95,y-30,1184,y-30),fill=LINE,width=1)
        label(d,(100,y),'Incoming request',BOLD,GREEN); label(d,(365,y),'Farm owner',REG,MUTED)
        label(d,(592,y),'Feed / medicine',REG,MUTED)
        box(d,(805,y-9,900,y+28),16,(254,243,199)); label(d,(824,y-2),'Pending',SMALL,(126,82,13))
        dx=int(12*ease((p-j*.14)))
        box(d,(956+dx,y-11,1053+dx,y+31),9,MID); label(d,(974+dx,y-3),'Approve',SMALL,WHITE)
        box(d,(1065+dx,y-11,1162+dx,y+31),9,(253,232,232)); label(d,(1086+dx,y-3),'Reject',SMALL,(155,55,46))
    # Small sourced capabilities, no counts or performance claims.
    for i,(t,c) in enumerate([('Medicines',PALE),('Feeds',(254,243,199)),('Feedback',(229,238,250))]):
        box(d,(72+i*235,548,275+i*235,594),20,c); label(d,(95+i*235,559),t,BOLD,GREEN)
    return im
def request_form_scene(p):
    im,d=base(); topbar(d,'OWNER WORKSPACE')
    label(d,(72,98),'Request what your farm needs',HEAD2,GREEN)
    label(d,(74,160),'Choose livestock and quantity before submitting.',REG,MUTED)
    x0,y0=340,213; box(d,(x0,y0,940,650),20,WHITE,LINE,1)
    label(d,(382,244),'Request Form',HEAD2,GREEN)
    fields=[('Request Type','Feed or Medicine'),('Item Name','Selected supply'),('Select Livestock','Choose livestock'),('Quantity','Enter quantity')]
    for i,(head,hint) in enumerate(fields):
        y=322+i*66
        label(d,(382,y),head.upper(),SMALL,MUTED)
        box(d,(382,y+24,898,y+65),8,BG,LINE,1)
        label(d,(400,y+33),hint,SMALL,(142,151,142))
    q=ease((p-.3)/.35); bx=382+int(12*q)
    box(d,(bx,600,bx+516,642),8,MID); label(d,(540+int(12*q),610),'Submit Request',BOLD,WHITE)
    return im
def myrequests_scene(p):
    return table_screen('My Requests','Track your medicine and feed requests.',
      ['TYPE','MEDICINE','FEED','QTY','STATUS','ACTION'],
      [['Medicine','Medicine name','—','—','Pending','Delete'],['Feed','—','Feed name','—','Approved','Delete']],p=p,button='Delete')
def roles_scene(p):
    im,d=base(); topbar(d,'ROLE-BASED ACCESS')
    label(d,(72,100),'Two roles. One farm workflow.',HEAD2,GREEN)
    label(d,(74,163),'Each side gets the tools for its part of the work.',REG,MUTED)
    for i,(role,title,items,accent) in enumerate([
        ('OWNER','Care for the farm',['Manage livestock','Browse feeds & medicines','Track requests'],PALE),
        ('SUPPLIER / ADMIN','Support the supply',['Manage inventory','Review requests','View feedback'],(254,243,199))]):
        x=72+i*574; y=244+int((1-ease((p-i*.12)))*25)
        box(d,(x,y,x+540,y+348),22,WHITE,LINE,1)
        d.rounded_rectangle((x,y,x+540,y+74),radius=21,fill=GREEN if i==0 else MID)
        d.rectangle((x,y+45,x+540,y+74),fill=GREEN if i==0 else MID)
        label(d,(x+28,y+24),role,SMALL,(223,239,226))
        label(d,(x+28,y+104),title,HEAD2,GREEN)
        for j,item in enumerate(items):
            yy=y+186+j*49
            box(d,(x+29,yy,x+57,yy+28),9,accent)
            label(d,(x+68,yy+1),'✓',SMALL,MID)
            label(d,(x+77,yy),item,REG,INK)
    return im
def outro(p):
    im,d=base(True)
    # concentric field curves, slowly shifting
    for i in range(10):
        off=int(16*math.sin(p*math.pi*2+i*.3))
        d.arc((800+i*24+off,35+i*18,1390+i*20,700-i*7),80,280,fill=(48,92,67),width=2)
    label(d,(78,100),'FarmConnect',SMALL,(177,224,193))
    label(d,(78,174),'Connecting farmers',HEAD,WHITE)
    label(d,(78,250),'with quality suppliers.',HEAD,WHITE)
    label(d,(82,359),'Livestock  ·  Medicines  ·  Feeds  ·  Requests  ·  Feedback',REG,(223,239,226))
    box(d,(80,460,352,522),15,LIME); label(d,(111,475),'FarmConnect',BOLD,WHITE)
    # Simple leaf/field symbol drawn as vector.
    d.ellipse((1000,176,1150,326),outline=LIME,width=5); d.arc((1027,202,1120,300),195,345,fill=(151,217,177),width=7)
    d.line((1035,282,1111,220),fill=(151,217,177),width=5)
    return im

def frame_at(t):
    scenes=[(2.4,owner_scene),(4.8,livestock_scene),(7.2,medicine_scene),
            (9.6,supplies_scene),(12.0,request_form_scene),(14.4,myrequests_scene),
            (17.2,supplier_scene),(20.0,outro)]
    start=0.0
    for end,fn in scenes:
        if t<end:
            return fn((t-start)/(end-start))
        start=end
    return outro(1)

def music(path):
    sr=48000; dur=SECONDS; n=sr*dur
    t=np.arange(n,dtype=np.float32)/sr; y=np.zeros(n,dtype=np.float32)
    # Warm, restrained plucked chord bed in C major, 90 BPM; soft synthesized tones only.
    beat=60/90; notes=[(261.63,0),(329.63,0),(392,0),(493.88,beat*2),(392,beat*2),(329.63,beat*2),(220,beat*4),(261.63,beat*4),(329.63,beat*4),(196,beat*6),(246.94,beat*6),(293.66,beat*6)]
    for freq,start in notes:
        phase=2*np.pi*freq*t
        env=np.exp(-np.maximum(t-start,0)*1.7)*(t>=start)*(t<start+beat*2.4)
        y += .035*env*(np.sin(phase)+.24*np.sin(phase*2))
    y += .012*np.sin(2*np.pi*65.4*t)*(.5+.5*np.sin(2*np.pi*.125*t))
    # soft onset ticks blended into the same bed
    for k in range(int(dur/beat)):
        start=int(k*beat*sr); length=min(int(.10*sr),n-start)
        if length>0:
            tt=np.arange(length)/sr; y[start:start+length]+=.015*np.sin(2*np.pi*880*tt)*np.exp(-tt*38)
    fade=np.minimum(1,t/1.2)*np.minimum(1,(dur-t)/1.2)
    y=np.clip(y*fade,-.95,.95)
    stereo=np.column_stack((y,y)).astype(np.float32)
    pcm=(stereo*32767).astype('<i2')
    with wave.open(str(path),'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes(pcm.tobytes())

def make_docs():
    (ROOT/'brag-plan.md').write_text('''# FarmConnect launch video plan\n\n## Angle\nShow the owner’s journey from livestock and supply management through a request, then show how suppliers respond.\n\n## Hook\n“Your farm, one connected workspace.”\n\n## Screens and highlights\n- Owner dashboard: livestock, feeds, medicines and requests.\n- Livestock list and available medicines.\n- Feed browse and request form.\n- Owner request tracking and supplier approve/reject actions.\n\n## Punchline\n“Connecting farmers with quality suppliers.”\n\n## Tone and visual identity\nWarm, polished, practical. Source palette of deep greens, pale green and cream; serif display type and clean sans-serif UI labels.\n\n## Storyboard (20 seconds, landscape)\n- 0–2.4s: owner dashboard and key work areas.\n- 2.4–4.8s: livestock records and management.\n- 4.8–7.2s: medicine browse and request action.\n- 7.2–9.6s: available feeds and request action.\n- 9.6–12s: request form, livestock selection and quantity.\n- 12–14.4s: owner request statuses.\n- 14.4–17.2s: supplier request review, approve or reject.\n- 17.2–20s: FarmConnect close and product tagline.\n''',encoding='utf-8')
    (ROOT/'share-copy.txt').write_text('FarmConnect brings livestock, feeds, medicines and requests into one workspace for farm owners, with suppliers managing stock and incoming requests on their side. Connecting farmers with quality suppliers.',encoding='utf-8')

if __name__=='__main__':
    make_docs(); music(WORK/'music.wav')
    poster=frame_at(1.0); poster.save(ROOT/'brag.jpg',quality=93)
    video=ROOT/'silent.mp4'
    writer=imageio.get_writer(str(video),fps=FPS,codec='libx264',quality=8,macro_block_size=1)
    for i in range(FPS*SECONDS):
        t=i/FPS
        im=frame_at(t)
        # Fade through the warm background between chapters.
        cut_points=[2.4,4.8,7.2,9.6,12.0,14.4,17.2]
        cut=next((x for x in cut_points if t<x),20.0)
        start=0.0 if cut==cut_points[0] else cut_points[cut_points.index(cut)-1] if cut in cut_points else cut_points[-1]
        local=t-start
        if local<.18 and t>0:
            alpha=1-ease(local/.18)
            tint=Image.new('RGB',(W,H),BG if cut<17.2 else GREEN)
            im=Image.blend(tint,im,1-alpha)
        if i==0: im=poster.copy()
        writer.append_data(np.asarray(im))
    writer.close()
    ff=imageio_ffmpeg.get_ffmpeg_exe()
    final=ROOT/'brag.mp4'
    subprocess.run([ff,'-y','-i',str(video),'-i',str(WORK/'music.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',str(final)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    video.unlink()
    print(f'Created {final} ({W}x{H}, {SECONDS}s, {FPS}fps, stereo audio)')
