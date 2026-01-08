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
