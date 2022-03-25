import { h } from 'preact';
import { useState } from 'preact/hooks';
import './TabGroup.css';

const SidebarToggleTabGroup = ({ defaultActiveTab }) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	function toggleType(type: 'learn' | 'api') {
		document.querySelectorAll(`li.nav-group`).forEach((el) => el.classList.remove('active'));
		document.querySelectorAll(`li.nav-group.${type}`).forEach((el) => el.classList.add('active'));
		setActiveTab(type);
	}
	return (
		<div class="TabGroup">
			<button class={activeTab === 'learn' ? 'active' : ''} onClick={() => toggleType('learn')}>
				Learn
			</button>
			<button class={activeTab === 'api' ? 'active' : ''} onClick={() => toggleType('api')}>
				Reference
			</button>
		</div>
	);
};

export default SidebarToggleTabGroup;
