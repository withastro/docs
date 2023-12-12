import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'इसे छोड़कर कंटेंट पर जाएं', // "Skip to Content"
	'a11y.sectionLink': 'शीर्षक', // "Section titled"
	'navbar.a11yTitle': 'शीर्ष', // "Top"
	// Site settings
	'site.title': 'Astro दस्तावेज़ीकरण', // "Astro Documentation"
	'site.description': 'कम Client-side Javascript के साथ तेज़ वेबसाइटें बनाएं।', // "Build faster websites with less client-side JavaScript."
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt':
		'एक तारों भरे अंतरिक्ष में Astro लोगो, जिसमें दाएँ से एक जामुनी शनि ग्रह की तरह ग्रह तैरता है', // "astro logo on a starry expanse of space, with a purple saturn-like planet floating in the right foreground"
	// Left Sidebar
	'leftSidebar.a11yTitle': 'प्रमुख', // "Primary"
	'leftSidebar.learnTab': 'सीखें', // "Learn"
	'leftSidebar.referenceTab': 'संदर्भ', // "Reference"
	'leftSidebar.viewInEnglish': 'अंग्रेज़ी में देखें', // "View in English"
	'leftSidebar.sponsoredBy': 'समर्थित करने वाला', // "Sponsored by"
	// Right Sidebar
	'rightSidebar.a11yTitle': 'माध्यमिक', // "Secondary"
	'rightSidebar.onThisPage': 'इस पृष्ठ पर', // "On this page"
	'rightSidebar.overview': 'अवलोकन', // "Overview"
	'rightSidebar.community': 'समुदाय', // "Community"
	'rightSidebar.joinDiscord': 'हमसे Discord में शामिल हों', // "Join us on Discord"
	'rightSidebar.readBlog': 'हमारे ब्लॉग पोस्ट पढ़ें', // "Read our blog posts"
	'rightSidebar.openCollective': 'हमारा ओपन कलेक्टिव', // "Our Open Collective"
	'rightSidebar.contribute': 'योगदान करें', // "Contribute"
	'rightSidebar.contributorGuides': 'योगदानकर्ता मार्गदर्शिकाएँ', // "Contributor Guides"
	'rightSidebar.editPage': 'इस पृष्ठ को संपादित करें', // "Edit this page"
	'rightSidebar.translatePage': 'इस पृष्ठ को अनुवाद करें', // "Translate this page"
	'rightSidebar.github': 'Astro Docs देखे GitHub पर', // "Astro Docs on GitHub"
	// Footer
	'footer.privacyPolicy': 'गोपनीयता नीति', // "Privacy Policy"
	// `<ThemeToggleButton>` accessibility labels
	'themeToggle.useLight': 'Light थीम उपयोग करें', // "Use light theme"
	'themeToggle.useDark': 'Dark थीम उपयोग करें', // "Use dark theme"
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'अगला पृष्ठ', // "Next Page"
	'articleNav.prevPage': 'पिछला पृष्ठ', // "Back"
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'जोड़ा गया:', // "Added in:"
	'since.new': 'नया', // "New"
	'since.beta': 'बीटा', // "Beta"
	// Installation Guide
	'install.autoTab': 'स्वचालित CLI', // "Automatic CLI"
	'install.manualTab': 'मैन्युअल सेटअप', // "Manual Setup"
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': 'पृष्ठ संचालन मार्गदर्शिकाएँ', // "Deployment Guides"
	'deploy.altSectionTitle': 'अधिक पृष्ठ संचालन मार्गदर्शिकाएँ', // "More Deployment Guides"
	'deploy.filterLabel': 'डिप्लॉय प्रकार से छाँटें', // "Filter by deploy type"
	'deploy.ssrTag': 'SSR', // "SSR"
	'deploy.staticTag': 'Static', // "Static"
	// CMS Guides vocabulary
	'cms.navTitle': 'अधिक CMS मार्गदर्शिकाएँ', // "More CMS guides"
	// Migration Guides vocabulary
	'migration.navTitle': 'अधिक माइग्रेशन मार्गदर्शिकाएँ', // "More migration guides"
	// Recipes vocabulary
	'recipes.navTitle': 'अधिक रेसिपी', // "More recipes"
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': 'संबंधित रेसिपी:', // "Related recipe:"
	'recipesLink.plural': 'संबंधित रेसिपीस', // "Related recipes"
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'सभी योगदानकर्ताओं को देखें', // "See all contributors"
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'यह पेज अभी तक आपकी भाषा में उपलब्ध नहीं है, इसलिए हम आपको अंग्रेजी संस्करण दिखा रहे हैं। आप इसका अनुवाद करके मदद कर सकते हैं!', // "This page is not yet available in your language, so we’re showing you the English version. You can help by translating it!"
	'fallbackContent.linkText': 'आप कैसे योगदान दे सकते हैं, इसके बारे में और जानें', // "Learn more about how you can contribute"
	// 404 Page
	'404.title': 'नहीं मिला', // "Not Found"
	'404.content': 'यह पेज हमारे सौरमंडल में नहीं है।', // "This page isn’t in our solar system."
	'404.linkText': 'मुझे घर ले चलो।', // "Take me home."
	// Aside component default labels
	'aside.note': 'टिप्पणी', // "Note"
	'aside.tip': 'सुझाव', // "Tip"
	'aside.caution': 'सावधानी', // "Caution"
	'aside.danger': 'खतरा', // "Danger"
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': 'भाषा चुने', // "Select language"
	// Integrations vocabulary
	'integrations.changelog': 'परिवर्तन लॉग', // "Changelog"
	'integrations.footerTitle': 'अधिक एकीकरण', // "More Integrations"
	'integrations.renderers': 'UI फ्रेमवर्क', // "UI Frameworks"
	'integrations.adapters': 'SSR एडेप्टर', // "SSR Adapters"
	'integrations.others': 'अन्य', // "Others"
	// Checklist component
	'checklist.or': 'या', // "or"
	// Multiple Choice component
	'multipleChoice.defaultCorrect': 'सही!', // "Correct!"
	'multipleChoice.defaultIncorrect': 'पुनः प्रयास करें!', // "Try again!"
	'multipleChoice.submitLabel': 'जमा करना', // "Submit"
	// Tutorial Progress
	'progress.todo': 'करने के लिए', // "To-do"
	'progress.done': 'पूरा', // "Complete"
	// Tutorial Navigation
	'tutorial.trackerLabel': 'ट्यूटोरियल ट्रैकर', // "Tutorial Tracker"
	'tutorial.unit': 'इकाई', // "Unit"
	// Tutorial
	'tutorial.getReady': 'के प्रति तैयार रहना…', // "Get ready to…"
	// Feedback Fish widget
	'feedback.button': 'हमें प्रतिक्रिया दे', // "Give us feedback"
	'feedback.a11yLabel': 'प्रतिक्रिया प्रपत्र', // "Feedback form"
	'feedback.formTitle': 'आपके दिमाग में क्या है?', // "What’s on your mind?",
	'feedback.categoryGroupLabel': 'प्रतिक्रिया श्रेणी चुनें', // "Choose feedback category"
	'feedback.issue': 'मुद्दा', // "Issue"
	'feedback.createIssue': 'GitHub मुद्दा बनाएं', // "Create GitHub Issue"
	'feedback.createIssue.description':
		'किसी समस्या के बारे में हमारी टीम को सचेत करने का सबसे तेज़ तरीका।', // "Quickest way to alert our team of a problem."
	'feedback.sendFeedback': 'हमें प्रतिक्रिया भेजें', // "Send us feedback"
	'feedback.sendFeedback.description': 'हमें सीधे संदेश भेजें.', // "Send us a message directly."
	'feedback.idea': 'विचार', // "Idea"
	'feedback.other': 'अन्य', // "Other"
	'feedback.messageA11yLabel': 'संदेश', // "Message"
	'feedback.placeholder': 'आप हमसे क्या जानना चाहते हैं?', // "What do you want us to know?"
	'feedback.submit': 'प्रतिक्रिया दें', // "Submit feedback"
	'feedback.close': 'प्रतिक्रिया प्रपत्र बंद करें', // "Close feedback form"
	'feedback.success': 'धन्यवाद! हमें आपकी प्रतिक्रिया प्राप्त हुई.', // "Thanks! We received your feedback."
	// `<FileTree>` component
	'fileTree.directoryLabel': 'निर्देशिका', // "Directory"
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': 'टर्मिनल विंडो', // "Terminal window"
	'expressiveCode.copyButtonTooltip': 'क्लिपबोर्ड पर कॉपी करें', // "Copy to clipboard"
	'expressiveCode.copyButtonCopied': 'कॉपी हो गया!', // "Copied!"
	// Backend Guides vocabulary
	'backend.navTitle': 'अधिक बैकएंड सेवा मार्गदर्शिकाएँ', // "More backend service guides"
	// Stubs vocabulary
	'stub.title': 'इस आधार का विस्तार करें!', // "Expand this stub!"
	'stub.subtitle': 'यह मार्गदर्शिका एक आधार है।', // "This guide is a stub.",
	'stub.description.migration':
		'क्या आप इस मार्गदर्शिका में योगदान देना चाहते हैं? क्या आपके पास इस तकनीक से Astro की ओर स्थानांतरित होने के बारे में साझा करने के लिए कोई ब्लॉग पोस्ट, Video या कोई अन्य संसाधन है?', // "Want to contribute to this guide? Have a blog post, video, or another resource to share about migrating from this technology to Astro?"
	'stub.description.cms': 'Astro के साथ इस CMS का उपयोग कैसे करें इसके बारे में और जानें?', // "Know more about how to use this CMS with Astro?"
	'stub.description.backend':
		'Astro के साथ इस बैकएंड सेवा का उपयोग कैसे करें इसके बारे में और जानें?', // "Know more about how to use this backend service with Astro?"
	// Starlight banner
	'starlight.title': 'क्या आप अपने स्वयं के दस्तावेज़ बनाना चाहते हैं?', // "Want to build your own Docs?"
	'starlight.description': 'आरंभ करने के लिए इस टेम्पलेट को पकड़ें।', // "Grab this template to get started."
});
