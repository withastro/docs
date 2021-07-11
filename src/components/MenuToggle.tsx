import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const MenuToggle: FunctionalComponent = () => {
  const [sidebarShown, setSidebarShown] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar-nav');
    if (sidebarShown) {
      sidebar.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
    }
  }, [sidebarShown]);

  return (
    <button
      aria-pressed={sidebarShown ? 'true' : 'false'}
      id="menu-toggle"
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
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
};

export default MenuToggle;
