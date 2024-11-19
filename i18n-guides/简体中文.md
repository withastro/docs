# Astro Docs 中文翻译指南

感谢你为 Astro 中文文档做出贡献！  
在提交改动之前，请阅读 [i18n 指南](https://contribute.docs.astro.build/guides/i18n/)，它含有翻译指南、提交流程、审查流程等很多有用的内容。同时也欢迎加入 Astro 的 [Discord 社区](https://astro.build/chat)！  
本中文翻译指南是在上述 i18n 指南的基础上针对中文翻译的补充说明，上述指南中已经存在的内容不再赘述。

和其他开源项目一样，我们的文档是由很多人自愿参与翻译的，参与翻译的人也会随着时间而变化。这篇翻译指南的目的是保证文档的翻译风格和质量的一致性，使文档读起来更加流畅易懂。

本翻译指南部分参照了 [Vue 中文文档指南](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E7%BF%BB%E8%AF%91%E9%A1%BB%E7%9F%A5)。

## 用词

对于可能不易于理解的翻译，可以在中文翻译后添加英文原文，例如：激活 (hydration)。

### 翻译术语表

在翻译和审查过程中如果发现了易错译、多处翻译不一致的词，可以讨论并添加到此表中。

| 英文原文                | 推荐译法        | 说明                                              |
| ----------------------- | --------------- | ------------------------------------------------- |
| [access](#access)       | 使用            |                                                   |
| accessibility           | 无障碍          |                                                   |
| adapter                 | 适配器          |                                                   |
| announce                | 读出            | 描述屏幕阅读器时作为 read out、speak 的近义词翻译 |
| architecture            | 架构            |                                                   |
| assistive technology    | 辅助技术        |                                                   |
| component               | 组件            |                                                   |
| endpoint                | 端点            |                                                   |
| escape                  | 转义            |                                                   |
| feed                    | 摘要            |                                                   |
| framework               | 框架            |                                                   |
| frontmatter             | *不翻译*        |                                                   |
| group                   | 分组            |                                                   |
| [hero](#hero)           | 主视觉          | 特指页面通常在顶部或首屏的一个区域                |
| [hydration](#hydration) | 激活            | 第一次出现时可以写为 `激活 (hydration)`           |
| integration             | 集成            |                                                   |
| island                  | 岛屿 / 群岛     | 根据实际情况选择更合适的译法                      |
| islands                 | 群岛            |                                                   |
| library                 | 库              |                                                   |
| locale                  | 区域 / 语言环境 |
| module                  | 模块            |                                                   |
| overrides               | 重写            |                                                   |
| package                 | 包              |                                                   |
| props                   | 参数            | Component props                                   |
| server-side rendering   | 服务端渲染      |                                                   |
| slot                    | 插槽            |                                                   |
| slug                    | *不翻译*        |                                                   |

#### Access

根据实际情况可以翻译成“使用”而不是“访问”，例：

> This will give you autocomplete and types when accessing `Astro.props`.

可以译为：“这样当使用 `Astro.props` 时就会有自动补全和类型提示。”

#### Hero

Hero：主视觉、主视觉区  
Hero image：主视觉图  
Hero section：主视觉区、主视觉区域

> (web design) An eye-catching, prominent image, used as an over-sized (almost background-like) header.

—— <https://en.wiktionary.org/wiki/hero_image>

> The term “hero image” in web design refers to a large, attention-grabbing picture with text typically shown in the above-the-fold area of the webpage, directly beneath the website header.

—— <https://vwo.com/glossary/hero-image/>

> The term “hero” was first used in the world of theater, and it was the prop (it’s usually called the [hero prop](https://en.wikipedia.org/wiki/Theatrical_property)) that is more detailed than usual because it’s meant to be seen or viewed in close range.

—— <https://foxxr.com/blog/epic-story-of-the-hero-image/>

#### Hydration

Hydration、hydrate：激活

可以根据实际情况酌情在每个页面或每个段落第一次出现的位置写作 `激活 (hydration)`，便于读者理解。

Vue 中文文档译为“激活”。  
React 中文文档没有翻译，保持了英文原文。

### 中文用词约定

| 中文用词 | 说明             |
| -------- | ---------------- |
| 你       | 不建议使用：您   |
| 其他     | 不建议使用：其它 |

### 前端术语

- 原则上，前端专业术语的译法优先参考 MDN 中文译法。
- 原文中出现的 MDN 文档链接，如果存在对应的中文翻译则转换为 MDN 的中文翻译链接，否则保持 MDN 英文原链接。

## 文本格式

中文排版格式可以参考[中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines)、[中文排版需求](https://w3c.github.io/clreq/)等。下述文本格式仅作为参考和建议，并非强制要求。文本格式与此指南完全相符不是审查通过和合并的前提条件。

### 标点符号

- 逗号、句号、分号、冒号、叹号、问号、顿号，使用全角字符：`，。；：！？、`
- 引号使用全角字符：`“”` 和 `‘’`
- 括号全角字符：`（）`。在与英文相邻时可以使用半角字符并在外侧添加空格：` () `
- 破折号使用：`——`
- 省略号使用：`……`
- 间隔号使用：`·`
- 书名号使用：`《》` 和 `〈〉`

### 空格的使用

- 中文和英文单词之间要有一个空格。如：`中文 English 中文`
- 全角标点符号两边没有空格。如：`中文，中文。“中文”中文。`
- 半角括号内侧没有空格，外侧如果是中文或英文则有一个空格，如果是其他标点符号则没有空格。如：`中文 (中文) 中文，(中文) 中文`
- 中文链接的左右不需要单独添加空格。如：`中文[链接](#foo)中文`
- 结合**加粗**、*斜体*、[链接](#空格的使用)等 Markdown 标记时，空格的用法和上述最终呈现的效果相同，紧挨着 Markdown 标记的空格应该出现在其外部。如：

  ```markdown
  遵守 **JavaScript 编码规范**非常重要
  遵守 [JavaScript 编码规范](#foo)非常重要
  更多信息详见*中文 MDN* 的介绍页面。
  更多信息详见[中文 MDN](#bar) 的介绍页面。
  ```

### 加粗和斜体

加粗和斜体的左右不需要单独添加空格。如：

```markdown
Astro 简单**好用**，值得*推荐*。
```

在翻译带有**加粗**和*斜体*的内容时需要注意最终渲染结果是否正确，尤其是在整句加粗或斜体时容易出现渲染错误的情况。

出现渲染错误时，可以使用 `<strong>` 和 `<em>` 来替代它们对应的 Markdown 标记，保持加粗、斜体的内容与英文原文对应。部分情况下也可以通过移动标点符号的位置来解决渲染错误的问题。添加空格会相对较明显地影响最终页面的显示效果，因此不推荐使用。

```markdown
渲染错误：**Astro 简单好用，值得推荐。**它的功能齐全且灵活。  
推荐方法：<strong>Astro 简单好用，值得推荐。</strong>它的功能齐全且灵活。  
酌情使用：**Astro 简单好用，值得推荐**。它的功能齐全且灵活。  
尽量不用：**Astro 简单好用，值得推荐。** 它的功能齐全且灵活。  

渲染错误：*Astro 简单好用，值得推荐。*它的功能齐全且灵活。  
推荐方法：<em>Astro 简单好用，值得推荐。</em>它的功能齐全且灵活。  
酌情使用：*Astro 简单好用，值得推荐*。它的功能齐全且灵活。  
尽量不用：*Astro 简单好用，值得推荐。* 它的功能齐全且灵活。  
```

> 渲染错误：**Astro 简单好用，值得推荐。**它的功能齐全且灵活。  
> 推荐方法：<strong>Astro 简单好用，值得推荐。</strong>它的功能齐全且灵活。  
> 酌情使用：**Astro 简单好用，值得推荐**。它的功能齐全且灵活。  
> 尽量不用：**Astro 简单好用，值得推荐。** 它的功能齐全且灵活。  
>
> 渲染错误：*Astro 简单好用，值得推荐。*它的功能齐全且灵活。  
> 推荐方法：<em>Astro 简单好用，值得推荐。</em>它的功能齐全且灵活。  
> 酌情使用：*Astro 简单好用，值得推荐*。它的功能齐全且灵活。  
> 尽量不用：*Astro 简单好用，值得推荐。* 它的功能齐全且灵活。  

## 代码片段

代码片段中的注释通常需要翻译成中文。  
代码片段中的其他部分保持与英文原文一致。

## 翻译建议

1. 调整语序为中文习惯，例如：

    > So far we've only been binding to simple property keys in our templates. But Vue.js actually supports the full power of JavaScript expressions inside all data bindings.

    可以译为“目前我们都是只通过模板语法绑定简单的 property 键值，但实际上，Vue.js 完全支持在所有的数据绑定中使用 JavaScript 表达式”。

1. 省略部分在外语中仅用于完成句式的词语，例如：

    > When Vue is updating a list of elements rendered with v-for, by default it uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, Vue will patch each element in-place and make sure it reflects what should be rendered at that particular index.

    像 `to match the order of the items` 这样的短语可以在保证语义不变的条件下简化，译为“Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染”。

1. 在句子之间补充类似“然而”、“并且”、“即使…也…”这样的关联词，使句子更加连贯，例如：

    > The mustache tag will be replaced with the value of the msg property from the corresponding component instance. It will also be updated whenever the msg property changes.

    后半句可以译为“只要绑定的组件实例上 msg property 发生改变，插值处的内容就会随之更新”。

1. 在尽可能地尊重原版内容的前提下，使读者理解起来更加容易。即，在修缮的同时，要保证译文所传达的内容（而非句式、语法等）是准确可靠的。

## 关于本指南

本指南并不是一份一成不变的规定，而是一份代表目前中文翻译团队的共识的建议。如果你对本文档中任何地方有意见和建议，可以提出 Discussion 或 Pull request，与其他翻译人员讨论、修改。
