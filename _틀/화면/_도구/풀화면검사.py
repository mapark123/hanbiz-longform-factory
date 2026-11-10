"""완본 검사: ① 줄마다 자막이 떠 있는 구간 소리만 잘라 받아써 자막 글자와 대조 ② 표시 시간 ③ 목소리 그대로 ④ 효과음 크기 ⑤ 멈춤 ⑥ 큐 순간 화면 변화.
사용: python -X utf8 화면/_도구/전체검사.py [--싱크만]"""
import difflib, json, os, re, subprocess, sys
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__); os.chdir(설['프로젝트'])  # 모든 경로는 프로젝트 폴더 기준
영상 = 설['기준영상']; 결과 = f"완성/{설['제목']}_완본_4K60.mp4"
D = json.loads(open('화면/풀화면데이터.js', encoding='utf-8').read().replace('window.D=', '').rstrip(';\n'))
n = lambda s: re.sub(r'[^가-힣0-9A-Za-z]', '', s)
말 = []
for k, l in enumerate(D['줄']):
    ws = [d for d in D['단어'] if d['줄'] == k]; 말.append({'k': k, 'l': l, 't0': ws[0]['t0'], 't1': ws[-1]['t1']})
# 다음 줄과 겹치거나 뒤집힌 곳
겹 = [(m['k'], m['l'][:14]) for m, x in zip(말, 말[1:]) if m['t1'] > x['t0'] + .05]
print('말 끝이 다음 줄 시작을 넘는 곳', len(겹), 겹[:10], flush=True)
print('줄 길이 짧음(0.4초 미만)', [(m['k'], m['l'][:14], round(m['t1'] - m['t0'], 2)) for m in 말 if m['t1'] - m['t0'] < .4], flush=True)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 영상, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(r, np.float32); SR = 16000
from _귀 import 귀열기
m = 귀열기('large-v3'); 점 = []; 나쁨 = []
for c in 말:
    a, b = c['t0'] - .06, c['t1'] + .1
    seg, _ = m.transcribe(x[int(max(0, a) * SR):int(b * SR)], language='ko', condition_on_previous_text=False, beam_size=5, temperature=0)
    들 = ' '.join(g.text.strip() for g in seg); q = difflib.SequenceMatcher(None, n(c['l']), n(들), autojunk=False).ratio(); 점.append(q)
    if q < .7: 나쁨.append(f"  {q:.2f} {a:.2f}-{b:.2f} [{c['l']}] 들림: {들}")
점 = np.array(점)
print('줄', len(말), '· 글자 일치 평균', round(float(점.mean()), 3), '중앙', round(float(np.median(점)), 3), '· 0.7 미만', int((점 < .7).sum()), flush=True)
print('\n'.join(나쁨), flush=True)
if '--싱크만' in sys.argv: raise SystemExit
SR2 = 48000
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 영상, '-vn', '-f', 'f32le', '-ac', '2', '-ar', str(SR2), '-'], capture_output=True).stdout
목 = np.frombuffer(r, np.float32).reshape(-1, 2); 합, _ = sf.read('화면/_소리_최종.wav', dtype='float32'); 효, _ = sf.read('화면/_효과음만.wav', dtype='float32'); k = min(len(목), len(합))
print('목소리 차이 최대', float(np.abs(합[:k] - 효[:k] - 목[:k]).max()))
배 = json.load(open('화면/배치도.json', encoding='utf-8'))[0]['효과음']; 약 = []
for e in 배:
    a = int(e['t'] * SR2); pk = 20 * np.log10(np.abs(효[a:a + int(.4 * SR2)]).max() + 1e-9)
    if pk < -26: 약.append((round(e['t'], 2), e['이름'][:24], round(float(pk), 1)))
print('효과음', len(배), '· 서로 다른 파일', len({e['이름'] for e in 배}), '· -26dB 아래 작은 소리', 약)
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 결과, '-vf', 'scale=480:270,fps=15,freezedetect=n=0.0008:d=2', '-an', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
print('2초 넘는 멈춤', re.findall(r'freeze_start: ([\d.]+)', r)[:20], flush=True)
