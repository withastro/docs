import { useState } from 'preact/hooks';
import './TabGroup.css';

type TabType = 'learn' | 'api';
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
		<div className="TabGroup">
			{(['learn', 'api'] as const).map((type) => (
				<button
					key={type}
					className={activeTab === type ? 'active' : ''}
					onClick={() => toggleType(type)}
				>
					{labels[type]}
				</button>
			))}
		</div>
	);
};

export default SidebarToggleTabGroup;
