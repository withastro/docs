# Astro 공식 문서 한국어 번역 가이드

이 가이드는 Astro 공식 문서의 한국어 번역에 기여하려는 분들을 위해 작성되었습니다.

한국어 번역에 관심있는 분들은 [Astro 공식 Discord 서버](https://astro.build/chat)의 [한국어 번역 채널](https://discord.com/channels/830184174198718474/1073677243290767512)에 참여해주세요!

## 기본 규칙

- **원문의 의도를 유지하세요:** 가능한 한 문장의 어조와 방향이 영어 버전에 쓰여진 내용과 일치하도록 번역하세요.
- **쉬운 이해를 우선시하세요:** 정확한 번역과 쉽게 이해할 수 있는 번역 사이에서 선택해야 하는 경우, 이해하기 쉬운 번역을 선택합니다.

## 표준

간결하고 일관된 번역을 유지하기 위해 몇 가지 표준이 권장됩니다.

### 링크

- **외부 링크:** 외부 링크의 한국어 버전이 존재하는 경우 URL을 업데이트하여 한국어 버전의 링크로 이동할 수 있어야 합니다. 그렇지 않은 경우 기존 영어 페이지 URL을 유지합니다.
- **내부 링크:**
  - 로케일을 나타내는 경로인 `/en`을 `/ko`로 업데이트합니다.
  - 이동할 페이지가 아직 번역되지 않은 경우에도 `/en`을 `/ko`로 업데이트합니다. 단, ID는 영어 버전을 그대로 유지합니다.
  - 다른 페이지에서 링크된 페이지를 번역하는 경우에는 두 페이지의 업데이트를 모두 PR에 포함시킵니다.

### 코드

Astro API, JavaScript 또는 라이브러리의 일부가 아니라면 독자의 이해를 돕기 위해 주석, 문자열 데이터를 번역합니다.

예시:

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

번역:

```astro
---
// 예시: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>레이아웃에 포함된 페이지 콘텐츠</p>
</MySiteLayout>
```

### 기타

- 독자를 지칭하는 경우 `여러분` 이라는 표현을 사용하는 것을 권장합니다.
- `인라인 코드`가 디렉터리 또는 파일의 경로를 나타낸다면 디렉터리 또는 파일임을 명시하세요. 예: (`/src/pages` 디렉터리, `/src/pages/index.astro` 파일)

## 용어집

잘못된 번역을 발견했거나 새로운 번역을 추가하고 싶다면 새로운 PR을 생성하세요!

> `Markdown`, `Astro`, `TypeScript`, `React` 등 회사명, 제품명과 같은 고유한 이름은 한글로 번역하지 않습니다.

| 원문                | 번역          |
| :------------------ | :------------ |
| actions           | 액션     |
| changelog           | 변경 로그     |
| client-side         | 클라이언트 측 |
| component           | 컴포넌트      |
| configuration       | 구성          |
| content collections | 콘텐츠 컬렉션 |
| dependencies        | 종속성        |
| directive           | 지시어        |
| directory           | 디렉터리      |
| element             | 요소          |
| footer              | 푸터        |
| fragment            | 프래그먼트    |
| frontmatter         | 프런트매터    |
| guide               | 가이드        |
| header              | 헤더        |
| integration         | 통합          |
| island              | 아일랜드      |
| production          | 프로덕션      |
| release             | 릴리스        |
| resources           | 리소스        |
| server-side         | 서버 측       |
| syntax              | 구문          |
| troubleshooting     | 문제 해결     |
