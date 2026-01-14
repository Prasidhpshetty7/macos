<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { desktopFilesState, type DesktopFile } from '🍎/state/desktop-files.svelte.ts';
	import { onMount } from 'svelte';
	
	type SidebarItem = {
		id: string;
		name: string;
		icon: string;
		type: 'favorite' | 'tag';
		color?: string;
	};
	
	type RecentItem = {
		id: string;
		name: string;
		type: 'app' | 'folder' | 'file';
		appId?: string;
		timestamp: number;
	};
	
	// Track recent activities
	let recentItems = $state<RecentItem[]>([]);
	
	const favorites: SidebarItem[] = [
		{ id: 'recents', name: 'Recents', icon: '🕐', type: 'favorite' },
		{ id: 'applications', name: 'Applications', icon: '📱', type: 'favorite' },
		{ id: 'desktop', name: 'Desktop', icon: '🖥️', type: 'favorite' },
		{ id: 'documents', name: 'Documents', icon: '📄', type: 'favorite' },
		{ id: 'downloads', name: 'Downloads', icon: '⬇️', type: 'favorite' },
	];
	
	const tags: SidebarItem[] = [
		{ id: 'red', name: 'Red', icon: '●', type: 'tag', color: '#ff3b30' },
		{ id: 'orange', name: 'Orange', icon: '●', type: 'tag', color: '#ff9500' },
		{ id: 'yellow', name: 'Yellow', icon: '●', type: 'tag', color: '#ffcc00' },
		{ id: 'green', name: 'Green', icon: '●', type: 'tag', color: '#34c759' },
		{ id: 'blue', name: 'Blue', icon: '●', type: 'tag', color: '#007aff' },
		{ id: 'purple', name: 'Purple', icon: '●', type: 'tag', color: '#af52de' },
		{ id: 'gray', name: 'Gray', icon: '●', type: 'tag', color: '#8e8e93' },
	];
	
	let activeSection = $state('desktop');
	let viewMode = $state<'grid' | 'list' | 'columns'>('grid');
	let navigationHistory = $state<string[]>(['desktop']);
	let historyIndex = $state(0);
	let currentFolder = $state<DesktopFile | null>(null);
	
	// Check if a folder was requested to open
	$effect(() => {
		if (desktopFilesState.folderToOpen) {
			currentFolder = desktopFilesState.folderToOpen;
			activeSection = `folder:${desktopFilesState.folderToOpen.id}`;
			navigationHistory = [...navigationHistory.slice(0, historyIndex + 1), activeSection];
			historyIndex = navigationHistory.length - 1;
			
			// Add to recent items
			addToRecent({
				id: desktopFilesState.folderToOpen.id,
				name: desktopFilesState.folderToOpen.name,
				type: 'folder',
				timestamp: Date.now()
			});
			
			desktopFilesState.folderToOpen = null;
		}
	});
	
	// Check if a specific section was requested
	$effect(() => {
		if (desktopFilesState.finderSection) {
			activeSection = desktopFilesState.finderSection;
			currentFolder = null;
			navigationHistory = [desktopFilesState.finderSection];
			historyIndex = 0;
			desktopFilesState.finderSection = null;
		}
	});
	
	function addToRecent(item: RecentItem) {
		// Remove if already exists
		recentItems = recentItems.filter(r => r.id !== item.id);
		// Add to front
		recentItems = [item, ...recentItems].slice(0, 10); // Keep max 10 items
	}
	
	// Get all apps for Applications view
	const allApps = Object.entries(apps_config)
		.filter(([_, config]) => config.should_open_window !== false)
		.map(([id, config]) => ({
			id: id as AppID,
			title: config.title,
		}))
		.sort((a, b) => a.title.localeCompare(b.title));
	
	function navigate(sectionId: string) {
		if (sectionId === activeSection) return;
		
		// Clear current folder if navigating to a standard section
		if (!sectionId.startsWith('folder:')) {
			currentFolder = null;
		}
		
		// Add to history
		navigationHistory = [...navigationHistory.slice(0, historyIndex + 1), sectionId];
		historyIndex = navigationHistory.length - 1;
		activeSection = sectionId;
	}
	
	function goBack() {
		if (historyIndex > 0) {
			historyIndex--;
			activeSection = navigationHistory[historyIndex];
			// Update currentFolder if going back to a folder view
			if (activeSection.startsWith('folder:')) {
				const folderId = activeSection.replace('folder:', '');
				currentFolder = desktopFilesState.files.find(f => f.id === folderId) || null;
			} else {
				currentFolder = null;
			}
		}
	}
	
	function goForward() {
		if (historyIndex < navigationHistory.length - 1) {
			historyIndex++;
			activeSection = navigationHistory[historyIndex];
			// Update currentFolder if going forward to a folder view
			if (activeSection.startsWith('folder:')) {
				const folderId = activeSection.replace('folder:', '');
				currentFolder = desktopFilesState.files.find(f => f.id === folderId) || null;
			} else {
				currentFolder = null;
			}
		}
	}
	
	function openApp(appId: AppID) {
		apps.open[appId] = true;
		apps.running[appId] = true;
		apps.minimized[appId] = false;
		apps.active = appId;
		
		if (appId === 'drift') {
			apps.fullscreen[appId] = true;
		}
		
		// Add to recent items
		const appConfig = apps_config[appId];
		if (appConfig) {
			addToRecent({
				id: appId,
				name: appConfig.title,
				type: 'app',
				appId: appId,
				timestamp: Date.now()
			});
		}
	}
	
	function openDesktopFile(file: DesktopFile) {
		if (file.type === 'app' && file.appId) {
			openApp(file.appId as AppID);
		} else if (file.type === 'folder') {
			// Open folder content in VSCode
			desktopFilesState.fileToOpen = file;
			openApp('vscode');
		}
	}
	
	function getSectionTitle(id: string): string {
		// Check if it's a folder view
		if (id.startsWith('folder:') && currentFolder) {
			return currentFolder.name;
		}
		const item = [...favorites, ...tags].find(i => i.id === id);
		return item?.name || 'Finder';
	}
