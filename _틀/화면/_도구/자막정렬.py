"""자막맞추기.py 다음 단계: 강제 정렬로 줄마다 실제 말 시작·끝을 재서 자막/줄.json 시각을 고친다.
whisper 단어 시각은 0.2초 안팎 일찍 찍혀, 그대로 쓰면 자막이 말보다 먼저 뜨고 먼저 꺼진다(글자·색 표시는 그대로 둔다).
뜨는 때 = 말 시작 0.03초 전 · 지는 때 = 말 끝 +0.3초(다음 줄과 0.4초 안 떨어지면 다음 줄까지 이어서 깜빡임 없앰).
정렬 점수가 0.3 아래인 줄은 시각을 믿을 수 없어 그대로 두고 «확인» 으로 알린다.
필요: srt-align 스킬(~/.claude/skills/srt-align). 사용: python -X utf8 화면/_도구/자막정렬.py → 자막/줄.json · 자막/정렬보고.txt"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로

설 = 경로.설정(__file__)
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
도구 = os.path.expanduser('~/.claude/skills/srt-align/scripts/srt_align.py')
if not os.path.exists(도구): raise SystemExit('srt-align 스킬이 없음: ' + 도구)
민 = lambda s: re.sub(r'\{[ry]:([^}]*)\}', lambda m: m.group(1), s)


def 시각표(s):
    t = max(0, s); return f'{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(round((t - int(t)) * 1000)) % 1000:03d}'


def 재기(줄, 곳):
    os.makedirs(곳, exist_ok=True)
    srt = f'{곳}/자막.srt'
    open(srt, 'w', encoding='utf-8').write('\n'.join(f"{i + 1}\n{시각표(c['t0'])} --> {시각표(c['t1'])}\n{민(c['글'])}\n" for i, c in enumerate(줄)))
    subprocess.run([sys.executable, '-X', 'utf8', 도구, 설['기준영상'], srt, 곳], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return json.load(open(f'{곳}/전_timing.json', encoding='utf-8'))


def 요약(표):
    시작 = sorted(abs(r['lag']) for r in 표 if r.get('lag') is not None)
    return f"말 시작과 차이 중앙 {시작[len(시작) // 2]:.3f}초 · 최대 {시작[-1]:.3f}초" if 시작 else '측정 없음'


줄 = json.load(open(f'{여기}/자막/줄.json', encoding='utf-8'))
with tempfile.TemporaryDirectory() as 임시:
    전 = 재기(줄, f'{임시}/전')
    if len(전) != len(줄): raise SystemExit(f'정렬 결과 줄 수가 다름 {len(전)} vs {len(줄)}')
    확인 = []
    for c, r in zip(줄, 전):
        if r.get('onset') is None or (r.get('score') or 0) < .3:
            확인.append(f"{c['t0']:7.2f} 점수 {r.get('score')} {c['글']}"); c['_끝'] = None; continue
        c['t0'] = round(max(0, r['onset'] - .03), 3); c['_끝'] = r['offset']
    # 숫자가 든 줄 등에서 정렬기가 다음 줄 시작을 앞줄 말 끝보다 일찍 잡는 일이 있다(«1대1» 이 0.8초 일찍 잡혀 앞줄이 0.18초만 뜸).
    # 앞줄 말 끝과 0.15초 넘게 겹치면 시작을 앞줄 말 끝으로 미루고, 0.35초 안에 쉼이 있으면 쉼이 끝나는 곳으로 맞춘다.
    소리 = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 설['기준영상'], '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
    db = 20 * np.log10(np.sqrt(np.convolve(소리 ** 2, np.ones(320) / 320, 'same')[::160] + 1e-12))
    for i in range(1, len(줄)):
        앞끝 = 줄[i - 1].get('_끝')
        if 앞끝 is None or 줄[i].get('_끝') is None or 앞끝 <= 줄[i]['t0'] + .03 + .15: continue
        시작 = 앞끝
        쉼 = [k for k in range(int(앞끝 * 100), min(len(db) - 1, int((앞끝 + .35) * 100))) if db[k] < -42 and db[k + 1] >= -42]
        if 쉼: 시작 = (쉼[-1] + 1) / 100
        확인.append(f"{시작:7.2f} 정렬 겹침 보정({줄[i]['t0']:.2f}→{시작:.2f}) {줄[i]['글']}")
        줄[i]['t0'] = round(시작 - .03, 3); 줄[i - 1]['_끝'] = min(앞끝, 시작)
    길이 = 설['길이']
    for i, c in enumerate(줄):
        다음 = 줄[i + 1]['t0'] if i + 1 < len(줄) else 길이 - .07
        말끝 = c.pop('_끝')
        if 말끝 is None: c['t1'] = min(c['t1'], 다음); continue
        끝 = 말끝 + .3
        c['t1'] = round(다음 if 다음 - 끝 < .4 else min(끝, 다음), 3)
        if c['t1'] <= c['t0']: 확인.append(f"시각 뒤집힘 {i} {c['글']}")
        elif c['t1'] - c['t0'] < .5: 확인.append(f"{c['t0']:7.2f} 너무 짧게 뜸 {c['t1'] - c['t0']:.2f}초 {c['글']}")
    후 = 재기(줄, f'{임시}/후')
json.dump(줄, open(f'{여기}/자막/줄.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
확인 += [f"{r['t0']:7.2f} {'·'.join(r['verdict'])} 시작차 {r['lag']} 끝차 {r['tail']} 점수 {r['score']} {r['text']}" for r in 후 if r.get('verdict') != ['맞음']]  # 고친 뒤에도 남은 줄은 앞뒤 소리를 들어 판단
보고 = ['고치기 전 ' + 요약(전), '고친 뒤 ' + 요약(후), f'줄 {len(줄)} · 사람이 볼 곳 {len(확인)}', *확인]
open(f'{여기}/자막/정렬보고.txt', 'w', encoding='utf-8').write('\n'.join(보고))
print('\n'.join(보고))
