// 영상 공용 움직임 (2026-11-05 대표 확인) — 튕김 없이 부드럽게. HTML 에서 <script src="../../_공용/모션.js"></script>
// 규칙은 같은 폴더 _영상모션_규칙.md
const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const p = (a, b, t) => cl((t - a) / (b - a));
const io = (x) => x * x * x * (x * (x * 6 - 15) + 10); // 시작·끝 속도와 가속이 모두 0
const soft = (a, b, t) => io(p(a, b, t));
const L = (a, b, x) => a + (b - a) * x;
