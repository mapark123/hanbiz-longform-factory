"""메타사기 녹화 컷: ① 다시 말한 앞 판·혼잣말 지우기(아래 지울말) ② 숨소리 지우기 ③ 쉼 줄이기(대표 기준 0.15~0.2초).
쉼 판단은 소리 크기로만 한다(받아쓰기 시각 X · 대표 기준 기억 feedback-cut-edit-owner-standard).
사용: python -X utf8 _도구/컷만들기.py  → 컷구간.json · 컷보고.txt"""
import json, os
import numpy as np, soundfile as sf

여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
x, sr = sf.read(J('a16k.wav'), dtype='float32')
끝 = len(x) / sr
칸 = int(sr * 0.01)  # 10ms
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(칸 * 2) / (칸 * 2), mode='same')[::칸] + 1e-12))
THR = -38      # 이보다 크면 소리
최소쉼 = 10     # 0.1초 이상 조용하면 덩어리 나눔

# (지울 시작, 지울 끝, 이유) — 시각은 구간단어.txt(잘게 받아쓴 단어 시각)·숨단위.txt 기준. 경계는 아래에서 가장 조용한 지점으로 붙인다.
지울말 = [
    # (지울 시작초, 지울 끝초, '이유') — 시각은 편집/구간단어.txt(잘게 받아쓴 단어 시각) 기준. 끝은 '끝' 이면 영상 끝까지.
    # 0.3초짜리 혼잣말은 조각만 받아써 확인(헛것이면 앞 말 꼬리 → 지우지 않음). 예시: ../../예시_메타사기4가지/컷만들기_예시.py
]


경고 = []
def 조용한곳(t, 폭=0.25, 조용=-35):
    """t 에서 가장 «가까운» 조용한 점(-35dB 아래). 11/7 사고: 창 안 «최솟값»을 고르면 말 가운데 살짝 작아진 곳(-29dB)을 골라
    지운 말 꼬리("이딴,"→"일단", "더,")가 남았다. 가까운 조용한 점이 없으면 그대로 두고 경고."""
    k0 = int(round(t * 100))
    if 0 <= k0 < len(db) and db[k0] < -38:
        return t  # v2: 이미 조용한 곳에 손으로 잡은 경계는 그대로(옮기다 말소리로 들어감)
    for d in range(0, int(폭 * 100) + 1):
        for k in (k0 - d, k0 + d):
            if 0 <= k < len(db) and db[k] < 조용:
                return k / 100
    # 말이 쉼 없이 붙어 있는 곳: 아주 좁게(±0.06초) 가장 작은 점
    a, b = max(0, k0 - 6), min(len(db) - 1, k0 + 6)
    k = a + int(np.argmin(db[a:b + 1]))
    경고.append(f'{t:.2f} 근처 ±{폭}초에 조용한 곳 없음 → ±0.06초 안 가장 작은 점 {k / 100:.2f}({db[k]:.0f}dB)에서 자름 · 이음매 받아쓰기로 확인')
    return k / 100


# ① 소리 덩어리
덩 = []
시작 = None
조용 = 0
for k in range(len(db)):
    if db[k] >= THR:
        if 시작 is None:
            시작 = k
        조용 = 0
        마지막 = k
    elif 시작 is not None:
        조용 += 1
        if 조용 >= 최소쉼:
            덩.append([시작 / 100, (마지막 + 1) / 100])
            시작 = None
if 시작 is not None:
    덩.append([시작 / 100, (마지막 + 1) / 100])
# 11/7 v2: 말 끝은 작아지며 사라짐(-38 아래로 내려가도 "요~" 꼬리가 들림) → -48dB 아래로 떨어질 때까지(최대 0.25초) 말로 친다. 머리도 같은 식(최대 0.12초).
for i, d in enumerate(덩):
    k = int(d[1] * 100)
    한 = min(len(db), k + 25, int(덩[i + 1][0] * 100) if i + 1 < len(덩) else len(db))
    while k < 한 and db[k] > -48: k += 1
    d[1] = k / 100
    k = int(d[0] * 100)
    한 = max(0, k - 12, int(덩[i - 1][1] * 100) if i else 0)
    while k > 한 and db[k - 1] > -48: k -= 1
    d[0] = k / 100

# ② 지울말 빼기 (경계는 가장 조용한 곳으로)
지움 = [(0 if a <= 0 else 조용한곳(a), 끝 if b >= 끝 else 조용한곳(b), 이유) for a, b, 이유 in 지울말]
def 빼기(구간, a, b):
    남 = []
    for s, e in 구간:
        if e <= a or s >= b:
            남.append([s, e])
        else:
            if s < a: 남.append([s, a])
            if e > b: 남.append([b, e])
    return 남
