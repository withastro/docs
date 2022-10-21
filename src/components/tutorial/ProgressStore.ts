export type SubListType = 'primary' | 'secondary';
type ListState = Record<SubListType, boolean[]>;
type PageState = { done: boolean; lists: Record<string, ListState> };
type ProgressState = Record<string, PageState>;

/**
 * This class is basically just a plain object used as a singleton, but written as a
 * class to allow APIs to be marked as private/public. It is used to manage data on
 * a user’s progress through the Build a Blog tutorial, which gets saved to the
 * browser’s localstorage.
 *
 * The data stored looks something like this:
 *
 * ```json
 * {
 *   "tutorial/0-introduction": {
 *     "done": true,
 *     "lists": { "introduction": { "primary": [true, true], "secondary": [] } }
 *   },
 *   "tutorial/0-introduction/1": {
 *     "done": false,
 *     "lists": { "default": { "primary": [true, false, false], "secondary": [false] } }
 *   }
 * }
 * ```
 *
 * Each key is the slug for a specific page and stores whether the page is `done`
 * (all checklists on the page are complete) as well as a record of all the `lists`
 * found on that page. These entries are populated as a user visits each page,
 * so the store doesn’t know about _all_ pages that might exist, only all lists
 * on pages that have been visited. This avoids the need for a central definition
 * of all checklists. Instead, each checklist registers itself with `ProgressStore`
 * when it is loaded.
 *
 * Each list can have both `primary` and `secondary` sublists. This provides
 * support for checklists that offer an alternate “OR” set of options to check off.
 * A list is `done` when either of these sublists is complete. These sublists are
 * just arrays of boolean values with an entry for each item in the sublist.
 *
 * ## Lifecycle
 *
 * 1. Page load:
 *
 *    - `ProgressStore` initializes, parsing the current page’s key from the URL,
 *      loading previously stored data from localstorage, and initializing this
 *      page’s data object if not already in localstorage.
 *
 *    - Any `<Checklist>` components on the page will initialise list, sublist,
 *      and sublist items, adding them to the store if not yet present.
 *
 *    - `<Checklist>` components will also _ask_ for any previously stored state
 *      at this point and use it to mark items as checked if appropriate.
 *
 *    - `<Progress>` and `<UnitProgressIcon>` will similarly check in to see if
 *      they should be showing as complete or not. They use a slug they receive as a
 *      prop to know which bit of state to ask for.
 *
 * 2. User interaction:
 *
 *    - A user clicks on a `<Checklist>` item marking it as checked/unchecked.
 *
 *    - This triggers a call to `setSubListItem`, which will update the boolean
 *      value in the appropriate sublist, update the page’s `done` value if
 *      appropriate, and then store the updated state to localstorage.
 *
 *    - As part of storing state, we always `notifySubscribers` so that any components
 *      listening for changes in state will find out that state changed. This allows,
 *      e.g. `<Progress>` to update to “checked” when the page completes, even though
 *      the checkbox is elsewhere on the page.
 *
 * ## Migration Scenarios
 *
 * The data stored in a user’s localstorage could become out of date if we change up
 * the tutorial structure in the following ways:
 *
 * 1. We change the number of items in a checklist.
 *
 *    If a user checked off a two-item list and we later add a third, it’ll stay “done”
 *    until the user re-visits that page, at which point the list will re-initialise
 *    and their checks will be wiped.
 *
 *    This is probably reasonable behaviour for the most part. No further dev action
 *    is required.
 *
 * 2. We add a checklist to a page.
 *
 *    Similar to above, the page may stay “done” until the user re-visits the page at
 *    which point the new checklist will register and state will be updated.
 *
 * 3. We _remove_ a checklist (or alternate sublist) from a page.
 *
 *    If a user visited a page previously and we later remove a checklist, this list’s
 *    state will remain in localstorage and not be updated. This could result in a page
 *    incorrectly NOT being marked as “done” because the ghost list wasn’t complete.
 *
 *    We should try to AVOID this. If the scenario arises, we will need to add migration
 *    logic to `ProgressStore` that maps slugs to list keys that need removing.
 *
 * 4. We _rename_ a checklist’s `key`.
 *
 *    This triggers the same scenario as #3 above and should be avoided.
 *
 * 5. We rename a page, moving its contents.
 *
 *    This is also liable to trigger the same scenario as #3 & #4, and is the more
 *    likely scenario. As long as the checklists weren’t using a custom `key`,
 *    this should work itself out. Perhaps some items will be marked as “done” even
 *    though the done items were for the old items on that page, but that’s probably
 *    OK. The more serious situation would be if the moved checklist had a custom `key`
 *    in which case it would continue to be stored in the user’s localstorage and would
 *    need the same migration strategy as for #3 above.
 *
 */
export class ProgressStore {
	private static key = 'astro-tutorial-progress';
	private static pageKey = ProgressStore.slugFromPathname(window.location.pathname);
	private static state: ProgressState = {
		[ProgressStore.pageKey]: { done: false, lists: {} },
		...ProgressStore.load(),
	};
	private static subscribers = new Map<(b: boolean) => void, string>();

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

	public static setSubListItem(
		listKey: string,
		type: SubListType,
		index: number,
		value: boolean
	): void {
		ProgressStore.pageState.lists[listKey][type][index] = value;
		ProgressStore.store();
	}

	public static getPageDone(path: string): boolean {
		const state = ProgressStore.state[ProgressStore.slugFromPathname(path)];
		return !!state && state.done;
	}

	public static subscribePageDone(path: string, callback: (done: boolean) => void): () => void {
		ProgressStore.subscribers.set(callback, path);
		callback(ProgressStore.getPageDone(path));
		return () => void ProgressStore.subscribers.delete(callback);
	}

	private static notifySubscribers() {
		for (const [callback, path] of ProgressStore.subscribers.entries()) {
			callback(ProgressStore.getPageDone(path));
		}
	}

	private static load(): ProgressState {
		try {
			const state = JSON.parse(localStorage.getItem(ProgressStore.key) || '{}');
			if (ProgressStore.validate(state)) return state;
		} catch (e) {
			/* assume no stored state */
		}
		return {};
	}

	private static validate(state: unknown): state is ProgressState {
		return (
			!!state &&
			typeof state === 'object' &&
			Object.values(state).every((val) => 'done' in val && val.lists)
		);
	}

	private static store(): void {
		ProgressStore.pageState.done = ProgressStore.isPageDone;
		ProgressStore.notifySubscribers();
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
		return (['primary', 'secondary'] as const)
			.map((type) => !!list[type].length && list[type].every((i) => i))
			.some((i) => i);
	}

	private static slugFromPathname(pathname: string) {
		// Remove the language segment from the path,
		// and strip a trailing slash, if present.
		return pathname.split('/').slice(2).join('/').replace(/\/$/, '');
	}
}
