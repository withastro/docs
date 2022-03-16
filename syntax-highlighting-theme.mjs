export const tokens = [
	{
		settings: {
			foreground: '#d8dee9',
			background: '#312749',
		},
	},
	{
		scope: 'emphasis',
		settings: {
			fontStyle: 'italic',
		},
	},
	{
		scope: 'strong',
		settings: {
			fontStyle: 'bold',
		},
	},
	{
		name: 'Comment',
		scope: 'comment',
		settings: {
			foreground: '#aba8bd',
		},
	},
	{
		name: 'Constant Character',
		scope: 'constant.character',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: 'Constant Character Escape',
		scope: 'constant.character.escape',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: 'Constant Language',
		scope: 'constant.language',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Constant Numeric',
		scope: 'constant.numeric',
		settings: {
			foreground: '#B48EAD',
		},
	},
	{
		name: 'Constant Regexp',
		scope: 'constant.regexp',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: 'Entity Name Class/Type',
		scope: ['entity.name.class', 'entity.name.type.class'],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Entity Name Function',
		scope: 'entity.name.function',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: 'Entity Name Tag',
		scope: 'entity.name.tag',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Entity Other Attribute Name',
		scope: 'entity.other.attribute-name',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Entity Other Inherited Class',
		scope: 'entity.other.inherited-class',
		settings: {
			fontStyle: 'bold',
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Invalid Deprecated',
		scope: 'invalid.deprecated',
		settings: {
			foreground: '#D8DEE9',
			background: '#EBCB8B',
		},
	},
	{
		name: 'Invalid Illegal',
		scope: 'invalid.illegal',
		settings: {
			foreground: '#D8DEE9',
			background: '#BF616A',
		},
	},
	{
		name: 'Keyword',
		scope: 'keyword',
		settings: {
			foreground: '#ff657c',
      fontStyle: 'italic',
		},
	},
	{
		name: 'Keyword Operator',
		scope: 'keyword.operator',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Keyword Other New',
		scope: 'keyword.other.new',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Markup Bold',
		scope: 'markup.bold',
		settings: {
			fontStyle: 'bold',
		},
	},
	{
		name: 'Markup Changed',
		scope: 'markup.changed',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: 'Markup Deleted',
		scope: 'markup.deleted',
		settings: {
			foreground: '#BF616A',
		},
	},
	{
		name: 'Markup Inserted',
		scope: 'markup.inserted',
		settings: {
			foreground: '#16c082',
		},
	},
	{
		name: 'Meta Preprocessor',
		scope: 'meta.preprocessor',
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: 'Punctuation',
		scope: 'punctuation',
		settings: {
			foreground: '#ECEFF4',
		},
	},
	{
		name: 'Punctuation Definition Parameters',
		scope: ['punctuation.definition.method-parameters', 'punctuation.definition.function-parameters', 'punctuation.definition.parameters'],
		settings: {
			foreground: '#ECEFF4',
		},
	},
	// {
	// 	name: 'Punctuation Definition Tag',
	// 	scope: 'punctuation.definition.tag',
	// 	settings: {
	// 		foreground: '#ff657c',
	// 	},
	// },
	{
		name: 'Punctuation Definition Comment',
		scope: ['punctuation.definition.comment', 'punctuation.end.definition.comment', 'punctuation.start.definition.comment'],
		settings: {
			foreground: '#aba8bd',
		},
	},
	{
		name: 'Punctuation Section',
		scope: 'punctuation.section',
		settings: {
			foreground: '#ECEFF4',
		},
	},
	{
		name: 'Punctuation Section Embedded',
		scope: ['punctuation.section.embedded.begin', 'punctuation.section.embedded.end'],
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Punctuation Terminator',
		scope: 'punctuation.terminator',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Punctuation Variable',
		scope: 'punctuation.definition.variable',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Storage',
		scope: 'storage',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'String',
		scope: 'string',
		settings: {
			foreground: '#16c082',
		},
	},
	{
		name: 'String Regexp',
		scope: 'string.regexp',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: 'Support Class',
		scope: 'support.class',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Support Constant',
		scope: 'support.constant',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Support Function',
		scope: 'support.function',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: 'Support Function Construct',
		scope: 'support.function.construct',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Support Type',
		scope: 'support.type',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Support Type Exception',
		scope: 'support.type.exception',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: 'Token Debug',
		scope: 'token.debug-token',
		settings: {
			foreground: '#b48ead',
		},
	},
	{
		name: 'Token Error',
		scope: 'token.error-token',
		settings: {
			foreground: '#bf616a',
		},
	},
	{
		name: 'Token Info',
		scope: 'token.info-token',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: 'Token Warning',
		scope: 'token.warn-token',
		settings: {
			foreground: '#ebcb8b',
		},
	},
	{
		name: 'Variable',
		scope: 'variable.other',
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: 'Variable Language',
		scope: 'variable.language',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: 'Variable Parameter',
		scope: 'variable.parameter',
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[C/CPP] Punctuation Separator Pointer-Access',
		scope: 'punctuation.separator.pointer-access.c',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[C/CPP] Meta Preprocessor Include',
		scope: ['source.c meta.preprocessor.include', 'source.c string.quoted.other.lt-gt.include'],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[C/CPP] Conditional Directive',
		scope: [
			'source.cpp keyword.control.directive.conditional',
			'source.cpp punctuation.definition.directive',
			'source.c keyword.control.directive.conditional',
			'source.c punctuation.definition.directive',
		],
		settings: {
			foreground: '#5E81AC',
			fontStyle: 'bold',
		},
	},
	{
		name: '[CSS] Constant Other Color RGB Value',
		scope: 'source.css constant.other.color.rgb-value',
		settings: {
			foreground: '#B48EAD',
		},
	},
	{
		name: '[CSS](Function) Meta Property-Value',
		scope: 'source.css meta.property-value',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[CSS] Media Queries',
		scope: ['source.css keyword.control.at-rule.media', 'source.css keyword.control.at-rule.media punctuation.definition.keyword'],
		settings: {
			foreground: '#23b1af',
		},
	},
	{
		name: '[CSS] Punctuation Definition Keyword',
		scope: 'source.css punctuation.definition.keyword',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[CSS] Support Type Property Name',
		scope: 'source.css support.type.property-name',
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[diff] Meta Range Context',
		scope: 'source.diff meta.diff.range.context',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[diff] Meta Header From-File',
		scope: 'source.diff meta.diff.header.from-file',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[diff] Punctuation Definition From-File',
		scope: 'source.diff punctuation.definition.from-file',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[diff] Punctuation Definition Range',
		scope: 'source.diff punctuation.definition.range',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[diff] Punctuation Definition Separator',
		scope: 'source.diff punctuation.definition.separator',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Elixir](JakeBecker.elixir-ls) module names',
		scope: 'entity.name.type.module.elixir',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Elixir](JakeBecker.elixir-ls) module attributes',
		scope: 'variable.other.readwrite.module.elixir',
		settings: {
			foreground: '#D8DEE9',
			fontStyle: 'bold',
		},
	},
	{
		name: '[Elixir](JakeBecker.elixir-ls) atoms',
		scope: 'constant.other.symbol.elixir',
		settings: {
			foreground: '#D8DEE9',
			fontStyle: 'bold',
		},
	},
	{
		name: '[Elixir](JakeBecker.elixir-ls) modules',
		scope: 'variable.other.constant.elixir',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Go] String Format Placeholder',
		scope: 'source.go constant.other.placeholder.go',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: '[JavaScript] Decorator',
		scope: ['source.js punctuation.decorator', 'source.js meta.decorator variable.other.readwrite', 'source.js meta.decorator entity.name.function'],
		settings: {
			foreground: '#23b1af',
		},
	},
	{
		name: '[JavaScript] Meta Object-Literal Key',
		scope: 'source.js meta.object-literal.key',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[JavaScript](JSDoc) Storage Type Class',
		scope: 'source.js storage.type.class.jsdoc',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[JavaScript] String Template Literals Punctuation',
		scope: [
			'source.js string.quoted.template punctuation.quasi.element.begin',
			'source.js string.quoted.template punctuation.quasi.element.end',
			'source.js string.template punctuation.definition.template-expression',
		],
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[JavaScript] Interpolated String Template Punctuation Functions',
		scope: 'source.js string.quoted.template meta.method-call.with-arguments',
		settings: {
			foreground: '#ECEFF4',
		},
	},
	{
		name: '[JavaScript] String Template Literal Variable',
		scope: ['source.js string.template meta.template.expression support.variable.property', 'source.js string.template meta.template.expression variable.other.object'],
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[JavaScript] Support Type Primitive',
		scope: 'source.js support.type.primitive',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[JavaScript] Variable Other Object',
		scope: 'source.js variable.other.object',
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[JavaScript] Variable Other Read-Write Alias',
		scope: 'source.js variable.other.readwrite.alias',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[JavaScript] Parentheses in Template Strings',
		scope: [
			'source.js meta.embedded.line meta.brace.square',
			'source.js meta.embedded.line meta.brace.round',
			/* Required for extension `mgmcdermott.vscode-language-babel`. */
			'source.js string.quoted.template meta.brace.square',
			'source.js string.quoted.template meta.brace.round',
		],
		settings: {
			foreground: '#ECEFF4',
		},
	},
	{
		name: '[HTML] Constant Character Entity',
		scope: 'text.html.basic constant.character.entity.html',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[HTML] Constant Other Inline-Data',
		scope: 'text.html.basic constant.other.inline-data',
		settings: {
			foreground: '#23b1af',
			fontStyle: 'italic',
		},
	},
	{
		name: '[HTML] Meta Tag SGML Doctype',
		scope: 'text.html.basic meta.tag.sgml.doctype',
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: '[HTML] Punctuation Definition Entity',
		scope: 'text.html.basic punctuation.definition.entity',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[INI] Entity Name Section Group-Title',
		scope: 'source.properties entity.name.section.group-title.ini',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[INI] Punctuation Separator Key-Value',
		scope: 'source.properties punctuation.separator.key-value.ini',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] Markup Fenced Code Block',
		scope: ['text.html.markdown markup.fenced_code.block', 'text.html.markdown markup.fenced_code.block punctuation.definition'],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Markdown] Markup Heading',
		scope: 'markup.heading',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Markdown] Markup Inline',
		scope: ['text.html.markdown markup.inline.raw', 'text.html.markdown markup.inline.raw punctuation.definition.raw'],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Markdown] Markup Italic',
		scope: 'text.html.markdown markup.italic',
		settings: {
			fontStyle: 'italic',
		},
	},
	{
		name: '[Markdown] Markup Link',
		scope: 'text.html.markdown markup.underline.link',
		settings: {
			fontStyle: 'underline',
		},
	},
	{
		name: '[Markdown] Markup List Numbered/Unnumbered',
		scope: 'text.html.markdown beginning.punctuation.definition.list',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] Markup Quote Punctuation Definition',
		scope: 'text.html.markdown beginning.punctuation.definition.quote',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Markdown] Markup Quote Punctuation Definition',
		scope: 'text.html.markdown markup.quote',
		settings: {
			foreground: '#aba8bd',
		},
	},
	{
		name: '[Markdown] Markup Math Constant',
		scope: 'text.html.markdown constant.character.math.tex',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] Markup Math Definition Marker',
		scope: ['text.html.markdown punctuation.definition.math.begin', 'text.html.markdown punctuation.definition.math.end'],
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: '[Markdown] Markup Math Function Definition Marker',
		scope: 'text.html.markdown punctuation.definition.function.math.tex',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Markdown] Markup Math Operator',
		scope: 'text.html.markdown punctuation.math.operator.latex',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] Punctuation Definition Heading',
		scope: 'text.html.markdown punctuation.definition.heading',
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] Punctuation Definition Constant/String',
		scope: ['text.html.markdown punctuation.definition.constant', 'text.html.markdown punctuation.definition.string'],
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Markdown] String Other Link Description/Title',
		scope: ['text.html.markdown constant.other.reference.link', 'text.html.markdown string.other.link.description', 'text.html.markdown string.other.link.title'],
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Perl] Perl Sigils',
		scope: 'source.perl punctuation.definition.variable',
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[PHP] Meta Function-Call Object',
		scope: ['source.php meta.function-call', 'source.php meta.function-call.object'],
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Python] Decorator',
		scope: ['source.python entity.name.function.decorator', 'source.python meta.function.decorator support.type'],
		settings: {
			foreground: '#23b1af',
		},
	},
	{
		name: '[Python] Function Call',
		scope: 'source.python meta.function-call.generic',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Python] Support Type',
		scope: 'source.python support.type',
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[Python] Function Parameter',
		scope: ['source.python variable.parameter.function.language'],
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[Python] Function Parameter Special',
		scope: ['source.python meta.function.parameters variable.parameter.function.language.special.self'],
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[Rust] Entity types',
		scope: 'source.rust entity.name.type',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[Rust] Macro',
		scope: 'source.rust meta.macro entity.name.function',
		settings: {
			fontStyle: 'bold',
			foreground: '#66adff',
		},
	},
	{
		name: '[Rust] Attributes',
		scope: ['source.rust meta.attribute', 'source.rust meta.attribute punctuation', 'source.rust meta.attribute keyword.operator'],
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: '[Rust] Traits',
		scope: 'source.rust entity.name.type.trait',
		settings: {
			fontStyle: 'bold',
		},
	},
	{
		name: '[Rust] Interpolation Bracket Curly',
		scope: 'source.rust punctuation.definition.interpolation',
		settings: {
			foreground: '#EBCB8B',
		},
	},
	{
		name: '[SCSS] Punctuation Definition Interpolation Bracket Curly',
		scope: ['source.css.scss punctuation.definition.interpolation.begin.bracket.curly', 'source.css.scss punctuation.definition.interpolation.end.bracket.curly'],
		settings: {
			foreground: '#ff657c',
		},
	},
	{
		name: '[SCSS] Variable Interpolation',
		scope: 'source.css.scss variable.interpolation',
		settings: {
			foreground: '#D8DEE9',
			fontStyle: 'italic',
		},
	},
	{
		name: '[TypeScript] Decorators',
		scope: [
			'source.ts punctuation.decorator',
			'source.ts meta.decorator variable.other.readwrite',
			'source.ts meta.decorator entity.name.function',
			'source.tsx punctuation.decorator',
			'source.tsx meta.decorator variable.other.readwrite',
			'source.tsx meta.decorator entity.name.function',
		],
		settings: {
			foreground: '#23b1af',
		},
	},
	{
		name: '[TypeScript] Object-literal keys',
		scope: ['source.ts meta.object-literal.key', 'source.tsx meta.object-literal.key'],
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[TypeScript] Object-literal functions',
		scope: ['source.ts meta.object-literal.key entity.name.function', 'source.tsx meta.object-literal.key entity.name.function'],
		settings: {
			foreground: '#66adff',
		},
	},
	{
		name: '[TypeScript] Type/Class',
		scope: [
			'source.ts support.class',
			'source.ts support.type',
			'source.ts entity.name.type',
			'source.ts entity.name.class',
			'source.tsx support.class',
			'source.tsx support.type',
			'source.tsx entity.name.type',
			'source.tsx entity.name.class',
		],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[TypeScript] Static Class Support',
		scope: [
			'source.ts support.constant.math',
			'source.ts support.constant.dom',
			'source.ts support.constant.json',
			'source.tsx support.constant.math',
			'source.tsx support.constant.dom',
			'source.tsx support.constant.json',
		],
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[TypeScript] Variables',
		scope: ['source.ts support.variable', 'source.tsx support.variable'],
		settings: {
			foreground: '#D8DEE9',
		},
	},
	{
		name: '[TypeScript] Parentheses in Template Strings',
		scope: [
			'source.ts meta.embedded.line meta.brace.square',
			'source.ts meta.embedded.line meta.brace.round',
			'source.tsx meta.embedded.line meta.brace.square',
			'source.tsx meta.embedded.line meta.brace.round',
		],
		settings: {
			foreground: '#ECEFF4',
		},
	},
	{
		name: '[XML] Entity Name Tag Namespace',
		scope: 'text.xml entity.name.tag.namespace',
		settings: {
			foreground: '#ffbd2e',
		},
	},
	{
		name: '[XML] Keyword Other Doctype',
		scope: 'text.xml keyword.other.doctype',
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: '[XML] Meta Tag Preprocessor',
		scope: 'text.xml meta.tag.preprocessor entity.name.tag',
		settings: {
			foreground: '#5E81AC',
		},
	},
	{
		name: '[XML] Entity Name Tag Namespace',
		scope: ['text.xml string.unquoted.cdata', 'text.xml string.unquoted.cdata punctuation.definition.string'],
		settings: {
			foreground: '#23b1af',
		},
	},
	{
		name: '[YAML] Entity Name Tag',
		scope: 'source.yaml entity.name.tag',
		settings: {
			foreground: '#ffbd2e',
		},
	},
];
