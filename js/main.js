// ---- game, calibration, input ----
import { ctx, ensureAudio, newBus, pause, resume, outLat, blip, kick } from './audio.js';
import { schedule, nextOpen } from './scheduler.js';
import { classify, judge, autoJudge } from './judge.js';
import { $, mode, show, showCalibNote, setReply, fb, hud, initTrack, drawTrack, updAideBtn, applyVis, showResult } from './ui.js';
import { loadChart } from './chart.js';

const CHART_URL = 'charts/chapter1.json';
const CALIB_BEAT = 60 / 100; // 校正固定 100 BPM，不隨譜面改變

let S = null, C = null, chart;
let run = 0, paused = false; // run：每次開局 +1，讓舊局的 loop 與計時器自行結束
let calib = 0;
try { calib = parseFloat(localStorage.getItem('rm-calib')) || 0; } catch (e) {}
try { $('#name').value = localStorage.getItem('rm-name') || ''; } catch (e) {}
showCalibNote(calib);

// ---- game ----
function newGame(){
  const ph = chart.phrases.map(({type,text}) => ({ type, text, assist:false, forced:false, judged:false, result:null }));
  return { chart, ph, t0: ctx.currentTime + .6, next: 0, vis: [], fav: 50, meter: 0, assists: 0, events: 0, locked: new Set(),
    stats: { perfect:0, good:0, miss:0, assist:0 }, sTot: 0, sHit: 0, endT: null, cur: -1, offs: [] };
}

function press(){
  if (paused) return;
  const now=ctx.currentTime; blip(now,1320,.05,'square',.1);
  const btn=$('#btn-press'); btn.classList.add('hit'); setTimeout(()=>btn.classList.remove('hit'),80);
  const r = classify(S, now-outLat()-calib);
  if (!r){ fb('空拍'); return; }
  judge(S, r.p, r.res, r.d);
}

function assist(){
  if (paused) return;
  const p=nextOpen(S); if(p<0) return;
  const ph=S.ph[p];
  if (ph.assist){ fb('下一題已經安排幕僚'); return; }
  if (S.locked.has(p)||ph.forced){ fb('這題必須本人回答'); return; }
  ph.assist=true; S.assists++; S.meter=Math.min(100,S.meter+34);
  fb(`第 ${p+1} 題由幕僚代答`);
  if (S.meter>=100){
    const q=p+1;
    if (q<S.ph.length){ S.ph[q].type='S'; S.ph[q].forced=true; S.locked.add(q); S.locked.add(q+1); }
    S.meter=0; S.events++;
    const bn=$('#banner'); bn.hidden=false; bn.textContent='「誰在答詢」量表滿了：再下一題必須本人回答，而且接下來兩題不能找幕僚。';
    const r=run; setTimeout(()=>{ if(r===run) bn.hidden=true; }, chart.beat*chart.phraseLength*2*1000);
  }
  hud(S); updAideBtn(S);
}

function loop(id){
  if (mode!=='play' || id!==run) return;
  schedule(S);
  const heard = ctx.currentTime - outLat();
  while (S.vis.length && S.vis[0].t <= heard) applyVis(S, S.vis.shift());
  autoJudge(S, heard, heard - calib);
  if (S.endT!==null && heard > S.endT + chart.beat) return showResult(S);
  requestAnimationFrame(()=>loop(id));
}

function start(){
  ensureAudio(); newBus(); setPaused(false);
  try { localStorage.setItem('rm-name', $('#name').value.trim()); } catch(e){}
  S=newGame(); show('play'); hud(S); fb(''); setReply('',''); $('#banner').hidden=true; drawTrack(null,-1); updAideBtn(S);
  const id=++run; requestAnimationFrame(()=>loop(id));
}

