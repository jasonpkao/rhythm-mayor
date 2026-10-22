// ---- ui ----
import { nextOpen } from './scheduler.js';
import { sectionOf } from './chart.js';
import { portrait } from './art.js';

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
const cells = [];
let TARGET = 6;
export function initTrack(chart){
  TARGET = chart.targetBeat;
  $('#track').replaceChildren(); cells.length = 0;
  for (let i=0;i<chart.phraseLength;i++){ const c=document.createElement('div'); c.className='cell'; $('#track').appendChild(c); cells.push(c); }
  drawTrack(null,-1);
}
export function drawTrack(ph,b){
  cells.forEach((c,i)=>{
    c.className='cell'; c.textContent='';
    if(i===TARGET){ c.classList.add('target'); c.textContent= ph?.type==='D' ? `${TARGET+1}·` : TARGET+1; if(b===TARGET) c.classList.add('now'); if(ph&&ph.result) c.classList.add('r-'+ph.result); }
    else if(i>TARGET){ c.classList.add('rest'); }
    else if(!ph || ph.type!=='S'){ c.textContent=i+1; if(ph && b>=i) c.classList.add('on'); if(ph?.type==='D' && i===0){ c.classList.add('half'); c.textContent='1·'; } }
    else { if(i<TARGET-1){ c.classList.add('hid'); c.textContent='?'; } else { c.classList.add('alarm'); c.textContent='!'; if(b>=TARGET-1) c.classList.add('on'); } }
  });
}

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
    if (sec.from===v.p && sec.name) $('#caption').textContent=sec.name;
    comic.className='comic t-'+(ph.assist?'A':ph.type);
    $('#who').textContent = ph.type==='S' ? '記者會' : (ph.who||'市民');
    $('#portrait').innerHTML = portrait(ph, v.p);
    const img=$('#scene-img');
    if (ph.image){ img.src=ph.image; img.hidden=false; img.onerror=()=>img.hidden=true; } else img.hidden=true;
    const tag=$('#tag'); tag.className='tag'+(ph.type==='S'?' s':'')+(ph.assist?' a':'');
    tag.textContent = `第 ${v.p+1} / ${S.ph.length} 題 · ` + (ph.forced?'本人回答':ph.type==='S'?'臨場提問':ph.type==='D'?'連珠炮（按兩下）':'市民陳情') + (ph.assist?' · 幕僚代答':'');
    $('#ask').textContent = ph.forced ? `記者：剛剛都是幕僚在答，這題請候選人本人回答。${ph.text}` : (ph.type==='S' ? `記者：${ph.text}` : ph.text);
    setReply('','');
    updAideBtn(S);
  }
  if (v.p===S.cur) drawTrack(ph, v.b);
  if (v.b%2===0){ comic.classList.add('pulse'); setTimeout(()=>comic.classList.remove('pulse'),70); }
}

// 狀聲詞：讚！好！漏！
export function burst(txt,cls){
  const b=$('#burst'); b.textContent=txt; b.className='burst '+cls; void b.offsetWidth; b.classList.add('go');
  if (cls==='miss'){ const c=$('#comic'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
}
export function resetComic(){
  $('#comic').className='comic'; $('#caption').textContent='第一章'; $('#who').textContent='';
  $('#portrait').innerHTML=''; $('#scene-img').hidden=true; $('#burst').className='burst';
}

export function showResult(S){
  show('result');
  const st=S.stats, total=S.ph.length;
  const hits=S.ph.filter(p=>p.result==='perfect'||p.result==='good').length, missed=S.ph.filter(p=>p.result==='miss').length;
  const grade = S.fav>=85?'S':S.fav>=70?'A':S.fav>=50?'B':'C';
  $('#grade').textContent=grade;
  $('#res-title').textContent=`${name()}・好感度 ${S.fav}`;
  $('#h-pro').textContent = S.assists
    ? `${name()}親自回應 ${hits} 位市民，團隊分工順暢，幕僚支援 ${S.assists} 次`
    : `${name()}全程親自上陣，${total} 題接住 ${hits} 題`;
  $('#h-con').textContent = S.assists
    ? `${S.assists} 題靠幕僚代答，臨場提問只接住 ${S.sHit}/${S.sTot}`
    : `臨場提問只接住 ${S.sHit}/${S.sTot}，漏掉 ${missed} 位市民`;
  const avg = S.offs.length ? Math.round(S.offs.reduce((a,b)=>a+b,0)/S.offs.length*1000) : 0;
  const rows=[['完美',st.perfect],['命中',st.good],['漏拍',st.miss],['幕僚代答',st.assist],['臨場提問接住',`${S.sHit} / ${S.sTot}`],['被要求本人回答',S.events],['平均偏移',`${avg>0?'+':''}${avg} ms`]];
  $('#stats').innerHTML = rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');
}
