<script lang="ts">
	import { trashState, emptyTrash, restoreFromTrash, isTrashFull } from '🍎/state/trash.svelte';
	
	let showContextMenu = $state(false);
	let contextMenuPos = $state({ x: 0, y: 0 });
	let showTrashWindow = $state(false);
	
	// Derived value for trash full state
	const isFull = $derived(isTrashFull());
	
	function handleClick() {
		showTrashWindow = true;
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
	
	function handleEmptyTrash() {
		emptyTrash();
		closeContextMenu();
	}
	
	function handleOpenTrash() {
		showTrashWindow = true;
		closeContextMenu();
	}
	
	function closeTrashWindow() {
		showTrashWindow = false;
	}
	
	function handleRestore(fileId: string) {
		// Import desktop files to restore
		import('🍎/state/desktop-files.svelte').then(({ desktopFilesState }) => {
			const file = trashState.items.find(f => f.id === fileId);
			if (file) {
				desktopFilesState.files = [...desktopFilesState.files, file];
				restoreFromTrash(fileId);
			}
		});
	}
</script>

<svelte:window onclick={closeContextMenu} />

<button 
	class="trash-bin"
	class:full={isFull}
	onclick={handleClick}
	oncontextmenu={handleContextMenu}
	aria-label="Trash"
>
	<div class="trash-icon">
		{#if isFull}
			<!-- Full Trash Icon -->
			<svg viewBox="0 0 64 64" fill="none">
				<defs>
					<linearGradient id="trashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" style="stop-color:#E8E8E8"/>
						<stop offset="100%" style="stop-color:#B8B8B8"/>
					</linearGradient>
				</defs>
				<!-- Trash can body -->
				<path d="M16 20 L18 56 C18 58 19 60 22 60 L42 60 C45 60 46 58 46 56 L48 20 Z" fill="url(#trashGrad)" stroke="#888" stroke-width="1.5"/>
				<!-- Trash can lid -->
				<rect x="12" y="16" width="40" height="4" rx="2" fill="#D0D0D0" stroke="#888" stroke-width="1.5"/>
				<!-- Handle -->
				<path d="M24 16 L24 12 C24 10 25 8 28 8 L36 8 C39 8 40 10 40 12 L40 16" fill="none" stroke="#888" stroke-width="1.5"/>
				<!-- Papers inside (full trash) -->
				<rect x="22" y="28" width="8" height="12" rx="1" fill="#FFF" opacity="0.8"/>
				<rect x="32" y="32" width="8" height="16" rx="1" fill="#FFF" opacity="0.7"/>
				<rect x="26" y="42" width="6" height="10" rx="1" fill="#FFF" opacity="0.6"/>
			</svg>
		{:else}
			<!-- Empty Trash Icon -->
			<svg viewBox="0 0 64 64" fill="none">
				<defs>
					<linearGradient id="trashGradEmpty" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" style="stop-color:#F5F5F5"/>
						<stop offset="100%" style="stop-color:#C8C8C8"/>
					</linearGradient>
				</defs>
				<!-- Trash can body -->
				<path d="M16 20 L18 56 C18 58 19 60 22 60 L42 60 C45 60 46 58 46 56 L48 20 Z" fill="url(#trashGradEmpty)" stroke="#888" stroke-width="1.5"/>
				<!-- Trash can lid -->
				<rect x="12" y="16" width="40" height="4" rx="2" fill="#E0E0E0" stroke="#888" stroke-width="1.5"/>
				<!-- Handle -->
				<path d="M24 16 L24 12 C24 10 25 8 28 8 L36 8 C39 8 40 10 40 12 L40 16" fill="none" stroke="#888" stroke-width="1.5"/>
				<!-- Vertical lines (empty) -->
				<line x1="26" y1="26" x2="26" y2="50" stroke="#AAA" stroke-width="1.5" opacity="0.5"/>
				<line x1="32" y1="26" x2="32" y2="50" stroke="#AAA" stroke-width="1.5" opacity="0.5"/>
				<line x1="38" y1="26" x2="38" y2="50" stroke="#AAA" stroke-width="1.5" opacity="0.5"/>
			</svg>
		{/if}
	</div>
	<span class="trash-label">Trash</span>
</button>

{#if showContextMenu}
	<div 
		class="trash-context-menu"
		style:left="{contextMenuPos.x}px"
		style:top="{contextMenuPos.y - 120}px"
		onclick={(e) => e.stopPropagation()}
	>
		<button onclick={handleOpenTrash}>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
			</svg>
			Open
		</button>
		{#if isFull}
			<button onclick={handleEmptyTrash} class="danger">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
				</svg>
				Empty Trash
			</button>
		{/if}
	</div>
{/if}

{#if showTrashWindow}
	<div class="trash-overlay" onclick={closeTrashWindow}>
		<div class="trash-window" onclick={(e) => e.stopPropagation()}>
			<div class="trash-header">
				<div class="trash-dots">
					<button class="dot red" onclick={closeTrashWindow}></button>
					<button class="dot yellow"></button>
					<button class="dot green"></button>
				</div>
				<h3>Trash</h3>
				{#if isFull}
					<button class="empty-btn" onclick={handleEmptyTrash}>Empty</button>
				{/if}
			</div>
			
			<div class="trash-content">
				{#if trashState.items.length === 0}
					<div class="trash-empty">
						<svg viewBox="0 0 64 64" fill="none" width="80" height="80">
							<defs>
								<linearGradient id="emptyTrashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" style="stop-color:#E8E8E8"/>
									<stop offset="100%" style="stop-color:#C8C8C8"/>
								</linearGradient>
							</defs>
							<path d="M16 20 L18 56 C18 58 19 60 22 60 L42 60 C45 60 46 58 46 56 L48 20 Z" fill="url(#emptyTrashGrad)" stroke="#888" stroke-width="1.5"/>
							<rect x="12" y="16" width="40" height="4" rx="2" fill="#E0E0E0" stroke="#888" stroke-width="1.5"/>
							<path d="M24 16 L24 12 C24 10 25 8 28 8 L36 8 C39 8 40 10 40 12 L40 16" fill="none" stroke="#888" stroke-width="1.5"/>
						</svg>
						<p>No Items in Trash</p>
					</div>
				{:else}
					<div class="trash-items">
						{#each trashState.items as item}
							<div class="trash-item">
								<div class="trash-item-icon">
									{#if item.type === 'folder'}
										<svg viewBox="0 0 80 64" fill="none">
											<defs>
												<linearGradient id="folderFront-{item.id}" x1="0%" y1="0%" x2="0%" y2="100%">
													<stop offset="0%" style="stop-color:#6ED4F7"/>
													<stop offset="100%" style="stop-color:#28A3DC"/>
												</linearGradient>
											</defs>
											<path d="M4 12C4 8 7 5 11 5H28L34 12H69C73 12 76 15 76 19V52C76 56 73 59 69 59H11C7 59 4 56 4 52V12Z" fill="url(#folderFront-{item.id})"/>
										</svg>
									{:else}
										<svg viewBox="0 0 60 72" fill="none">
											<path d="M4 4C4 2 5.5 0.5 7.5 0.5H40L55.5 16V68C55.5 70 54 71.5 52 71.5H7.5C5.5 71.5 4 70 4 68V4Z" fill="#FFF" stroke="#CCC" stroke-width="2"/>
										</svg>
									{/if}
								</div>
								<div class="trash-item-info">
									<div class="trash-item-name">{item.name}</div>
									<div class="trash-item-type">{item.type}</div>
								</div>
								<button class="restore-btn" onclick={() => handleRestore(item.id)}>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
									</svg>
									Put Back
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.trash-bin {
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
	
	.trash-bin:hover {
		transform: translateY(-8px);
	}
	
	.trash-bin:hover .trash-label {
		opacity: 1;
		transform: translate(-50%, -8px);
	}
	
	.trash-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}
	
	.trash-icon svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
	}
	
	.trash-label {
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
	
	.trash-context-menu {
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
	
	.trash-context-menu button {
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
	
	.trash-context-menu button:hover {
		background: #007aff;
	}
	
	.trash-context-menu button.danger:hover {
		background: #ff3b30;
	}
	
	.trash-context-menu button svg {
		width: 16px;
		height: 16px;
	}
	
	.trash-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}
	
	.trash-window {
		width: 600px;
		height: 500px;
		background: #1e1e1e;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0,0,0,0.5);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.trash-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: #2d2d2d;
		border-bottom: 1px solid #404040;
	}
	
	.trash-dots {
		display: flex;
		gap: 8px;
	}
	
	.trash-dots .dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
	}
	
	.trash-dots .dot.red { background: #ff5f57; }
	.trash-dots .dot.yellow { background: #febc2e; }
	.trash-dots .dot.green { background: #28c840; }
	
	.trash-header h3 {
		flex: 1;
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		text-align: center;
		margin-right: 60px;
	}
	
	.empty-btn {
		padding: 4px 12px;
		background: #007aff;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.empty-btn:hover {
		background: #0051d5;
	}
	
	.trash-content {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}
	
	.trash-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 16px;
	}
	
	.trash-empty p {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.4);
	}
	
	.trash-items {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.trash-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		transition: background 0.15s;
	}
	
	.trash-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	
	.trash-item-icon {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
	}
	
	.trash-item-icon svg {
		width: 100%;
		height: 100%;
	}
	
	.trash-item-info {
		flex: 1;
	}
	
	.trash-item-name {
		font-size: 14px;
		color: #fff;
		font-weight: 500;
		margin-bottom: 2px;
	}
	
	.trash-item-type {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		text-transform: capitalize;
	}
	
	.restore-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: #007aff;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.restore-btn:hover {
		background: #0051d5;
	}
	
	.restore-btn svg {
		width: 14px;
		height: 14px;
	}
</style>
