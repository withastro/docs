import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/** FOR INTERNAL USE ONLY. USE `Spoiler.astro` INSTEAD OF THIS. */
export default function Spoiler({ children }: { children: ComponentChildren}) {
	const [checked, setChecked] = useState(false);
	return (
		<>
			<input
				className="sr-only"
				type="checkbox"
				disabled={checked}
				checked={checked}
				onClick={() => setChecked(true)}
			/>
			<span>{children}</span>
		</>
	);
}
