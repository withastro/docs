import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { tabStore } from './store';

export function useTabState(initialCurr: string, storeKey?: string): [string, (curr: string) => void] {
	const $tabStore = useStore(tabStore)
	// Why use a local state variable alongside the shared store?
	// This ensures a nice SSR result, without waiting for the store to get set on the client!
	const [curr, setCurr] = useState<string>(initialCurr)

	// If you're using a storeKey, set the shared store to an initial value
	useEffect(() => {
		if (storeKey) {
			tabStore.setKey(storeKey, { curr: initialCurr })
		}
	}, [storeKey, initialCurr])

	// If you're using a storeKey, update local state whenever the shared store changes
	useEffect(() => {
		if (storeKey && $tabStore[storeKey]?.curr) {
			setCurr($tabStore[storeKey]?.curr)
		}
	}, [$tabStore])

	function setCurrStore(newCurr: string) {
		setCurr(newCurr)
		if (storeKey) {
			tabStore.setKey(storeKey, { curr: newCurr })
		}
	}

	return [curr, setCurrStore]
}
