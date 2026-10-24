// ---- ui ----
import { nextOpen } from './scheduler.js';
import { sectionOf } from './chart.js';
import { portrait, candidate, aide, icon, STAGES } from './art.js';

export const $ = s => document.querySelector(s);
export let mode = 'title';

export function show(id){ ['title','calib','play','result'].forEach(k => $('#scr-'+k).hidden = k !== id); mode = id; }
export function showCalibNote(calib){ $('#calib-note').textContent = calib ? `延遲修正 ${calib>0?'+':''}${Math.round(calib*1000)} ms` : ''; }
export function setReply(txt,cls){ const r=$('#reply'); r.textContent=txt; r.className='reply '+cls; }
export function fb(txt){ $('#fb').textContent=txt; }
export const name = () => ($('#name').value.trim() || '候選人');

export function hud(S){
  $('#fav-n').textContent=S.fav; $('#fav-bar').style.width=S.fav+'%';
  $('#aide-n').textContent=S.meter; $('#aide-bar').style.width=S.meter+'%';
  $('#aide-wrap').classList.toggle('full', S.meter>=68);
}

// ---- track ----
// 每格一拍；判定點落在哪一格就標在哪一格，半拍標「跟」。教學題分成「聽」「換你」兩個小節
const cells = [];
let TARGET = 6, HALF = 4, LESSON = false, lastB = -1;
export function initTrack(chart){
  TARGET = chart.targetBeat; HALF = chart.phraseLength/2; LESSON = chart.phrases.some(p=>p.type==='L');
  $('#track').replaceChildren(); cells.length = 0;
  for (let i=0;i<chart.phraseLength;i++){ const c=document.createElement('div'); c.className='cell'; $('#track').appendChild(c); cells.push(c); }
  $('#track').classList.toggle('lesson', LESSON);
  drawTrack(null,-1);
}
const RANK = { perfect:0, good:1, assist:2, miss:3 };
export function drawTrack(ph,b){
  if (b===-2) b=lastB; else lastB=b;
  cells.forEach((c,i)=>{
    c.className='cell'+(LESSON&&i===HALF?' bar2':'');
    const num = LESSON ? (i%HALF)+1 : i+1;
    c.textContent = num;
    if (!ph) return;
    const L = ph.type==='L';
    const mine = (ph.tgs||[]).filter(g=>Math.floor(g.off)===i);
    const marks = mine.length ? mine.map(g=>g.off-i) : L && i<HALF ? ph.hits.filter(h=>Math.floor(h)===i).map(h=>h-i) : [];
    const h0 = marks.includes(0), h5 = marks.some(m=>m>0);
    if (marks.length) c.textContent = h0&&h5 ? `${num} 跟` : h5 ? '· 跟' : num;
    if (h5) c.classList.add('h5');
    if (ph.type==='S' && i<TARGET){ c.classList.add(i<TARGET-1?'hid':'alarm'); c.textContent = i<TARGET-1?'?':'!'; if(b>=i) c.classList.add('on'); return; }
    if (mine.length){
      c.classList.add('target');
      if (ph.type==='D') c.classList.add('dbl');
      const done = mine.filter(g=>g.judged);
      if (done.length) c.classList.add('r-'+done.reduce((w,g)=>RANK[g.result]>RANK[w]?g.result:w, 'perfect'));
      else if (L && ph.cue===0){ c.classList.add('blind'); c.textContent='?'; }
      if (b===i) c.classList.add('now');
    } else if (L ? !marks.length : i>TARGET) c.classList.add('rest');
    else if (L && marks.length) c.classList.add('demo');
    if (b>=i && !(L && i>=HALF && ph.cue===0 && mine.length)) c.classList.add('on');
  });
}

// 提示列：段落教學說明、「懂了」命名時刻
let noteT = 0;
export function note(txt, ms=6000){
  const bn=$('#banner'); bn.hidden=false; bn.className='banner tip'; bn.textContent=txt;
  const k=++noteT; setTimeout(()=>{ if(k===noteT) bn.hidden=true; }, ms);
}

// 按鈕美術：data-icon 的按鈕加小圖示，回應／幕僚鈕放角色
export function initArt(){
  document.querySelectorAll('button[data-icon]').forEach(b => b.insertAdjacentHTML('afterbegin', icon(b.dataset.icon)));
  $('#fig-cand').innerHTML = candidate();
  $('#fig-aide').innerHTML = aide();
}
// 換段落：換舞台背景，並讓段落標題大字甩進畫面
function enterSection(chart, sec){
  const i = chart.sections.indexOf(sec);
  const k = sec.stage ?? i;
  $('#stage').innerHTML = STAGES[k % STAGES.length]();
  $('#stage').dataset.s = k % STAGES.length;
  if (!sec.name) return;
  $('#caption').textContent = sec.name;
  if (sec.tip) note(sec.tip, chart.beat*chart.phraseLength*1500);
  const s=$('#slam'); s.innerHTML = `<small>第 ${i+1} 段</small>${sec.name}`; s.className='slam'; void s.offsetWidth; s.classList.add('go');
}
export function aideAct(){ const b=$('#btn-aide'); b.classList.remove('act'); void b.offsetWidth; b.classList.add('act'); }

