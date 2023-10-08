import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'Ir al contenido',
	'a11y.sectionLink': 'Sección titulada',
	'navbar.a11yTitle': 'Inicio',
	// Configuración del sitio
	'site.title': 'Documentación de Astro',
	'site.description':
		'Construye sitios web más rápidos con menos JavaScript en el lado del cliente.',
	'site.og.imageSrc': '/default-og-image.webp?v=1',
	'site.og.imageAlt':
		'Logo de Astro en un espacio estrellado, con un planeta púrpura similar a Saturno flotando en el primer plano derecho',
	// Barra lateral izquierda
	'leftSidebar.a11yTitle': 'Primario',
	'leftSidebar.learnTab': 'Aprender',
	'leftSidebar.referenceTab': 'Referencia',
	'leftSidebar.viewInEnglish': 'Ver en inglés',
	'leftSidebar.sponsoredBy': 'Patrocinado por',
	// Barra lateral derecha
	'rightSidebar.a11yTitle': 'Secundario',
	'rightSidebar.onThisPage': 'En esta página',
	'rightSidebar.overview': 'Sinopsis',
	'rightSidebar.community': 'Comunidad',
	'rightSidebar.joinDiscord': 'Únete a nuestro Discord',
	'rightSidebar.readBlog': 'Lee nuestras publicaciones en el blog',
	'rightSidebar.openCollective': 'Nuestro Open Collective',
	'rightSidebar.contribute': 'Contribuir',
	'rightSidebar.contributorGuides': 'Guías para colaboradores',
	'rightSidebar.editPage': 'Editar esta página',
	'rightSidebar.translatePage': 'Traducir esta página',
	'rightSidebar.github': 'Documentación de Astro en GitHub',
	// Pie de página
	'footer.privacyPolicy': 'Política de privacidad',
	// Etiquetas de accesibilidad para <ThemeToggleButton>
	'themeToggle.useLight': 'Usar tema claro',
	'themeToggle.useDark': 'Usar tema oscuro',
	// Se utiliza en los enlaces de página anterior/siguiente en la parte inferior de las páginas
	'articleNav.nextPage': 'Siguiente página',
	'articleNav.prevPage': 'Atrás',
	// Se utiliza en <Since>: Agregado en: v0.24.0 [NUEVO]
	'since.addedIn': 'Agregado en:',
	'since.new': 'Nuevo',
	'since.beta': 'Beta',
	// Guía de instalación
	'install.autoTab': 'CLI automática',
	'install.manualTab': 'Configuración manual',
	// Vocabulario de <DeployGuidesNav>
	'deploy.sectionTitle': 'Guías de implementación',
	'deploy.altSectionTitle': 'Más guías de implementación',
	'deploy.filterLabel': 'Filtrar por tipo de implementación',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Estático',
	// Vocabulario de guías de CMS
	'cms.navTitle': 'Más guías de CMS',
	// Vocabulario de guías de migración
	'migration.navTitle': 'Más guías de migración',
	// Vocabulario de recetas
	'recipes.navTitle': 'Más recetas',
	// Vocabulario de <RecipeLinks>
	'recipesLink.singular': 'Receta relacionada:',
	'recipesLink.plural': 'Recetas relacionadas',
	// Texto de respaldo para <ContributorList>
	'contributors.seeAll': 'Ver todos los colaboradores',
	// Aviso de contenido de respaldo que se muestra cuando una página aún no está traducida
	'fallbackContent.notice':
		'Esta página aún no está disponible en tu idioma, así que te mostramos la versión en inglés. ¡Puedes ayudar traduciéndola!',
	'fallbackContent.linkText': 'Obtén más información sobre cómo contribuir',
	// Página 404
	'404.title': 'No encontrado',
	'404.content': 'Esta página no está en nuestro sistema solar.',
	'404.linkText': 'Volver a la página principal.',
	// Etiquetas predeterminadas del componente Aside
	'aside.note': 'Nota',
	'aside.tip': 'Consejo',
	'aside.caution': 'Precaución',
	'aside.danger': 'Peligro',
	// Vocabulario de <LanguageSelect>
	'languageSelect.label': 'Seleccionar idioma',
	// Vocabulario de integraciones
	'integrations.changelog': 'Registro de cambios',
	'integrations.footerTitle': 'Más integraciones',
	'integrations.renderers': 'Frameworks UI',
	'integrations.adapters': 'Adaptadores SSR',
	'integrations.others': 'Otros',
	// Componente Checklist
	'checklist.or': 'o',
	// Componente Multiple Choice
	'multipleChoice.defaultCorrect': '¡Correcto!',
	'multipleChoice.defaultIncorrect': '¡Inténtalo de nuevo!',
	'multipleChoice.submitLabel': 'Enviar',
	// Progreso del tutorial
	'progress.todo': 'Por hacer',
	'progress.done': 'Completado',
	// Navegación del tutorial
	'tutorial.trackerLabel': 'Seguimiento del tutorial',
	'tutorial.unit': 'Unidad',
	// Tutorial
	'tutorial.getReady': 'Prepárate para...',
	// Widget Feedback Fish
	'feedback.button': 'Danos tu opinión',
	'feedback.a11yLabel': 'Formulario de opinión',
	'feedback.formTitle': '¿Qué tienes en mente?',
	'feedback.categoryGroupLabel': 'Elige una categoría de opinión',
	'feedback.issue': 'Problema',
	'feedback.createIssue': 'Crear un problema en GitHub',
	'feedback.idea': 'Idea',
	'feedback.other': 'Otro',
	'feedback.messageA11yLabel': 'Mensaje',
	'feedback.placeholder': '¿Qué nos quieres decir?',
	'feedback.submit': 'Enviar opinión',
	'feedback.close': 'Cerrar formulario de opinión',
	'feedback.success': '¡Gracias! Hemos recibido tu opinión.',
	// Componente <FileTree>
	'fileTree.directoryLabel': 'Directorio',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': 'Ventana de terminal',
	'expressiveCode.copyButtonTooltip': 'Copiar al portapapeles',
	'expressiveCode.copyButtonCopied': '¡Copiado!',
	// Vocabulario de guías de backend
	'backend.navTitle': 'Más guías de servicios backend',
	// Vocabulario de borradores
	'stub.title': '¡Amplía este borrador!',
	'stub.subtitle': 'Esta guía es un borrador.',
	'stub.description.migration':
		'¿Quieres contribuir a esta guía? ¿Tienes alguna publicación en un blog, un video u otro recurso para compartir sobre la migración desde esta tecnología a Astro?',
	'stub.description.cms': '¿Quieres saber más sobre cómo usar este CMS con Astro?',
	'stub.description.backend': '¿Quieres saber más sobre cómo usar este servicio backend con Astro?',
});
