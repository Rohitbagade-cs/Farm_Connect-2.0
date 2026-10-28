from pathlib import Path
import math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio.v2 as imageio
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]; WORK=ROOT/'work'
W,H,FPS=1280,720,30
GREEN=(26,60,46); MID=(45,106,79); LIGHT=(82,183,136); PALE=(216,243,220)
CREAM=(248,249,247); AMBER=(233,168,37); INK=(42,52,42); MUTED=(92,107,90)
LINE=(226,230,227); WHITE=(255,255,255); SOFT=(240,245,240)
F=Path('C:/Windows/Fonts')
REG=ImageFont.truetype(str(F/'segoeui.ttf'),20)
SMALL=ImageFont.truetype(str(F/'segoeui.ttf'),15)
BOLD=ImageFont.truetype(str(F/'segoeuib.ttf'),20)
MED=ImageFont.truetype(str(F/'segoeui.ttf'),25)
HEAD=ImageFont.truetype(str(F/'georgiab.ttf'),48)
SERIF=ImageFont.truetype(str(F/'georgia.ttf'),56)
HEAD_SM=ImageFont.truetype(str(F/'georgiab.ttf'),29)

VOICE=[
 'FarmConnect is a role-based farm management app built to connect farm owners with suppliers and administrators.',
 'Owners can register livestock, recording details such as species, health, location, and vaccination status.',
 'They can browse available feeds and medicines, search listings, and choose what they need.',
 'A request links the selected product to livestock and a quantity, then submits it to the supplier.',
 'From My Requests, owners can follow each request as it moves through pending, approved, or rejected status.',
 'On the supplier side, teams manage feed and medicine listings, review incoming requests, and approve or reject them. Owners can also leave feedback, giving both roles a shared workflow.',
 'The frontend uses Angular and TypeScript. It talks to an ASP.NET Core Web API, with Entity Framework Core and SQL Server for data, plus JWT authentication and role-based route protection.',
 'The outcome is a full-stack application that brings livestock records, supply browsing, requests, inventory, and feedback into one connected process. FarmConnect: connecting farmers with quality suppliers.'
]
SCENE_NAMES=['Project overview','Livestock management','Supply catalogue','Create a request','Track requests','Supplier workspace','Tools and architecture','Outcome']

def ease(x):
    x=max(0,min(1,x)); return x*x*(3-2*x)
def txt(d,xy,s,font=REG,color=INK): d.text(xy,s,font=font,fill=color)
def box(d,xy,r=14,fill=WHITE,outline=None,width=1): d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=width)
def page(role='OWNER WORKSPACE',dark=False):
    im=Image.new('RGB',(W,H),CREAM if not dark else GREEN); d=ImageDraw.Draw(im)
    if not dark:
        d.rectangle((0,0,W,62),fill=WHITE); d.line((0,61,W,61),fill=LINE,width=1)
        txt(d,(52,16),'Farm',BOLD,GREEN); txt(d,(98,16),'Connect',BOLD,MID)
        box(d,(1030,15,1225,47),16,PALE); txt(d,(1050,21),role,SMALL,MID)
    return im,d
def title(d,headline,sub):
    txt(d,(72,92),headline,HEAD,GREEN); txt(d,(74,151),sub,REG,MUTED)

def scene_overview(p):
    im,d=page(dark=True)
    # Field-line motif
    for i in range(9):
        x=865+i*47+int(10*math.sin(2*math.pi*p+i*.5))
        d.arc((x-210,40,x+210,480),190,345,fill=(49,91,68),width=2)
    txt(d,(74,79),'FARMCONNECT  /  PROJECT PRESENTATION',SMALL,(177,224,193))
    txt(d,(70,149),'Farm management,',SERIF,WHITE); txt(d,(70,220),'connected.',SERIF,WHITE)
    txt(d,(74,308),'One role-based workflow for farm owners, suppliers and administrators.',REG,(226,239,228))
    labels=[('01','Manage livestock'),('02','Browse supplies'),('03','Send requests'),('04','Review & respond')]
    for i,(n,s) in enumerate(labels):
        x=72+i*292; y=426+int((1-ease(p*1.5-i*.08))*18)
        box(d,(x,y,x+266,y+116),15,(255,255,255,255),outline=(61,97,75))
        txt(d,(x+18,y+18),n,SMALL,LIGHT); txt(d,(x+18,y+55),s,BOLD,GREEN)
    txt(d,(74,606),'OBJECTIVE  ·  Connect daily farm records and supply requests in one app.',SMALL,(205,226,209))
    return im

