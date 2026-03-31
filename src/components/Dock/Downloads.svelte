<script lang="ts">
	let showContextMenu = $state(false);
	let contextMenuPos = $state({ x: 0, y: 0 });
	let showDownloadsWindow = $state(false);
	
	// Sample downloads
	const downloads = [
		{ name: 'macOS-Ventura.dmg', size: '12.4 GB', icon: 'disk', date: '2 hours ago' },
		{ name: 'Xcode_14.3.dmg', size: '8.2 GB', icon: 'disk', date: 'Yesterday' },
		{ name: 'Screenshot 2024.png', size: '2.1 MB', icon: 'image', date: 'Today' },
		{ name: 'Project.zip', size: '45 MB', icon: 'archive', date: 'Today' },
	];
	
	function handleClick() {
		showDownloadsWindow = true;
	}
	
	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		showContextMenu = true;
		contextMenuPos = { x: e.clientX, y: e.clientY };
	}
	
	function closeContextMenu() {
		showContextMenu = false;
	}
	
	function closeDownloadsWindow() {
		showDownloadsWindow = false;
	}
	
	function openInFinder() {
		// Would open Finder to Downloads folder
		closeContextMenu();
	}
</script>

<svelte:window onclick={closeContextMenu} />

<button 
	class="downloads-folder"
	onclick={handleClick}
	oncontextmenu={handleContextMenu}
	aria-label="Downloads"
>
	<div class="downloads-icon">
		<!-- Downloads folder icon with stack effect -->
		<svg viewBox="0 0 80 64" fill="none" class="folder-stack">
			<defs>
				<linearGradient id="downloadsFolderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:#6ED4F7"/>
					<stop offset="100%" style="stop-color:#28A3DC"/>
				</linearGradient>
			</defs>
			<!-- Back folder (stack effect) -->
			<path d="M8 16C8 12 11 9 15 9H32L38 16H73C77 16 80 19 80 23V56C80 60 77 63 73 63H15C11 63 8 60 8 56V16Z" fill="url(#downloadsFolderGrad)" opacity="0.4"/>
			<!-- Front folder -->
			<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#downloadsFolderGrad)"/>
			<!-- Download arrow -->
			<path d="M40 28 L40 42 M34 38 L40 44 L46 38" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</div>
	<span class="downloads-label">Downloads</span>
</button>

{#if showContextMenu}
	<div 
		class="downloads-context-menu"
		style:left="{contextMenuPos.x - 90}px"
		style:top="{contextMenuPos.y - 100}px"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="context-menu-header">Downloads</div>
		<div class="context-divider"></div>
		<button onclick={handleClick}>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
			</svg>
			Open
		</button>
		<button onclick={openInFinder}>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
			</svg>
			Show in Finder
		</button>
	</div>
{/if}

{#if showDownloadsWindow}
	<div class="downloads-overlay" onclick={closeDownloadsWindow}>
		<div class="downloads-window" onclick={(e) => e.stopPropagation()}>
			<div class="downloads-header">
				<div class="downloads-dots">
					<button class="dot red" onclick={closeDownloadsWindow}></button>
					<button class="dot yellow"></button>
					<button class="dot green"></button>
				</div>
				<h3>Downloads</h3>
			</div>
			
			<div class="downloads-content">
				<div class="downloads-items">
					{#each downloads as download}
						<div class="download-item">
							<div class="download-icon">
								{#if download.icon === 'disk'}
									<svg viewBox="0 0 64 64" fill="none">
										<rect x="8" y="12" width="48" height="40" rx="4" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
										<rect x="12" y="20" width="40" height="4" fill="#CCC"/>
										<circle cx="32" cy="32" r="12" fill="#FFF" stroke="#999" stroke-width="2"/>
										<circle cx="32" cy="32" r="4" fill="#666"/>
									</svg>
								{:else if download.icon === 'image'}
									<svg viewBox="0 0 64 64" fill="none">
										<rect x="8" y="8" width="48" height="48" rx="4" fill="#FFF" stroke="#CCC" stroke-width="2"/>
										<circle cx="20" cy="20" r="4" fill="#FFD700"/>
										<path d="M8 48 L24 32 L36 44 L48 28 L56 36 L56 52 C56 54 54 56 52 56 L12 56 C10 56 8 54 8 52 Z" fill="#87CEEB"/>
									</svg>
								{:else}
									<svg viewBox="0 0 64 64" fill="none">
										<path d="M16 8 L48 8 L48 56 L16 56 Z" fill="#FFD700" stroke="#CCC" stroke-width="2"/>
										<rect x="20" y="20" width="24" height="3" fill="#FFF"/>
										<rect x="20" y="28" width="24" height="3" fill="#FFF"/>
										<rect x="20" y="36" width="16" height="3" fill="#FFF"/>
									</svg>
								{/if}
							</div>
							<div class="download-info">
								<div class="download-name">{download.name}</div>
								<div class="download-meta">
									<span>{download.size}</span>
									<span>•</span>
									<span>{download.date}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.downloads-folder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding: 0 4px;
		cursor: pointer;
		position: relative;
		transition: transform 0.2s ease;
		background: transparent;
		border: none;
	}
	
	.downloads-folder:hover {
		transform: translateY(-8px);
	}
	
	.downloads-folder:hover .downloads-label {
		opacity: 1;
		transform: translate(-50%, -8px);
	}
	
	.downloads-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.folder-stack {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
	}
	
	.downloads-label {
		position: absolute;
		top: -28px;
		left: 50%;
		transform: translateX(-50%);
		background: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(5px);
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 11px;
		color: var(--system-color-light-contrast);
		white-space: nowrap;
		opacity: 0;
		transition: all 0.2s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
		pointer-events: none;
	}
	
	.downloads-context-menu {
		position: fixed;
		background: rgba(40, 40, 40, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 8px;
		padding: 4px;
		min-width: 180px;
		box-shadow: 0 8px 30px rgba(0,0,0,0.4);
		z-index: 99999;
		border: 1px solid rgba(255,255,255,0.1);
	}
	
	.context-menu-header {
		padding: 8px 12px;
		font-size: 12px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		text-align: center;
	}
	
	.downloads-context-menu button {
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
	
	.downloads-context-menu button:hover {
		background: #007aff;
	}
	
	.downloads-context-menu button svg {
		width: 16px;
		height: 16px;
	}
	
	.context-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 4px 0;
	}
	
	.downloads-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}
	
	.downloads-window {
		width: 500px;
		height: 500px;
		background: #1e1e1e;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0,0,0,0.5);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.downloads-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: #2d2d2d;
		border-bottom: 1px solid #404040;
	}
	
	.downloads-dots {
		display: flex;
		gap: 8px;
	}
	
	.downloads-dots .dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
	}
	
	.downloads-dots .dot.red { background: #ff5f57; }
	.downloads-dots .dot.yellow { background: #febc2e; }
	.downloads-dots .dot.green { background: #28c840; }
	
	.downloads-header h3 {
		flex: 1;
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		text-align: center;
		margin-right: 60px;
	}
	
	.downloads-content {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
	}
	
	.downloads-items {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.download-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		transition: background 0.15s;
		cursor: pointer;
	}
	
	.download-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	
	.download-icon {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
	}
	
	.download-icon svg {
		width: 100%;
		height: 100%;
	}
	
	.download-info {
		flex: 1;
	}
	
	.download-name {
		font-size: 14px;
		color: #fff;
		font-weight: 500;
		margin-bottom: 4px;
	}
	
	.download-meta {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		display: flex;
		gap: 6px;
	}
</style>
