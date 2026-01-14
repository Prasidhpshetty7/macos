<script lang="ts">
	import { desktopFilesState, type DesktopFile, renameFile, startEditing, stopEditing, deleteFile } from '🍎/state/desktop-files.svelte.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { onMount } from 'svelte';
	
	let selectedFile = $state<string | null>(null);
	let contextMenu = $state<{ x: number; y: number; file: DesktopFile } | null>(null);
	let openFolder = $state<string | null>(null);
	let previewFile = $state<DesktopFile | null>(null);
	let editInputEl = $state<HTMLInputElement | null>(null);
	let editValue = $state('');
	
	// Watch for newly created folders to focus input
	$effect(() => {
		if (desktopFilesState.newlyCreatedId && editInputEl) {
			editInputEl.focus();
			editInputEl.select();
		}
	});
	
	function handleDoubleClick(file: DesktopFile) {
		// Don't open if we're editing
		if (desktopFilesState.editingFileId === file.id) return;
		
		if (file.type === 'app' && file.appId) {
			// Open the app
			const appId = file.appId as AppID;
			apps.open[appId] = true;
			apps.running[appId] = true;
			apps.minimized[appId] = false;
			apps.active = appId;
			
			// Drift opens maximized directly
			if (appId === 'drift') {
				apps.fullscreen[appId] = true;
			}
		} else if (file.type === 'folder') {
			// Open folder in Finder
			desktopFilesState.folderToOpen = file;
			apps.open['finder'] = true;
			apps.running['finder'] = true;
			apps.minimized['finder'] = false;
			apps.active = 'finder';
		} else {
			// Show preview modal for files
			previewFile = file;
		}
	}
	
	function handleContextMenu(e: MouseEvent, file: DesktopFile) {
		e.preventDefault();
		e.stopPropagation();
		contextMenu = { x: e.clientX, y: e.clientY, file };
	}
	
	function openInVSCode(file: DesktopFile) {
		desktopFilesState.fileToOpen = file;
		apps.open['vscode'] = true;
		apps.running['vscode'] = true;
		apps.minimized['vscode'] = false;
		apps.active = 'vscode';
		contextMenu = null;
		previewFile = null;
	}
	
	function openApp(file: DesktopFile) {
		if (file.appId) {
			const appId = file.appId as AppID;
			apps.open[appId] = true;
			apps.running[appId] = true;
			apps.minimized[appId] = false;
			apps.active = appId;
			
			// Drift opens maximized directly
			if (appId === 'drift') {
				apps.fullscreen[appId] = true;
			}
		}
		contextMenu = null;
	}
	
	function closeContextMenu() {
		contextMenu = null;
	}
	
	function closePreview() {
		previewFile = null;
	}
	
	function handleRename(file: DesktopFile) {
		editValue = file.name;
		startEditing(file.id);
		contextMenu = null;
	}
	
	function handleRenameSubmit(fileId: string) {
		renameFile(fileId, editValue);
	}
	
	function handleRenameKeydown(e: KeyboardEvent, fileId: string) {
		if (e.key === 'Enter') {
			handleRenameSubmit(fileId);
		} else if (e.key === 'Escape') {
			stopEditing();
		}
	}
	
	function handleDelete(file: DesktopFile) {
		// Don't allow deleting apps
		if (file.type === 'app') return;
		deleteFile(file.id);
		contextMenu = null;
	}
	
	function handleClick(file: DesktopFile) {
		// If clicking on a different file while editing, save the edit
		if (desktopFilesState.editingFileId && desktopFilesState.editingFileId !== file.id) {
			handleRenameSubmit(desktopFilesState.editingFileId);
		}
		selectedFile = file.id;
	}
</script>

<svelte:window onclick={closeContextMenu} />

