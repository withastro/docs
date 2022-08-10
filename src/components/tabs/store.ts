import { atom, map } from 'nanostores';

type TabStore = {
	[key: string]: {
		curr: string;
	};
};

export const tabId = atom<number>(0);
export const tabStore = map<TabStore>({});

export function genTabId() {
	const id = tabId.get();
	tabId.set(id + 1);
	return id;
}
