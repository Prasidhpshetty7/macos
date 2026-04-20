<script lang="ts">
	let showScreenshotUI = $state(false);
	let screenshotMode = $state<'full' | 'selection' | null>(null);
	let selectionStart = $state<{ x: number; y: number } | null>(null);
	let selectionEnd = $state<{ x: number; y: number } | null>(null);
	let isSelecting = $state(false);
	
	const selectionRect = $derived(() => {
		if (!selectionStart || !selectionEnd) return null;
		return {
			left: Math.min(selectionStart.x, selectionEnd.x),
			top: Math.min(selectionStart.y, selectionEnd.y),
			width: Math.abs(selectionEnd.x - selectionStart.x),
			height: Math.abs(selectionEnd.y - selectionStart.y),
		};
	});
	
	function handleKeyDown(e: KeyboardEvent) {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		const cmdKey = isMac ? e.metaKey : e.ctrlKey;
		
		// Cmd+Shift+3 - Full screen screenshot (simulated)
		if (cmdKey && e.shiftKey && e.key === '3') {
			e.preventDefault();
			simulateScreenshot('full');
		}
		
		// Cmd+Shift+4 - Selection screenshot
		else if (cmdKey && e.shiftKey && e.key === '4') {
			e.preventDefault();
			startSelectionMode();
		}
		
		// Cmd+Shift+5 - Screenshot UI
		else if (cmdKey && e.shiftKey && e.key === '5') {
			e.preventDefault();
			showScreenshotUI = !showScreenshotUI;
		}
		
		// Escape - Cancel screenshot
		else if (e.key === 'Escape' && (screenshotMode || showScreenshotUI)) {
			cancelScreenshot();
		}
	}
	
	function simulateScreenshot(type: 'full' | 'selection') {
		// Show camera flash effect
		const flash = document.createElement('div');
		flash.style.cssText = `
			position: fixed;
			inset: 0;
			background: white;
			z-index: 99999;
			animation: cameraFlash 0.3s ease;
			pointer-events: none;
		`;
		document.body.appendChild(flash);
		
		// Add animation keyframes if not exists
		if (!document.getElementById('camera-flash-style')) {
			const style = document.createElement('style');
			style.id = 'camera-flash-style';
			style.textContent = `
				@keyframes cameraFlash {
					0% { opacity: 0; }
					50% { opacity: 0.8; }
					100% { opacity: 0; }
				}
			`;
			document.head.appendChild(style);
		}
		
		setTimeout(() => flash.remove(), 300);
		
		// Play camera sound (if available)
		try {
			const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z2Ik2CBdju+zooVARC0yl4fG5ZRwFNo3V7859LwUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFL4TP89iJNggXY7vs6KFQEQtMpeHxuWUcBTaN1e/OfS8FKH7M8NqPOwsSXLHo7KtYFQhDnN3ywW4kBS+Ez/PYiTYIF2O77OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUvhM/z2Ik2CBdju+zooVARC0yl4fG5ZRwFNo3V7859LwUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFL4TP89iJNggXY7vs6KFQEQtMpeHxuWUcBTaN1e/OfS8FKH7M8NqPOwsSXLHo7KtYFQhDnN3ywW4kBS+Ez/PYiTYIF2O77OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUvhM/z2Ik2CBdju+zooVARC0yl4fG5ZRwFNo3V7859LwUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFL4TP89iJNggXY7vs6KFQEQtMpeHxuWUcBTaN1e/OfS8FKH7M8NqPOwsSXLHo7KtYFQhDnN3ywW4kBS+Ez/PYiTYIF2O77OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUvhM/z2Ik2CBdju+zooVARC0yl4fG5ZRwFNo3V7859LwUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFL4TP89iJNggXY7vs6KFQEQtMpeHxuWUcBTaN1e/OfS8FKH7M8NqPOwsSXLHo7KtYFQhDnN3ywW4kBS+Ez/PYiTYIF2O77OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUvhM/z2Ik2CBdju+zooVARC0yl4fG5ZRwFNo3V7859LwUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFL4TP8w==');
			audio.volume = 0.3;
			audio.play().catch(() => {});
		} catch (e) {}
		
		showNotification(type);
		cancelScreenshot();
	}
	
	function startSelectionMode() {
		screenshotMode = 'selection';
		showScreenshotUI = false;
		selectionStart = null;
		selectionEnd = null;
	}
	
	function handleMouseDown(e: MouseEvent) {
		if (screenshotMode !== 'selection') return;
		isSelecting = true;
		selectionStart = { x: e.clientX, y: e.clientY };
		selectionEnd = { x: e.clientX, y: e.clientY };
	}
	
	function handleMouseMove(e: MouseEvent) {
		if (!isSelecting || screenshotMode !== 'selection') return;
		selectionEnd = { x: e.clientX, y: e.clientY };
	}
	
	function handleMouseUp(e: MouseEvent) {
		if (!isSelecting || screenshotMode !== 'selection') return;
		isSelecting = false;
		
		const rect = selectionRect();
		if (!rect || rect.width < 10 || rect.height < 10) {
			cancelScreenshot();
			return;
		}
		
		simulateScreenshot('selection');
	}
	
	function showNotification(type: 'full' | 'selection') {
		const notification = document.createElement('div');
		const message = type === 'full' 
			? 'Screenshot saved to Desktop' 
			: 'Screenshot saved to Desktop';
		notification.textContent = message;
		notification.style.cssText = `
			position: fixed;
			top: 50px;
			right: 20px;
			background: rgba(0, 0, 0, 0.85);
			color: white;
			padding: 14px 24px;
			border-radius: 10px;
			font-size: 13px;
			font-weight: 500;
			z-index: 99999;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
			animation: slideIn 0.3s ease;
		`;
		document.body.appendChild(notification);
		
		setTimeout(() => {
			notification.style.animation = 'slideOut 0.3s ease';
			setTimeout(() => notification.remove(), 300);
		}, 2500);
	}
	
	function cancelScreenshot() {
		screenshotMode = null;
		showScreenshotUI = false;
		selectionStart = null;
		selectionEnd = null;
		isSelecting = false;
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if screenshotMode === 'selection'}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="screenshot-overlay"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
	>
		{#if selectionStart && selectionEnd}
			{@const rect = selectionRect()}
			{#if rect}
				<div 
					class="selection-box"
					style:left="{rect.left}px"
					style:top="{rect.top}px"
					style:width="{rect.width}px"
					style:height="{rect.height}px"
				></div>
			{/if}
		{/if}
		
		<div class="screenshot-instructions">
			Click and drag to select area • Press ESC to cancel
		</div>
	</div>
{/if}

{#if showScreenshotUI}
	<div class="screenshot-ui">
		<div class="screenshot-panel">
			<button class="screenshot-btn" onclick={() => simulateScreenshot('full')}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" fill="none" stroke-width="2"/>
				</svg>
				<span>Capture Entire Screen</span>
			</button>
			
			<button class="screenshot-btn" onclick={startSelectionMode}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 3h6v2H5v4H3V3zm18 0v6h-2V5h-4V3h6zM3 15v6h6v-2H5v-4H3zm18 0v4h-4v2h6v-6h-2z" stroke="currentColor" fill="none"/>
				</svg>
				<span>Capture Selected Area</span>
			</button>
			
			<button class="screenshot-btn close" onclick={cancelScreenshot}>
				<span>Close</span>
			</button>
		</div>
	</div>
{/if}

<style>
	.screenshot-overlay {
		position: fixed;
		inset: 0;
		z-index: 99998;
		cursor: crosshair;
		background: rgba(0, 0, 0, 0.3);
	}
	
	.selection-box {
		position: fixed;
		border: 2px solid #007AFF;
		background: rgba(0, 122, 255, 0.1);
		pointer-events: none;
	}
	
	.screenshot-instructions {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 16px 24px;
		border-radius: 12px;
		font-size: 14px;
		pointer-events: none;
	}
	
	.screenshot-ui {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 99999;
		animation: slideUp 0.3s ease;
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
	
	.screenshot-panel {
		display: flex;
		gap: 12px;
		padding: 16px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(20px);
	}
	
	:global(.dark-mode) .screenshot-panel {
		background: rgba(40, 40, 40, 0.95);
	}
	
	.screenshot-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px 20px;
		background: transparent;
		border: 2px solid transparent;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #333;
		min-width: 140px;
	}
	
	:global(.dark-mode) .screenshot-btn {
		color: #fff;
	}
	
	.screenshot-btn:hover {
		background: rgba(0, 122, 255, 0.1);
		border-color: rgba(0, 122, 255, 0.3);
	}
	
	.screenshot-btn.close {
		min-width: 100px;
		background: rgba(255, 59, 48, 0.1);
	}
	
	.screenshot-btn.close:hover {
		background: rgba(255, 59, 48, 0.2);
		border-color: rgba(255, 59, 48, 0.3);
	}
	
	.screenshot-btn svg {
		width: 32px;
		height: 32px;
	}
	
	.screenshot-btn span {
		font-size: 12px;
		font-weight: 500;
		text-align: center;
	}
	
	.capturing-overlay {
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.capturing-message {
		background: rgba(255, 255, 255, 0.95);
		color: #333;
		padding: 20px 40px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 500;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}
	
	:global(.dark-mode) .capturing-message {
		background: rgba(40, 40, 40, 0.95);
		color: #fff;
	}
</style>