<div class="desktop-icons">
	{#each desktopFilesState.files as file}
		<div class="icon-wrapper">
			<button
				class="desktop-icon"
				class:selected={selectedFile === file.id}
				onclick={() => handleClick(file)}
				ondblclick={() => handleDoubleClick(file)}
				oncontextmenu={(e) => handleContextMenu(e, file)}
			>
				<div class="icon-image">
					{#if file.type === 'folder'}
						<!-- macOS Blue Folder -->
						<svg viewBox="0 0 80 64" fill="none">
							<defs>
								<linearGradient id="folderFront-{file.id}" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#6ED4F7"/>
									<stop offset="100%" style="stop-color:#28A3DC"/>
								</linearGradient>
								<linearGradient id="folderBack-{file.id}" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#5BC8F0"/>
									<stop offset="100%" style="stop-color:#1E90CF"/>
								</linearGradient>
							</defs>
							<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#folderBack-{file.id})"/>
							<path d="M4 20H76V52C76 56 73 59 69 59H11C7 59 4 56 4 52V20Z" fill="url(#folderFront-{file.id})"/>
						</svg>
					{:else if file.type === 'app' && file.appId === 'chess'}
						<!-- Chess icon -->
						<img src="/app-icons/chess/256.png.webp" alt="{file.name}" class="app-icon-img" />
					{:else if file.type === 'app'}
						<!-- App icon from public folder -->
						<img src="/app-icons/{file.appId}/256.webp" alt="{file.name}" class="app-icon-img" onerror={(e) => { e.currentTarget.src = `/app-icons/${file.appId}/256.png`; }} />
					{:else}
						<!-- macOS style document icon -->
						<svg viewBox="0 0 60 72" fill="none">
							<defs>
								<linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#FEFEFE"/>
									<stop offset="100%" style="stop-color:#E8E8E8"/>
								</linearGradient>
								<linearGradient id="foldGrad" x1="100%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#D8D8D8"/>
									<stop offset="100%" style="stop-color:#B8B8B8"/>
								</linearGradient>
								<filter id="iconShadow" x="-10%" y="-5%" width="120%" height="115%">
									<feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.25"/>
								</filter>
							</defs>
							<!-- Paper body -->
							<path d="M4 4C4 2 5.5 0.5 7.5 0.5H40L55.5 16V68C55.5 70 54 71.5 52 71.5H7.5C5.5 71.5 4 70 4 68V4Z" fill="url(#paperGrad)" filter="url(#iconShadow)"/>
							<!-- Folded corner -->
							<path d="M40 0.5V12.5C40 14.5 41.5 16 43.5 16H55.5L40 0.5Z" fill="url(#foldGrad)"/>
							<!-- Content lines -->
							<rect x="12" y="26" width="28" height="3" rx="1.5" fill="#D0D0D0"/>
							<rect x="12" y="34" width="36" height="2" rx="1" fill="#E0E0E0"/>
							<rect x="12" y="40" width="32" height="2" rx="1" fill="#E0E0E0"/>
							<rect x="12" y="46" width="36" height="2" rx="1" fill="#E0E0E0"/>
							<rect x="12" y="52" width="24" height="2" rx="1" fill="#E0E0E0"/>
						</svg>
					{/if}
				</div>
				{#if desktopFilesState.editingFileId === file.id}
					<input
						type="text"
						class="icon-name-input"
						bind:value={editValue}
						bind:this={editInputEl}
						onblur={() => handleRenameSubmit(file.id)}
						onkeydown={(e) => handleRenameKeydown(e, file.id)}
						onclick={(e) => e.stopPropagation()}
						ondblclick={(e) => e.stopPropagation()}
					/>
				{:else}
					<span class="icon-name">{file.name}</span>
				{/if}
			</button>
			
			{#if file.type === 'folder' && openFolder === file.id && file.children}
				<div class="folder-contents">
					{#each file.children as child}
						<button
							class="desktop-icon child"
							class:selected={selectedFile === child.id}
							onclick={() => selectedFile = child.id}
							ondblclick={() => openInVSCode(child)}
							oncontextmenu={(e) => handleContextMenu(e, child)}
						>
							<div class="icon-image small">
								<svg viewBox="0 0 80 80" fill="none">
									<path d="M20 10H50L60 20V70H20V10Z" fill="#fff" stroke="#ccc" stroke-width="2"/>
									<path d="M50 10V20H60" fill="#eee" stroke="#ccc" stroke-width="2"/>
								</svg>
							</div>
							<span class="icon-name">{child.name}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

{#if contextMenu}
	<div 
		class="context-menu"
		style:left="{contextMenu.x - 180}px"
		style:top="{contextMenu.y}px"
	>
		{#if contextMenu.file.type === 'app'}
			<button onclick={() => openApp(contextMenu.file)}>
				<span class="ctx-icon">🚀</span> Open
			</button>
		{:else}
			<button onclick={() => openInVSCode(contextMenu.file)}>
				<span class="ctx-icon">📝</span> Open
			</button>
		{/if}
		<button onclick={() => { selectedFile = contextMenu.file.id; contextMenu = null; }}>
			<span class="ctx-icon">ℹ️</span> Get Info
		</button>
		{#if contextMenu.file.type !== 'app'}
			<div class="ctx-divider"></div>
			<button onclick={() => handleRename(contextMenu.file)}>
				<span class="ctx-icon">✏️</span> Rename
			</button>
			<button onclick={() => handleDelete(contextMenu.file)} class="delete-btn">
				<span class="ctx-icon">🗑️</span> Move to Trash
			</button>
		{/if}
	</div>
{/if}

{#if previewFile}
	<div class="preview-overlay" onclick={closePreview}>
		<div class="preview-modal" onclick={(e) => e.stopPropagation()}>
			<div class="preview-header">
				<div class="preview-title">
					<span class="preview-icon">📄</span>
					{previewFile.name}
				</div>
				<button class="preview-close" onclick={closePreview}>✕</button>
			</div>
			<div class="preview-content">
				<pre><code>{previewFile.content || 'No content'}</code></pre>
			</div>
			<div class="preview-footer">
				<button class="edit-btn" onclick={() => openInVSCode(previewFile)}>
					<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
						<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
					</svg>
					Edit in VS Code
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.desktop-icons {
		position: absolute;
		top: 40px;
		right: 20px;
		display: grid;
		grid-template-columns: repeat(2, 80px);
		grid-auto-rows: auto;
		gap: 8px;
		z-index: 1;
	}
	
	.icon-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	
	/* Drift goes in first column, Portfolio in second */
	.icon-wrapper:nth-child(1) { grid-column: 1; grid-row: 1; } /* Drift - left */
	.icon-wrapper:nth-child(2) { grid-column: 2; grid-row: 1; } /* Portfolio - right */
	.icon-wrapper:nth-child(3) { grid-column: 2; grid-row: 2; } /* Music */
	.icon-wrapper:nth-child(4) { grid-column: 2; grid-row: 3; } /* Chess */
	
	.desktop-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 8px;
		background: transparent;
		border: 2px solid transparent;
		border-radius: 8px;
		cursor: pointer;
		width: 80px;
		transition: all 0.15s;
	}
	
	.desktop-icon:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	
	.desktop-icon.selected {
		background: rgba(0, 122, 255, 0.3);
		border-color: rgba(0, 122, 255, 0.5);
	}
	
	.icon-image {
		width: 56px;
		height: 56px;
	}
	
	.icon-image.small {
		width: 40px;
		height: 40px;
	}
	
	.icon-image svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
	}
	
	.app-icon-img {
		width: 100%;
		height: 100%;
		border-radius: 12px;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
		object-fit: contain;
		background: transparent;
	}
	
	.emoji-icon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 42px;
		background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
		border-radius: 12px;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
	}
	
	.icon-name {
		font-size: 11px;
		color: #fff;
		text-shadow: 0 1px 3px rgba(0,0,0,0.8);
		text-align: center;
		word-break: break-word;
		max-width: 70px;
	}
	
	.icon-name-input {
		font-size: 11px;
		color: #fff;
		text-align: center;
		background: rgba(0, 122, 255, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 4px;
		padding: 2px 4px;
		max-width: 70px;
		width: 100%;
		outline: none;
		text-shadow: none;
	}
	
	.icon-name-input:focus {
		background: rgba(0, 122, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.5);
	}
	
	.folder-contents {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(20px);
		border-radius: 10px;
		margin-right: 10px;
	}
	
	.desktop-icon.child {
		width: 70px;
		padding: 6px;
	}
	
	.context-menu {
		position: fixed;
		background: rgba(40, 40, 40, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 8px;
		padding: 4px;
		min-width: 180px;
		box-shadow: 0 8px 30px rgba(0,0,0,0.4);
		z-index: 9999;
		border: 1px solid rgba(255,255,255,0.1);
	}
	
	.context-menu button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 13px;
		cursor: pointer;
		border-radius: 4px;
		text-align: left;
	}
	
	.context-menu button:hover {
		background: #007aff;
	}
	
	.ctx-icon {
		font-size: 14px;
	}
	
	.ctx-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 4px 0;
	}
	
	.context-menu .delete-btn:hover {
		background: #ff3b30;
	}
	
	.preview-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		backdrop-filter: blur(4px);
	}
	
	.preview-modal {
		background: #1e1e1e;
		border-radius: 12px;
		width: 600px;
		max-width: 90vw;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 60px rgba(0,0,0,0.5);
		overflow: hidden;
	}
	
	.preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		background: #2d2d2d;
		border-bottom: 1px solid #404040;
	}
	
	.preview-title {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
	}
	
	.preview-icon {
		font-size: 18px;
	}
	
	.preview-close {
		background: transparent;
		border: none;
		color: #888;
		font-size: 18px;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 4px;
	}
	
	.preview-close:hover {
		background: rgba(255,255,255,0.1);
		color: #fff;
	}
	
	.preview-content {
		flex: 1;
		overflow: auto;
		padding: 16px;
		background: #1e1e1e;
	}
	
	.preview-content pre {
		margin: 0;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 13px;
		line-height: 1.5;
		color: #d4d4d4;
		white-space: pre-wrap;
		word-break: break-word;
	}
	
	.preview-footer {
		padding: 12px 16px;
		background: #2d2d2d;
		border-top: 1px solid #404040;
		display: flex;
		justify-content: flex-end;
	}
	
	.edit-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: #007acc;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.edit-btn:hover {
		background: #0098ff;
	}
	
	.edit-btn svg {
		width: 16px;
		height: 16px;
	}
</style>
