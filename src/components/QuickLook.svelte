<script lang="ts">
	import { desktopFiles } from '🍎/state/desktop-files.svelte';
	
	let showQuickLook = $state(false);
	let selectedFile = $state<any>(null);
	let selectedIndex = $state(0);
	let previewFiles = $state<any[]>([]);
	
	// Listen for custom event from desktop icons
	function handleQuickLookRequest(e: CustomEvent) {
		const { file, allFiles } = e.detail;
		selectedFile = file;
		previewFiles = allFiles.filter((f: any) => f.type === 'file' || f.type === 'folder' || f.type === 'app');
		selectedIndex = previewFiles.findIndex((f: any) => f.id === file.id);
		showQuickLook = true;
	}
	
	function closeQuickLook() {
		showQuickLook = false;
		selectedFile = null;
		previewFiles = [];
	}
	
	function navigateNext() {
		if (selectedIndex < previewFiles.length - 1) {
			selectedIndex++;
			selectedFile = previewFiles[selectedIndex];
		}
	}
	
	function navigatePrevious() {
		if (selectedIndex > 0) {
			selectedIndex--;
			selectedFile = previewFiles[selectedIndex];
		}
	}
	
	function handleKeyDown(e: KeyboardEvent) {
		if (!showQuickLook) return;
		
		if (e.key === 'Escape' || e.key === ' ') {
			e.preventDefault();
			closeQuickLook();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			navigateNext();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			navigatePrevious();
		}
	}
	
	function getFileIcon(file: any) {
		if (file.type === 'app' && file.appId) {
			return `/app-icons/${file.appId}/256.webp`;
		}
		return null;
	}
	
	function getFilePreview(file: any) {
		if (!file) return null;
		
		// For text files, show content preview
		if (file.name.endsWith('.txt')) {
			return {
				type: 'text',
				content: 'This is a preview of the text file.\n\nQuick Look allows you to preview files without opening them.\n\nPress Space or Escape to close.\nUse arrow keys to navigate between files.'
			};
		}
		
		// For images
		if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
			return {
				type: 'image',
				url: file.icon || '/placeholder-image.png'
			};
		}
		
		// For apps
		if (file.type === 'app') {
			return {
				type: 'app',
				icon: getFileIcon(file)
			};
		}
		
		// For folders
		if (file.type === 'folder') {
			return {
				type: 'folder',
				itemCount: 0
			};
		}
		
		// Default preview
		return {
			type: 'generic',
			icon: file.icon
		};
	}
	
	const preview = $derived(getFilePreview(selectedFile));
	
	function formatFileSize(bytes: number = 0) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	}
	
	function formatDate(date: Date = new Date()) {
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:window 
	onkeydown={handleKeyDown}
	onquicklook={handleQuickLookRequest}
/>

{#if showQuickLook && selectedFile}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="quicklook-overlay" onclick={closeQuickLook}>
		<div class="quicklook-window" onclick={(e) => e.stopPropagation()}>
			<!-- Title Bar -->
			<div class="quicklook-titlebar">
				<div class="titlebar-controls">
					<button class="titlebar-btn close" onclick={closeQuickLook}>
						<svg viewBox="0 0 12 12" fill="currentColor">
							<path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
						</svg>
					</button>
				</div>
				<div class="titlebar-title">{selectedFile.name}</div>
				<div class="titlebar-actions">
					<button class="action-btn" title="Open with default app">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
						</svg>
					</button>
				</div>
			</div>
			
			<!-- Preview Area -->
			<div class="quicklook-content">
				{#if preview?.type === 'text'}
					<div class="preview-text">
						<pre>{preview.content}</pre>
					</div>
				{:else if preview?.type === 'image'}
					<div class="preview-image">
						<img src={preview.url} alt={selectedFile.name} />
					</div>
				{:else if preview?.type === 'app'}
					<div class="preview-app">
						<img src={preview.icon} alt={selectedFile.name} class="app-icon-large" />
						<h2>{selectedFile.name}</h2>
						<p class="app-type">Application</p>
					</div>
				{:else if preview?.type === 'folder'}
					<div class="preview-folder">
						<svg viewBox="0 0 24 24" fill="currentColor" class="folder-icon">
							<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#3B9EFF"/>
						</svg>
						<h2>{selectedFile.name}</h2>
						<p class="folder-type">Folder</p>
					</div>
				{:else}
					<div class="preview-generic">
						<div class="generic-icon">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
							</svg>
						</div>
						<h2>{selectedFile.name}</h2>
						<p class="file-type">Document</p>
					</div>
				{/if}
			</div>
			
			<!-- Info Bar -->
			<div class="quicklook-info">
				<div class="info-item">
					<span class="info-label">Size:</span>
					<span class="info-value">{formatFileSize(selectedFile.size || 0)}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Modified:</span>
					<span class="info-value">{formatDate(selectedFile.modified)}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Kind:</span>
					<span class="info-value">{selectedFile.type === 'app' ? 'Application' : selectedFile.type === 'folder' ? 'Folder' : 'Document'}</span>
				</div>
			</div>
			
			<!-- Navigation -->
			{#if previewFiles.length > 1}
				<div class="quicklook-nav">
					<button 
						class="nav-btn" 
						onclick={navigatePrevious}
						disabled={selectedIndex === 0}
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
						</svg>
					</button>
					<span class="nav-counter">{selectedIndex + 1} of {previewFiles.length}</span>
					<button 
						class="nav-btn" 
						onclick={navigateNext}
						disabled={selectedIndex === previewFiles.length - 1}
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.quicklook-overlay {
		position: fixed;
		inset: 0;
		z-index: 10001;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(20px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s ease;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.quicklook-window {
		width: 90%;
		max-width: 900px;
		height: 85vh;
		max-height: 700px;
		background: rgba(255, 255, 255, 0.98);
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	
	:global(.dark-mode) .quicklook-window {
		background: rgba(40, 40, 40, 0.98);
	}
	
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.quicklook-titlebar {
		height: 52px;
		background: rgba(246, 246, 246, 0.95);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		flex-shrink: 0;
	}
	
	:global(.dark-mode) .quicklook-titlebar {
		background: rgba(50, 50, 50, 0.95);
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}
	
	.titlebar-controls {
		display: flex;
		gap: 8px;
		width: 100px;
	}
	
	.titlebar-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.titlebar-btn.close {
		background: #FF5F57;
	}
	
	.titlebar-btn.close:hover {
		background: #FF3B30;
	}
	
	.titlebar-btn svg {
		width: 6px;
		height: 6px;
		opacity: 0;
		color: rgba(0, 0, 0, 0.6);
	}
	
	.titlebar-btn:hover svg {
		opacity: 1;
	}
	
	.titlebar-title {
		flex: 1;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	:global(.dark-mode) .titlebar-title {
		color: #fff;
	}
	
	.titlebar-actions {
		display: flex;
		gap: 8px;
		width: 100px;
		justify-content: flex-end;
	}
	
	.action-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		transition: all 0.2s;
	}
	
	.action-btn:hover {
		background: rgba(0, 0, 0, 0.05);
		color: #333;
	}
	
	:global(.dark-mode) .action-btn {
		color: #999;
	}
	
	:global(.dark-mode) .action-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}
	
	.action-btn svg {
		width: 18px;
		height: 18px;
	}
	
	.quicklook-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		overflow: auto;
		background: #f5f5f5;
	}
	
	:global(.dark-mode) .quicklook-content {
		background: #2a2a2a;
	}
	
	.preview-text {
		width: 100%;
		height: 100%;
		background: white;
		border-radius: 8px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: auto;
	}
	
	:global(.dark-mode) .preview-text {
		background: #1e1e1e;
	}
	
	.preview-text pre {
		font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
		font-size: 13px;
		line-height: 1.6;
		color: #333;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	
	:global(.dark-mode) .preview-text pre {
		color: #e0e0e0;
	}
	
	.preview-image {
		max-width: 100%;
		max-height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.preview-image img {
		max-width: 100%;
		max-height: 100%;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}
	
	.preview-app, .preview-folder, .preview-generic {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	
	.app-icon-large {
		width: 128px;
		height: 128px;
		border-radius: 22px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}
	
	.folder-icon {
		width: 128px;
		height: 128px;
		filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
	}
	
	.generic-icon {
		width: 128px;
		height: 128px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 122, 255, 0.1);
		border-radius: 16px;
	}
	
	.generic-icon svg {
		width: 64px;
		height: 64px;
		color: #007AFF;
	}
	
	.preview-app h2, .preview-folder h2, .preview-generic h2 {
		font-size: 24px;
		font-weight: 600;
		color: #333;
		margin: 0;
	}
	
	:global(.dark-mode) .preview-app h2,
	:global(.dark-mode) .preview-folder h2,
	:global(.dark-mode) .preview-generic h2 {
		color: #fff;
	}
	
	.app-type, .folder-type, .file-type {
		font-size: 14px;
		color: #666;
		margin: 0;
	}
	
	:global(.dark-mode) .app-type,
	:global(.dark-mode) .folder-type,
	:global(.dark-mode) .file-type {
		color: #999;
	}
	
	.quicklook-info {
		height: 60px;
		background: rgba(246, 246, 246, 0.95);
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0 24px;
		flex-shrink: 0;
	}
	
	:global(.dark-mode) .quicklook-info {
		background: rgba(50, 50, 50, 0.95);
		border-top-color: rgba(255, 255, 255, 0.1);
	}
	
	.info-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	
	.info-label {
		font-size: 11px;
		color: #666;
		font-weight: 500;
	}
	
	:global(.dark-mode) .info-label {
		color: #999;
	}
	
	.info-value {
		font-size: 12px;
		color: #333;
	}
	
	:global(.dark-mode) .info-value {
		color: #fff;
	}
	
	.quicklook-nav {
		position: absolute;
		bottom: 80px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 16px;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(20px);
		padding: 8px 16px;
		border-radius: 20px;
	}
	
	.nav-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.nav-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.nav-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	
	.nav-btn svg {
		width: 24px;
		height: 24px;
	}
	
	.nav-counter {
		font-size: 13px;
		color: white;
		font-weight: 500;
		min-width: 60px;
		text-align: center;
	}
</style>