for a, b, _ in 지움:
    덩 = 빼기(덩, a, b)

# ③ 숨소리: 짧고(0.7초 미만) 말보다 한참 작은 덩어리
말크기 = []
for s, e in 덩:
    seg = db[int(s * 100):int(e * 100)]
    if len(seg): 말크기.append(np.percentile(seg, 90))
기준 = float(np.median(말크기))
숨 = []
남 = []
for s, e in 덩:
    seg = db[int(s * 100):int(e * 100)]
    if len(seg) == 0: continue
    크기 = float(np.percentile(seg, 90))
    # 실측(11/7): 바닥 소음 -62dB · 숨은 -48~-35dB · 말 90%값 -15dB 안팎. 기준-14 로 잡았더니 552.9초 "이제"를 숨으로 잘못 지움 → 절대값으로.
    if (e - s) < 0.6 and 크기 < -30:
        숨.append((s, e, round(크기, 1)))
    else:
        남.append([s, e])
덩 = [d for d in 남 if d[1] - d[0] >= 0.06]

# ④ 쉼 줄이기: 덩어리 사이 쉼이 0.35초 넘으면 0.18초만 남김(앞 말 뒤 0.10 + 다음 말 앞 0.08). 그보다 짧은 쉼은 그대로.
앞여유, 뒤여유, 긴쉼 = 0.04, 0.06, 0.30  # v2: 꼬리를 -48dB까지 늘렸으니 여유는 줄임
def 지운곳안(t):
    return any(a < t < b for a, b, _ in 지움)
살림 = []
for i, (s, e) in enumerate(덩):
    # 여유를 붙일 때 지운 구간 안으로 다시 들어가지 않게(11/7 사고: 여유 0.08초가 지운 "이딴," 꼬리를 되살림)
    a = max(0, s - 앞여유)
    for ra, rb, _ in 지움:
        if a < rb <= s: a = rb
    b = min(끝, e + 뒤여유)
    for ra, rb, _ in 지움:
        if e <= ra < b: b = ra
    if 살림 and a - 살림[-1][1] < (긴쉼 - 앞여유 - 뒤여유):
        살림[-1][1] = b  # 짧은 쉼은 그대로 이어 붙임
    else:
        살림.append([a, b])
# 겹침 정리
정리 = []
for a, b in 살림:
    if 정리 and a <= 정리[-1][1]:
        정리[-1][1] = max(정리[-1][1], b)
    else:
        정리.append([round(a, 3), round(b, 3)])

길이 = sum(b - a for a, b in 정리)
json.dump({'초구간': 정리, '원본초': 끝, '지움': [[a, b, r] for a, b, r in 지움], '숨': [[s, e] for s, e, _ in 숨]}, open(J('컷구간.json'), 'w', encoding='utf-8'), ensure_ascii=False)

# 보고: 이어 붙인 뒤 쉼 분포(소리 크기로 다시 잼)
y = np.concatenate([x[int(a * sr):int(b * sr)] for a, b in 정리])
dy = 20 * np.log10(np.sqrt(np.convolve(y ** 2, np.ones(칸 * 2) / (칸 * 2), mode='same')[::칸] + 1e-12))
쉼들 = []
n = 0
for v in dy:
    if v < THR: n += 1
    else:
        if n: 쉼들.append(n / 100)
        n = 0
쉼들 = np.array([s for s in 쉼들 if s >= 0.1])
말컷초 = sum(b - a for a, b, _ in 지움 if b - a > 0)
보고 = [
    f'원본 {끝:.1f}초 → 컷 {길이:.1f}초 (줄어든 {끝 - 길이:.1f}초)',
    f'다시 말한 곳·혼잣말 지움 {len(지움)}곳 {말컷초:.1f}초 · 숨소리 지움 {len(숨)}곳 · 이어 붙인 조각 {len(정리)}개',
    f'컷본 쉼(0.1초 이상) {len(쉼들)}곳 · 가장 긴 쉼 {쉼들.max() if len(쉼들) else 0:.2f}초 · 0.3초 넘는 쉼 {(쉼들 > 0.3).sum()}곳 · 중앙값 {np.median(쉼들) if len(쉼들) else 0:.2f}초',
    '',
    '[지운 말]',
] + [f'{a:7.2f}~{b:7.2f} ({b - a:4.1f}초) {이유}' for a, b, 이유 in 지움] + ['', '[경고]'] + 경고 + ['', '[숨소리]'] + [f'{s:7.2f}~{e:7.2f} {크}dB' for s, e, 크 in 숨]
open(J('컷보고.txt'), 'w', encoding='utf-8').write('\n'.join(보고))
print('\n'.join(보고[:3]))