def scene_livestock(p):
    im,d=page(); title(d,'Livestock','Keep the details owners use to manage their herd.')
    # Real source fields displayed as a product form
    box(d,(72,220,824,646),18,WHITE,LINE)
    txt(d,(104,248),'Add Livestock',HEAD,GREEN)
    fields=[('NAME','e.g. Bessie'),('SPECIES','e.g. Cattle'),('AGE','Years'),('BREED','e.g. Holstein'),
            ('HEALTH CONDITION','e.g. Healthy'),('VACCINATION STATUS','Enter status'),('LOCATION','Barn or farm location')]
    positions=[(104,328),(430,328),(104,404),(430,404),(104,480),(430,480),(104,556)]
    for (lab,hint),(x,y) in zip(fields,positions):
        txt(d,(x,y),lab,SMALL,MUTED); box(d,(x,y+23,x+284,y+61),7,CREAM,LINE)
        txt(d,(x+12,y+32),hint,SMALL,(146,154,146))
    box(d,(864,220,1208,646),18,SOFT)
    txt(d,(900,258),'A farm record',HEAD,GREEN)
    for i,s in enumerate(['Species and breed','Age and health condition','Location and vaccination','Edit or remove records']):
        yy=352+i*58; box(d,(900,yy,930,yy+30),9,PALE); txt(d,(909,yy+2),'✓',SMALL,MID); txt(d,(947,yy+2),s,SMALL,INK)
    return im

def scene_catalogue(p):
    im,d=page(); title(d,'Find farm supplies','Owners can search medicines and feeds before placing a request.')
    # Search control
    box(d,(72,207,1208,258),10,WHITE,LINE); txt(d,(98,222),'Search by name, brand, category or description…',SMALL,MUTED)
    tabs=[('Medicines',True),('Feeds',False)]
    for i,(t,on) in enumerate(tabs):
        x=72+i*178; y=284
        box(d,(x,y,x+157,y+43),20,MID if on else WHITE,LINE)
        txt(d,(x+23,y+10),t,BOLD,WHITE if on else MID)
    # Product table fields mirror the owner catalogue template; no invented stock values.
    x0,y0=72,352; box(d,(x0,y0,1208,623),16,WHITE,LINE)
    d.rounded_rectangle((x0,y0,1208,y0+54),radius=15,fill=GREEN); d.rectangle((x0,y0+34,1208,y0+54),fill=GREEN)
    for x,s in [(96,'MEDICINE NAME'),(320,'BRAND'),(468,'CATEGORY'),(625,'DESCRIPTION'),(905,'PRICE / UNIT'),(1070,'ACTION')]: txt(d,(x,y0+18),s,SMALL,WHITE)
    yy=441
    for x,s in [(96,'Medicine listing'),(320,'Brand'),(468,'Category'),(625,'Description'),(905,'—')]: txt(d,(x,yy),s,SMALL,GREEN if x==96 else MUTED)
    bx=1065+int(12*ease(p)); box(d,(bx,yy-11,bx+116,yy+34),9,MID); txt(d,(bx+17,yy),'Request',SMALL,WHITE)
    txt(d,(96,526),'A clear listing leads straight into the request flow.',SMALL,MUTED)
    return im

def scene_request(p):
    im,d=page(); title(d,'Create a supply request','Connect the item to livestock, enter a quantity, and submit.')
    box(d,(325,207,955,659),20,WHITE,LINE)
    txt(d,(374,231),'Request Form',HEAD,GREEN)
    for i,(lab,hint) in enumerate([('REQUEST TYPE','Feed or Medicine'),('ITEM NAME','Selected supply'),('SELECT LIVESTOCK','Choose livestock'),('QUANTITY','Enter quantity')]):
        y=308+i*69; txt(d,(374,y),lab,SMALL,MUTED); box(d,(374,y+22,905,y+61),7,CREAM,LINE); txt(d,(393,y+31),hint,SMALL,(143,152,143))
    q=ease((p-.32)/.34); bx=374+int(10*q); box(d,(bx,600,bx+531,642),8,MID); txt(d,(546+int(10*q),610),'Submit Request',BOLD,WHITE)
    return im

