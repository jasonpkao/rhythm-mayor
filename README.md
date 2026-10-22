# 節奏市長 本機測試

ES modules 與 `fetch` 譜面在 `file://` 下會被瀏覽器擋，請用本機伺服器：

```sh
cd rhythm-mayor
python3 -m http.server 8000
```

瀏覽器開 http://localhost:8000 ，停止伺服器按 Ctrl+C。

改譜面：編輯 `charts/chapter1.json`，重新整理頁面即可。
