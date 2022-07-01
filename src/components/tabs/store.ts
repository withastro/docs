import { map } from 'nanostores';

type TabStore = {
	[key: string]: {
		curr: string;
	}
}

export const tabStore = map<TabStore>({})
