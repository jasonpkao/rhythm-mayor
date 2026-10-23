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

// ---- 按鈕美術 ----
// 回應鈕：候選人（黃色彩帶、舉麥克風）；幕僚鈕：幕僚（圓眼鏡、耳機、資料夾）；其餘為漫畫風小圖示
export function candidate(){
  return `<svg class="fig cand" viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${K}" stroke-width="3" stroke-linejoin="round">
    <path d="M10 100 Q12 66 45 62 Q78 66 80 100Z" fill="#fffdf5"/>
    <path d="M26 66 L62 100 L72 100 L36 64Z" fill="#f2b632"/>
    <rect x="38" y="48" width="14" height="16" fill="#f3c9a0"/>
    <ellipse cx="45" cy="34" rx="20" ry="22" fill="#f3c9a0"/>
    <path d="M24 32 Q22 10 45 10 Q68 10 66 32 Q60 20 45 20 Q30 20 24 32Z" fill="#2b2118"/>
    <circle cx="38" cy="36" r="2.4" fill="${K}" stroke="none"/><circle cx="52" cy="36" r="2.4" fill="${K}" stroke="none"/>
    <path d="M37 46 Q45 52 53 46" fill="#7a2a22"/>
    <g class="arm"><path d="M70 74 L82 40" stroke-width="9" stroke="${K}"/><path d="M70 74 L82 40" stroke-width="5" stroke="#fffdf5"/>
      <circle cx="83" cy="38" r="6" fill="#f3c9a0"/><rect x="80" y="14" width="7" height="22" rx="2" fill="#3a4152"/><ellipse cx="83.5" cy="12" rx="7" ry="8" fill="#e8604c"/></g>
  </g></svg>`;
}
export function aide(){
  return `<svg class="fig aide" viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${K}" stroke-width="3" stroke-linejoin="round">
    <path d="M10 100 Q12 66 45 62 Q78 66 80 100Z" fill="#26324a"/>
    <path d="M38 64 L45 80 L52 64" fill="#fffdf5"/>
    <rect x="38" y="48" width="14" height="16" fill="#e0a979"/>
    <ellipse cx="45" cy="34" rx="19" ry="21" fill="#e0a979"/>
    <path d="M26 30 Q26 10 46 11 Q66 12 64 30 L58 22 Q46 26 34 20Z" fill="#1d1712"/>
    <circle cx="37" cy="36" r="6.5" fill="#fffdf5" fill-opacity=".35"/><circle cx="53" cy="36" r="6.5" fill="#fffdf5" fill-opacity=".35"/><path d="M43.5 36 h3"/>
    <circle cx="37" cy="36" r="1.8" fill="${K}" stroke="none"/><circle cx="53" cy="36" r="1.8" fill="${K}" stroke="none"/>
    <path d="M39 47 h12"/>
    <path d="M25 34 Q20 46 30 50" fill="none" stroke-width="2.5"/><circle cx="30" cy="50" r="3" fill="#7fa6e8"/>
    <g class="clip"><rect x="54" y="66" width="26" height="32" rx="2" fill="#f5e7b8"/><rect x="61" y="62" width="12" height="7" rx="2" fill="#7fa6e8"/>
      <path d="M59 76 h16 M59 83 h16 M59 90 h10" stroke-width="2"/></g>
  </g></svg>`;
}
const I = {
  pause:  `<rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/>`,
  play:   `<path d="M7 4 L20 12 L7 20Z"/>`,
  restart:`<path d="M19 12 A7 7 0 1 1 15.5 5.9" fill="none" stroke-width="3"/><path d="M13 2 L19 5 L14 10Z"/>`,
  home:   `<path d="M3 11 L12 4 L21 11Z"/><rect x="5" y="11" width="14" height="9"/><rect x="10" y="14" width="4" height="6" fill="#151b27"/>`,
  start:  `<path d="M3 9 L14 4 L14 20 L3 15Z"/><rect x="14" y="8" width="4" height="8"/><path d="M19 7 l3 -2 M19 12 h3 M19 17 l3 2" fill="none" stroke-width="2"/>`,
  calib:  `<path d="M7 21 L12 3 L17 21Z"/><path d="M12 17 L17 7" fill="none" stroke-width="2.5"/><circle cx="17" cy="7" r="2"/>`
};
export const icon = k => `<svg class="ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round">${I[k]}</svg>`;

