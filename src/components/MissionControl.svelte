<script lang="ts">
	import { apps } from '🍎/state/apps.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { missionControl } from '🍎/state/mission-control.svelte';
	import { spacesManager } from '🍎/state/spaces.svelte';
	import type { AppID } from '🍎/state/apps.svelte';
	import { onMount } from 'svelte';
	
	let draggedWindow: string | null = $state(null);
	let dragOverSpace: number | null = $state(null);
	
	// Get windows for current active space
	const currentSpaceWindows = $derived(
		Object.entries(apps.open)
			.filter(([id, isOpen]) => {
				if (!isOpen) return false;
				const config = apps_config[id as AppID];
				if (!config || config.should_open_window === false) return false;
				return spacesManager.isWindowInActiveSpace(id);
			})
			.map(([id]) => ({
				id: id as AppID,
				title: apps_config[id as AppID]?.title || id
			}))
	);
	
	// Get the actual window element for live preview
	function getWindowElement(appId: string): HTMLElement | null {
		return document.querySelector(`[data-app-id="${appId}"]`) as HTMLElement;
	}
	
	// Calculate window positions - fill space like real macOS
	// Windows have different sizes based on count, filling the available area
	function getWindowLayout(index: number, total: number): { x: number; y: number; width: number; height: number } {
		const gap = 20; // Gap between windows in pixels
		
		if (total === 1) {
			// Single window - 90% centered
			return { x: 5, y: 5, width: 90, height: 90 };
		}
		
		if (total === 2) {
			// Two windows side by side - each 45%
			const layouts = [
				{ x: 2, y: 10, width: 46, height: 80 },
				{ x: 52, y: 10, width: 46, height: 80 }
			];
			return layouts[index];
		}
		
		if (total === 3) {
			// One big (45%) on left, two smaller stacked on right
			const layouts = [
				{ x: 2, y: 10, width: 48, height: 80 },      // Big left
				{ x: 54, y: 5, width: 44, height: 42 },      // Top right
				{ x: 54, y: 52, width: 44, height: 42 }      // Bottom right
			];
			return layouts[index];
		}
		
		if (total === 4) {
			// 2x2 grid
			const layouts = [
				{ x: 2, y: 5, width: 47, height: 44 },
				{ x: 51, y: 5, width: 47, height: 44 },
				{ x: 2, y: 52, width: 47, height: 44 },
				{ x: 51, y: 52, width: 47, height: 44 }
			];
			return layouts[index];
		}
		
		if (total === 5) {
			// One big on left, 4 smaller in 2x2 on right
			const layouts = [
				{ x: 2, y: 10, width: 40, height: 80 },      // Big left
				{ x: 45, y: 5, width: 26, height: 44 },      // Top middle
				{ x: 73, y: 5, width: 26, height: 44 },      // Top right
				{ x: 45, y: 52, width: 26, height: 44 },     // Bottom middle
				{ x: 73, y: 52, width: 26, height: 44 }      // Bottom right
			];
			return layouts[index];
		}
		
		if (total === 6) {
			// 3x2 grid
			const layouts = [
				{ x: 1, y: 5, width: 32, height: 44 },
				{ x: 34, y: 5, width: 32, height: 44 },
				{ x: 67, y: 5, width: 32, height: 44 },
				{ x: 1, y: 52, width: 32, height: 44 },
				{ x: 34, y: 52, width: 32, height: 44 },
				{ x: 67, y: 52, width: 32, height: 44 }
			];
			return layouts[index];
		}
		
		// 7+ windows - dynamic grid
		const cols = Math.ceil(Math.sqrt(total * 1.5));
		const rows = Math.ceil(total / cols);
		const cellWidth = (98 - (cols - 1) * 2) / cols;
		const cellHeight = (92 - (rows - 1) * 3) / rows;
		
		const row = Math.floor(index / cols);
		const col = index % cols;
		
		// Center last row if not full
		const itemsInLastRow = total % cols || cols;
		const isLastRow = row === rows - 1;
		const xOffset = isLastRow ? ((cols - itemsInLastRow) * (cellWidth + 2)) / 2 : 0;
		
		return {
			x: 1 + xOffset + col * (cellWidth + 2),
			y: 4 + row * (cellHeight + 3),
			width: cellWidth,
			height: cellHeight
		};
	}
	
	function getWindowStyle(index: number, total: number) {
		const layout = getWindowLayout(index, total);
		return `left: ${layout.x}%; top: ${layout.y}%; width: ${layout.width}%; height: ${layout.height}%;`;
	}
	
	function selectWindow(appId: AppID) {
		apps.active = appId;
		apps.minimized[appId] = false;
		missionControl.close();
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && missionControl.isOpen) {
			missionControl.close();
		}
	}
	
	function clickOverlay(e: MouseEvent) {
		if ((e.target as HTMLElement).classList.contains('mc-overlay')) {
			missionControl.close();
		}
	}
	
	// Drag and drop handlers
	function onWindowDragStart(e: DragEvent, appId: string) {
		draggedWindow = appId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', appId);
			// Create a ghost image
			const target = e.target as HTMLElement;
			if (target) {
				e.dataTransfer.setDragImage(target, target.offsetWidth / 2, target.offsetHeight / 2);
			}
		}
	}
	
	function onWindowDragEnd() {
		draggedWindow = null;
		dragOverSpace = null;
	}
	
	function onSpaceDragOver(e: DragEvent, spaceId: number) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverSpace = spaceId;
	}
	
	function onSpaceDragLeave() {
		dragOverSpace = null;
	}
	
	function onSpaceDrop(e: DragEvent, spaceId: number) {
		e.preventDefault();
		if (draggedWindow) {
			// Move window to the new space (don't switch desktop - let user keep organizing)
			spacesManager.moveWindowToSpace(draggedWindow, spaceId);
		}
		draggedWindow = null;
		dragOverSpace = null;
	}
	
	function addNewSpace() {
		spacesManager.addSpace();
	}
	
	function removeSpace(e: MouseEvent, spaceId: number) {
		e.stopPropagation();
		spacesManager.removeSpace(spaceId);
	}
	
	function switchSpace(spaceId: number) {
		// If clicking the same desktop we're already viewing, close MC and go to it
		if (spaceId === spacesManager.activeSpaceId) {
			missionControl.close();
		} else {
			// Just switch to view that desktop's windows in MC (don't close)
			spacesManager.switchToSpace(spaceId);
		}
	}
	
	// Get windows count for a space
	function getSpaceWindowCount(spaceId: number): number {
		return Object.entries(apps.open).filter(([id, isOpen]) => {
			if (!isOpen) return false;
			const config = apps_config[id as AppID];
			if (!config || config.should_open_window === false) return false;
			return spacesManager.getWindowSpace(id) === spaceId;
		}).length;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if missionControl.isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mc-overlay" onclick={clickOverlay}>
		<!-- Desktop spaces bar at top -->
		<div class="mc-spaces-bar">
			<div class="mc-spaces-container">
				{#each spacesManager.spaces as space, i}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="mc-space-thumb"
						class:active={space.id === spacesManager.activeSpaceId}
						class:drag-over={dragOverSpace === space.id}
						onclick={() => switchSpace(space.id)}
						ondragover={(e) => onSpaceDragOver(e, space.id)}
						ondragleave={onSpaceDragLeave}
						ondrop={(e) => onSpaceDrop(e, space.id)}
					>
						<div class="mc-space-preview" style="background-image: url('{space.wallpaper}'); background-size: cover; background-position: center;">
							<div class="mc-space-live">
								{#each Object.entries(apps.open) as [appId, isOpen]}
									{#if isOpen && spacesManager.getWindowSpace(appId) === space.id && apps_config[appId]?.should_open_window !== false}
										<div class="mc-mini-window">
											<img src="/app-icons/{appId}/256.webp" alt="" />
										</div>
									{/if}
								{/each}
							</div>
						</div>
						<span class="mc-space-label">Desktop {i + 1}</span>
						{#if spacesManager.spaces.length > 1}
							<button class="mc-remove-btn" onclick={(e) => removeSpace(e, space.id)}>×</button>
						{/if}
					</div>
				{/each}
				
				{#if spacesManager.spaces.length < spacesManager.maxSpaces}
					<button class="mc-add-space" onclick={addNewSpace}>
						<span>+</span>
					</button>
				{/if}
			</div>
		</div>
		
		<!-- Windows area -->
		<div class="mc-windows-area">
			{#if currentSpaceWindows.length === 0}
				<div class="mc-empty">
					<span>No windows on this desktop</span>
				</div>
			{:else}
				{#each currentSpaceWindows as win, i}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="mc-window"
						class:dragging={draggedWindow === win.id}
						style={getWindowStyle(i, currentSpaceWindows.length)}
						draggable="true"
						ondragstart={(e) => onWindowDragStart(e, win.id)}
						ondragend={onWindowDragEnd}
						onclick={() => selectWindow(win.id)}
					>
						<div class="mc-window-content" data-app={win.id}>
							<div class="mc-window-titlebar">
								<div class="mc-window-dots">
									<span class="dot red"></span>
									<span class="dot yellow"></span>
									<span class="dot green"></span>
								</div>
								<span class="mc-window-name">{win.title}</span>
							</div>
							<div class="mc-window-body">
								<!-- Reference to actual window for live preview -->
								<div class="mc-window-preview">
									<div class="preview-placeholder">
										<img src="/app-icons/{win.id}/256.webp" alt={win.title} class="preview-icon" />
										<span class="preview-label">{win.title}</span>
									</div>
								</div>
							</div>
						</div>
						<span class="mc-window-label">{win.title}</span>
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
.mc-overlay {
	position: fixed;
	inset: 0;
	z-index: 99999;
	background: rgba(30, 30, 30, 0.85);
	backdrop-filter: blur(20px);
	display: flex;
	flex-direction: column;
	animation: mcFadeIn 0.3s ease;
}

@keyframes mcFadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

/* Spaces bar at top */
.mc-spaces-bar {
	padding: 16px 24px;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
}

.mc-spaces-container {
	display: flex;
	gap: 16px;
	align-items: flex-start;
}

.mc-space-thumb {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	position: relative;
	transition: transform 0.2s ease;
}

.mc-space-thumb:hover {
	transform: scale(1.05);
}

.mc-space-thumb:hover .mc-remove-btn {
	opacity: 1;
}

.mc-space-preview {
	width: 180px;
	height: 110px;
	border-radius: 10px;
	overflow: hidden;
	position: relative;
	border: 3px solid transparent;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	transition: all 0.2s ease;
}

.mc-space-thumb.active .mc-space-preview {
	border-color: rgba(255, 255, 255, 0.8);
	box-shadow: 0 4px 25px rgba(255, 255, 255, 0.2);
}

.mc-space-thumb.drag-over .mc-space-preview {
	border-color: #007aff;
	box-shadow: 0 4px 25px rgba(0, 122, 255, 0.4);
	transform: scale(1.05);
}

.mc-space-live {
	position: absolute;
	inset: 4px;
	display: flex;
	flex-wrap: wrap;
	gap: 3px;
	padding: 3px;
	align-content: flex-start;
}

.mc-mini-window {
	width: 35px;
	height: 25px;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.mc-mini-window img {
	width: 14px;
	height: 14px;
	border-radius: 3px;
}

.mc-space-label {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.mc-remove-btn {
	position: absolute;
	top: -8px;
	left: -8px;
	width: 22px;
	height: 22px;
	border-radius: 50%;
	background: rgba(80, 80, 80, 0.9);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: #fff;
	font-size: 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: all 0.2s ease;
}

.mc-remove-btn:hover {
	background: #ff3b30;
}

.mc-add-space {
	width: 180px;
	height: 110px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.08);
	border: 2px dashed rgba(255, 255, 255, 0.25);
	color: rgba(255, 255, 255, 0.6);
	font-size: 40px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.mc-add-space:hover {
	background: rgba(255, 255, 255, 0.12);
	border-color: rgba(255, 255, 255, 0.4);
	color: rgba(255, 255, 255, 0.8);
}

/* Windows area */
.mc-windows-area {
	flex: 1;
	position: relative;
	padding: 20px;
}

.mc-empty {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.mc-empty span {
	font-size: 20px;
	color: rgba(255, 255, 255, 0.4);
	font-weight: 500;
}

.mc-window {
	position: absolute;
	cursor: pointer;
	transition: all 0.3s ease;
	animation: windowAppear 0.4s ease;
	display: flex;
	flex-direction: column;
}

@keyframes windowAppear {
	from { 
		opacity: 0; 
		transform: scale(0.9);
	}
	to { 
		opacity: 1; 
	}
}

.mc-window:hover {
	z-index: 10;
	transform: scale(1.02);
}

.mc-window:hover .mc-window-content {
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.mc-window.dragging {
	opacity: 0.6;
	cursor: grabbing;
}

.mc-window-content {
	flex: 1;
	border-radius: 12px;
	overflow: hidden;
	background: #1e1e1e;
	box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
	transition: box-shadow 0.2s ease;
	display: flex;
	flex-direction: column;
}

.mc-window-titlebar {
	height: 32px;
	min-height: 32px;
	background: linear-gradient(180deg, #3d3d3d 0%, #2d2d2d 100%);
	display: flex;
	align-items: center;
	padding: 0 12px;
	gap: 8px;
}

.mc-window-dots {
	display: flex;
	gap: 6px;
}

.mc-window-dots .dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.mc-window-dots .dot.red { background: #ff5f57; }
.mc-window-dots .dot.yellow { background: #febc2e; }
.mc-window-dots .dot.green { background: #28c840; }

.mc-window-name {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
	flex: 1;
	text-align: center;
	margin-right: 50px;
}

.mc-window-body {
	flex: 1;
	background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
}

.mc-window-preview {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #1e1e1e;
	overflow: hidden;
	position: relative;
}

.live-preview-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
	background: white;
}

.live-preview-content {
	pointer-events: none;
	user-select: none;
}

.preview-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

.preview-icon {
	width: 25%;
	max-width: 80px;
	min-width: 48px;
	aspect-ratio: 1;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-label {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.6);
	font-weight: 500;
}

.mc-window-label {
	display: block;
	text-align: center;
	margin-top: 8px;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
	text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
