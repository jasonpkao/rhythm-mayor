// ---- chart data ----
// 譜面 JSON 格式見 charts/chapter1.json。type: N = 一般陳情、S = 臨場提問。
export async function loadChart(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`譜面載入失敗：${url} (${res.status})`);
  const c = await res.json();
  if (!c.phrases?.length || c.phrases.some(p => p.type!=='N' && p.type!=='S')) throw new Error(`譜面格式錯誤：${url}`);
  return {
    bpm: c.bpm,
    beat: 60 / c.bpm,
    countIn: c.countIn ?? 4,
    phraseLength: c.phraseLength ?? 8,
    targetBeat: c.targetBeat ?? 6,
    progression: c.progression,
    replies: c.replies,
    phrases: c.phrases,
    events: c.events ?? []
  };
}
