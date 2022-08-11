---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: إعداد محرر الشفرة
description: أعِد محرر الشفرة لبناء المشاريع مع Astro.
dir: rtl
---

خصص محرر الشفرة لتحسين تجربة التطوير مع Astro وفتح ميزات جديدة

## محرر VS Code

[محرر VS Code](https://code.visualstudio.com/) هو محرر شفرات شائع لمطوري الويب، من تطوير مايكروسوفت. نفس الشفرة التي بُني بها VS Code مستخدمة لتشغيل محررات الشفرات الشائعة في المتصفح مثل [GitHub Codespaces](https://github.com/features/codespaces) و [Gitpod](https://gitpod.io/).

يعمل Astro مع أي محرر شفرات، ولكنّا نوصي باستخدام VS Code لمشاريع Astro. نُقدم الامتداد الرسمي [Astro VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) الذي يفتح العديد من الميزات الرئيسية، وتحسينات تجربة التطوير على Astro.

- ابراز التعليمات البرمجية (syntax highlighting) لملفات `.astro`.
- دعم الأنواع للغة TypeScript على ملفات `.astro`.
- [اقتراحات VS Code](https://code.visualstudio.com/docs/editor/intellisense) لإكمال الشفرة، والتلميحات وغيرها.

لنبدأ! ثبّت [امتداد Astro VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) الآن.

📚 راجع [اعداد دعم TypeScript](/en/guides/typescript/) في مشاريع Astro.

## محررات شفرات برمجية أخرى

يقدم مجتمعنا المذهل عدة امتدادات للمحررات الشهيرة الأخرى، بما في ذلك:

- [امتداد VS Code على Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">دعم رسمي</Badge></span> - امتداد VS Code الرسمي الذي تحدثنا عنه أعلاه، متوفر أيضا على مستودع Open VSX للمحررات المبنية عليه مثل [VSCodium](https://vscodium.com/)
- [امتداد Nova](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/) <span style="margin: 0.25em;"><Badge variant="neutral">دعم مجتمعي</Badge></span> - يوفر ابراز تعليمات Astro البرمجية، وإكمالها على محرر Nova
- [مُلحق Vim](https://github.com/wuelnerdotexe/vim-astro) <span style="margin: 0.25em;"><Badge variant="neutral">دعم مجتمعي</Badge></span> - يوفر إبراز تعليمات Astro البرمجية، وطي الشفرة، وإزاحتها (indentation) على محررات Vim و Neovim
- ملحقات [LSP](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#astro) و [TreeSitter](https://github.com/virchau13/tree-sitter-astro) لـNeovim <span style="margin: 0.25em;"><Badge variant="neutral">دعم مجتمعي</Badge></span> - يوفر إبراز تعليمات Astro البرمجية، وتحليلها، وتوفير دعم الإكمال التلقائي في محرر Neovim

### بيئات تطوير JetBrains

نود دعم [Webstorm IDE](https://www.jetbrains.com/webstorm/). لكنه لا يدعم التقنيات التي نستخدمها لإنشاء الامتدادات (Astro يستخدم language servers لبناء الامتدادات)، وليس لدينا القدرة على انشاء وصيانة امتداد جديد كليًا. صوّت [لدعم Astro على JetBrains](https://youtrack.jetbrains.com/issue/WEB-52015/Astro-Language-Support)، تتبع تقدم التصويت، وابحث عن حلول من مجتمع JetBrains. 

مع ذلك بيئة [Fleet IDE](https://www.jetbrains.com/fleet/) القادمة من JetBrains _ستدعم_ التقنيات التي نستخدمها لانشاء الامتدادات (laguage servrs)، وحينها ستعمل أدواتنا بدون أي مشاكل.

## المحررات في المتصفح

بالإضافة للمحررات المثبة على جهازك، Astro يعمل بشكل جيد على المحررات السحابية (المحررات في المتصفح عموما)، ويشمل الدعم:

- [StackBlitz](https://stackblitz.com/) و [CodeSandbox](https://codesandbox.io/) - محررات سحابية تعمل من المتصفح، تدعم إبراز التعليمات البرمجية في ملفات `.astro` بدون اِعداد
- [GitHub.dev](https://github.dev/) - يسمح بتثبيت امتداد Astro VS Code [كملحق web](https://code.visualstudio.com/api/extension-guides/web-extensions), ليوفر بعض مزايا الامتداد, حاليا يوفر الدعم لإبراز تعليمات Astro فقط.
- [Gitpod](https://gitpod.io/) - بيئة تطوير سحابية كاملة يمكنها تثبيت امتداد Astro VS Code الرسمي من OpenVSX.

## أدوات أخرى

### ESLint

[ESLint](https://eslint.org/) أشهر أدوات اكتشاف الاخطاء في الشفرة البرمجية لـ JavaScript و JSX. يمكن تثبيت [ملحق يوفره المجتمع](https://github.com/ota-meshi/eslint-plugin-astro) لدعم Astro أيضا.

راجع [دليل المستخدم](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) لمعرفة المزيد حول تثبيت وإعداد ESLint لمشروعك.

### Prettier

[Prettier](https://prettier.io/) هو  [منسق](https://ar.wikipedia.org/wiki/برتي_برنت) شائع لشفرات JavaScript, HTML, CSS وغيرها. لدعم تجميل شفرات Astro، استخدم [ملحق Astro الرسمي لـ Prettier](https://github.com/withastro/prettier-plugin-astro).

للبدأ، ثبّت Prettier أولا، ثم ملحق Astro على Prettier:

```shell
npm install --save-dev prettier prettier-plugin-astro
```

يتعرف Prettier تلقائيا على ملحق Astro لمعالجة ملفات `.astro` عند تشغيله:

```shell
prettier --write .
```

راجع ملف README [لملحق Astro على Prettier](https://github.com/withastro/prettier-plugin-astro/blob/main/README.md) لمزيد من المعلومات حول الخيارات المدعومة وكيفية إعداد Prettier داخل VS Code والمزيد.

:::caution[الاستخدام مع مدير الحزم pnpm]
نظرًا لوجود مشكلات في Prettier ، فلن يتم اكتشاف ملحق Astro تلقائيًا عند استخدام [pnpm](https://pnpm.io/). من أجل العثور على الملحق، يجب إضافة الخيار التالي عند تشغيل Prettier:

```shell
prettier --write --plugin-search-dir=. .
```

استخدام Prettier في VS Code يحتاج بعض الإعداد الإضافي. راجع ملف README للملحق.
:::
