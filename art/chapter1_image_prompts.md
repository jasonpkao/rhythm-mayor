# 第一章 插圖提示詞（美式漫畫風）

每題一張，對應 `charts/chapter1.json` 的 `phrases` 順序。建議檔名 `art/ch1_01.png` … `ch1_16.png`。

## 共用設定（每次生成都附上）

**Style:** American comic book illustration, bold black ink outlines, cel shading with halftone dot texture, flat saturated colors (mustard yellow #f2b632, coral red #e8604c, mint green #5cc28f, steel blue #7fa6e8) on a dark navy night palette (#151b27), dramatic angles, Silver-Age-meets-modern-indie look. Horizontal 16:9, single panel, no speech bubbles, no text, no logos, no real people, no real political parties or flags.

**Setting:** a fictional Taiwanese-style city at night during the last month of a mayoral election — scooters, convenience stores, narrow alleys, mixed-use apartment blocks.

**Recurring characters (keep consistent):**
- *The Candidate*: a fictional mayoral candidate in their 40s, gender-ambiguous, short neat hair, rolled-up white shirt sleeves, a yellow campaign sash with no writing. Usually seen from behind or three-quarter view so the player can imagine themselves.
- *The Aide*: a young campaign staffer with round glasses, a navy blazer, a clipboard and an earpiece.
- *Reporters* (spot questions only): a crowd of microphones and camera flashes, faces partly hidden by glare.

**Negative prompt:** text, letters, watermark, real politician likeness, party symbols, national flags, gore, photorealism.

---

## 一般陳情（N）：市民面向鏡頭說話，畫面偏暖

| # | 陳情 | Prompt |
|---|---|---|
| 01 | 早上捷運擠不上去，可以加班次嗎？ | A frustrated office worker in a suit squeezed against the doors of a packed metro train at rush hour, arms full with a briefcase and breakfast, looking pleadingly at the viewer; commuters pressed like sardines behind the glass, speed lines, morning light rays cutting through the station. |
| 02 | 巷口路燈壞三天了，晚上好暗。 | A middle-aged woman holding up a flashlight under a dead, flickering streetlamp at the mouth of a narrow alley, deep black shadows swallowing the lane behind her, a stray cat's glowing eyes in the dark, moody noir lighting. |
| 03 | 夜市太吵，我們樓上睡不著。 | A tired resident in pajamas leaning out of a second-floor apartment window with pillow over one ear, below them a blazing chaotic night market with neon food stalls, sizzling grills and loudspeakers drawn with jagged sound-effect shapes (no letters). |
| 05 | 公園溜滑梯什麼時候修好？ | A small child and a grandparent standing in front of a broken playground slide wrapped in caution tape with a cracked plastic chute, the child pointing up at the viewer with a pouty face, late-afternoon park, warm halftone sky. |
| 06 | 公車站可以加個遮雨棚嗎？ | A student and an elderly man huddled at a bare bus stop pole in pouring rain, one tiny umbrella between them, splashes from a passing bus drawn as dramatic water arcs, blue-grey storm palette. |
| 08 | 人行道都被機車停滿了。 | A mother pushing a stroller forced onto the street because the sidewalk is completely blocked by rows of parked scooters, cars zooming past with motion blur, she glares at the viewer, low dramatic angle. |
| 09 | 老公寓沒電梯，阿嬤下不了樓。 | A grandmother with a cane at the top of a steep, narrow five-story walk-up stairwell, her grandson holding her arm and looking at the viewer for help, vertiginous top-down perspective of the stairs spiraling down. |
| 10 | 垃圾車可以晚一點來嗎？我下班趕不上。 | A young worker in a uniform sprinting down the street holding two garbage bags, a yellow garbage truck disappearing around the corner ahead, wristwatch showing late evening, comic speed lines and sweat drops. |
| 12 | 河濱步道的燈可以開晚一點嗎？ | A jogger in a reflective vest stopped on a dark riverside path, lamps along the path switched off in sequence behind them, city lights reflected in the river, cool blue night with a single pool of light. |
| 13 | 颱風前水溝可以先清一下嗎？ | A shopkeeper crouched by a clogged storm drain stuffed with leaves and plastic bags, ominous swirling typhoon clouds overhead, wind bending trees, sandbags stacked by their shop door, high-tension dramatic sky. |
| 16 | 學校門口接送好危險。 | Chaotic school gate at pick-up time: double-parked cars, scooters weaving, a crossing guard with a flag blowing a whistle, a small kid with a big backpack holding a parent's hand at the curb, bird's-eye comic panel composition. |

## 臨場提問（S）：記者包圍，畫面偏冷、壓迫感

| # | 提問 | Prompt |
|---|---|---|
| 04 | 這項政見的預算從哪裡來？ | The Candidate seen from behind facing a wall of thrust-out microphones and blinding camera flashes, a reporter in front holding up a tablet with a big red downward chart (no numbers), coral-red rim lighting, tense close-up, sweat drop on the Candidate's neck. |
| 07 | 您自己平常怎麼通勤？ | A reporter pointing knowingly past the Candidate toward a shiny black chauffeured sedan parked behind them, other reporters leaning in with smirks, flash bursts, awkward-moment composition with the Candidate glancing back. |
| 11 | 昨晚停電，您第一時間在哪？ | Split panel: left side a dark city block in a blackout with residents holding phone flashlights; right side the Candidate surrounded by reporters under harsh flash lights, a microphone shoved toward their face, dramatic diagonal panel border. |
| 14 | 可以不看稿講三十秒嗎？ | Close-up of the Aide's hand pulling a stack of cue cards away from the Candidate's podium, a reporter holding up a stopwatch, the Candidate's eyes wide in a dramatic extreme close-up with speed lines radiating outward. |
| 15 | 哪一項承諾最可能做不到？ | The Candidate standing in front of a campaign billboard covered with many blank promise icons (house, bus, tree, school), one icon cracking apart, reporters' shadows looming large across the billboard, low-angle heroic-but-uneasy shot. |

## 被要求本人回答（量表滿時的強制題，可共用一張）

| # | 情境 | Prompt |
|---|---|---|
| F | 記者：剛剛都是幕僚在答，這題請候選人本人回答。 | The Aide being gently but firmly blocked by a reporter's outstretched arm, while a spotlight snaps onto the Candidate alone at center stage; all microphones swing toward the Candidate in unison, motion arcs, high-contrast spotlight with deep shadows. |
