// ---- scheduler ----
// 拍點一律由 ctx.currentTime 推算；每 frame 排程未來 150ms 內的拍子，畫面事件放進 S.vis 佇列。
import { ctx, kick, blip, bass, snap, hat, clap } from './audio.js';
import { sectionOf, targetsOf } from './chart.js';

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
      const half=PL/2, cut = ph.type==='L' ? half : TARGET;
      if (L.has('kick')) kick(t, b%4===0 ? .5 : b%2===0 ? .36 : .22); // 每小節第一拍最重
      if (L.has('bass') && (b===0||b===4)) bass(t, root, BEAT);
      if (L.has('hat')) { hat(t+BEAT/2, .1); if (b%2===1) hat(t, .06); }
      if (L.has('arp') && b<cut) blip(t+BEAT/4, root*[4,5,6,5,4,3][b], .05, 'triangle', .05);
      if (L.has('clap') && (b%4===1||b%4===3)) clap(t); // 2、4 拍的反拍
      // 預告：前六拍對應第七拍。連珠炮在第一拍多一聲半拍，暗示第七拍也要多按半拍
      // 教學：前一小節示範（高音＝重拍），後一小節 cue 2 時輕聲引導
      if (ph.type==='L'){
        if (b<half) ph.hits.filter(h=>Math.floor(h)===b).forEach(h=>blip(t+(h-b)*BEAT, h===0?1568:1175, .06, 'square', .13));
        else if (ph.cue>=2) targetsOf(ph,S.chart).filter(o=>Math.floor(o)===b).forEach(o=>blip(t+(o-b)*BEAT, 1175, .04, 'sine', .06));
      }
      if ((ph.type==='N'||ph.type==='D') && b<=5) blip(t, b===0?1040:880, .07, 'sine', .22);
      if (ph.type==='D' && b===0) blip(t+BEAT/2, 1240, .07, 'sine', .22);
      if (ph.type==='S' && b===5){ blip(t,990,.06,'square',.12); blip(t+BEAT/2,990,.06,'square',.12); }
      if (ph.assist) targetsOf(ph,S.chart).filter(o=>Math.floor(o)===b).forEach((o,j)=>{ snap(t+(o-b)*BEAT,.3); blip(t+(o-b)*BEAT, j?659:523, .14, 'triangle', .18); });
      S.vis.push({t, k:'beat', p, b});
    }
    S.next++;
  }
}

export function nextOpen(S){ const now=ctx.currentTime; return S.ph.findIndex((ph,i)=>startTime(S,i) > now+.2); }
