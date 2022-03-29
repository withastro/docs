import { h } from 'preact';
import './TabGroup.css';

const InstallGuideTabGroup = ({ currentPage }) => {
	return (
		<div class="InstallGuideTabGroup TabGroup">
			<a href="/en/install/auto" class={currentPage.endsWith('auto') ? 'active' : ''} onClick={() => toggleType('auto')}>
				Automatic CLI
			</a>
			<a href="/en/install/manual" class={currentPage.endsWith('manual') ? 'active' : ''} onClick={() => toggleType('manual')}>
				Manual Setup
			</a>
		</div>
	);
};

export default InstallGuideTabGroup;
