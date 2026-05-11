---
title: 假文章三：排序與列表
description: 用 date 欄位配合 order，可以控制文章顯示順序。
date: 2026-05-10
---

這篇文章的 `date` 設得比較新，若使用 `order('date', 'DESC')`，它會出現在列表最上方。

### 待辦感清單

1. 建立 `content.config.ts`
2. 在 `content/` 放 Markdown
3. 用 `queryCollection` + `ContentRenderer` 呈現

完成後就可以開始寫真正的文章了。
