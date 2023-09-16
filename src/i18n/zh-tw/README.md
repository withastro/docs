# Astro Docs 中文翻譯指南

感謝你有興趣對 Astro 文檔翻譯做出貢獻！  
提交改動前，別忘了閱讀 [i18n 指南](../../../contributor-guides/translating-astro-docs.md)，裡面包含了貢獻過程中需要知道的內容。  
也歡迎加入 Astro 的 [Discord 社群](https://astro.build/chat)與其他貢獻者們交流！

本指南旨在整理一份統一的格式及風格指南，使文檔讀起來更流暢並易於理解。  

編撰時參考了 [Vue 中文文档指南](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E7%BF%BB%E8%AF%91%E9%A1%BB%E7%9F%A5)。



## 1. 術語和用詞

### 1.1 術語表
> 部分參考[《重編國語辭典修訂本》](https://dict.revised.moe.edu.tw/index.jsp)

|原文                   |推薦翻譯             |備註                   |
|----------------------|--------------------|----------------------|
|Server-side Rendering |伺服器端渲染          |                      |
|integration           |整合                 |                      |
|import                |引入                 |                      |
|middleware            |中介層               |                       |
|adapter               |配接器               |                       |
|CLI                   |命令列               |                      |
|terminal              |終端機               |                      |
|package               |套件                 |                      |
|library               |庫                  |                       |
|islands               |群島                 |特指 Astro Islands     |
|routing               |路由                 |                       |
|recipe                |操作指南             |                       |
|experimental          |實驗性               |                       |
|escape                |跳脫                 |特指 Escape Character   |
|architecture          |架構                 |                       |
|framework             |框架                 |                       |
|reference             |參考                 |                       |
|deploy                |部署                 |                       |
|component             |組件                 |                       |
|migration             |遷移                 |                       |
|asset                 |資產                 |                       |
|reactive              |反應式               |                       |
|responsive            |響應式               |                       |
|docs                  |文檔                 |                       |
|configuration         |配置                 |                       |
|changelog             |變更日誌              |                       |
|hydration             |水合                 |                       |


### 1.2 中文用詞
> 部分參考[《重編國語辭典修訂本》](https://dict.revised.moe.edu.tw/index.jsp)及[《異體字字典》](https://dict.variants.moe.edu.tw/variants/rbt/home.do)

|中文             |說明               |
|----------------|-------------------|
|你              |而不使用「您」       |
|構建            |而不使用「建構」     |
|開發者           |而不使用「開發人員」  |
|應用程式         |而不使用「應用」      |
|舉例來說         |而不使用「舉個例子」等 |
|甚麼             |「什麼」為異體字     |
|其他             |並無「其它」一詞     |
|注釋             |並無「註釋」一詞     |
|優化             |並無「最佳化」一詞   |


### 1.3 特指名詞及品牌名稱
- 「JavaScript」或「ECMAScript」等詞語應**保留風格化寫法**，而非「Javascript」或「Ecmascript」
- 「npm」及「webpack」等產品 / 品牌名稱的應**保留風格化寫法**，而非「Npm」或「Webpack」


### 1.4 關於 MDN 中可查詢的前端術語
- 原則上，前端專業術語的翻譯優先**參考 MDN 中文譯文**，若無中文則**保留原文**。
- 原文中的 MDN 文檔連結建議轉換為 MDN 的中文譯文連結，但是鑒於 MDN 的中文翻譯也並不完善，所以：
    - 當條目有中文譯文時，將其手動**變更為 MDN 中文連結**，其餘則**保留原文連結**



## 2. 譯文格式

### 2.1 標點符號
> 參考[《重訂標點符號手冊》](https://language.moe.gov.tw/001/upload/files/site_content/m0001/hau/c2.htm)及[《W3C 中文排版需求》](https://w3c.github.io/clreq/#line_composition_rules_for_punctuation_marks)
- 除特殊情況外，所有中文標點符號應為**全形字元**
- 考慮到 `／` 在不同字體下渲染差異較大，分隔號應為前後包含空格的 `/`，如：`你好 / 世界`


### 2.2 代碼內聯與關鍵字
請使用**反單引號**（`）標記，例：
```md
調用 `window` 的 `alert()` 函式
```


### 2.3 中西文混排
> 部分參考[《W3C 中文排版需求》](https://w3c.github.io/clreq/#chinese_and_western_mixed_text_composition)
- 中文和英文之間**應**插入一個**半形空格**。如：`你好 Hello 世界`
- 全形標點與英文之間**不須**插入空格。如：`你好世界（Hello World）`
- 注意使用 Markdown 標記（如*斜體*、**粗體**或[超連結](#)等）時，應保證空格出現在欲分隔字詞的**外部**。如：
```md
遵守 **JavaScript 代碼規範**非常重要
遵守 [JavaScript 代碼規範](#foo)非常重要
詳見*中文 MDN* 的參考頁面
詳見[中文 MDN](#bar) 的參考頁面
```


### 2.4 代碼片段
- 代碼片段中的**注釋應翻譯為中文**，其餘部分應**保留原文**
- 日誌及執行結果等也應**保留原文**，以便和代碼邏輯保持一致



## 3. 翻譯建議

### 3.1 調整語序為中文習慣
例如：
> So far we've only been binding to simple property keys in our templates. But Vue.js actually supports the full power of JavaScript expressions inside all data bindings.

以上例句可譯為：「目前我們都只是在模板中綁定簡單的屬性鍵，但事實上 Vue.js 支援在任何資料綁定中使用 JavaScript 表達式」。


### 3.2 省略部分在原文中僅作完成句式的詞語
例如：
> When Vue is updating a list of elements rendered with v-for, by default it uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, Vue will patch each element in-place and make sure it reflects what should be rendered at that particular index.

像是「to match the order of the items」這樣的短語可以在**保證語意不變**的情況下簡化。  

以上例句可譯為：「Vue 預設按照『就地更新』的策略來更新透過 `v-for` 渲染的元素列表。當資料的順序改變時，Vue 不會隨之移動 DOM 元素的順序，而是就地更新每個元素，確保它反映應在指定索引位置上渲染的內容」。


### 3.3 補充連接詞使句子更加連貫
例如：
> The mustache tag will be replaced with the value of the msg property from the corresponding component instance. It will also be updated whenever the msg property changes.

可在句中加入如「然而」、「並且」或「即使……也……」等連接詞來使句子更加連貫。  

以上例句的後半句可譯為：「每當 `msg` 屬性發生改變時，綁定處的內容便會隨之更新」。


### 3.4 在尊重原文的前提下使讀者更容易理解

> TODO

### 3.5 譯文及原文行號應相對應
由於 Astro 文檔以 Markdown 撰寫，每一行形成一個自然段落，因此原則上應保持譯文及原文行號應相對應，以保證後續更新時不造成混淆。



## 4. 關於本指南
本指南**並非**硬性規定，而是代表中文文檔翻譯團隊共識的建議。  
如果你對本指南有任何想法或勘誤建議，歡迎透過創建 Issue 或是加入 [Discord 社群](https://astro.build/chat)中的 `#i18n-crew-zh` 頻道參與討論！