import { h } from 'preact';
import { useState } from 'preact/hooks';
import './SidebarSectionToggle.css';

const SidebarSectionToggle = ({defaultActiveTab}) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	function toggleType(type: 'learn' | 'api') {
		document.querySelectorAll(`.nav-groups`).forEach(el => el.classList.remove('active'))
		const chosenNavGroup = document.querySelector(`.nav-groups.${type}`)
		chosenNavGroup.classList.add('active');
		console.log(chosenNavGroup);
		setActiveTab(type);
	}
	return (
		<div class="SidebarSectionToggle">
			<button class={(activeTab === 'learn' ? 'active' : '')}  onClick={() => toggleType('learn')}>Learn</button>
			<button class={(activeTab === 'api' ? 'active' : '')}  onClick={() => toggleType('api')}>API</button>
		</div>
	);
};

export default SidebarSectionToggle;