def scene_tracking(p):
    im,d=page(); title(d,'My Requests','Owners can review the status of medicine and feed requests.')
    x0,y0=72,239; box(d,(x0,y0,1208,632),16,WHITE,LINE)
    d.rounded_rectangle((x0,y0,1208,y0+58),radius=15,fill=GREEN); d.rectangle((x0,y0+37,1208,y0+58),fill=GREEN)
    for x,s in [(100,'TYPE'),(305,'MEDICINE'),(520,'FEED'),(730,'QTY'),(860,'STATUS'),(1040,'ACTION')]: txt(d,(x,y0+20),s,SMALL,WHITE)
    rows=[('Medicine','Medicine name','—','—','Pending'),('Feed','—','Feed name','—','Approved')]
    for i,row in enumerate(rows):
        y=337+i*110
        if i: d.line((96,y-28,1183,y-28),fill=LINE)
        for j,(x,val) in enumerate(zip([100,305,520,730],row[:4])): txt(d,(x,y),val,BOLD if j==0 else SMALL,GREEN if j==0 else MUTED)
        state=row[4]; col=AMBER if state=='Pending' else LIGHT
        box(d,(855,y-12,972,y+29),18,(254,243,199) if state=='Pending' else PALE); txt(d,(875,y-3),state,SMALL,(126,82,13) if state=='Pending' else MID)
        txt(d,(1042,y-2),'View / Delete',SMALL,MID)
    # explain the status lifecycle without implying these are live customer records
    txt(d,(95,588),'STATUS FLOW',SMALL,MUTED)
    for i,(s,c) in enumerate([('Pending',(254,243,199)),('Approved',PALE),('Rejected',(253,232,232))]):
        x=222+i*180; box(d,(x,576,x+142,617),20,c); txt(d,(x+22,586),s,BOLD,GREEN if i<2 else (155,55,46))
    return im

def scene_supplier(p):
    im,d=page('SUPPLIER PORTAL'); title(d,'Supplier workspace','Manage inventory and respond to incoming owner requests.')
    # Workspace tabs from source navigation
    for i,(s,sel) in enumerate([('Inventory',False),('Requests',True),('Feedbacks',False)]):
        x=72+i*163; box(d,(x,206,x+145,248),20,MID if sel else WHITE,LINE); txt(d,(x+21,217),s,BOLD,WHITE if sel else MID)
    x0,y0=72,279; box(d,(x0,y0,1208,570),16,WHITE,LINE)
    d.rounded_rectangle((x0,y0,1208,y0+55),radius=15,fill=GREEN); d.rectangle((x0,y0+35,1208,y0+55),fill=GREEN)
    for x,s in [(98,'TYPE'),(267,'MEDICINE'),(459,'FEED'),(622,'QTY'),(745,'STATUS'),(910,'ACTIONS')]: txt(d,(x,y0+18),s,SMALL,WHITE)
    y=380
    for x,s in [(98,'Supply request'),(267,'Medicine name'),(459,'Feed name'),(622,'—')]: txt(d,(x,y),s,SMALL,GREEN if x==98 else MUTED)
    box(d,(735,y-12,846,y+29),18,(254,243,199)); txt(d,(753,y-3),'Pending',SMALL,(126,82,13))
    q=ease(p); ax=905+int(10*q)
    box(d,(ax,y-13,1018,y+31),8,MID); txt(d,(ax+10,y-3),'Approve',SMALL,WHITE)
    box(d,(1031+int(10*q),y-13,1148+int(10*q),y+31),8,(253,232,232)); txt(d,(1047+int(10*q),y-3),'Reject',SMALL,(155,55,46))
    txt(d,(94,478),'Inventory: add and manage feeds and medicines.',SMALL,MUTED)
    txt(d,(94,513),'Feedback: view comments submitted by farm owners.',SMALL,MUTED)
    return im

def scene_architecture(p):
    im,d=page(); title(d,'How the pieces work together','A browser app sends role-authorized requests to the API and database.')
    cards=[('FRONTEND',['Angular 16'],'TypeScript · HTML · CSS',PALE),('API',['ASP.NET Core'],'REST endpoints · JWT', (230,239,250)),('DATA',['Entity Framework','Core'],'SQL Server', (254,243,199))]
    for i,(k,names,detail,c) in enumerate(cards):
        x=72+i*408; y=300+int((1-ease(p*1.7-i*.12))*22)
        box(d,(x,y,x+340,y+220),20,WHITE,LINE)
        box(d,(x+24,y+22,x+133,y+57),17,c); txt(d,(x+40,y+30),k,SMALL,MID)
        font=HEAD if len(names)==1 and names[0]=='Angular 16' else HEAD_SM
        for j,line in enumerate(names): txt(d,(x+24,y+79+j*42),line,font,GREEN)
        txt(d,(x+24,y+169),detail,SMALL,MUTED)
    for x in [427,835]:
        y=410; d.line((x,y,x+30,y),fill=MID,width=4); d.line((x+20,y-10,x+30,y),fill=MID,width=4); d.line((x+20,y+10,x+30,y),fill=MID,width=4)
    box(d,(150,562,1130,624),18,GREEN); txt(d,(204,581),'JWT authentication',BOLD,WHITE)
    txt(d,(524,581),'Role guards: Owner  ·  Supplier  ·  Admin',REG,(222,239,225))
    return im

