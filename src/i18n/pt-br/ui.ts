import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'Pular para o Conteúdo',
	'a11y.sectionLink': 'Seção intitulada',
	'navbar.a11yTitle': 'Superior',
	// Site settings
	'site.title': 'Documentação do Astro',
	'site.description': 'Construa websites mais rápidos com menos JavaScript no lado do cliente.',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt':
		'a logo do astro em um estrelado pedaço do espaço, com um planeta roxo parecido com Saturno flutuando à direita',
	// Left Sidebar
	'leftSidebar.a11yTitle': 'Primária',
	'leftSidebar.learnTab': 'Aprenda',
	'leftSidebar.referenceTab': 'Referência',
	'leftSidebar.viewInEnglish': 'Veja em Inglês',
	'leftSidebar.sponsoredBy': 'Patrocinado por',
	// Right Sidebar
	'rightSidebar.onThisPage': 'Nesta página',
	'rightSidebar.overview': 'Visão geral',
	'rightSidebar.community': 'Comunidade',
	'rightSidebar.joinDiscord': 'Junte-se a nós no Discord',
	'rightSidebar.readBlog': 'Leia nossas postagens no blog',
	'rightSidebar.openCollective': 'Nossa Open Collective',
	'rightSidebar.contribute': 'Contribua',
	'rightSidebar.contributorGuides': 'Guias de Contribuidor',
	'rightSidebar.editPage': 'Edite esta página',
	'rightSidebar.translatePage': 'Traduza esta página',
	'rightSidebar.a11yTitle': 'Secundária',
	'rightSidebar.github': 'Documentação do Astro no GitHub',
	// Footer
	'footer.privacyPolicy': 'Política de Privacidade',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': 'Usar tema claro',
	'themeToggle.useDark': 'Usar tema escuro',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'Próxima página',
	'articleNav.prevPage': 'Página anterior',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'Adicionado em:',
	'since.new': 'Novo',
	'since.beta': 'Beta',
	// Installation Guide
	'install.autoTab': 'Interface de Linha de Comando Automática',
	'install.manualTab': 'Instalação Manual',
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': 'Guias de Deploy',
	'deploy.altSectionTitle': 'Mais Guias de Deploy',
	'deploy.filterLabel': 'Filtrar por tipo de deploy',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Estático',
	// CMS Guides vocabulary
	'cms.navTitle': 'Mais guias de CMS',
	// Migration Guides vocabulary
	'migration.navTitle': 'Mais guias de migração',
	// Recipes vocabulary
	'recipes.navTitle': 'Mais receitas',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': 'Receita relacionada:',
	'recipesLink.plural': 'Receitas relacionadas',
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'Veja todos os contribuidores',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'Esta página ainda não está disponível em sua língua, portanto estamos te mostrando a versão em Inglês. Você pode nos ajudar a traduzindo!',
	'fallbackContent.linkText': 'Aprenda mais sobre como você pode contribuir',
	// 404 Page
	'404.title': 'Não encontrado',
	'404.content': 'Esta página não está no nosso sistema solar.',
	'404.linkText': 'Me leve para casa.',
	// Aside component default labels
	'aside.note': 'Nota',
	'aside.tip': 'Dica',
	'aside.caution': 'Cuidado',
	'aside.danger': 'Perigo',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': 'Selecione a língua',
	// Integrations vocabulary
	'integrations.changelog': 'Registro de alterações',
	'integrations.footerTitle': 'Mais Integrações',
	'integrations.renderers': 'Frameworks de UI',
	'integrations.adapters': 'Adaptadores de SSR',
	'integrations.others': 'Outras',
	// Checklist component
	'checklist.or': 'ou',
	// Multiple Choice component
	'multipleChoice.defaultCorrect': 'Correto!',
	'multipleChoice.defaultIncorrect': 'Tente novamente!',
	'multipleChoice.submitLabel': 'Enviar',
	// Tutorial Progress
	'progress.todo': 'A fazer',
	'progress.done': 'Completo',
	// Tutorial Navigation
	'tutorial.trackerLabel': 'Progresso do Tutorial',
	'tutorial.unit': 'Unidade',
	// Tutorial
	'tutorial.getReady': 'Se prepare para...',
	// Feedback Fish widget
	'feedback.button': 'Nos dê feedback',
	'feedback.a11yLabel': 'Formulário de feedback',
	'feedback.formTitle': 'O que passa em sua cabeça?',
	'feedback.categoryGroupLabel': 'Escolha a categoria do feedback',
	'feedback.issue': 'Problema',
	'feedback.createIssue': 'Criar um problema no GitHub',
	'feedback.idea': 'Ideia',
	'feedback.other': 'Outro',
	'feedback.messageA11yLabel': 'Mensagem',
	'feedback.placeholder': 'O que você quer que saibamos?',
	'feedback.submit': 'Enviar feedback',
	'feedback.close': 'Fechar formulário de feedback',
	'feedback.success': 'Obrigado! Nós recebemos seu feedback.',
	// `<FileTree>` component
	'fileTree.directoryLabel': 'Diretório',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': 'Janela do terminal',
	'expressiveCode.copyButtonTooltip': 'Copiar para área de transferência',
	'expressiveCode.copyButtonCopied': 'Copiado!',
	// Backend Guides vocabulary
	'backend.navTitle': 'Mais guias de serviço de back-end',
	// Stubs vocabulary
	'stub.title': 'Expanda este esboço!',
	'stub.subtitle': 'Este guia é um esboço.',
	'stub.description.migration':
		'Quer contribuir para este guia? Tem uma postagem de blog, vídeo ou outro recurso para compartilhar sobre a migração desta tecnologia para o Astro?',
	'stub.description.cms': 'Sabe mais sobre como usar este CMS com Astro?',
	'stub.description.backend': 'Sabe mais sobre como usar este serviço de back-end com o Astro?',
});