export function updAideBtn(S){
  const p=nextOpen(S); const b=$('#btn-aide');
  b.disabled = p<0 || S.locked.has(p) || S.ph[p].forced || S.ph[p].assist;
}

// 畫面事件在「實際聽到」的時間才套用
export function applyVis(S,v){
  if (v.k==='count'){ $('#ask').textContent = v.n>1 ? `${v.n-1}…` : '開始'; $('#tag').textContent='準備'; return; }
  const ph=S.ph[v.p];
  const comic=$('#comic');
  if (v.b===0){
    S.cur=v.p;
    const sec=sectionOf(S.chart,v.p);
    if (sec.from===v.p) enterSection(S.chart, sec);
    comic.className='comic t-'+(ph.assist?'A':ph.type);
    comic.style.setProperty('--beat', S.chart.beat+'s');
    $('#who').textContent = ph.type==='S' ? '記者會' : (ph.who||'市民');
    $('#portrait').innerHTML = portrait(ph, v.p);
    // 連珠炮：題目一出現就跳大提示，第七拍前再閃一次
    const dbl=$('#double'); dbl.className='double'; if (ph.type==='D'){ void dbl.offsetWidth; dbl.classList.add('show'); if (sec.from===v.p && sec.name) dbl.classList.add('late'); }
    const img=$('#scene-img');
    if (ph.image){ img.src=ph.image; img.hidden=false; img.onerror=()=>img.hidden=true; } else img.hidden=true;
    const tag=$('#tag'); tag.className='tag'+(ph.type==='S'?' s':'')+(ph.assist?' a':'');
    tag.textContent = ph.type==='L' ? `第 ${v.p+1} / ${S.ph.length} 輪 · 先聽` : `第 ${v.p+1} / ${S.ph.length} 題 · ` + (ph.forced?'本人回答':ph.type==='S'?'臨場提問':ph.type==='D'?'連珠炮（按兩下）':'市民陳情') + (ph.assist?' · 幕僚代答':'');
    $('#ask').textContent = ph.forced ? `記者：剛剛都是幕僚在答，這題請候選人本人回答。${ph.text}` : (ph.type==='S' ? `記者：${ph.text}` : ph.text);
    setReply('','');
    updAideBtn(S);
  }
  if (ph.type==='L' && v.b===S.chart.phraseLength/2){
    const tag=$('#tag'); tag.className='tag you'+(ph.assist?' a':'');
    tag.textContent = `第 ${v.p+1} / ${S.ph.length} 輪 · ` + (ph.assist?'幕僚示範':ph.cue===0?'換你！（只靠耳朵）':'換你！');
    comic.classList.remove('you'); void comic.offsetWidth; comic.classList.add('you');
  }
  if (v.p===S.cur) drawTrack(ph, v.b);
  if (ph.type==='D' && v.b===S.chart.targetBeat-1){ const d=$('#double'); d.className='double'; void d.offsetWidth; d.classList.add('show','urgent'); }
  // 舞台每拍動一下（人潮跳、燈泡擺）；奇偶拍換方向
  const st=$('#stage'); st.classList.remove('beat','odd'); void st.offsetWidth; st.classList.add('beat'); if (v.b%2) st.classList.add('odd');
  if (v.b%2===0){ comic.classList.add('pulse'); setTimeout(()=>comic.classList.remove('pulse'),70); }
}

