import { useState } from 'preact/hooks';

/** FOR INTERNAL USE ONLY. USE `Spoiler.astro` INSTEAD OF THIS. */
export default function Spoiler({ children }) {
	const [checked, setChecked] = useState(false);
	return (
		<>
			<input class="sr-only" type="checkbox" disabled={checked} checked={checked} onClick={() => setChecked(true)} />
			<span>{children}</span>
		</>
	);
}
