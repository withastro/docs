import { h } from 'preact'
import { useStore } from '@nanostores/preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { registerTab, tabStore } from './store'

type Props = {
	children: JSX.Element;
	id: string;
}

export default function Tab({ id, children }: Props) {
	const $tabStore = useStore(tabStore)
	const [storeKey, setStoreKey] = useState<string | null>(null)
	const containerRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (containerRef.current) {
			const nearestTabWrapper = containerRef.current?.closest('[data-store-key]')
			if (!nearestTabWrapper) {
				throw new Error(
					`Unable to find a tab wrapper for a TabPanel! Did you forget to use the <Tabs> component wrapper?`
				)
			}
			const wrapperKey = nearestTabWrapper.getAttribute('data-store-key')!
			setStoreKey(wrapperKey)
			registerTab(wrapperKey, id)
		}
	}, [containerRef])

	return (
		<button ref={containerRef} onClick={() => {
			if (storeKey) {
				tabStore.setKey(storeKey, {
					...$tabStore[storeKey],
					currIdx: $tabStore[storeKey].tabs.indexOf(id),
				})
			}
		}}>{children}</button>
	)
}
