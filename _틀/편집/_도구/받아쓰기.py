"""녹화 받아쓰기: large-v3 + 창근 대리 설정(추임새 프롬프트·앞 문맥 끄기) + 어절 시각. 사용: python -X utf8 받아쓰기.py <16k.wav> <words.json>"""
import json, sys, time
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
PROMPT = "어, 음, 그, 저, 그니까, 자, 이제, 어… 그 그러니까 이게 이게 말이죠."
t = time.time()
m = 귀열기('large-v3')
s, _ = m.transcribe(sys.argv[1], language='ko', word_timestamps=True, vad_filter=False, condition_on_previous_text=False, initial_prompt=PROMPT, beam_size=5)
r = []
for x in s:
    r.append(dict(t0=round(x.start, 3), t1=round(x.end, 3), text=x.text.strip(), words=[dict(t0=round(w.start, 3), t1=round(w.end, 3), w=w.word.strip(), p=round(w.probability, 3)) for w in (x.words or [])]))
json.dump(r, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('조각', len(r), '걸린 초', round(time.time() - t))