def scene_outcome(p):
    im,d=page(dark=True)
    for i in range(9):
        x=900+i*38+int(10*math.sin(p*4+i*.4)); d.arc((x-220,82,x+220,615),190,350,fill=(49,91,68),width=2)
    txt(d,(76,88),'PROJECT OUTCOME',SMALL,(177,224,193))
    txt(d,(72,179),'One connected',SERIF,WHITE); txt(d,(72,250),'farm workflow.',SERIF,WHITE)
    txt(d,(76,354),'Livestock  ·  Medicines  ·  Feeds  ·  Requests  ·  Feedback',REG,(226,239,228))
    txt(d,(76,444),'A full-stack application for farm owners and suppliers.',MED,WHITE)
    box(d,(76,544,370,604),14,LIGHT); txt(d,(106,559),'FarmConnect',BOLD,WHITE)
    txt(d,(76,635),'Connecting farmers with quality suppliers.',SMALL,(205,226,209))
    return im

RENDER=[scene_overview,scene_livestock,scene_catalogue,scene_request,scene_tracking,scene_supplier,scene_architecture,scene_outcome]

def read_wav(path):
    with wave.open(str(path),'rb') as f:
        sr=f.getframerate(); channels=f.getnchannels(); sw=f.getsampwidth(); data=f.readframes(f.getnframes())
    if sw!=2: raise ValueError(f'Expected 16-bit PCM: {path}')
    arr=np.frombuffer(data,dtype='<i2').astype(np.float32)/32768
    if channels>1: arr=arr.reshape(-1,channels).mean(axis=1)
    return sr,arr

