// ---- chart data ----
// 譜面 JSON 格式見 charts/chapter1.json。
// type: N = 一般陳情、S = 臨場提問、D = 連珠炮（第七拍和第七拍半各按一次）
export const TYPES = ['N','S','D'];

export async function loadChart(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`譜面載入失敗：${url} (${res.status})`);
  const c = await res.json();
  if (!c.phrases?.length || c.phrases.some(p => !TYPES.includes(p.type))) throw new Error(`譜面格式錯誤：${url}`);
  const sections = (c.sections?.length ? c.sections : [{ from:0, name:'', layers:['kick','bass'] }]).slice().sort((a,b)=>a.from-b.from);
  return {
    bpm: c.bpm,
    beat: 60 / c.bpm,
    countIn: c.countIn ?? 4,
    phraseLength: c.phraseLength ?? 8,
    targetBeat: c.targetBeat ?? 6,
    progression: c.progression,
    sections,
    replies: c.replies,
    phrases: c.phrases,
    events: c.events ?? []
  };
}

// 第 p 題所屬段落
export function sectionOf(chart, p){
  let s = chart.sections[0];
  for (const x of chart.sections) if (x.from <= p) s = x;
  return s;
}

// 每題的判定點（相對於題目開頭的拍數）
export const targetsOf = (type, chart) => type==='D' ? [chart.targetBeat, chart.targetBeat + .5] : [chart.targetBeat];
