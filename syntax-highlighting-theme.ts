import type { ShikiConfig } from 'astro';

const red = { 0: '#ff657c' };
const yellow = { 0: '#EBCB8B', 1: '#ffbd2e' };
const blue = { 0: '#66adff', 1: '#5E81AC' };
const green = { 0: '#16c082' };
const cyan = { 0: '#23b1af' };
const grey = { 0: '#d8dee9', 1: '#c7c5d3', 2: '#aba8bd', 9: '#312749' };

const foregroundPrimary = grey[0];
const backgroundPrimary = grey[9];

export const theme: ShikiConfig['theme'] = {
	name: 'Star Gazer',
	type: 'dark',
	fg: foregroundPrimary,
	bg: backgroundPrimary,
	settings: [
		{
			settings: {
				foreground: foregroundPrimary,
				background: backgroundPrimary,
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
				foreground: grey[2],
			},
		},
		{
			name: 'Constant Character',
			scope: 'constant.character',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Constant Character Escape',
			scope: 'constant.character.escape',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Constant Language',
			scope: 'constant.language',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Constant Numeric',
			scope: 'constant.numeric',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Constant Regexp',
			scope: 'constant.regexp',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Entity Name Class/Type',
			scope: ['entity.name.class', 'entity.name.type.class'],
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: 'Entity Name Function',
			scope: 'entity.name.function',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: 'Entity Name Tag',
			scope: 'entity.name.tag',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Entity Other Attribute Name',
			scope: 'entity.other.attribute-name',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: 'Entity Other Inherited Class',
			scope: 'entity.other.inherited-class',
			settings: {
				fontStyle: 'bold',
				foreground: yellow[1],
			},
		},
		{
			name: 'Invalid Deprecated',
			scope: 'invalid.deprecated',
			settings: {
				foreground: foregroundPrimary,
				background: yellow[0],
			},
		},
		{
			name: 'Invalid Illegal',
			scope: 'invalid.illegal',
			settings: {
				foreground: foregroundPrimary,
				background: red[0],
			},
		},
		{
			name: 'Keyword',
			scope: 'keyword',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Keyword Operator',
			scope: 'keyword.operator',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Keyword Other New',
			scope: 'keyword.other.new',
			settings: {
				foreground: red[0],
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
				foreground: yellow[0],
			},
		},
		{
			name: 'Markup Deleted',
			scope: 'markup.deleted',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Markup Inserted',
			scope: 'markup.inserted',
			settings: {
				foreground: green[0],
			},
		},
		{
			name: 'Meta Preprocessor',
			scope: 'meta.preprocessor',
			settings: {
				foreground: blue[1],
			},
		},
		{
			name: 'Punctuation',
			scope: 'punctuation',
			settings: {
				foreground: grey[1],
			},
		},
		{
			name: 'Punctuation Definition Parameters',
			scope: [
				'punctuation.definition.method-parameters',
				'punctuation.definition.function-parameters',
				'punctuation.definition.parameters',
			],
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: 'Punctuation Definition Comment',
			scope: [
				'punctuation.definition.comment',
				'punctuation.end.definition.comment',
				'punctuation.start.definition.comment',
			],
			settings: {
				foreground: grey[2],
			},
		},
		{
			name: 'Misc blocks',
			scope: ['source.astro meta.brace.round'],
			settings: {
				foreground: grey[2],
			},
		},
		{
			name: 'Punctuation Section',
			scope: 'punctuation.section',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: 'Punctuation Section Embedded',
			scope: ['punctuation.section.embedded.begin', 'punctuation.section.embedded.end'],
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Punctuation Terminator',
			scope: 'punctuation.terminator',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Punctuation Variable',
			scope: 'punctuation.definition.variable',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Storage',
			scope: 'storage',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'String',
			scope: 'string',
			settings: {
				foreground: green[0],
			},
		},
		{
			name: 'String Regexp',
			scope: 'string.regexp',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Support Class',
			scope: 'support.class',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: 'Support Constant',
			scope: 'support.constant',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Support Function',
			scope: 'support.function',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: 'Support Function Construct',
			scope: 'support.function.construct',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Support Type',
			scope: 'support.type',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: 'Support Type Exception',
			scope: 'support.type.exception',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: 'Token Debug',
			scope: 'token.debug-token',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Token Error',
			scope: 'token.error-token',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Token Info',
			scope: 'token.info-token',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: 'Token Warning',
			scope: 'token.warn-token',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: 'Variable',
			scope: 'variable.other',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: 'Variable Language',
			scope: 'variable.language',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: 'Variable Parameter',
			scope: 'variable.parameter',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: 'Quotes',
			scope: ['punctuation.definition.string.begin', 'punctuation.definition.string.end'],
			settings: {
				foreground: green[0],
			},
		},
		{
			name: 'Punctuation ends (ex. semicolons)',
			scope: ['punctuation.terminator.statement', 'punctuation.terminator.rule'],
			settings: {
				foreground: grey[1],
			},
		},
		{
			name: '[Astro] Embedded expressions as HTML props',
			scope: ['expression.embbeded.astro'],
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Astro] Embedded expressions as HTML props',
			scope: ['expression.embbeded.astro meta.brace'],
			settings: {
				foreground: grey[1],
			},
		},
		{
			name: '[C/CPP] Punctuation Separator Pointer-Access',
			scope: 'punctuation.separator.pointer-access.c',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[C/CPP] Meta Preprocessor Include',
			scope: ['source.c meta.preprocessor.include', 'source.c string.quoted.other.lt-gt.include'],
			settings: {
				foreground: yellow[1],
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
				foreground: blue[1],
				fontStyle: 'bold',
			},
		},
		{
			name: '[CSS] Constant Other Color RGB Value',
			scope: 'source.css constant.other.color.rgb-value',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[CSS] Property values',
			scope: ['meta.property-value.css', 'meta.property-list.css', 'source.css keyword.other.unit'],
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: '[CSS] Units',
			scope: ['source.css keyword.other.unit'],
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: '[CSS] Function variable arguments',
			scope: 'meta.function.variable.css',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[CSS] Constant in string (ex. data attribute)',
			scope: ['string.quoted.double.css', 'string.quoted.single.css'],
			settings: {
				foreground: green[0],
			},
		},
		{
			name: '[CSS](Function) Meta Property-Value',
			scope: 'source.css meta.property-value',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[CSS] Media Queries',
			scope: [
				'source.css keyword.control.at-rule.media',
				'source.css keyword.control.at-rule.media punctuation.definition.keyword',
			],
			settings: {
				foreground: cyan[0],
			},
		},
		{
			name: '[CSS] Support Type Property Name',
			scope: 'source.css support.type.property-name',
			settings: {
				foreground: cyan[0],
			},
		},
		{
			name: '[diff] Meta Range Context',
			scope: 'source.diff meta.diff.range.context',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[diff] Meta Header From-File',
			scope: 'source.diff meta.diff.header.from-file',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[diff] Punctuation Definition From-File',
			scope: 'source.diff punctuation.definition.from-file',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[diff] Punctuation Definition Range',
			scope: 'source.diff punctuation.definition.range',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[diff] Punctuation Definition Separator',
			scope: 'source.diff punctuation.definition.separator',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Elixir](JakeBecker.elixir-ls) module names',
			scope: 'entity.name.type.module.elixir',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[Elixir](JakeBecker.elixir-ls) module attributes',
			scope: 'variable.other.readwrite.module.elixir',
			settings: {
				foreground: foregroundPrimary,
				fontStyle: 'bold',
			},
		},
		{
			name: '[Elixir](JakeBecker.elixir-ls) atoms',
			scope: 'constant.other.symbol.elixir',
			settings: {
				foreground: foregroundPrimary,
				fontStyle: 'bold',
			},
		},
		{
			name: '[Elixir](JakeBecker.elixir-ls) modules',
			scope: 'variable.other.constant.elixir',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[Go] String Format Placeholder',
			scope: 'source.go constant.other.placeholder.go',
			settings: {
				foreground: yellow[0],
			},
		},
		{
			name: '[JavaScript] Decorator',
			scope: [
				'source.js punctuation.decorator',
				'source.js meta.decorator variable.other.readwrite',
				'source.js meta.decorator entity.name.function',
			],
			settings: {
				foreground: cyan[0],
			},
		},
		{
			name: '[JavaScript] Meta Object-Literal Key',
			scope: 'source.js meta.object-literal.key',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[JavaScript](JSDoc) Storage Type Class',
			scope: 'source.js storage.type.class.jsdoc',
			settings: {
				foreground: yellow[1],
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
				foreground: red[0],
			},
		},
		{
			name: '[JavaScript] Interpolated String Template Punctuation Functions',
			scope: 'source.js string.quoted.template meta.method-call.with-arguments',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[JavaScript] String Template Literal Variable',
			scope: [
				'source.js string.template meta.template.expression support.variable.property',
				'source.js string.template meta.template.expression variable.other.object',
			],
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[JavaScript] Support Type Primitive',
			scope: 'source.js support.type.primitive',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[JavaScript] Variable Other Object',
			scope: 'source.js variable.other.object',
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[JavaScript] Variable Other Read-Write Alias',
			scope: 'source.js variable.other.readwrite.alias',
			settings: {
				foreground: yellow[1],
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
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[JavaScript] Braces',
			scope: ['source.astro meta.brace.square', 'source.astro meta.brace.round'],
			settings: {
				foreground: grey[2],
			},
		},
		{
			name: '[HTML] Constant Character Entity',
			scope: 'text.html.basic constant.character.entity.html',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[HTML] Constant Other Inline-Data',
			scope: 'text.html.basic constant.other.inline-data',
			settings: {
				foreground: cyan[0],
				fontStyle: 'italic',
			},
		},
		{
			name: '[HTML] Meta Tag SGML Doctype',
			scope: 'text.html.basic meta.tag.sgml.doctype',
			settings: {
				foreground: blue[1],
			},
		},
		{
			name: '[HTML] Punctuation Definition Entity',
			scope: 'text.html.basic punctuation.definition.entity',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[INI] Entity Name Section Group-Title',
			scope: 'source.properties entity.name.section.group-title.ini',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[INI] Punctuation Separator Key-Value',
			scope: 'source.properties punctuation.separator.key-value.ini',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] Markup Fenced Code Block',
			scope: [
				'text.html.markdown markup.fenced_code.block',
				'text.html.markdown markup.fenced_code.block punctuation.definition',
			],
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[Markdown] Markup Heading',
			scope: 'markup.heading',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[Markdown] Markup Inline',
			scope: [
				'text.html.markdown markup.inline.raw',
				'text.html.markdown markup.inline.raw punctuation.definition.raw',
			],
			settings: {
				foreground: yellow[1],
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
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] Markup Quote Punctuation Definition',
			scope: 'text.html.markdown beginning.punctuation.definition.quote',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[Markdown] Markup Quote Punctuation Definition',
			scope: 'text.html.markdown markup.quote',
			settings: {
				foreground: grey[2],
			},
		},
		{
			name: '[Markdown] Markup Math Constant',
			scope: 'text.html.markdown constant.character.math.tex',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] Markup Math Definition Marker',
			scope: [
				'text.html.markdown punctuation.definition.math.begin',
				'text.html.markdown punctuation.definition.math.end',
			],
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[Markdown] Markup Math Function Definition Marker',
			scope: 'text.html.markdown punctuation.definition.function.math.tex',
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[Markdown] Markup Math Operator',
			scope: 'text.html.markdown punctuation.math.operator.latex',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] Punctuation Definition Heading',
			scope: 'text.html.markdown punctuation.definition.heading',
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] Punctuation Definition Constant/String',
			scope: [
				'text.html.markdown punctuation.definition.constant',
				'text.html.markdown punctuation.definition.string',
			],
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[Markdown] String Other Link Description/Title',
			scope: [
				'text.html.markdown constant.other.reference.link',
				'text.html.markdown string.other.link.description',
				'text.html.markdown string.other.link.title',
			],
			settings: {
				foreground: blue[0],
			},
		},
		{
			name: '[SCSS] Punctuation Definition Interpolation Bracket Curly',
			scope: [
				'source.css.scss punctuation.definition.interpolation.begin.bracket.curly',
				'source.css.scss punctuation.definition.interpolation.end.bracket.curly',
			],
			settings: {
				foreground: red[0],
			},
		},
		{
			name: '[SCSS] Variable Interpolation',
			scope: 'source.css.scss variable.interpolation',
			settings: {
				foreground: foregroundPrimary,
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
				foreground: cyan[0],
			},
		},
		{
			name: '[TypeScript] Object-literal keys',
			scope: ['source.ts meta.object-literal.key', 'source.tsx meta.object-literal.key'],
			settings: {
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[TypeScript] Object-literal functions',
			scope: [
				'source.ts meta.object-literal.key entity.name.function',
				'source.tsx meta.object-literal.key entity.name.function',
			],
			settings: {
				foreground: blue[0],
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
				foreground: yellow[1],
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
				foreground: yellow[1],
			},
		},
		{
			name: '[TypeScript] Variables',
			scope: ['source.ts support.variable', 'source.tsx support.variable'],
			settings: {
				foreground: foregroundPrimary,
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
				foreground: foregroundPrimary,
			},
		},
		{
			name: '[XML] Entity Name Tag Namespace',
			scope: 'text.xml entity.name.tag.namespace',
			settings: {
				foreground: yellow[1],
			},
		},
		{
			name: '[XML] Keyword Other Doctype',
			scope: 'text.xml keyword.other.doctype',
			settings: {
				foreground: blue[1],
			},
		},
		{
			name: '[XML] Meta Tag Preprocessor',
			scope: 'text.xml meta.tag.preprocessor entity.name.tag',
			settings: {
				foreground: blue[1],
			},
		},
		{
			name: '[XML] Entity Name Tag Namespace',
			scope: [
				'text.xml string.unquoted.cdata',
				'text.xml string.unquoted.cdata punctuation.definition.string',
			],
			settings: {
				foreground: cyan[0],
			},
		},
		{
			name: '[YAML] Entity Name Tag',
			scope: 'source.yaml entity.name.tag',
			settings: {
				foreground: yellow[1],
			},
		},
	],
};