def write_wav(path,sr,stereo):
    pcm=(np.clip(stereo,-.98,.98)*32767).astype('<i2')
    with wave.open(str(path),'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr); f.writeframes(pcm.tobytes())

def build_audio():
    clips=[read_wav(WORK/f'voice-{i:02d}.wav') for i in range(1,9)]
    sr=clips[0][0]
    if any(x[0]!=sr for x in clips): raise ValueError('Voiceover WAV sample rates differ')
    gap=int(sr*.38); close=int(sr*2.1)
    durations=[len(x[1])/sr for x in clips]
    segments=[]
    for i,(_,a) in enumerate(clips):
        # Gentle segment tails prevent the narration from sounding clipped.
        tail=min(int(sr*.10),len(a)//4); a=a.copy()
        if tail: a[-tail:]*=np.linspace(1,0,tail,dtype=np.float32)
        segments.append(a)
        if i<len(clips)-1: segments.append(np.zeros(gap,dtype=np.float32))
    segments.append(np.zeros(close,dtype=np.float32))
    voice=np.concatenate(segments)
    t=np.arange(len(voice),dtype=np.float32)/sr; music=np.zeros(len(voice),dtype=np.float32)
    # A soft, original C-major pad with gentle plucks under the narration.
    beat=60/84; chords=[(130.81,0,8),(164.81,0,8),(196,0,8),(110,beat*8,8),(146.83,beat*8,8),(174.61,beat*8,8),(98,beat*16,8),(130.81,beat*16,8),(164.81,beat*16,8)]
    for hz,start,beats in chords:
        env=np.exp(-np.maximum(t-start,0)*.20)*(t>=start)*(t<start+beat*beats)
        music+=.020*env*np.sin(2*np.pi*hz*t)
    for k in range(int(len(t)/sr/beat)):
        st=int(k*beat*sr); n=min(int(sr*.11),len(t)-st)
        if n>0:
            tt=np.arange(n)/sr; music[st:st+n]+=.012*np.sin(2*np.pi*659.25*tt)*np.exp(-tt*30)
    fade=int(sr*1.1); env=np.ones(len(t),dtype=np.float32)
    env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
    voice*=.92; music*=env
    peak=max(float(np.max(np.abs(voice+music))),.1); mono=(voice+music)*min(1,.94/peak)
    stereo=np.column_stack((mono,mono))
    write_wav(WORK/'voiceover.wav',sr,np.column_stack((voice,voice)))
    write_wav(WORK/'soundtrack.wav',sr,stereo)
    with wave.open(str(WORK/'music.wav'),'wb') as f:
        pcm=(np.clip(np.column_stack((music,music)),-.98,.98)*32767).astype('<i2')
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr); f.writeframes(pcm.tobytes())
    # Visual beat duration follows each complete spoken line, with a small breath between beats.
    scene_durations=[x+.38 for x in durations[:-1]]+[durations[-1]+2.1]
    return durations,scene_durations,sum(scene_durations),sr

def draw_frame(idx,local,duration):
    return RENDER[idx](min(1,max(0,local/max(duration,0.01))))

def main():
    durations,scene_durations,total,sr=build_audio()
    starts=np.cumsum([0]+scene_durations[:-1]).tolist()
    # First-frame poster is a fully-settled composition from the opening scene.
    poster=scene_overview(0.0); poster.save(ROOT/'brag.jpg',quality=94)
    video=WORK/'picture-only.mp4'; writer=imageio.get_writer(str(video),fps=FPS,codec='libx264',quality=8,macro_block_size=1)
    total_frames=math.ceil(total*FPS)
    for frame_no in range(total_frames):
        t=frame_no/FPS; idx=max(i for i,s in enumerate(starts) if s<=t)
        local=t-starts[idx]; im=draw_frame(idx,local,scene_durations[idx])
        # Fade up from the background at each chapter boundary; no double exposure.
        if idx>0 and local<.25:
            im=Image.blend(im,Image.new('RGB',(W,H),GREEN if idx in (0,7) else CREAM),1-ease(local/.25))
        if frame_no==0: im=poster.copy()
        writer.append_data(np.asarray(im))
    writer.close()
    ff=imageio_ffmpeg.get_ffmpeg_exe(); final=ROOT/'brag.mp4'
    subprocess.run([ff,'-y','-i',str(video),'-i',str(WORK/'soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',str(final)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    video.unlink()
    ranges=[]; cursor=0
    for i,(name,line,du) in enumerate(zip(SCENE_NAMES,VOICE,scene_durations)):
        a=cursor; cursor+=du; ranges.append(f'{a:05.1f}–{cursor:05.1f}s  |  {name}\n“{line}”')
    (ROOT/'voiceover-script.md').write_text('# FarmConnect video narration\n\n'+'\n\n'.join(ranges)+'\n',encoding='utf-8')
    (ROOT/'brag-plan.md').write_text('''# FarmConnect — professional project presentation\n\n## Objective\nExplain how FarmConnect connects farm owners with suppliers and administrators through a role-based app for livestock records, supply browsing, requests, inventory and feedback.\n\n## Process shown\nOwners maintain livestock records, search medicine and feed listings, select a product and livestock in a request form, and track request status. Suppliers manage inventory, review incoming requests, approve or reject them, and view owner feedback.\n\n## Tools and architecture\nAngular 16 with TypeScript, HTML and CSS; ASP.NET Core Web API; Entity Framework Core; SQL Server; JWT authentication and role-protected routes for Owner, Supplier and Admin roles.\n\n## Outcome\nA full-stack application that brings the owner and supplier workflows into one role-based system. This presentation describes the repository’s implemented features without claiming deployment, usage metrics or measured business impact.\n\n## Visual sequence\n1. Project objective and end-to-end workflow.\n2. Add livestock form and the record fields.\n3. Searchable medicine and feed catalogues.\n4. Request form connecting a supply item to livestock and quantity.\n5. Owner request tracking and status lifecycle.\n6. Supplier inventory, request decisions and feedback.\n7. Frontend, API, database and authentication architecture.\n8. Project outcome and brand close.\n\nScene durations are timed to the narration; see `voiceover-script.md` for the exact time ranges and spoken copy.\n''',encoding='utf-8')
    (ROOT/'share-copy.txt').write_text('FarmConnect is a role-based full-stack app for farm owners and suppliers. It connects livestock records, feed and medicine listings, supply requests, supplier decisions and feedback in one workflow. Built with Angular, ASP.NET Core, Entity Framework Core, SQL Server and JWT authentication.',encoding='utf-8')
    print(f'Created {final} — {total:.1f}s, 1280x720, {FPS}fps, narrated audio ({sr} Hz).')
    print('Scene durations: '+', '.join(f'{x:.1f}s' for x in scene_durations))

if __name__=='__main__': main()
