<script lang="ts">
	import html2canvas from 'html2canvas';
	
	let showScreenshotUI = $state(false);
	let screenshotMode = $state<'full' | 'selection' | 'window' | null>(null);
	let isCapturing = $state(false);
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
		
		// Cmd+Shift+3 - Full screen screenshot
		if (cmdKey && e.shiftKey && e.key === '3') {
			e.preventDefault();
			captureFullScreen();
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
	
	async function captureFullScreen() {
		isCapturing = true;
		showScreenshotUI = false;
		
		try {
			// Wait a moment for UI to hide
			await new Promise(resolve => setTimeout(resolve, 100));
			
			const canvas = await html2canvas(document.body, {
				allowTaint: true,
				useCORS: true,
				logging: false,
			});
			
			downloadScreenshot(canvas);
		} catch (error) {
			console.error('Screenshot failed:', error);
		} finally {
			isCapturing = false;
		}
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
	
	async function handleMouseUp(e: MouseEvent) {
		if (!isSelecting || screenshotMode !== 'selection') return;
		isSelecting = false;
		
		const rect = selectionRect();
		if (!rect || rect.width < 10 || rect.height < 10) {
			cancelScreenshot();
			return;
		}
		
		isCapturing = true;
		
		try {
			// Capture the full screen first
			const canvas = await html2canvas(document.body, {
				allowTaint: true,
				useCORS: true,
				logging: false,
			});
			
			// Create a new canvas with just the selected area
			const croppedCanvas = document.createElement('canvas');
			croppedCanvas.width = rect.width;
			croppedCanvas.height = rect.height;
			const ctx = croppedCanvas.getContext('2d');
			
			if (ctx) {
				ctx.drawImage(
					canvas,
					rect.left, rect.top, rect.width, rect.height,
					0, 0, rect.width, rect.height
				);
			}
			
			downloadScreenshot(croppedCanvas);
		} catch (error) {
			console.error('Screenshot failed:', error);
		} finally {
			cancelScreenshot();
			isCapturing = false;
		}
	}
	
	function downloadScreenshot(canvas: HTMLCanvasElement) {
		canvas.toBlob((blob) => {
			if (!blob) return;
			
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `Screenshot ${new Date().toLocaleString()}.png`;
			a.click();
			URL.revokeObjectURL(url);
			
			// Show notification
			showNotification();
		});
	}
	
	function showNotification() {
		// Create a simple notification
		const notification = document.createElement('div');
		notification.textContent = 'Screenshot saved to Downloads';
		notification.style.cssText = `
			position: fixed;
			top: 50px;
			right: 20px;
			background: rgba(0, 0, 0, 0.8);
			color: white;
			padding: 12px 20px;
			border-radius: 8px;
			font-size: 14px;
			z-index: 99999;
			animation: slideIn 0.3s ease;
		`;
		document.body.appendChild(notification);
		
		setTimeout(() => {
			notification.style.animation = 'slideOut 0.3s ease';
			setTimeout(() => notification.remove(), 300);
		}, 2000);
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
			<button class="screenshot-btn" onclick={captureFullScreen}>
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

{#if isCapturing}
	<div class="capturing-overlay">
		<div class="capturing-message">Capturing screenshot...</div>
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
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(100px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	@keyframes slideOut {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(100px);
		}
	}
</style>
