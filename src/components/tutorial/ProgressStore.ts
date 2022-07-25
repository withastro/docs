export type SubListType = 'primary' | 'secondary';
type ListState = Record<SubListType, boolean[]>;
type PageState = { done: boolean; lists: Record<string, ListState> };
type ProgressState = Record<string, PageState>;

export class ProgressStore {
	private static key = 'astro-tutorial-progress';
	private static pageKey = ProgressStore.slugFromPathname(window.location.pathname);
	private static state: ProgressState = { [ProgressStore.pageKey]: { done: false, lists: {} }, ...ProgressStore.load() };

	public static initialiseList(listKey: string): void {
		if (ProgressStore.pageState.lists[listKey]) return;
		ProgressStore.pageState.lists[listKey] = { primary: [], secondary: [] };
	}

	public static initaliseSubList(listKey: string, type: SubListType, length: number): void {
		if (ProgressStore.pageState.lists[listKey][type].length === length) return;
		ProgressStore.pageState.lists[listKey][type] = Array.from({ length }, () => false);
		ProgressStore.store();
	}

	public static getSubListItem(listKey: string, type: SubListType, index: number): boolean {
		return ProgressStore.pageState.lists[listKey][type][index];
	}

	public static setSubListItem(listKey: string, type: SubListType, index: number, value: boolean): void {
		ProgressStore.pageState.lists[listKey][type][index] = value;
		ProgressStore.store();
	}

	public static getPageDone(path: string): boolean {
		const state = ProgressStore.state[ProgressStore.slugFromPathname(path)];
		return !!state && state.done;
	}

	private static load(): ProgressState {
		try {
			const state = JSON.parse(localStorage.getItem(ProgressStore.key) || '{}');
			if (state && ProgressStore.validate(state)) {
				return state;
			}
		} catch (e) {
			/* assume no stored state */
		}
		return {};
	}

	private static validate(state: unknown): state is ProgressState {
		return !!state && typeof state === 'object' && Object.values(state).every((val) => 'done' in val && val.lists);
	}

	private static store(): void {
		ProgressStore.pageState.done = ProgressStore.isPageDone;
		try {
			localStorage.setItem(ProgressStore.key, JSON.stringify(ProgressStore.state));
		} catch (e) {
			/* might be incognito mode, no biggie */
		}
	}

	private static get pageState(): PageState {
		return ProgressStore.state[ProgressStore.pageKey];
	}

	/** Work out if all of this page’s lists is complete. */
	private static get isPageDone(): boolean {
		return Object.values(ProgressStore.pageState.lists).every(ProgressStore.isListDone);
	}

	/** Work out if either of a checklist’s sub-lists is complete. */
	private static isListDone(list: ListState): boolean {
		return (['primary', 'secondary'] as const).map((type) => !!list[type].length && list[type].every((i) => i)).some((i) => i);
	}

	private static slugFromPathname(pathname: string) {
		return pathname.split('/').slice(2).join('/').replace(/\/$/, '');
	}
}
