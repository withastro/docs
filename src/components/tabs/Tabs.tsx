import { h } from 'preact';
import { nextTab, prevTab, registerTabView } from "./store";

type Props = {
	storeKey?: string;
	tabs: JSX.Element;
	panels: JSX.Element;
}

function moveFocus(tabStoreKey: string, event: React.KeyboardEvent<HTMLDivElement>) {
	if (event.key === 'ArrowLeft') {
		prevTab(tabStoreKey)
	}
	if (event.key === 'ArrowRight') {
		nextTab(tabStoreKey)
	}
}

export default function Tabs({ tabs, panels, storeKey }: Props) {
	const tabStoreKey = registerTabView(storeKey)

	return (
		<div data-store-key={tabStoreKey}>
			<div role="tablist" onKeyDown={(e) => moveFocus(tabStoreKey, e)}>
				{tabs}
			</div>
			{panels}
		</div>
	)
}
