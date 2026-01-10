<script lang="ts">
	import { safariState, type Tab } from '🍎/state/safari.svelte.ts';
	
	// Use external state so it persists on minimize
	let inputUrl = $state('');
	
	// Get active tab
	const activeTab = $derived(safariState.tabs.find(t => t.id === safariState.activeTabId) || safariState.tabs[0]);
	const showStartPage = $derived(!activeTab.url);
	const canGoBack = $derived(activeTab.historyIndex > 0);
	const canGoForward = $derived(activeTab.historyIndex < activeTab.history.length - 1);
	
	// Sync inputUrl with active tab
	$effect(() => {
		inputUrl = activeTab.url || '';
	});
	
	// Favorites for start page
	const favorites = [
		{ name: 'Google', url: 'https://www.google.com/webhp?igu=1', icon: '🔍', color: '#4285f4' },
		{ name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', icon: '📚', color: '#000' },
		{ name: 'Archive.org', url: 'https://archive.org', icon: '📖', color: '#428bca' },
		{ name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.15%2C51.5%2C0.0%2C51.55&layer=mapnik', icon: '🗺️', color: '#7ebc6f' },
		{ name: 'Bing', url: 'https://www.bing.com/search?q=hello', icon: '🔎', color: '#008373' },
	];
	
	// Sites that block iframes
	const blockedDomains = ['github.com', 'twitter.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'lichess.org', 'chess.com'];
	
	function isBlocked(url: string): boolean {
		if (url.startsWith('github://') || url.startsWith('vercel://') || url.startsWith('youtube://')) return true;
		return blockedDomains.some(domain => url.includes(domain));
	}
	
	function isSearchQuery(input: string): boolean {
		return !input.includes('.') || input.includes(' ');
	}
	
	function navigate(url: string) {
		if (!url.trim()) return;
		
		// Handle search queries - open Google in new tab
		if (isSearchQuery(url)) {
			window.open(`https://www.google.com/search?q=${encodeURIComponent(url)}`, '_blank');
			return;
		}
		
		let finalUrl = url;
		if (!url.startsWith('http')) {
			finalUrl = 'https://' + url;
		}
		
		// Update active tab with new URL and add to history
		safariState.tabs = safariState.tabs.map(t => {
			if (t.id === safariState.activeTabId) {
				const newHistory = [...t.history.slice(0, t.historyIndex + 1), finalUrl];
				return { 
					...t, 
					url: finalUrl, 
					title: getTitle(finalUrl), 
					isLoading: true,
					history: newHistory,
					historyIndex: newHistory.length - 1,
					iframeKey: t.iframeKey + 1
				};
			}
			return t;
		});
		
		inputUrl = finalUrl;
		
		setTimeout(() => {
			safariState.tabs = safariState.tabs.map(t => {
				if (t.id === safariState.activeTabId) {
					return { ...t, isLoading: false };
				}
				return t;
			});
		}, 800);
	}
	
	function goBack() {
		if (!canGoBack) return;
		
		const tab = safariState.tabs.find(t => t.id === safariState.activeTabId);
		if (!tab || tab.historyIndex <= 0) return;
		
		const newIndex = tab.historyIndex - 1;
		const newUrl = tab.history[newIndex];
		
		safariState.tabs = safariState.tabs.map(t => {
			if (t.id === safariState.activeTabId) {
				return { 
					...t, 
					historyIndex: newIndex, 
					url: newUrl, 
					title: getTitle(newUrl),
					iframeKey: t.iframeKey + 1
				};
			}
			return t;
		});
		
		inputUrl = newUrl;
	}
	
	function goForward() {
		if (!canGoForward) return;
		
		const tab = safariState.tabs.find(t => t.id === safariState.activeTabId);
		if (!tab || tab.historyIndex >= tab.history.length - 1) return;
		
		const newIndex = tab.historyIndex + 1;
		const newUrl = tab.history[newIndex];
		
		safariState.tabs = safariState.tabs.map(t => {
			if (t.id === safariState.activeTabId) {
				return { 
					...t, 
					historyIndex: newIndex, 
					url: newUrl, 
					title: getTitle(newUrl),
					iframeKey: t.iframeKey + 1
				};
			}
			return t;
		});
		
		inputUrl = newUrl;
	}
	
	function getTitle(url: string): string {
		if (!url) return 'Start Page';
		if (url.includes('google.com')) return 'Google';
		if (url.includes('wikipedia.org')) return 'Wikipedia';
		if (url.includes('archive.org')) return 'Archive.org';
		try {
			return new URL(url).hostname;
		} catch {
			return 'New Tab';
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			navigate(inputUrl);
		}
	}
	
	function newTab() {
		const newT: Tab = { 
			id: safariState.nextTabId, 
			url: '', 
			title: 'Start Page', 
			isLoading: false, 
			history: [], 
			historyIndex: -1,
			iframeKey: safariState.nextTabId * 1000
		};
		safariState.tabs = [...safariState.tabs, newT];
		safariState.activeTabId = safariState.nextTabId;
		safariState.nextTabId++;
		inputUrl = '';
	}
	
	function closeTab(id: number) {
		if (safariState.tabs.length === 1) {
			safariState.tabs = [{ id: 1, url: '', title: 'Start Page', isLoading: false, history: [], historyIndex: -1, iframeKey: Date.now() }];
			safariState.activeTabId = 1;
			inputUrl = '';
			return;
		}
		
		const index = safariState.tabs.findIndex(t => t.id === id);
		safariState.tabs = safariState.tabs.filter(t => t.id !== id);
		
		if (safariState.activeTabId === id) {
			safariState.activeTabId = safariState.tabs[Math.max(0, index - 1)].id;
			inputUrl = safariState.tabs.find(t => t.id === safariState.activeTabId)?.url || '';
		}
	}
	
	function selectTab(id: number) {
		safariState.activeTabId = id;
		const tab = safariState.tabs.find(t => t.id === id);
		if (tab) {
			inputUrl = tab.url;
		}
	}
	
	function goHome() {
		safariState.tabs = safariState.tabs.map(t => {
			if (t.id === safariState.activeTabId) {
				return { ...t, url: '', title: 'Start Page', history: [], historyIndex: -1 };
			}
			return t;
		});
		inputUrl = '';
	}
	
	function refresh() {
		if (activeTab.url) {
			safariState.tabs = safariState.tabs.map(t => {
				if (t.id === safariState.activeTabId) {
					return { ...t, isLoading: true, iframeKey: t.iframeKey + 1 };
				}
				return t;
			});
			setTimeout(() => {
				safariState.tabs = safariState.tabs.map(t => {
					if (t.id === safariState.activeTabId) {
						return { ...t, isLoading: false };
					}
					return t;
				});
			}, 500);
		}
	}
	
	function openExternal(url: string) {
		window.open(url, '_blank');
	}
</script>

<div class="safari-container">
	<!-- Tab Bar -->
	<div class="tab-bar">
		<div class="tabs-wrapper">
			{#each safariState.tabs as tab (tab.id)}
				<div 
					class="tab" 
					class:active={tab.id === safariState.activeTabId}
					role="button"
					tabindex="0"
					onclick={() => selectTab(tab.id)}
					onkeydown={(e) => e.key === 'Enter' && selectTab(tab.id)}
				>
					<span class="tab-title">{tab.title}</span>
					<button class="tab-close" onclick={(e) => { e.stopPropagation(); closeTab(tab.id); }} aria-label="Close tab">
						<svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
					</button>
				</div>
			{/each}
			<button class="new-tab-btn" onclick={newTab} aria-label="New tab">
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
			</button>
		</div>
	</div>
	
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="nav-buttons">
			<button class="nav-btn" disabled={!canGoBack} onclick={goBack} aria-label="Back">
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
			</button>
			<button class="nav-btn" disabled={!canGoForward} onclick={goForward} aria-label="Forward">
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
			</button>
			<button class="nav-btn" onclick={refresh} aria-label="Refresh">
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
			</button>
		</div>
		
		<div class="url-bar">
			{#if activeTab.isLoading}
				<div class="loading-spinner"></div>
			{:else}
				<svg class="url-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
			{/if}
			<input 
				type="text" 
				bind:value={inputUrl}
				onkeydown={handleKeydown}
				placeholder="Search or enter website"
			/>
			<button class="home-btn" onclick={goHome} aria-label="Home">
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
			</button>
		</div>
		
		<button class="share-btn" onclick={() => activeTab.url && openExternal(activeTab.url)} aria-label="Open externally">
			<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
		</button>
	</div>
	
	<!-- Content Area - Each tab has its own iframe -->
	<div class="content-area">
		{#each safariState.tabs as tab (tab.id)}
			<div class="tab-content" class:active={tab.id === safariState.activeTabId}>
				{#if !tab.url}
					<!-- Start Page -->
					<div class="start-page">
						<div class="start-content">
							<h1 class="start-title">Start Page</h1>
							
							<div class="search-box">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
								<input 
									type="text" 
									placeholder="Search Google"
									onkeydown={(e) => {
										if (e.key === 'Enter' && e.currentTarget.value) {
											window.open(`https://www.google.com/search?q=${encodeURIComponent(e.currentTarget.value)}`, '_blank');
											e.currentTarget.value = '';
										}
									}}
								/>
							</div>
							
							<div class="favorites-section">
								<h2>Favorites</h2>
								<div class="favorites-grid">
									{#each favorites as fav}
										<button class="favorite-item" onclick={() => navigate(fav.url)}>
											<div class="favorite-icon" style:background={fav.color}>
												<span>{fav.icon}</span>
											</div>
											<span class="favorite-name">{fav.name}</span>
										</button>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{:else if isBlocked(tab.url)}
					<!-- Blocked Site -->
					<div class="blocked-preview">
						<div class="preview-card blocked">
							<div class="blocked-icon">🔒</div>
							<h2>Cannot Display Page</h2>
							<p class="blocked-url">{tab.url}</p>
							<p class="blocked-reason">This website doesn't allow embedding.</p>
							<button class="open-btn" onclick={() => openExternal(tab.url)}>
								Open in New Tab
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
							</button>
						</div>
					</div>
				{:else}
					<!-- Iframe - unique key per tab -->
					{#key tab.iframeKey}
						<iframe 
							src={tab.url}
							title="Browser content for tab {tab.id}"
							sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
						></iframe>
					{/key}
				{/if}
			</div>
		{/each}
	</div>
</div>


<style>
	.safari-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: #fff;
		border-radius: 0 0 10px 10px;
		overflow: hidden;
	}

	/* Tab Bar */
	.tab-bar {
		display: flex;
		align-items: center;
		background: linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 100%);
		border-bottom: 1px solid #b8b8b8;
		padding: 6px 8px 0;
		padding-left: 80px;
	}

	.tabs-wrapper {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		flex: 1;
		overflow-x: auto;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: #c8c8c8;
		border: 1px solid #b0b0b0;
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		font-size: 12px;
		color: #555;
		cursor: pointer;
		min-width: 120px;
		max-width: 200px;
		transition: all 0.15s;
		user-select: none;
	}

	.tab.active {
		background: #fff;
		color: #333;
		border-color: #c8c8c8;
	}

	.tab-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tab-close {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: transparent;
		border: none;
		color: #888;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: all 0.15s;
	}

	.tab:hover .tab-close { opacity: 1; }
	.tab-close:hover { background: rgba(0,0,0,0.1); color: #333; }
	.tab-close svg { width: 10px; height: 10px; }

	.new-tab-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: transparent;
		border: none;
		color: #666;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 4px;
		margin-bottom: 4px;
	}

	.new-tab-btn:hover { background: rgba(0,0,0,0.08); }
	.new-tab-btn svg { width: 20px; height: 20px; }

	/* Toolbar */
	.toolbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: #f6f6f6;
		border-bottom: 1px solid #ddd;
	}

	.nav-buttons {
		display: flex;
		gap: 2px;
	}

	.nav-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: transparent;
		border: none;
		color: #555;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-btn:hover:not(:disabled) { background: rgba(0,0,0,0.08); }
	.nav-btn:disabled { color: #ccc; cursor: default; }
	.nav-btn svg { width: 18px; height: 18px; }

	.url-bar {
		flex: 1;
		display: flex;
		align-items: center;
		background: #fff;
		border: 1px solid #c8c8c8;
		border-radius: 8px;
		padding: 6px 12px;
		gap: 8px;
	}

	.url-icon {
		width: 16px;
		height: 16px;
		color: #888;
		flex-shrink: 0;
	}

	.loading-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid #ddd;
		border-top-color: #007aff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.url-bar input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 13px;
		color: #333;
		background: transparent;
	}

	.home-btn {
		width: 20px;
		height: 20px;
		background: transparent;
		border: none;
		color: #888;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.home-btn:hover { color: #333; }
	.home-btn svg { width: 16px; height: 16px; }

	.share-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: transparent;
		border: none;
		color: #007aff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.share-btn:hover { background: rgba(0,122,255,0.1); }
	.share-btn svg { width: 18px; height: 18px; }

	/* Content Area */
	.content-area {
		flex: 1;
		overflow: hidden;
		background: #fff;
		position: relative;
	}

	.tab-content {
		position: absolute;
		inset: 0;
		display: none;
	}

	.tab-content.active {
		display: block;
	}

	.tab-content iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	/* Start Page */
	.start-page {
		height: 100%;
		background: linear-gradient(180deg, #f5f5f7 0%, #e8e8ea 100%);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 60px;
		overflow-y: auto;
	}

	.start-content {
		width: 100%;
		max-width: 500px;
		padding: 0 20px;
	}

	.start-title {
		font-size: 28px;
		font-weight: 700;
		color: #333;
		text-align: center;
		margin-bottom: 24px;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 10px;
		padding: 12px 16px;
		gap: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08);
		margin-bottom: 40px;
	}

	.search-box svg {
		width: 20px;
		height: 20px;
		color: #888;
		flex-shrink: 0;
	}

	.search-box input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 16px;
		color: #333;
	}

	.favorites-section h2 {
		font-size: 14px;
		font-weight: 600;
		color: #666;
		margin-bottom: 16px;
	}

	.favorites-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.favorite-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: 12px;
		transition: all 0.15s;
	}

	.favorite-item:hover { background: rgba(0,0,0,0.05); }

	.favorite-icon {
		width: 52px;
		height: 52px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
	}

	.favorite-name {
		font-size: 11px;
		color: #333;
	}

	/* Blocked Preview */
	.blocked-preview {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.preview-card {
		background: #f5f5f7;
		border-radius: 20px;
		padding: 40px;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		max-width: 380px;
		color: #333;
	}

	.blocked-icon { font-size: 48px; margin-bottom: 16px; }

	.preview-card h2 {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.blocked-url { font-size: 11px; color: #666; word-break: break-all; }
	.blocked-reason { font-size: 12px; color: #888; margin: 8px 0 20px; }

	.open-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background: #007aff;
		color: #fff;
		border: none;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.open-btn:hover { background: #0066d6; }
	.open-btn svg { width: 16px; height: 16px; }
</style>
