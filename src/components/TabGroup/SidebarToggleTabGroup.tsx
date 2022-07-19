import { useState } from 'preact/hooks';
import './TabGroup.css';

type TabType = 'learn' | 'tutorial';
interface Props {
	defaultActiveTab: TabType;
	labels: Record<TabType, string>;
}

const SidebarToggleTabGroup = ({ defaultActiveTab, labels }: Props) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	function toggleType(type: TabType) {
		document.querySelectorAll(`li.nav-group`).forEach((el) => el.classList.remove('active'));
		document.querySelectorAll(`li.nav-group.${type}`).forEach((el) => el.classList.add('active'));
		setActiveTab(type);
	}
	return (
		<div class="TabGroup">
			{(['learn', 'tutorial'] as const).map((type) => (
				<button class={activeTab === type ? 'active' : ''} onClick={() => toggleType(type)}>
					{labels[type]}
				</button>
			))}
		</div>
	);
};

export default SidebarToggleTabGroup;
