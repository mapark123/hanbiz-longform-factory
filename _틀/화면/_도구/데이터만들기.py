"""장면 엔진이 읽는 화면/데이터.js 만들기 (배치도·말시각·설정 → 한 파일) + 실제 캡처 선명 사본(화면/재료/사례3x).
- 사례: 재료/실제사례_가림/NN_*.png (개인정보 가린 사본만!) → 3배(폭 600 넘으면 2배) 키워 선명하게
- 컷씬: 재료/컷씬/NN_*.png
- 장(배경 색·밝기)·장카드 장면·길이: 설정.json
사용: python -X utf8 화면/_도구/데이터만들기.py   (배치도.py 를 고친 뒤 매번)"""
import glob, json, os
from PIL import Image, ImageFilter
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)

여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
뿌리 = 설['프로젝트']
os.makedirs(f'{여기}/재료/사례3x', exist_ok=True)
사례 = {}
for f in sorted(glob.glob(f'{뿌리}/재료/실제사례_가림/*.png')):
    n = os.path.basename(f)[:2]; im = Image.open(f).convert('RGB'); k = 3 if im.width < 600 else 2
    out = f'{여기}/재료/사례3x/{n}.jpg'
    if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(f):
        im.resize((im.width * k, im.height * k), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2)).save(out, quality=94)
    사례[n] = {'src': f'재료/사례3x/{n}.jpg', 'w': im.width, 'h': im.height}
컷 = {os.path.basename(f)[:2]: '../재료/컷씬/' + os.path.basename(f) for f in sorted(glob.glob(f'{뿌리}/재료/컷씬/[0-9][0-9]_*.png'))}
배치 = json.load(open(f'{여기}/배치도.json', encoding='utf-8'))
말 = json.load(open(f'{여기}/말시각.json', encoding='utf-8'))
단어 = [[w, a, b] for c in 말 for w, a, b in c['단어']]
장 = 설.get('장') or [{'시작': 0, '색': '#ff3b4f', '낮': 0}]
구간 = [[c['시작'], (장[i + 1]['시작'] if i + 1 < len(장) else 99999), c['색'], c.get('낮', 0)] for i, c in enumerate(장)]
글 = (f"window.길이={설['길이']};\nwindow.장={json.dumps(구간, ensure_ascii=False)};\nwindow.장카드={json.dumps(설.get('장카드_장면', []))};\n"
     f"window.사례={json.dumps(사례, ensure_ascii=False)};\nwindow.컷씬={json.dumps(컷, ensure_ascii=False)};\n"
     f"window.배치={json.dumps([{'번호': s['번호'], 't0': s['t0'], 't1': s['t1'], 'ev': [e['t'] for e in s['효과음']]} for s in 배치], ensure_ascii=False)};\n"
     f"window.단어={json.dumps(단어, ensure_ascii=False)};\n")
open(f'{여기}/데이터.js', 'w', encoding='utf-8', newline='\n').write(글)
print('데이터.js · 길이', 설['길이'], '· 장면', len(배치), '· 사례', len(사례), '· 컷씬', len(컷), '· 장', len(구간))
