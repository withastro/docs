import { navDictionary } from '../../util/navDictionary';

export default navDictionary({
	start: '開始',
	'start.welcome': '歡迎，世界！',
	'start.newProject': '開始新專案',
	'start.config': '設定',
	'start.migrate': '遷移到 Astro',

	guides: '指南',
	'guides.routing': '路由與導覽',
	'guides.ui': '建構 UI',
	'guides.content': '加入內容到網站',
	'guides.serverRendering': '伺服器算繪',
	'guides.upgrade': '升級',
	'guides.upgrade.major': '主要版本升級指南',
	'guides.recipes': '操作指南',

	reference: '參考',
	'reference.runtime': '執行階段 API',
	'reference.other': '其他開發 API',
	'reference.syntax': 'Astro 模板語法',
	'reference.experimental': '實驗功能',

	integrations: '整合',
	'integrations.ui': 'UI 框架',
	'integrations.adapters': '配接器',
	'integrations.other': '其他官方整合',

	thirdParty: '第三方服務',
	'thirdParty.deployment': '部署指南',
	'thirdParty.cms': '內容管理系統',
	'thirdParty.backend': '後端服務',
	'thirdParty.media': '受託管的媒體與 DAM',
});
