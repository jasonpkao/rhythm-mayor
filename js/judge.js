// ---- judge ----
import { targetTime } from './scheduler.js';
import { fb, setReply, drawTrack, hud, name } from './ui.js';

// 判定窗（秒）：p = 完美、g = 命中
export const WINDOWS = { N: {p:.045, g:.10}, S: {p:.022, g:.05} };
export const SEARCH = .2; // 超過這個距離就算空拍
const FAV = { perfect:4, good:2, assist:1, miss:{ N:-6, S:-8 } };

const pick = a => a[Math.floor(Math.random()*a.length)];

// 找出離這次按鍵最近、尚未判定的題目；回傳 null 表示空拍
export function classify(S, adj){
  let best=-1, bd=9;
  S.ph.forEach((ph,p)=>{ if(ph.judged||ph.assist) return; const d=adj-targetTime(S,p); if(Math.abs(d)<Math.abs(bd)){ bd=d; best=p; } });
  if (best<0 || Math.abs(bd)>SEARCH) return null;
  const w = WINDOWS[S.ph[best].type], a=Math.abs(bd);
  return { p:best, res: a<=w.p?'perfect':a<=w.g?'good':'miss', d:bd };
}

export function judge(S,p,res,d){
  const ph=S.ph[p]; ph.judged=true; ph.result=res; S.stats[res]++;
  if (ph.type==='S'){ S.sTot++; if(res==='perfect'||res==='good') S.sHit++; }
  if (d!=null && res!=='miss') S.offs.push(d);
  S.fav = Math.max(0, Math.min(100, S.fav + (res==='miss' ? FAV.miss[ph.type] : FAV[res])));
  const ms = d==null ? '' : ` ${d<0?'早':'晚'} ${Math.abs(Math.round(d*1000))} ms`;
  const R = S.chart.replies;
  if (res==='perfect'){ fb('完美'+ms); setReply(`${name()}：${pick(ph.type==='S'?R.spot:R.hit)}`,'good'); }
  else if (res==='good'){ fb('命中'+ms); setReply(`${name()}：${pick(ph.type==='S'?R.spot:R.hit)}`,'good'); }
  else if (res==='assist'){ fb('幕僚代答'); setReply('幕僚：這部分由我來補充說明。','aide'); }
  else { fb('漏拍'+ms); setReply(ph.type==='S' ? '記者：……候選人沒有回答。' : '市民：……他是不是沒聽到？','bad'); }
  if (p===S.cur) drawTrack(ph, S.chart.targetBeat);
  hud(S);
}

// 每 frame 檢查：幕僚代答到點自動判定、超過命中窗判漏拍
export function autoJudge(S, heard, adj){
  S.ph.forEach((ph,p)=>{
    if (ph.judged) return;
    const T=targetTime(S,p);
    if (ph.assist && heard>=T) judge(S,p,'assist',null);
    else if (!ph.assist && adj > T + WINDOWS[ph.type].g) judge(S,p,'miss',null);
  });
}
