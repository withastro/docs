import { atom, map } from "nanostores";

type TabInfo = {
	currIdx: number;
	tabs: string[];
}

function getTabEntry(storeKey: string) {
	const tabEntry = tabStore.get()[storeKey]
	if (!tabEntry) throw new Error(
		`Attempted to read a tab store by the key ${storeKey}. Did you forget to use the <Tabs> component wrapper?`
	)
	return tabEntry
}

export const tabStore = map<Record<string, TabInfo>>({});
const nextTabViewKey = atom(0);

export function registerTabView(storeKey?: string) {
	if (!storeKey) {
		storeKey = `${nextTabViewKey.get()}`
		nextTabViewKey.set(nextTabViewKey.get() + 1)
	}
	tabStore.setKey(storeKey, { tabs: [], currIdx: 0 })
	return storeKey
}

export function registerTab(storeKey: string, tabName: string) {
	console.log({storeKey, tabName})
	const { currIdx, tabs } = getTabEntry(storeKey)
	tabStore.setKey(storeKey, { currIdx, tabs: [...tabs, tabName] })

	return tabStore
}

export function nextTab(storeKey: string) {
	const { currIdx, tabs } = getTabEntry(storeKey)
	const nextIdx = currIdx >= tabs.length - 1 ? currIdx : currIdx + 1
	tabStore.setKey(storeKey, { currIdx: nextIdx, tabs })
}

export function prevTab(storeKey: string) {
	const { currIdx, tabs } = getTabEntry(storeKey)
	const nextIdx = currIdx <= 0 ? currIdx : currIdx - 1
	tabStore.setKey(storeKey, { currIdx: nextIdx, tabs })
}
