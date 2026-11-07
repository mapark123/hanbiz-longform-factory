"""최종 영상 검수: 형식 · 얼굴 원(대표 원본과 픽셀 대조) · 소리(목소리=원본, 크기) · 효과음 순간 화면 모음.
사용: python -X utf8 화면/_도구/최종검수.py → 화면/_검수/최종_*.jpg · 결과 출력"""
import json, os, subprocess
import numpy as np
from PIL import Image, ImageDraw
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)


여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
뿌리 = os.path.dirname(여기)
최종 = f"{뿌리}/완성/{설.get('제목', '롱폼')}_최종_4K60.mp4"
대표 = 설['기준영상']
곳 = f'{여기}/_검수'; os.makedirs(곳, exist_ok=True)
print(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels', '-of', 'compact', 최종], capture_output=True, text=True).stdout)

def 틀(파일, t, w=1920):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', 파일, '-frames:v', '1', '-vf', f'scale={w}:-1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True)
    return np.frombuffer(r.stdout, np.uint8).reshape(-1, w, 3).astype(int)
# 얼굴 원 대조 (1920 기준 원 안쪽만)
yy, xx = np.mgrid[0:1080, 0:1920]; _o = 설.get('얼굴원_4K', {'cx': 365.5, 'cy': 1797, 'r': 320}); 원 = ((xx - _o['cx'] / 2) ** 2 + (yy - _o['cy'] / 2) ** 2) < (_o['r'] / 2 - 10) ** 2
차 = []
for t in [설['길이'] * k / 8 + 1 for k in range(8)]:
    a, b = 틀(최종, t), 틀(대표, t)
    차.append(float(np.abs(a[원] - b[원]).mean()))
print('얼굴 원 평균 차이(0~255, 압축 잡음 수준이면 2 이하):', [round(x, 2) for x in 차])

# 효과음 순간 화면 모음
배치 = json.load(open(f'{여기}/배치도.json', encoding='utf-8'))
시각 = [e['t'] + .12 for s in 배치 for e in s['효과음']][::4]
열, w, h = 6, 480, 270
판 = Image.new('RGB', (열 * w, ((len(시각) + 열 - 1) // 열) * (h + 22)), (25, 25, 25)); d = ImageDraw.Draw(판)
for i, t in enumerate(시각):
    im = Image.fromarray(틀(최종, t, 480).astype(np.uint8)); x, y = (i % 열) * w, (i // 열) * (h + 22)
    판.paste(im, (x, y + 22)); d.text((x + 5, y + 4), f'{int(t // 60)}:{t % 60:05.2f}', fill=(255, 220, 0))
판.save(f'{곳}/최종_효과음순간.jpg', quality=80); print('효과음 순간', len(시각), '장 →', f'{곳}/최종_효과음순간.jpg')

# 소리
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', 최종, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
print('소리:', ' '.join(l.strip() for l in m.splitlines()[-12:] if 'I:' in l or 'Peak:' in l))