</script>

<section class="finder-app">
	<!-- Sidebar -->
	<div class="sidebar">
		<div class="sidebar-section">
			<div class="section-title">Favorites</div>
			{#each favorites as item}
				<button 
					class="sidebar-item" 
					class:active={activeSection === item.id}
					onclick={() => navigate(item.id)}
				>
					<span class="item-icon">{item.icon}</span>
					<span class="item-name">{item.name}</span>
				</button>
			{/each}
		</div>
		
		<div class="sidebar-section">
			<div class="section-title">Tags</div>
			{#each tags as tag}
				<button 
					class="sidebar-item"
					class:active={activeSection === tag.id}
					onclick={() => navigate(tag.id)}
				>
					<span class="tag-dot" style:color={tag.color}>●</span>
					<span class="item-name">{tag.name}</span>
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Main Content -->
	<div class="main-content">
		<!-- Toolbar -->
		<div class="toolbar app-window-drag-handle">
			<div class="nav-buttons">
				<button class="nav-btn" onclick={goBack} disabled={historyIndex === 0}>
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
				</button>
				<button class="nav-btn" onclick={goForward} disabled={historyIndex >= navigationHistory.length - 1}>
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
				</button>
			</div>
			
			<div class="path-title">{getSectionTitle(activeSection)}</div>
			
			<div class="toolbar-actions">
				<button class="toolbar-btn" class:active={viewMode === 'grid'} onclick={() => viewMode = 'grid'}>
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
				</button>
				<button class="toolbar-btn" class:active={viewMode === 'list'} onclick={() => viewMode = 'list'}>
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>
				</button>
				<div class="toolbar-divider"></div>
				<button class="toolbar-btn">
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
				</button>
				<button class="toolbar-btn search-btn">
					<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
				</button>
			</div>
		</div>
		
		<!-- Content Area -->
		<div class="content-area">
			{#if activeSection === 'applications'}
				<div class="files-grid" class:list-view={viewMode === 'list'}>
					{#each allApps as app}
						<button class="file-item" ondblclick={() => openApp(app.id)}>
							<div class="file-icon">
								<img 
									src="/app-icons/{app.id}/256.webp" 
									alt={app.title}
									onerror={(e) => { e.currentTarget.src = `/app-icons/${app.id}/256.png`; }}
								/>
							</div>
							<span class="file-name">{app.title}</span>
						</button>
					{/each}
				</div>
			{:else if activeSection === 'desktop'}
				<div class="files-grid" class:list-view={viewMode === 'list'}>
					{#each desktopFilesState.files as file}
						<button class="file-item" ondblclick={() => openDesktopFile(file)}>
							<div class="file-icon">
								{#if file.type === 'folder'}
									<svg viewBox="0 0 80 64" fill="none" class="folder-svg">
										<defs>
											<linearGradient id="finderFolderFront" x1="0%" y1="0%" x2="0%" y2="100%">
												<stop offset="0%" style="stop-color:#6ED4F7"/>
												<stop offset="100%" style="stop-color:#28A3DC"/>
											</linearGradient>
											<linearGradient id="finderFolderBack" x1="0%" y1="0%" x2="0%" y2="100%">
												<stop offset="0%" style="stop-color:#5BC8F0"/>
												<stop offset="100%" style="stop-color:#1E90CF"/>
											</linearGradient>
										</defs>
										<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#finderFolderBack)"/>
										<path d="M4 20H76V52C76 56 73 59 69 59H11C7 59 4 56 4 52V20Z" fill="url(#finderFolderFront)"/>
									</svg>
								{:else if file.type === 'app' && file.appId}
									<img 
										src="/app-icons/{file.appId}/256.webp" 
										alt={file.name}
										onerror={(e) => { e.currentTarget.src = `/app-icons/${file.appId}/256.png`; }}
									/>
								{:else}
									<span class="doc-icon">📄</span>
								{/if}
							</div>
							<span class="file-name">{file.name}</span>
						</button>
					{/each}
				</div>
			{:else if activeSection === 'recents'}
				{#if recentItems.length === 0}
					<div class="empty-state">
						<span class="empty-icon">🕐</span>
						<span class="empty-text">No Recent Items</span>
					</div>
				{:else}
					<div class="files-grid" class:list-view={viewMode === 'list'}>
						{#each recentItems as item}
							<button class="file-item" ondblclick={() => {
								if (item.type === 'app' && item.appId) {
									openApp(item.appId as AppID);
								} else if (item.type === 'folder') {
									const folder = desktopFilesState.files.find(f => f.id === item.id);
									if (folder) {
										currentFolder = folder;
										activeSection = `folder:${folder.id}`;
									}
								}
							}}>
								<div class="file-icon">
									{#if item.type === 'app' && item.appId}
										<img 
											src="/app-icons/{item.appId}/256.webp" 
											alt={item.name}
											onerror={(e) => { e.currentTarget.src = `/app-icons/${item.appId}/256.png`; }}
										/>
									{:else if item.type === 'folder'}
										<svg viewBox="0 0 80 64" fill="none" class="folder-svg">
											<defs>
												<linearGradient id="recentFolderFront" x1="0%" y1="0%" x2="0%" y2="100%">
													<stop offset="0%" style="stop-color:#6ED4F7"/>
													<stop offset="100%" style="stop-color:#28A3DC"/>
												</linearGradient>
												<linearGradient id="recentFolderBack" x1="0%" y1="0%" x2="0%" y2="100%">
													<stop offset="0%" style="stop-color:#5BC8F0"/>
													<stop offset="100%" style="stop-color:#1E90CF"/>
												</linearGradient>
											</defs>
											<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#recentFolderBack)"/>
											<path d="M4 20H76V52C76 56 73 59 69 59H11C7 59 4 56 4 52V20Z" fill="url(#recentFolderFront)"/>
										</svg>
									{:else}
										<span class="doc-icon">📄</span>
									{/if}
								</div>
								<span class="file-name">{item.name}</span>
							</button>
						{/each}
					</div>
				{/if}
			{:else if activeSection === 'documents'}
				<div class="files-grid" class:list-view={viewMode === 'list'}>
					{#each desktopFilesState.files.filter(f => f.type === 'folder') as file}
						<button class="file-item" ondblclick={() => openDesktopFile(file)}>
							<div class="file-icon">
								<svg viewBox="0 0 80 64" fill="none" class="folder-svg">
									<defs>
										<linearGradient id="docFolderFront" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" style="stop-color:#6ED4F7"/>
											<stop offset="100%" style="stop-color:#28A3DC"/>
										</linearGradient>
										<linearGradient id="docFolderBack" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" style="stop-color:#5BC8F0"/>
											<stop offset="100%" style="stop-color:#1E90CF"/>
										</linearGradient>
									</defs>
									<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#docFolderBack)"/>
									<path d="M4 20H76V52C76 56 73 59 69 59H11C7 59 4 56 4 52V20Z" fill="url(#docFolderFront)"/>
								</svg>
							</div>
							<span class="file-name">{file.name}</span>
						</button>
					{/each}
				</div>
			{:else if activeSection === 'downloads'}
				<div class="files-grid" class:list-view={viewMode === 'list'}>
					<button class="file-item" ondblclick={() => openApp('chess')}>
						<div class="file-icon">
							<img 
								src="/app-icons/chess/256.webp" 
								alt="Chess"
								onerror={(e) => { e.currentTarget.src = `/app-icons/chess/256.png`; }}
							/>
						</div>
						<span class="file-name">Chess</span>
					</button>
				</div>
			{:else if activeSection.startsWith('folder:') && currentFolder}
				<!-- Folder contents view -->
				<div class="folder-view">
					{#if currentFolder.content}
						<!-- Folder has content (like Portfolio) - show preview -->
						<div class="folder-content-preview">
							<div class="preview-header">
								<span class="preview-icon">📄</span>
								<span>index.html</span>
							</div>
							<div class="preview-body">
								<pre>{currentFolder.content.substring(0, 500)}...</pre>
							</div>
							<button class="open-vscode-btn" onclick={() => { desktopFilesState.fileToOpen = currentFolder; openApp('vscode'); }}>
								Open in VS Code
							</button>
						</div>
					{:else if currentFolder.children && currentFolder.children.length > 0}
						<!-- Folder has children -->
						<div class="files-grid" class:list-view={viewMode === 'list'}>
							{#each currentFolder.children as child}
								<button class="file-item">
									<div class="file-icon">
										<span class="doc-icon">📄</span>
									</div>
									<span class="file-name">{child.name}</span>
								</button>
							{/each}
						</div>
					{:else}
						<!-- Empty folder -->
						<div class="empty-state">
							<span class="empty-icon">📁</span>
							<span class="empty-text">This folder is empty</span>
						</div>
					{/if}
				</div>
			{:else}
				<div class="empty-state">
					<span class="empty-icon">🏷️</span>
					<span class="empty-text">No items with this tag</span>
				</div>
			{/if}
		</div>
	</div>
</section>


<style>
	.finder-app {
		height: 100%;
		width: 100%;
		display: flex;
		background: #fff;
		border-radius: inherit;
		overflow: hidden;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
	}
	
	/* Sidebar */
	.sidebar {
		width: 180px;
		background: rgba(245, 245, 247, 0.95);
		border-right: 1px solid rgba(0, 0, 0, 0.1);
		padding: 8px 0;
		padding-top: 40px;
		overflow-y: auto;
		flex-shrink: 0;
	}
	
	.sidebar-section {
		margin-bottom: 16px;
	}
	
	.section-title {
		font-size: 11px;
		font-weight: 600;
		color: #86868b;
		text-transform: uppercase;
		padding: 4px 16px;
		margin-bottom: 4px;
	}
	
	.sidebar-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 6px 16px;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 13px;
		color: #1d1d1f;
		text-align: left;
		border-radius: 0;
		transition: background 0.1s;
	}
	
	.sidebar-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	
	.sidebar-item.active {
		background: rgba(0, 122, 255, 0.15);
		color: #007aff;
	}
	
	.item-icon {
		font-size: 14px;
		width: 18px;
		text-align: center;
	}
	
	.tag-dot {
		font-size: 10px;
		width: 18px;
		text-align: center;
	}
	
	.item-name {
		flex: 1;
	}
	
	/* Main Content */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	
	/* Toolbar */
	.toolbar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 12px;
		background: rgba(245, 245, 247, 0.9);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		min-height: 38px;
	}
	
	.nav-buttons {
		display: flex;
		gap: 4px;
	}
	
	.nav-btn {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1d1d1f;
		transition: all 0.1s;
	}
	
	.nav-btn:hover:not(:disabled) {
		background: rgba(0, 0, 0, 0.08);
	}
	
	.nav-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}
	
	.nav-btn svg {
		width: 16px;
		height: 16px;
	}
	
	.path-title {
		font-size: 13px;
		font-weight: 600;
		color: #1d1d1f;
		flex: 1;
	}
	
	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	
	.toolbar-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #86868b;
		transition: all 0.1s;
	}
	
	.toolbar-btn:hover {
		background: rgba(0, 0, 0, 0.08);
		color: #1d1d1f;
	}
	
	.toolbar-btn.active {
		background: rgba(0, 0, 0, 0.1);
		color: #1d1d1f;
	}
	
	.toolbar-btn svg {
		width: 18px;
		height: 18px;
	}
	
	.toolbar-divider {
		width: 1px;
		height: 20px;
		background: rgba(0, 0, 0, 0.15);
		margin: 0 4px;
	}
	
	/* Content Area */
	.content-area {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		background: #fff;
	}
	
	.files-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		gap: 16px;
	}
	
	.files-grid.list-view {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	
	.files-grid.list-view .file-item {
		flex-direction: row;
		width: 100%;
		padding: 6px 12px;
		gap: 10px;
	}
	
	.files-grid.list-view .file-icon {
		width: 20px;
		height: 20px;
	}
	
	.files-grid.list-view .file-name {
		text-align: left;
	}
	
	.file-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px;
		background: transparent;
		border: 2px solid transparent;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.1s;
	}
	
	.file-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	
	.file-item:focus {
		background: rgba(0, 122, 255, 0.1);
		border-color: rgba(0, 122, 255, 0.3);
	}
	
	.file-icon {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.file-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 12px;
	}
	
	.file-icon .folder-svg {
		width: 100%;
		height: 100%;
	}
	
	.doc-icon {
		font-size: 40px;
	}
	
	.file-name {
		font-size: 11px;
		color: #1d1d1f;
		text-align: center;
		word-break: break-word;
		max-width: 80px;
		line-height: 1.3;
	}
	
	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 12px;
		color: #86868b;
	}
	
	.empty-icon {
		font-size: 48px;
		opacity: 0.5;
	}
	
	.empty-text {
		font-size: 14px;
	}
	
	/* Folder View */
	.folder-view {
		height: 100%;
	}
	
	.folder-content-preview {
		background: #f5f5f7;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.preview-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		background: #e8e8ea;
		font-size: 12px;
		font-weight: 500;
		color: #333;
	}
	
	.preview-icon {
		font-size: 16px;
	}
	
	.preview-body {
		padding: 12px;
		max-height: 200px;
		overflow: auto;
	}
	
	.preview-body pre {
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 10px;
		color: #666;
		white-space: pre-wrap;
		word-break: break-all;
		margin: 0;
	}
	
	.open-vscode-btn {
		display: block;
		width: calc(100% - 24px);
		margin: 12px;
		padding: 8px 16px;
		background: #007acc;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.open-vscode-btn:hover {
		background: #0098ff;
	}
</style>
