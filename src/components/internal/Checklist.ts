interface CheckListState {
	done: boolean;
	primary: boolean[];
	secondary: boolean[];
}
type SubListType = 'primary' | 'secondary';

class CheckList extends HTMLElement {
	state: CheckListState = { done: false, primary: [], secondary: [] };
	key: string;

	constructor() {
		super();
		this.key = CheckList.Key(this.dataset['key']!);
		this.loadState();
		this.upgradeSubList(this.querySelector('.checklist ul'), 'primary');
		this.upgradeSubList(this.querySelector('.checklist.alternative ul'), 'secondary');
	}

	/** Upgrade the primary or secondary check lists. */
	upgradeSubList(ul: Element | null, type: SubListType) {
		if (!ul) return;
		const items = Array.from(ul.children);
		
		// Initialise this sub-list’s state.
		if (this.state[type].length !== items.length) {
			this.state[type] = items.map(() => false);
		}
		
		items.forEach((li, index) => this.upgradeTaskItem(li, type, index));
	}

	/** Upgrade an item in a GitHub-Flavoured Markdown task list. */
	upgradeTaskItem(li: Element, type: SubListType, index: number) {
		// 1. Wrap contents in `<label>` to associate checkbox with contents.
		const label = document.createElement('label');
		// Markdown may wrap `<li>` contents in `<p>`. This ensures we nest the `<label>` in that case.
		const target = li.children.length === 1 && li.children[0].nodeName === 'P'
			? li.children[0]
			: li;
		const { childNodes } = target.cloneNode(true);
		label.append(...childNodes);
		target.replaceChildren(label);

		// 2. Re-enable checkboxes, hydrate state & listen for changes.
		const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
		checkbox.removeAttribute('disabled');
		checkbox.checked = this.state[type][index];
		checkbox.addEventListener('change', (e) => {
			this.setState(type, index, (e.currentTarget as HTMLInputElement).checked);
		});
	}

	/** Update state for a specific task. */
	setState(type: SubListType, index: number, value: boolean) {
		this.state[type][index] = value;
		this.state.done = this.isDone();
		this.storeState();
	}

	/** Work out if either of this checklist’s sub-lists is complete. */
	isDone() {
		return (['primary', 'secondary'] as const)
			.map(type => !!this.state[type].length && this.state[type].every(i => i))
			.some(i => i);
	}

	loadState() {
		try {
			const state = JSON.parse(localStorage.getItem(this.key)!);
			if (state) this.state = state;
		} catch (e) { /* assume no stored state */ }
	}

	storeState() {
		try {
			localStorage.setItem(this.key, JSON.stringify(this.state));
		} catch (e) { /* might be incognito mode, no biggie */ }
	}

	static Key(key: string) {
		return 'tutorial/checklist/' + key;
	}
}

customElements.define('check-list', CheckList);
