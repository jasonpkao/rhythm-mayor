// ---- scheduler ----
// 拍點一律由 ctx.currentTime 推算；每 frame 排程未來 150ms 內的拍子，畫面事件放進 S.vis 佇列。
import { ctx, kick, blip, bass, snap } from './audio.js';

export const beatTime = (S,i) => S.t0 + i*S.chart.beat;
export const startTime = (S,p) => beatTime(S, S.chart.countIn + p*S.chart.phraseLength);
export const targetTime = (S,p) => beatTime(S, S.chart.countIn + p*S.chart.phraseLength + S.chart.targetBeat);

export function schedule(S){
  const { countIn:CI, phraseLength:PL, targetBeat:TARGET, beat:BEAT, progression:PROG } = S.chart;
  while (S.endT===null && beatTime(S,S.next) < ctx.currentTime + .15){
    const i=S.next, t=beatTime(S,i);
    if (i < CI){ kick(t,.5); blip(t, i===CI-1?880:660, .08, 'sine', .2); S.vis.push({t, k:'count', n:CI-i}); }
    else {
      const p=Math.floor((i-CI)/PL), b=(i-CI)%PL;
      if (p >= S.ph.length){ S.endT = t; break; }
      const ph=S.ph[p];
      kick(t, b%2===0 ? .42 : .22);
      if (b===0||b===4) bass(t, PROG[p%PROG.length], BEAT);
      if (ph.type==='N' && b<=5) blip(t, b===0?1040:880, .07, 'sine', .22);
      if (ph.type==='S' && b===5){ blip(t,990,.06,'square',.12); blip(t+BEAT/2,990,.06,'square',.12); }
      if (ph.assist && b===TARGET){ snap(t,.3); blip(t,523,.14,'triangle',.18); }
      S.vis.push({t, k:'beat', p, b});
    }
    S.next++;
  }
}

export function nextOpen(S){ const now=ctx.currentTime; return S.ph.findIndex((ph,i)=>startTime(S,i) > now+.2); }
