// ---- audio ----
export let ctx, master, bus;

export function ensureAudio(){
  if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = .7; master.connect(ctx.destination); newBus(); }
  if (ctx.state === 'suspended') ctx.resume();
}
// 每局（或每次校正）換一條新匯流排；斷開舊的就能切掉已排程但還沒播的聲音
export function newBus(){ if (bus) bus.disconnect(); bus = ctx.createGain(); bus.connect(master); }
export const pause = () => ctx.suspend();
export const resume = () => ctx.resume();
export const outLat = () => (ctx.outputLatency || 0) + (ctx.baseLatency || 0);

function env(g,t,v,d){ g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.004); g.gain.exponentialRampToValueAtTime(.0001,t+d); }
export function blip(t,f,d,type='sine',v=.25){ const o=ctx.createOscillator(),g=ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); env(g,t,v,d); o.connect(g).connect(bus); o.start(t); o.stop(t+d+.03); }
export function kick(t,v=.5){ const o=ctx.createOscillator(),g=ctx.createGain(); o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(45,t+.12); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+.18); o.connect(g).connect(bus); o.start(t); o.stop(t+.2); }
export function bass(t,f,beat){ const o=ctx.createOscillator(),g=ctx.createGain(); o.type='triangle'; o.frequency.setValueAtTime(f,t); env(g,t,.22,beat*3.6); o.connect(g).connect(bus); o.start(t); o.stop(t+beat*3.8); }
let noiseBuf;
export function snap(t,v=.35){
  if(!noiseBuf){ noiseBuf=ctx.createBuffer(1,ctx.sampleRate*.08,ctx.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length); }
  const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain(); s.buffer=noiseBuf; f.type='highpass'; f.frequency.value=1800; g.gain.value=v; s.connect(f).connect(g).connect(bus); s.start(t);
}