// ---- pause ----
// 暫停直接凍結 AudioContext：currentTime 停住，已排程的拍子與判定時間一起停，繼續後不需重算
function setPaused(v){
  paused = v;
  if (ctx) v ? pause() : resume();
  $('#pause').hidden = !v;
  $('#scr-play').classList.toggle('paused', v);
  $('#btn-pause').innerHTML = v ? '繼續 <kbd>Esc</kbd>' : '暫停 <kbd>Esc</kbd>';
  if (v) $('#btn-resume').focus();
}
function quit(){ run++; setPaused(false); newBus(); show('title'); }

// ---- calibration ----
function calibStart(){
  ensureAudio(); newBus(); show('calib');
  const n=13, t0=ctx.currentTime+.6;
  C={t0,n,taps:[]};
  for(let i=0;i<n;i++){ const t=t0+i*CALIB_BEAT; kick(t,.5); blip(t,i<3?660:880,.07,'sine',.22); }
  const tick=()=>{ if(mode!=='calib') return; const h=ctx.currentTime-outLat(); const i=Math.floor((h-t0)/CALIB_BEAT);
    $('#calib-count').textContent = h<t0 ? '準備' : i<3 ? `聽 ${i+1}` : i<n ? `跟拍 ${i-2} / ${n-3}` : '計算中';
    if (h > t0+n*CALIB_BEAT+.3) return calibDone(); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function calibTap(){
  const adj=ctx.currentTime-outLat(); blip(ctx.currentTime,1320,.05,'square',.1);
  const k=Math.round((adj-C.t0)/CALIB_BEAT); if(k<3||k>=C.n) return;
  const d=adj-(C.t0+k*CALIB_BEAT); if(Math.abs(d)<.25) C.taps.push(d);
}
function calibDone(){
  if (C.taps.length>=4){ const s=[...C.taps].sort((a,b)=>a-b); calib=s[Math.floor(s.length/2)]; try{localStorage.setItem('rm-calib',calib)}catch(e){} }
  show('title'); showCalibNote(calib);
  if (C.taps.length<4) $('#calib-note').textContent='有效點擊太少，請再校正一次';
}

// ---- boot & input ----
try {
  chart = await loadChart(CHART_URL);
} catch (err) {
  $('#calib-note').textContent = location.protocol==='file:' ? '請用本機伺服器開啟（見 README），直接雙擊檔案無法載入譜面' : String(err.message);
  $('#btn-start').disabled = true;
  throw err;
}
initTrack(chart);

document.addEventListener('keydown', e=>{
  // 注音等輸入法選字時的 Enter 只是確認文字，不能觸發開始（keyCode 229 為舊版瀏覽器的組字中標記）
  if (e.target.id==='name') { if(e.code==='Enter' && !e.isComposing && e.keyCode!==229) start(); return; }
  if (e.repeat) return;
  if (e.code==='Space'){ e.preventDefault(); if(mode==='play') press(); else if(mode==='calib') calibTap(); }
  if (e.code==='KeyF' && mode==='play') assist();
  if (e.code==='Escape' && mode==='play') setPaused(!paused);
  if (e.code==='KeyR' && mode==='play') start();
});
$('#btn-press').addEventListener('pointerdown', e=>{ e.preventDefault(); press(); });
$('#btn-aide').addEventListener('pointerdown', e=>{ e.preventDefault(); if(!e.currentTarget.disabled) assist(); });
$('#calib-tap').addEventListener('pointerdown', e=>{ e.preventDefault(); calibTap(); });
$('#btn-start').addEventListener('click', start);
$('#btn-calib').addEventListener('click', calibStart);
$('#btn-again').addEventListener('click', start);
$('#btn-home').addEventListener('click', ()=>show('title'));
$('#btn-pause').addEventListener('click', ()=>setPaused(!paused));
$('#btn-resume').addEventListener('click', ()=>setPaused(false));
$('#btn-restart').addEventListener('click', start);
$('#btn-restart2').addEventListener('click', start);
$('#btn-quit').addEventListener('click', quit);