// ---- 段落舞台 ----
// 每個段落一個專屬背景動畫，畫在漫畫格最底層。動畫週期綁 --beat（一拍的秒數），另有每拍觸發的 .beat 動作
const scooter = (y,d,dl) => `<g class="scoot" style="--d:${d};--dl:${dl}"><g transform="translate(0 ${y})"><circle cx="8" cy="12" r="5" fill="${K}"/><circle cx="34" cy="12" r="5" fill="${K}"/><path d="M6 6 h20 l8 6 h-28Z" fill="#e8604c" stroke="${K}" stroke-width="2"/><rect x="14" y="-6" width="9" height="12" rx="3" fill="#f2b632" stroke="${K}" stroke-width="2"/></g></g>`;
export const STAGES = [
  // 0 暖身：社區走讀——老公寓窗戶依序亮燈、路燈閃爍、機車呼嘯而過
  () => `<svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMax slice">
    ${[0,1,2,3,4,5].map(i=>{ const x=i*100+(i%2?10:0), h=110+((i*37)%60);
      return `<rect x="${x}" y="${250-h}" width="88" height="${h}" fill="#1a2232" stroke="${K}" stroke-width="3"/>`+
      [0,1,2].flatMap(c=>[0,1,2,3].filter(r=>r*28+20<h-20).map(r=>`<rect class="win" style="--dl:${((i*7+c*3+r*5)%12)*.25}" x="${x+12+c*24}" y="${250-h+16+r*28}" width="14" height="16" fill="#f2b632"/>`)).join(''); }).join('')}
    <g class="lamp"><rect x="470" y="70" width="6" height="180" fill="${K}"/><path d="M450 70 h40 l-8 14 h-24Z" fill="#3a4152" stroke="${K}" stroke-width="2"/><path class="glow" d="M458 84 L430 250 H520 L492 84Z" fill="#f2b632" opacity=".25"/></g>
    ${scooter(222,'3.2s','0s')}${scooter(228,'4.4s','1.6s')}
  </svg>`,
  // 1 加溫：菜市場——條紋雨遮、跟著拍子搖的燈泡、蒸籠冒煙
  () => `<svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMax slice">
    ${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<path d="M${i*50} 0 h50 v34 q-25 14 -50 0Z" fill="${i%2?'#fffdf5':'#e8604c'}" stroke="${K}" stroke-width="3"/>`).join('')}
    ${[60,180,300,420,540].map((x,i)=>`<g class="bulb" style="transform-origin:${x}px 34px;--dl:${i%2?.5:0}"><path d="M${x} 34 v40" stroke="${K}" stroke-width="2"/><circle cx="${x}" cy="82" r="10" fill="#f2b632" stroke="${K}" stroke-width="3"/></g>`).join('')}
    ${[0,1,2].map(i=>`<g transform="translate(${90+i*190} 190)"><rect x="0" y="0" width="90" height="60" fill="#c98b5e" stroke="${K}" stroke-width="3"/><ellipse cx="45" cy="0" rx="45" ry="10" fill="#e0a979" stroke="${K}" stroke-width="3"/>
      <path class="steam" style="--dl:${i*.4}" d="M30 -12 q-10 -18 0 -36 q10 -18 0 -36" fill="none" stroke="#fffdf5" stroke-width="5" stroke-linecap="round"/>
      <path class="steam" style="--dl:${i*.4+.6}" d="M60 -12 q10 -18 0 -36 q-10 -18 0 -36" fill="none" stroke="#fffdf5" stroke-width="5" stroke-linecap="round"/></g>`).join('')}
  </svg>`,
  // 2 衝刺：電視辯論前——兩道聚光燈交錯掃射、「直播中」燈號閃、攝影機
  () => `<svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMax slice">
    <path class="beam l" d="M60 0 L0 250 H200Z" fill="#fffdf5" opacity=".18"/>
    <path class="beam r" d="M540 0 L400 250 H600Z" fill="#fffdf5" opacity=".18"/>
    <g class="onair"><rect x="230" y="10" width="140" height="40" rx="6" fill="#e8604c" stroke="${K}" stroke-width="3"/><circle cx="252" cy="30" r="8" fill="#fffdf5"/><text x="312" y="38" text-anchor="middle" font-size="22" font-family="Huninn,Noto Sans TC,sans-serif" fill="#fffdf5">直播中</text></g>
    <g transform="translate(470 150)"><rect x="0" y="0" width="80" height="50" rx="4" fill="#3a4152" stroke="${K}" stroke-width="3"/><path d="M80 12 L110 0 V50 L80 38Z" fill="#26324a" stroke="${K}" stroke-width="3"/><circle class="rec" cx="14" cy="12" r="5" fill="#e8604c"/><path d="M30 50 L20 100 M50 50 L60 100 M40 50 V100" stroke="${K}" stroke-width="4"/></g>
    <rect x="0" y="232" width="600" height="18" fill="#26324a" stroke="${K}" stroke-width="3"/>
  </svg>`,
  // 3 選前之夜：人潮跟拍子跳、螢光棒揮舞、煙火
  () => `<svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMax slice">
    ${[[110,60,'#f2b632',0],[300,40,'#e8604c',.7],[490,70,'#5cc28f',1.3]].map(([x,y,c,d])=>`<g class="fw" style="transform-origin:${x}px ${y}px;--dl:${d}">${[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>{const a=k*Math.PI/6;return `<path d="M${x+Math.cos(a)*12} ${y+Math.sin(a)*12} L${x+Math.cos(a)*40} ${y+Math.sin(a)*40}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`}).join('')}</g>`).join('')}
    ${Array.from({length:14},(_,i)=>{const x=i*44+10, h=i%3; return `<g class="fan ${i%2?'odd':''}"><circle cx="${x+20}" cy="${190-h*6}" r="15" fill="#0b0f17" stroke="${K}" stroke-width="2"/><path d="M${x} 250 q20 -50 40 0Z" fill="#0b0f17"/>
      ${i%3===0?`<g class="stick" style="transform-origin:${x+34}px 210px"><path d="M${x+34} 210 L${x+44} 150" stroke="${['#5cc28f','#f2b632','#7fa6e8','#e8604c'][i%4]}" stroke-width="7" stroke-linecap="round"/></g>`:''}</g>`}).join('')}
  </svg>`
];
