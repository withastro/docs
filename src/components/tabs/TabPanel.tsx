import { useStore } from '@nanostores/preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { tabStore } from './store'

type Props = {
	children: JSX.Element;
	id: string;
}

export default function TabPanel({ id, children }: Props) {
	const $tabStore = useStore(tabStore)
	const [storeKey, setStoreKey] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

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
		}
	}, [containerRef])

	console.log(storeKey && $tabStore[storeKey].tabs)

	return (
		<div ref={containerRef} hidden={storeKey ? $tabStore[storeKey].currIdx !== $tabStore[storeKey].tabs.indexOf(id) : true}>
			{children}
		</div>
	)
}
