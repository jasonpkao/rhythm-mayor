// ---- judge ----
// 判定以「判定點」為單位（S.tg）：一般與臨場題一個點，連珠炮兩個點（第七拍、第七拍半）
import { targetTime } from './scheduler.js';
import { fb, setReply, drawTrack, hud, name, burst, aideAct, note } from './ui.js';
import { sectionOf } from './chart.js';

// 判定窗（秒）：p = 完美、g = 命中
export const WINDOWS = { N: {p:.045, g:.10}, D: {p:.045, g:.10}, S: {p:.022, g:.05}, L: {p:.045, g:.10} };
export const SEARCH = .2; // 超過這個距離就算空拍
const FAV = { perfect:4, good:2, assist:1, miss:{ N:-6, D:-6, S:-8 } };
const FAV_L = { perfect:2, good:1, assist:0, miss:-3 }; // 教學題一題按好幾下，每下分數縮小
const RANK = { perfect:0, good:1, assist:2, miss:3 };

const pick = a => a[Math.floor(Math.random()*a.length)];

// 找出離這次按鍵最近、尚未判定的判定點；回傳 null 表示空拍
export function classify(S, adj){
  let best=-1, bd=9;
  S.tg.forEach((g,k)=>{ if(g.judged||S.ph[g.p].assist) return; const d=adj-targetTime(S,g.p,g.off); if(Math.abs(d)<Math.abs(bd)){ bd=d; best=k; } });
  if (best<0 || Math.abs(bd)>SEARCH) return null;
  const w = WINDOWS[S.ph[S.tg[best].p].type], a=Math.abs(bd);
  return { k:best, res: a<=w.p?'perfect':a<=w.g?'good':'miss', d:bd };
}

export function judge(S,k,res,d){
  const g=S.tg[k], p=g.p, ph=S.ph[p];
  g.judged=true; g.result=res; S.stats[res]++;
  if (ph.result==null || RANK[res]>RANK[ph.result]) ph.result=res; // 題目顯示最差的那一下
  const mine = S.tg.filter(x=>x.p===p);
  ph.judged = mine.every(x=>x.judged);
  const multi = mine.length>1, last = ph.judged && multi;
  // 每段的體檢資料；第一次在這段按中時，告訴玩家剛剛那個東西叫什麼
  const sec = sectionOf(S.chart,p), si = S.chart.sections.indexOf(sec), ss = S.sec[si];
  if (res!=='assist'){ ss.tot++; if (res!=='miss'){ ss.hit++; if(d!=null) ss.offs.push(d); } }
  if (res!=='miss' && res!=='assist' && sec.named && !S.named.has(si)){ S.named.add(si); note('懂了：'+sec.named); }
  if (ph.type==='S'){ S.sTot++; if(res==='perfect'||res==='good') S.sHit++; }
  if (d!=null && res!=='miss') S.offs.push(d);
  S.fav = Math.max(0, Math.min(100, S.fav + (ph.type==='L' ? FAV_L[res] : res==='miss' ? FAV.miss[ph.type] : FAV[res])));
  const ms = d==null ? '' : ` ${d<0?'早':'晚'} ${Math.abs(Math.round(d*1000))} ms`;
  const R = S.chart.replies;
  const line = () => pick(ph.type==='S' ? R.spot : ph.type==='D' ? (R.double||R.hit) : R.hit);
  if (res==='perfect'){ fb('完美'+ms); burst(multi&&!last ? '好！' : '讚！','perfect'); if(!multi||last) setReply(`${name()}：${line()}`,'good'); }
  else if (res==='good'){ fb('命中'+ms); burst('好！','good'); if(!multi||last) setReply(`${name()}：${line()}`,'good'); }
  else if (res==='assist'){ fb('幕僚代答'); aideAct(); if(!multi||last) setReply('幕僚：這部分由我來補充說明。','aide'); }
  else { fb('漏拍'+ms); burst('漏！','miss'); setReply(ph.type==='S' ? '記者：……候選人沒有回答。' : ph.type==='L' ? '（掉了一下，沒關係，下一輪再跟上）' : '市民：……他是不是沒聽到？','bad'); }
  if (p===S.cur) drawTrack(ph, -2);
  hud(S);
}

// 每 frame 檢查：幕僚代答到點自動判定、超過命中窗判漏拍
export function autoJudge(S, heard, adj){
  S.tg.forEach((g,k)=>{
    if (g.judged) return;
    const ph=S.ph[g.p], T=targetTime(S,g.p,g.off);
    if (ph.assist && heard>=T) judge(S,k,'assist',null);
    else if (!ph.assist && adj > T + WINDOWS[ph.type].g) judge(S,k,'miss',null);
  });
}
