// Safari browser state - persists across minimize/restore

export type Tab = {
	id: number;
	url: string;
	title: string;
	isLoading: boolean;
	history: string[];
	historyIndex: number;
	iframeKey: number;
};

export const safariState = $state({
	tabs: [
		{ id: 1, url: '', title: 'Start Page', isLoading: false, history: [], historyIndex: -1, iframeKey: 1 }
	] as Tab[],
	activeTabId: 1,
	nextTabId: 2,
});

// Function to open a URL in Safari from other apps
export function openInSafari(url: string, title?: string) {
	const newTab: Tab = {
		id: safariState.nextTabId,
		url: url,
		title: title || getTitle(url),
		isLoading: true,
		history: [url],
		historyIndex: 0,
		iframeKey: safariState.nextTabId * 1000
	};
	
	safariState.tabs = [...safariState.tabs, newTab];
	safariState.activeTabId = safariState.nextTabId;
	safariState.nextTabId++;
	
	// Stop loading after a delay
	setTimeout(() => {
		safariState.tabs = safariState.tabs.map(t => {
			if (t.id === newTab.id) {
				return { ...t, isLoading: false };
			}
			return t;
		});
	}, 800);
}

function getTitle(url: string): string {
	if (!url) return 'New Tab';
	if (url.includes('lichess.org')) return 'Lichess';
	if (url.includes('chess.com')) return 'Chess.com';
	if (url.includes('google.com')) return 'Google';
	try {
		return new URL(url).hostname;
	} catch {
		return 'New Tab';
	}
}
