import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': '콘텐츠로 이동',
	'a11y.sectionLink': '섹션 제목: ',
	'navbar.a11yTitle': '탐색 메뉴',
	// Site settings
	'site.title': 'Astro 문서',
	'site.description': '더 적은 클라이언트 측 JavaScript로 더 빠른 웹사이트를 구축하세요.',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt':
		'오른쪽 전경에 보라색 토성과 같은 행성이 떠 있는 별이 빛나는 넓은 우주에 있는 Astro 로고',
	// Left Sidebar
	'leftSidebar.a11yTitle': '왼쪽 사이드바',
	'leftSidebar.learnTab': '배우기',
	'leftSidebar.referenceTab': '참조',
	'leftSidebar.viewInEnglish': '영어로 보기',
	'leftSidebar.sponsoredBy': '후원',
	// Right Sidebar
	'rightSidebar.a11yTitle': '오른쪽 사이드바',
	'rightSidebar.onThisPage': '목차',
	'rightSidebar.overview': '개요',
	'rightSidebar.community': '커뮤니티',
	'rightSidebar.joinDiscord': 'Discord',
	'rightSidebar.readBlog': '블로그',
	'rightSidebar.openCollective': 'Open Collective',
	'rightSidebar.contribute': '기여하기',
	'rightSidebar.contributorGuides': '기여자를 위한 안내서',
	'rightSidebar.editPage': '페이지 수정',
	'rightSidebar.translatePage': '이 페이지 번역',
	'rightSidebar.github': 'GitHub에서 Astro 문서 보기',
	// Footer
	'footer.privacyPolicy': '개인 정보 정책',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': '밝은 테마',
	'themeToggle.useDark': '어두운 테마',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': '다음 페이지',
	'articleNav.prevPage': '뒤로',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'Added in:',
	'since.new': 'New',
	'since.beta': 'Beta',
	// Installation Guide
	'install.autoTab': '자동 CLI',
	'install.manualTab': '수동 설치',
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': '배포 안내서',
	'deploy.altSectionTitle': '더 많은 배포 안내서',
	'deploy.filterLabel': '배포 타입에 따라 분류',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Static',
	// CMS Guides vocabulary
	'cms.navTitle': '더 많은 CMS 안내서',
	// Migration Guides vocabulary
	'migration.navTitle': '더 많은 전환 안내서',
	// Recipes vocabulary
	'recipes.navTitle': '더 많은 레시피',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': '관련 레시피:',
	'recipesLink.plural': '관련 레시피',
	// `<ContributorList>` fallback text
	'contributors.seeAll': '모든 기여자',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'이 페이지는 아직 한글로 번역되지 않았으므로 영어 버전의 페이지를 보게 됩니다. 번역에 참여해주세요.',
	'fallbackContent.linkText': '번역에 참여하는 방법',
	// 404 Page
	'404.title': '찾을 수 없음',
	'404.content': '이 페이지는 우리 태양계에 존재하지 않습니다.',
	'404.linkText': '홈페이지로 이동',
	// Aside component default labels
	'aside.note': '참고',
	'aside.tip': '팁',
	'aside.caution': '경고',
	'aside.danger': '주의',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': '언어 선택',
	// Integrations vocabulary
	'integrations.changelog': '변경 로그',
	'integrations.footerTitle': '더 많은 통합',
	'integrations.renderers': 'UI 프레임워크',
	'integrations.adapters': 'SSR 어댑터',
	'integrations.others': '기타',
	// Checklist component
	'checklist.or': '또는',
	// Multiple Choice component
	'multipleChoice.defaultCorrect': '정확해요!',
	'multipleChoice.defaultIncorrect': '다시 선택하세요!',
	'multipleChoice.submitLabel': '제출',
	// Tutorial Progress
	'progress.todo': '수행할 작업',
	'progress.done': '완료',
	// Tutorial Navigation
	'tutorial.trackerLabel': '튜토리얼 진행도',
	'tutorial.unit': '학습 단위',
	// Tutorial
	'tutorial.getReady': '요구 사항',
	// Feedback Fish widget
	'feedback.button': '새로운 의견이 있으신가요?',
	'feedback.a11yLabel': '피드백 양식',
	'feedback.formTitle': '여러분의 생각을 들려주세요!',
	'feedback.categoryGroupLabel': '어떤 종류의 의견인가요?',
	'feedback.issue': '문제 보고',
	'feedback.createIssue': 'GitHub Issue 생성',
	'feedback.idea': '새로운 아이디어',
	'feedback.other': '기타',
	'feedback.messageA11yLabel': '전달할 생각',
	'feedback.placeholder': '어떤 생각을 우리에게 전달하고 싶나요?',
	'feedback.submit': '제출',
	'feedback.close': '피드백 양식 닫기',
	'feedback.success': '여러분의 생각을 들려주셔서 감사합니다!',
	// `<FileTree>` component
	'fileTree.directoryLabel': '디렉터리',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': '터미널 창',
	'expressiveCode.copyButtonTooltip': '클립보드로 복사',
	'expressiveCode.copyButtonCopied': '복사 완료!',
	// Backend Guides vocabulary
	'backend.navTitle': '더 많은 백엔드 서비스 안내서',
	// Stubs vocabulary
	'stub.title': '이 게시물을 완성하는데 도움을 주세요!',
	'stub.subtitle': '이 게시물은 아직 작성 중입니다.',
	'stub.description.migration':
		'해당 기술에서 Astro로 전환하는 데 도움이 되는 글, 비디오 등 다양한 자료를 공유하고 싶으신가요?',
	'stub.description.cms': 'Astro에서 이 CMS를 사용하는 방법에 대해 잘 알고 계신가요?',
	'stub.description.backend':
		'Astro에서 이 백엔드 서비스를 사용하는 방법에 대해 더 잘 알고 계신가요?',
});
