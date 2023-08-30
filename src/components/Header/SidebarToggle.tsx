import { useEffect, useState } from 'preact/hooks';
import './HeaderButton.css';
import './SidebarToggle.css';

const MenuToggle = () => {
	const [sidebarShown, setSidebarShown] = useState(false);

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0];
		if (sidebarShown) {
			body.classList.add('mobile-sidebar-toggle');
			document.querySelectorAll('aside nav details').forEach((e) => {
				e.removeAttribute('open');
			});
			document
				.querySelector('details a[data-current-parent="true"]')
				?.closest('details')
				?.setAttribute('open', '');
		} else {
			body.classList.remove('mobile-sidebar-toggle');
			document.querySelectorAll('aside nav details').forEach((e) => {
				e.setAttribute('open', '');
			});
		}
	}, [sidebarShown]);

	return (
		<button
			id="menu-toggle"
			className="header-button"
			type="button"
			aria-pressed={sidebarShown ? 'true' : 'false'}
			onClick={() => setSidebarShown(!sidebarShown)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
			<span className="sr-only">Toggle sidebar</span>
		</button>
	);
};

export default MenuToggle;
