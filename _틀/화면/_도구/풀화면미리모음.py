"""장면마다 자료가 다 나온 순간을 실제 화면 위에 합성해 한 장으로 본다. 사용: python -X utf8 화면/_도구/미리모음.py 출력폴더"""
import glob, json, os, subprocess, sys
from PIL import Image, ImageDraw
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__); os.chdir(설['프로젝트'])  # 모든 경로는 프로젝트 폴더 기준
곳 = sys.argv[1]; os.makedirs(곳 + '/ov', exist_ok=True)
for f in glob.glob(곳 + '/ov/*.png'): os.remove(f)
D = json.loads(open('화면/풀화면데이터.js', encoding='utf-8').read().replace('window.D=', '').rstrip(';\n'))
ts = set()
for p in D['판']:
    for c in p['층']:
        끝 = c.get('다음') or None
        시각 = [it.get('t') for it in c['items'] if it.get('t')] + [s[1] for it in c['items'] if it['k'] == 'chain' for s in it['steps']]
        ts.add(round(max(시각 + [c['t'] + .7]) + .75, 2))
for x in D['포인트']: ts.add(round(x['t큰'] + .6, 2))
for x in D['질문']: ts.add(round(x['t0'] + .6, 2))
for x in D['옆']: ts.add(round(x['t'] + .7, 2))
for x in D['손글씨'] + D['이름표']: ts.add(round(x['t0'] + .6, 2))
ts = sorted(ts)
print(len(ts), '장')
print(subprocess.run(['node', '화면/풀화면찍기.cjs', '미리', 곳 + '/ov', ','.join(map(str, ts))], capture_output=True, text=True, encoding='utf-8', errors='replace').stdout[-300:])
영상 = 설['기준영상']
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(round(D['길이'] / 2)), '-i', 영상, '-frames:v', '1', '-vf', 'scale=1920:-1', 곳 + '/바탕.png'])
바탕 = Image.open(곳 + '/바탕.png').convert('RGBA')
w, h, 열 = 480, 270, 5
장수 = 40
for 쪽 in range(0, len(ts), 장수):
    묶 = ts[쪽:쪽 + 장수]; 판 = Image.new('RGB', (w * 열, h * ((len(묶) + 열 - 1) // 열)), (20, 20, 20))
    for i, t in enumerate(묶):
        c = Image.alpha_composite(바탕, Image.open(f'{곳}/ov/{t:.2f}.png').convert('RGBA')).convert('RGB').resize((w, h))
        ImageDraw.Draw(c).text((6, 256), f'{int(t // 60)}:{t % 60:05.2f}', fill=(255, 255, 0)); 판.paste(c, ((i % 열) * w, (i // 열) * h))
    판.save(f'{곳}/모음{쪽 // 장수}.jpg', quality=84)
print('끝')
