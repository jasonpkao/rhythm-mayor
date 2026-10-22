// ---- scheduler ----
// 拍點一律由 ctx.currentTime 推算；每 frame 排程未來 150ms 內的拍子，畫面事件放進 S.vis 佇列。
import { ctx, kick, blip, bass, snap, hat, clap } from './audio.js';
import { sectionOf } from './chart.js';

export const beatTime = (S,i) => S.t0 + i*S.chart.beat;
export const startTime = (S,p) => beatTime(S, S.chart.countIn + p*S.chart.phraseLength);
export const targetTime = (S,p,off=S.chart.targetBeat) => beatTime(S, S.chart.countIn + p*S.chart.phraseLength + off);

export function schedule(S){
  const { countIn:CI, phraseLength:PL, targetBeat:TARGET, beat:BEAT } = S.chart;
  while (S.endT===null && beatTime(S,S.next) < ctx.currentTime + .15){
    const i=S.next, t=beatTime(S,i);
    if (i < CI){ kick(t,.5); blip(t, i===CI-1?880:660, .08, 'sine', .2); S.vis.push({t, k:'count', n:CI-i}); }
    else {
      const p=Math.floor((i-CI)/PL), b=(i-CI)%PL;
      if (p >= S.ph.length){ S.endT = t; break; }
      const ph=S.ph[p], sec=sectionOf(S.chart,p), L=new Set(sec.layers), PROG=sec.progression || S.chart.progression;
      const root=PROG[p%PROG.length];
      // 伴奏層：段落越後面越熱鬧，但第七拍（判定拍）不放額外打擊，避免混淆
      if (L.has('kick')) kick(t, b%2===0 ? .42 : .22);
      if (L.has('bass') && (b===0||b===4)) bass(t, root, BEAT);
      if (L.has('hat')) { hat(t+BEAT/2, .1); if (b%2===1) hat(t, .06); }
      if (L.has('arp') && b<TARGET) blip(t+BEAT/4, root*[4,5,6,5,4,3][b], .05, 'triangle', .05);
      if (L.has('clap') && (b===2||b===4)) clap(t);
      // 預告：前六拍對應第七拍。連珠炮在第一拍多一聲半拍，暗示第七拍也要多按半拍
      if (ph.type!=='S' && b<=5) blip(t, b===0?1040:880, .07, 'sine', .22);
      if (ph.type==='D' && b===0) blip(t+BEAT/2, 1240, .07, 'sine', .22);
      if (ph.type==='S' && b===5){ blip(t,990,.06,'square',.12); blip(t+BEAT/2,990,.06,'square',.12); }
      if (ph.assist && b===TARGET){
        snap(t,.3); blip(t,523,.14,'triangle',.18);
        if (ph.type==='D'){ snap(t+BEAT/2,.3); blip(t+BEAT/2,659,.14,'triangle',.18); }
      }
      S.vis.push({t, k:'beat', p, b});
    }
    S.next++;
  }
}

export function nextOpen(S){ const now=ctx.currentTime; return S.ph.findIndex((ph,i)=>startTime(S,i) > now+.2); }
