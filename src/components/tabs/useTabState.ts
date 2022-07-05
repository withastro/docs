import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { tabStore } from './store';

export function useTabState(initialCurr: string, storeKey?: string): [string, (curr: string) => void] {
	const $tabStore = useStore(tabStore);
	// Use localState when no storeKey is provided
	// Would be nice to conditionally create this but alas...
	// hooks can't use conditionals :(
	const localState = useState(initialCurr);
	if (!storeKey) return localState;

	const curr = $tabStore[storeKey]?.curr ?? initialCurr;
	function setCurr(newCurr) {
		if (storeKey) {
			tabStore.setKey(storeKey, { curr: newCurr })
		}
	}

	return [curr, setCurr]
}