// 狀聲詞：讚！好！漏！
export function burst(txt,cls){
  const b=$('#burst'); b.textContent=txt; b.className='burst '+cls; void b.offsetWidth; b.classList.add('go');
  if (cls==='miss'){ const c=$('#comic'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
}
export function resetComic(){
  $('#comic').className='comic'; $('#caption').textContent='第一章'; $('#who').textContent='';
  $('#portrait').innerHTML=''; noteT++; $('#banner').hidden=true; $('#stage').innerHTML=''; $('#slam').className='slam'; $('#scene-img').hidden=true; $('#burst').className='burst'; $('#double').className='double';
}

const ms = x => `${x>0?'+':''}${Math.round(x*1000)} ms`;
const mean = a => a.reduce((x,y)=>x+y,0)/a.length;
const sd = a => Math.sqrt(mean(a.map(x=>(x-mean(a))**2)));
// 偏移點圖：中線是拍點，左早右晚，範圍 ±100ms
const strip = offs => `<svg class="strip" viewBox="-100 0 200 16" preserveAspectRatio="none"><line x1="0" y1="0" x2="0" y2="16"/>`+
  offs.map(d=>`<circle cx="${Math.max(-98,Math.min(98,d*1000)).toFixed(1)}" cy="8" r="3"/>`).join('')+`</svg>`;

function diagnose(S){
  const rows = S.chart.sections.map((sec,i)=>({ sec, ...S.sec[i] })).filter(r=>r.tot);
  const all = rows.flatMap(r=>r.offs);
  const tips = [];
  if (all.length>=4){
    const m=mean(all), v=sd(all);
    tips.push(m<-.015 ? `你習慣<b>搶拍</b>（平均早 ${Math.round(-m*1000)} ms）。等鼓聲「咚」真的出來再按，想像你在接球不是丟球。`
      : m>.015 ? `你習慣<b>拖拍</b>（平均晚 ${Math.round(m*1000)} ms）。跟著點頭，在頭往下點到底的那一瞬間按。`
      : `時間感很準，平均只差 ${Math.abs(Math.round(m*1000))} ms。`);
    tips.push(v>.04 ? `每一下的落點還在飄（散布 ±${Math.round(v*1000)} ms）。標題畫面把速度調到 70% 再練一輪，穩了再加速。`
      : `每一下都落在差不多的位置（散布 ±${Math.round(v*1000)} ms），這就是「穩」。`);
  }
  const weak = rows.filter(r=>r.hit/r.tot<.8).sort((a,b)=>a.hit/a.tot-b.hit/b.tot)[0];
  if (weak) tips.push(`最需要再練的是「${weak.sec.name}」：${weak.sec.tip}`);
  else if (rows.length) tips.push('四個概念都過關了。下一步：試著不看燈，邊玩邊跟著數「1 跟 2 跟」。');
  $('#diag').innerHTML = rows.map(r=>`<div class="drow"><div class="dname">${r.sec.name}<span class="mono">${r.hit}/${r.tot}${r.offs.length?' · '+ms(mean(r.offs)):''}</span></div>${strip(r.offs)}</div>`).join('')
    + `<div class="axis mono"><span>早 100ms</span><span>拍點</span><span>晚 100ms</span></div>`
    + `<ul class="tips">${tips.map(t=>`<li>${t}</li>`).join('')}</ul>`;
  return { rows, weak };
}

export function showResult(S){
  show('result');
  const st=S.stats, total=S.ph.length;
  const presses=st.perfect+st.good+st.miss, acc = presses ? (st.perfect+st.good)/presses : 0;
  const hits=S.ph.filter(p=>p.result==='perfect'||p.result==='good').length, missed=S.ph.filter(p=>p.result==='miss').length;
  const { weak } = diagnose(S);
  const grade = LESSON ? (acc>=.95?'S':acc>=.85?'A':acc>=.7?'B':'C') : (S.fav>=85?'S':S.fav>=70?'A':S.fav>=50?'B':'C');
  $('#grade').textContent=grade;
  $('#res-title').textContent = LESSON ? `${name()}・命中率 ${Math.round(acc*100)}%` : `${name()}・好感度 ${S.fav}`;
  if (LESSON){
    $('#h-pro').textContent = `${name()}的演講越來越有節奏感，${presses} 下接住 ${st.perfect+st.good} 下`;
    $('#h-con').textContent = weak ? `可惜一到「${weak.sec.name.split('：')[0]}」就亂了陣腳` : st.miss ? `還是漏了 ${st.miss} 下，節拍器般的穩定還差一點` : '批評者也只能說：穩得像節拍器';
  } else {
    $('#h-pro').textContent = S.assists
      ? `${name()}親自回應 ${hits} 位市民，團隊分工順暢，幕僚支援 ${S.assists} 次`
      : `${name()}全程親自上陣，${total} 題接住 ${hits} 題`;
    $('#h-con').textContent = S.assists
      ? `${S.assists} 題靠幕僚代答，臨場提問只接住 ${S.sHit}/${S.sTot}`
      : `臨場提問只接住 ${S.sHit}/${S.sTot}，漏掉 ${missed} 位市民`;
  }
  const avg = S.offs.length ? mean(S.offs) : 0;
  const rows=[['完美',st.perfect],['命中',st.good],['漏拍',st.miss],['幕僚代答',st.assist],
    ...(S.sTot?[['臨場提問接住',`${S.sHit} / ${S.sTot}`]]:[]),['被要求本人回答',S.events],['民調好感度',S.fav],['平均偏移',ms(avg)]];
  $('#stats').innerHTML = rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');
}
