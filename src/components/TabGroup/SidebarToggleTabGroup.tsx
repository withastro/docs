import { useState } from 'preact/hooks';
import './TabGroup.css';

interface Props {
	defaultActiveTab: 'learn' | 'api';
	labels: {
		learn: string;
		api: string;
	};
}

const SidebarToggleTabGroup = ({ defaultActiveTab, labels }: Props) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	function toggleType(type: 'learn' | 'api') {
		document.querySelectorAll(`li.nav-group`).forEach((el) => el.classList.remove('active'));
		document.querySelectorAll(`li.nav-group.${type}`).forEach((el) => el.classList.add('active'));
		setActiveTab(type);
	}
	return (
		<div class="TabGroup">
			<button class={activeTab === 'learn' ? 'active' : ''} onClick={() => toggleType('learn')}>
				{labels.learn}
			</button>
			<button class={activeTab === 'api' ? 'active' : ''} onClick={() => toggleType('api')}>
				{labels.api}
			</button>
		</div>
	);
};

export default SidebarToggleTabGroup;