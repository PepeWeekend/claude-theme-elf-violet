// ちびキャラの顔（作業中の行に出す）。黒ウルフ髪、紫インナー、尖り耳、紫縁メガネ、半目。
export const MASCOT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<style>
.bob { animation: bob 3.2s ease-in-out infinite; transform-origin: 32px 40px; }
.lid { animation: blink 5s infinite; transform-origin: 32px 33px; }
@keyframes bob { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(1.5px); } }
@keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 94% { transform: scaleY(2.2); } }
</style>
<g class="bob">
<!-- back hair -->
<path d="M14 30 Q12 50 18 56 L22 48 L24 56 L30 50 L34 56 L40 50 L42 56 L46 48 L48 56 Q54 48 50 30 Z" fill="#1a181d"/>
<path d="M44 34 Q50 44 47 55 L43 47 Z" fill="#7b5cc4"/>
<!-- ears -->
<path d="M15 33 L3 24 L16 39 Z" fill="#f2d9cc" stroke="#d8b8a8" stroke-width="0.8"/>
<path d="M49 33 L61 24 L48 39 Z" fill="#f2d9cc" stroke="#d8b8a8" stroke-width="0.8"/>
<!-- face -->
<ellipse cx="32" cy="35" rx="16" ry="15" fill="#f6e3d8"/>
<!-- eyes -->
<ellipse cx="25" cy="36" rx="3.2" ry="3" fill="#7b5cc4"/>
<ellipse cx="39" cy="36" rx="3.2" ry="3" fill="#7b5cc4"/>
<circle cx="26" cy="35.5" r="0.9" fill="#efeaf6"/>
<circle cx="40" cy="35.5" r="0.9" fill="#efeaf6"/>
<!-- sleepy lids -->
<g class="lid">
<rect x="21" y="32" width="8" height="2.6" fill="#f6e3d8"/>
<rect x="35" y="32" width="8" height="2.6" fill="#f6e3d8"/>
</g>
<path d="M21.5 34.4 L28.5 34.4" stroke="#1a181d" stroke-width="1.1" stroke-linecap="round"/>
<path d="M35.5 34.4 L42.5 34.4" stroke="#1a181d" stroke-width="1.1" stroke-linecap="round"/>
<!-- glasses -->
<rect x="19.5" y="31.5" width="11" height="8.5" rx="2.5" fill="none" stroke="#9a7fe0" stroke-width="1.2"/>
<rect x="33.5" y="31.5" width="11" height="8.5" rx="2.5" fill="none" stroke="#9a7fe0" stroke-width="1.2"/>
<path d="M30.5 35 L33.5 35" stroke="#9a7fe0" stroke-width="1.1"/>
<!-- mouth -->
<path d="M30 44 L34 44" stroke="#b0727a" stroke-width="1" stroke-linecap="round"/>
<!-- front hair, heavy bangs -->
<path d="M14 32 Q12 14 32 12 Q52 14 50 32 L46 26 L44 34 L40 25 L36 33 L33 24 L29 33 L26 25 L22 34 L20 27 Z" fill="#1a181d"/>
<path d="M18 20 Q22 15 27 14" stroke="#3a3542" stroke-width="1" fill="none"/>
</g>
</svg>`

// 無表情・退屈・ちょっと口が悪い先輩。
export const LINES: Record<string, string[]> = {
  thinking: ['…考えてる。急かさないで', 'んー、めんどくさ', 'ちょっと待って', '……ふぁ'],
  requesting: ['はいはい', '…ん', '聞いてるってば'],
  'tool-input': ['やるよ、やればいいんでしょ', '準備中'],
  'tool-use': ['やってるってば', '作業中。話しかけないで', '…手が袖に埋まる'],
  responding: ['書いてる', 'はいはい、今答える', '…まあ、こんなとこ'],
}

export function pick(mode: string, seed: string): string {
  const list = LINES[mode] ?? LINES.thinking!
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return list[Math.abs(h) % list.length]!
}
