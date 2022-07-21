---
layout: ~/layouts/MainLayout.astro
title: 元件
description: 關於 .astro 元件語法的介紹。
---

**Astro 元件**是 Astro 專案的基礎構建塊。它們是純 HTML、無需客戶端運行時的模板元件。

Astro 元件的語法是 HTML 的超集。該語法[設計地讓所有擁有編寫 HTML 或 JSX 經驗的人都感到熟悉](/zh-tw/comparing-astro-vs-other-tools/#astro-vs-jsx)，並增加包括對元件和 JavaScript 運算式的支援。你可以透過檔案擴展名 `.astro` 來建立新的 Astro 元件。

Astro 元件非常靈活的。通常情況下，Astro 元件會包含一些**可在頁面中複用的 UI**，如頁首或簡介卡。在其他時候，Astro 元件可能包含一個較小的 HTML 片段，像是常見的使 SEO 更好的 `<meta>` 標籤集合。Astro 元件甚至可以包含整個頁面佈局。

Astro 元件中最重要的一點是，它們在構建過程中會被**渲染成 HTML**。即使你在元件內運行 JavaScript 程式碼，它也會搶先一步運行從呈現給使用者的終端頁面中剝離出來。其最終使得網站變得更快，且預設不用任何 JavaScript。

## 元件概述

Astro 元件是由兩個主要部分所組成的——**元件指令碼**和**元件模板**。每個部分分工處理最終呈現出一個既容易使用，又有足夠的表現力來實現你的想象的框架。

```astro
---
// 元件指令碼（JavaScript）
---
<!-- Component Template (HTML + JS Expressions) -->
```

你也可以在其他元件中使用元件以建立更多高階 UI。例如 `Button` 元件可以被用來建立 `ButtonGroup` 元件，像是這樣。

```astro
---
// 示例：ButtonGroup.astro
import Button from './Button.astro';
---
<div>
  <Button title="Button 1" />
  <Button title="Button 2" />
  <Button title="Button 3" />
</div>
```

### 元件指令碼

Astro 使用程式碼柵欄（`---`）來識別 Astro 元件中的元件指令碼。如果你以前寫過 Markdown，你可能已經熟悉了叫做 *frontmatter* 類似概念。Astro 的元件指令碼的想法直接受到了這個概念的啓發。

你可以使用元件指令碼來編寫渲染模板所需 JavaScript 程式碼。這可以包括：

- 匯入其他 Astro 元件
- 匯入其他框架元件，如 React
- 匯入資料，如 JSON 檔案
- 從 API 或資料庫中獲取內容
- 建立你要在模板中引用的變數

```astro
---
// 注意：匯入必須位於檔案的頂部。
import SomeAstroComponent from '../components/SomeAstroComponent.astro';
import SomeReactComponent from '../components/SomeReactComponent.jsx';
import someData from '../data/pokemon.json';

// 訪問傳入的元件參數，如 `<X title="Hello, World"/>`
const {title} = Astro.props;
// 獲取外部資料，甚至可以從私有 API 和資料庫中獲取
const data = await fetch ('SOME_SECRET_API_URL/users').then (r => r.json ());
---
<!-- 你的模板在這！ -->
```

程式碼圍欄的設計是爲了保證你在其中編寫的 JavaScript 被「圍起來」。它不會逃到你的前端應用程式中，或落入你的使用者手中。你可以安全地在這裏寫一些昂貴或敏感的程式碼（比如呼叫你的私人資料庫），而不用擔心它會出現在你的使用者的瀏覽器中。

:::tip
你甚至可以在你的元件腳本中編寫 TypeScript！
:::

### 元件模板

在元件腳本下面的是元件模板。元件模板決定了你的元件的 HTML 輸出。

如果你在這裏寫普通的 HTML，你的元件將在任何 Astro 頁面上呈現它被匯入和使用的 HTML。

然而，Astro 的元件模板語法也支援 **JavaScript 運算式**、**匯入的元件**和**[特殊的 Astro 指令](/zh-tw/reference/directives-reference/)**。在元件腳本中定義的資料和值（在頁面構建時）可以在元件模板中使用，以產生動態建立的 HTML。

```astro
---
// 你的元件腳本在這！
import ReactPokemonComponent from '../components/ReactPokemonComponent.jsx';
const myFavoritePokemon = [/* ... */];
---
<!-- 支援 HTML 註釋！ -->

<h1>你好，世界！</h1>

<!-- 在元件腳本中使用參數或其他變數： -->
<p>我最喜歡的寶可夢是：{Astro.props.title}</p>

<!-- 包括其他帶有 `client:` 指令的激活元件： -->
<ReactPokemonComponent client:visible />

<!-- 混合 HTML 和 JavaScript 運算式，類似於 JSX： -->
<ul>
  {myFavoritePokemon.map ((data) => <li>{data.name}</li>)}
<ul>

<!-- 使用模板指令來在元素中插入未轉義的 HTML 字符串： -->
<p set:html={rawHTMLString} />
```

### JSX 運算式

你可以在 Astro 元件的 frontmatter 元件腳本內定義局部 JavaScript 變數。然後你就可以在元件的 HTML 模板中使用 JSX 運算式插入這些變數！

#### 變數

在 HTML 中可以透過大括號使用局部變數：

```astro
---
const name = "Astro";
---
<div>
 <h1>你好 {name}！</h1>  <!-- 輸出`<h1>你好 Astro！</h1>` -->
</div>
```

#### 動態屬性

這些局部變數可以用大括號來傳遞屬性值給 HTML 元素和元件。

```astro
---
const name = "Astro";
---
<h1 class={name}>Attribute expressions are supported</h1>

<MyComponent templateLiteralNameAttribute={`MyNameIs${name}`} />
```

#### 動態 HTML

局部變數可以在類似 JSX 的函式中使用，產生動態生成的 HTML 元素。

```astro
---
const items = ["Dog", "Cat", "Platypus"];
---
<ul>
  {items.map ((item) => (
    <li>{item}</li>
  ))}
</ul>
```

#### 片段和多元素

Astro 元件模板可以渲染多個元素，而無需像 JavaScript 或 JSX 將所有內容包裝在單個 `<div>` 或 `<>` 中。

```astro
---
// 多元素模板
---
<p>無需將元素包裹在一個元素中。</p>
<p>Astro 支援在模板中使用多根元素。</p>
```

但是，當使用類似運算式動態建立多元素時，你應該像在 JavaScript 或 JSX 中那樣將這些多個元素包裝在一個**片段** 中。Astro 支援使用 `<Fragment> </Fragment>` 或 `<> </>` 速記。

```astro
---
const items = ["狗", "貓", "鴨嘴獸"];
---
<ul>
  {items.map ((item) => (
    <>
      <li>紅色的{item}</li>
      <li>藍色的{item}</li>
      <li>綠色的{item}</li>
    </>
  ))}
</ul>
```

在使用 [`set:*` 指令](/zh-tw/reference/directives-reference/#sethtml)時，片段也用於避免使用包裝元素，如下所示：

```astro
---
const htmlString = '<p>原始 HTML 內容</p>';
---
<Fragment set:html={htmlString} />
```

### 元件參數

Astro 元件可以定義和接受參數。然後，這些參數可用於元件模板以呈現 HTML。可以在 frontmatter scsipt 中的 `Astro.props` 中使用。

這是一個接收 `greeting` 參數和 `name` 參數的元件示例。請注意，要接收的參數是從全域性 `Astro.props` 物件中解構的。

```astro
---
// 示例：GreetingHeadline.astro
// 使用：<GreetingHeadline greeting="Howdy" name="Partner" />
const { greeting, name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

你還可以使用 TypeScript 導出 `Props` 類型介面來定義參數。Astro 將自動選擇任何導出的 `props` 介面，併爲你的專案提供類型警告/錯誤提示。當從 `Astro.props` 解構時，這些參數也可以被賦予預設值。

```astro
---
//src/components/GreetingHeadline.astro
export interface Props {
  name: string;
  greeting?: string;
}

const { greeting = "Hello", name } = Astro.props as Props;
---
<h2>{greeting}, {name}!</h2>
```

當這個元件被其他 Astro 元件、佈局或頁面匯入和渲染時，可以將這些參數作爲屬性傳遞：

```astro
---
//src/components/GreetingCard.astro
import GreetingHeadline from './GreetingHeadline.astro';
const name = "Astro"
---
<h1>Greeting Card</h1>
<GreetingHeadline greeting="Hi" name={name} />
<p>I hope you have a wonderful day!</p>
```

### 插槽

`<slot />` 元素是嵌入外部 HTML 內容的佔位符，你可以將其他檔案中的子元素注入（或「嵌入」）到元件模板中。

預設情況下，傳遞給元件的所有子元素都將呈現在 `<slot />` 中。

:::note
與傳遞給 Astro 元件的屬性，可透過 `Astro.props ()` 在所有元件中使用的參數不同，*slots* 是在編寫它們的地方渲染子 HTML 元素。
:::

```astro
---
//src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot />  <!-- children will go here -->
  <Footer />
</div>
```

```astro
---
//src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper title="Fred's Page">
  <h2>All about Fred</h2>
  <p>Here is some stuff about Fred.</p>
</Wrapper>
```

這種模式是 Astro 佈局元件的基礎：整個頁面的 HTML 內容可以用 `<Layout></Layout>` 標籤包裹並傳遞到 Layout 元件以在常見頁面元素中呈現。

#### 命名插槽

Astro 元件也可以有命名插槽。這允許你僅將具有相應插槽名稱的 HTML 元素傳遞到插槽的位置。

```astro
---
//src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <slot name="after-header"/>  <!--  children with the `slot="after-header"` attribute will go here -->
  <Logo />
  <h1>{title}</h1>
  <slot />  <!--  children without a `slot`, or with `slot="default"` attribute will go here -->
  <Footer />
  <slot name="after-footer"/>  <!--  children with the `slot="after-footer"` attribute will go here -->
</div>
```

```astro
---
//src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper title="Fred's Page">
  <img src="https://my.photo/fred.jpg" slot="after-header">
  <h2>All about Fred</h2>
  <p>Here is some stuff about Fred.</p>
  <p slot="after-footer">Copyright 2022</p>
</Wrapper>
```

在要傳遞給元件相應的 `<slot name="my-slot"/>` 佔位符的子元素上使用 `slot="my-slot"` 屬性。

:::caution
這僅在你將插槽傳遞給其他 Astro 元件時纔有效。瞭解更多有關在 Astro 檔案中使用其他 [UI 框架元件](/zh-tw/core-concepts/framework-components/)的資訊。
:::

#### 插槽回退內容

插槽還可以渲染**回退內容**。當沒有匹配的子元素傳遞給插槽時，`<slot />` 元素將呈現其自己的佔位符子元素。

```astro
---
//src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot>
    <p>This is my fallback content, if there is no child passed into slot</p>
  </slot>
  <Footer />
</div>
```

### CSS 樣式

元件模板內部也支援 CSS `<style>` 標籤。

它們可用於設定元件樣式，並且所有樣式規則都自動僅限用於元件範圍內，以防止大型應用程式中的 CSS 衝突。

```astro
---
// 你的元件腳本在這！
---
<style>
  /* 僅限該元件範圍內，頁面上的其他 H1 保持不變 */
  h1 { color: red }
</style>

<h1>你好，世界！</h1>
```

:::caution
這裏定義的樣式只適用於元件模板中的內容。預設情況下，子元件和任何匯入的元件的樣式將**不會被修改**。
:::

📚 有關應用樣式的更多資訊，請參閱我們的[樣式指南](/zh-tw/guides/styling/)。

### 客戶端腳本

在不使用[使用框架元件](/zh-tw/core-concepts/framework-components/)（React、Svelte、Vue、Preact、SolidJS、AlpineJS、Lit）或 [Astro 整合](https://astro.build/integrations/)（例如 astro-XElement）時，你可以在 Astro 元件模板中使用 `<script>` 標籤使得該 JavaScript 可以在瀏覽器中使用。

預設情況下，`<script>` 標籤由 Astro 處理：

- 任何匯入都將被捆綁，允許你匯入本地檔案或 node 模組。
- 處理後的腳本將透過 [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 注入你頁面的`<head>`。
- 全面支援 TypeScript 包括匯入 TypeScript 檔案
- 如果你的元件在頁面上多次使用，則腳本標籤將只包含一次。

```astro
<script>
  // 處理！捆綁！TypeScript 支援！可以使用 ESM 匯入，甚至也適用於 npm 包。
</script>
```

要避免捆綁腳本，你可以使用 `is:inline` 屬性：

```astro
<script is:inline>
  // 將會完全按照寫好的內容呈現在 HTML 中！
  // ESM 匯入將不會相對於檔案進行解析。
</script>
```

上述方法可以自由搭配組合，也可以在同一個 `.astro` 檔案多次使用 `<script>` 標籤。

:::note
將 `type="module"` 或任何其他屬性新增到 `<script>` 標籤將禁用 Astro 的預設捆綁行爲，並將標籤視爲具有 `is:inline` 指令。
:::

📚 請參閱我們的[指令參考](/zh-tw/reference/directives-reference/#script--style-directives)頁面以獲取有關 `<script>` 標籤上可用指令的更多資訊。

#### 加載外部腳本

**什麼時候用？**如果你的 JavaScript 檔案處於 `public/` 中時。

請注意，當你使用下面提到的 `import` 方法時，該方法會跳過由 Astro 提供的 JavaScript 處理、捆綁和壓縮。

```astro
// 絕對路徑
<script is:inline src="/some-external-script.js"></script>
```

#### 使用 hoist 腳本

**什麼時候用？**如果你的外部腳本位於 `src/` 中，**並且**它支援 ESM 模組類型時。

Astro 檢測到這些 JavaScript 將在客戶端匯入，然後自動構建、壓縮並將 JS 新增到頁面中。

```astro
// ESM 匯入
<script>
  import './some-external-script.js';
</script>
```

## 下一步

📚 閱讀 [Astro 的内建元件](/zh-tw/reference/api-reference/#built-in-components)。

📚 瞭解如何在你的 Astro 專案中使用 [JavaScript 框架元件](/zh-tw/core-concepts/framework-components/)。
