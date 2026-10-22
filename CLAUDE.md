# 節奏市長（Rhythm Mayor）

單鍵節奏遊戲，玩法參考《節奏醫生》：前六拍是預告，玩家在第七拍按下按鍵，回應市民陳情。主角是原創虛構的市長候選人，名字由玩家輸入；角色和劇情不對應任何真實人物或政黨。

## 目前狀態
- 第一章 PoC，原生 JS（ES modules）+ Web Audio API，沒有外部依賴。需用本機伺服器開啟（見 `README.md`）。
  - `index.html` 畫面結構、`style.css` 樣式
  - `js/audio.js` 音效、`js/scheduler.js` 拍點排程、`js/judge.js` 判定與好感度、`js/ui.js` 畫面、`js/chart.js` 譜面載入、`js/main.js` 遊戲流程／校正／輸入
  - `charts/chapter1.json` 譜面（BPM、每題拍型與文字、回應台詞；`events` 預留給干擾事件）
  - `_backup/index.poc-single-file.html` 拆分前的單檔版本
- 已有：第七拍判定、臨場提問拍、幕僚接話與「誰在答詢」量表、好感度、延遲校正、結算畫面（支持者/批評者兩則標題）。

## 技術原則
- 所有節拍時間一律用 `audioContext.currentTime` 計算，不用 `setTimeout`／`setInterval` 決定拍點。
- 判定時間 = `ctx.currentTime - outputLatency - calib`；`calib` 由校正畫面取得，存在 localStorage。
- 排程採 lookahead：每個 frame 排程未來 150ms 內的拍子。
- 畫面事件放進佇列，等到「實際聽到」的時間才套用。

## 判定與數值
| 拍型 | 完美 | 命中 |
| --- | --- | --- |
| 一般陳情 | ±45ms | ±100ms |
| 臨場提問 | ±22ms | ±50ms |

好感度：完美 +4、命中 +2、幕僚代答 +1、漏拍 −6（臨場 −8）。幕僚接話每次 +34 量表，滿了下一題強制本人回答，之後兩題鎖住幕僚。

## 下一步（依序）
1. ~~拆模組~~、~~譜面 JSON~~（2026-10-22 完成）。
3. 加入干擾：宣傳車假鼓聲、手機推播遮擋畫面。
4. 加「固定政績」與既視感系統、「脫稿反擊」爆發段落。
5. 手感確認後再評估是否搬到 Godot 4。

## 規則
- 每次改判定或數值，先在 PoC 裡試玩確認，再改文件。
- 介面文字用繁體中文。
