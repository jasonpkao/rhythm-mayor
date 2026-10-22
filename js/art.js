// ---- art ----
// 程式繪製的漫畫風角色，等 art/ 裡的插圖生好前先頂著用。外觀由譜面的 look 與題號決定，同一題每次長得一樣。
const SKIN = ['#f3c9a0','#e0a979','#c98b5e','#f6d7b8'];
const SHIRT = ['#e8604c','#5cc28f','#7fa6e8','#f2b632','#b07fe8','#4fb8c4'];
const HAIR = { kid:'#2a1d14', young:'#1d1712', adult:'#2b2118', auntie:'#3a2a1e', elder:'#c9c9c9' };
const K = '#05070b';

export function portrait(ph, seed){
  return ph.type==='S' ? reporters(seed) : citizen(ph.look || 'adult', seed);
}

function citizen(look, n){
  const skin=SKIN[n%SKIN.length], shirt=SHIRT[(n*5+1)%SHIRT.length], hair=HAIR[look]||HAIR.adult;
  const kid = look==='kid', s = kid ? .82 : 1;          // 小孩縮小、頭比例大一點
  const glasses = look==='elder' || n%4===1;
  const hairShape = {
    kid:    `<path d="M30 46 Q30 18 60 18 Q90 18 90 46 Q84 30 60 32 Q38 30 30 46Z"/>`,
    young:  `<path d="M28 50 Q26 16 62 16 Q96 18 92 52 Q86 30 70 34 Q60 22 44 34 Q32 36 28 50Z"/>`,
    adult:  `<path d="M30 48 Q28 18 60 18 Q92 18 90 48 Q88 32 60 30 Q34 32 30 48Z"/>`,
    auntie: `<path d="M24 70 Q16 20 60 16 Q104 20 96 70 Q94 40 86 36 Q60 26 34 36 Q26 44 24 70Z"/><circle cx="60" cy="14" r="11"/>`,
    elder:  `<path d="M32 44 Q36 24 60 24 Q84 24 88 44 Q80 34 60 34 Q40 34 32 44Z"/>`
  }[look] || '';
  return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${60-60*s} ${140-140*s}) scale(${s})" stroke="${K}" stroke-width="3.5" stroke-linejoin="round">
    <path d="M14 140 Q16 100 60 96 Q104 100 106 140Z" fill="${shirt}"/>
    <path d="M48 96 L60 112 L72 96" fill="none"/>
    <rect x="50" y="78" width="20" height="20" fill="${skin}"/>
    <ellipse cx="60" cy="54" rx="30" ry="${kid?32:34}" fill="${skin}"/>
    <g fill="${hair}">${hairShape}</g>
    <path d="M42 46 l10 3 M78 46 l-10 3" stroke-width="3"/>
    <circle cx="48" cy="56" r="3.2" fill="${K}" stroke="none"/><circle cx="72" cy="56" r="3.2" fill="${K}" stroke="none"/>
    ${glasses ? `<circle cx="48" cy="56" r="8" fill="none" stroke-width="2.5"/><circle cx="72" cy="56" r="8" fill="none" stroke-width="2.5"/><path d="M56 56 h8" stroke-width="2.5"/>` : ''}
    <path d="M50 74 Q60 ${n%2?68:80} 70 74" fill="${n%2?'none':'#7a2a22'}" stroke-width="3"/>
    ${look==='elder' ? `<path d="M40 66 q4 3 8 0 M72 66 q4 3 8 0" stroke-width="2" fill="none"/>` : ''}
    <path d="M40 68 q-4 2 -2 6 M80 68 q4 2 2 6" stroke="none" fill="#e87a6a" opacity=".5"/>
  </g>
  <g fill="#fffdf5" stroke="${K}" stroke-width="2"><path d="M100 22 l6 -10 M106 30 l10 -4 M98 12 l2 -10"/></g>
</svg>`;
}

function reporters(n){
  const mics=[[18,-18,'#e8604c'],[42,-6,'#7fa6e8'],[70,-12,'#f2b632'],[96,-22,'#5cc28f']];
  const flash=(x,y,r)=>`<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3}Z" fill="#fffdf5" stroke="${K}" stroke-width="2"/>`;
  return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  ${flash(22,24,16)}${flash(96,16,12)}${n%2?flash(70,40,9):''}
  <g stroke="${K}" stroke-width="3.5" stroke-linejoin="round">
    ${mics.map(([x,rot,c])=>`<g transform="rotate(${rot} ${x} 140)">
      <rect x="${x-4}" y="80" width="8" height="64" fill="#2a2f3a"/>
      <rect x="${x-9}" y="72" width="18" height="14" rx="2" fill="${c}"/>
      <ellipse cx="${x}" cy="64" rx="10" ry="13" fill="#3a4152"/></g>`).join('')}
  </g>
</svg>`;
}
