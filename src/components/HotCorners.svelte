<script lang="ts">
	import { apps } from '🍎/state/apps.svelte';
	import { missionControl } from '🍎/state/mission-control.svelte';
	import { openLaunchpad } from '🍎/state/launchpad.svelte';
	import type { AppID } from '🍎/state/apps.svelte';
	
	let mouseX = $state(0);
	let mouseY = $state(0);
	let lastTriggerTime = 0;
	let activeCorner = $state<string | null>(null);
	
	const cornerSize = 10; // pixels
	const cooldown = 1000; // ms between triggers
	
	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		
		const now = Date.now();
		if (now - lastTriggerTime < cooldown) return;
		
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		
		// Top-left corner - Show all windows (Mission Control)
		if (mouseX < cornerSize && mouseY < cornerSize) {
			activeCorner = 'top-left';
			setTimeout(() => {
				missionControl.open();
				lastTriggerTime = Date.now();
				activeCorner = null;
			}, 300);
		}
		// Top-right corner - Mission Control
		else if (mouseX > screenWidth - cornerSize && mouseY < cornerSize) {
			activeCorner = 'top-right';
			setTimeout(() => {
				missionControl.open();
				lastTriggerTime = Date.now();
				activeCorner = null;
			}, 300);
		}
		// Bottom-left corner - Launchpad
		else if (mouseX < cornerSize && mouseY > screenHeight - cornerSize) {
			activeCorner = 'bottom-left';
			setTimeout(() => {
				openLaunchpad();
				lastTriggerTime = Date.now();
				activeCorner = null;
			}, 300);
		}
		// Bottom-right corner - Show Desktop (minimize all)
		else if (mouseX > screenWidth - cornerSize && mouseY > screenHeight - cornerSize) {
			activeCorner = 'bottom-right';
			setTimeout(() => {
				showDesktop();
				lastTriggerTime = Date.now();
				activeCorner = null;
			}, 300);
		}
		else {
			activeCorner = null;
		}
	}
	
	function showDesktop() {
		// Minimize all open windows
		Object.keys(apps.open).forEach((id) => {
			if (apps.open[id as AppID] && !apps.minimized[id as AppID]) {
				apps.minimized[id as AppID] = true;
				apps.open[id as AppID] = false;
			}
		});
	}
</script>

<svelte:window onmousemove={handleMouseMove} />

<!-- Visual indicators for hot corners -->
{#if activeCorner}
	<div class="hot-corner-indicator {activeCorner}"></div>
{/if}

<style>
	.hot-corner-indicator {
		position: fixed;
		width: 40px;
		height: 40px;
		background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%);
		pointer-events: none;
		z-index: 999999;
		animation: cornerPulse 0.3s ease;
	}
	
	.hot-corner-indicator.top-left {
		top: 0;
		left: 0;
		border-radius: 0 0 100% 0;
	}
	
	.hot-corner-indicator.top-right {
		top: 0;
		right: 0;
		border-radius: 0 0 0 100%;
	}
	
	.hot-corner-indicator.bottom-left {
		bottom: 0;
		left: 0;
		border-radius: 0 100% 0 0;
	}
	
	.hot-corner-indicator.bottom-right {
		bottom: 0;
		right: 0;
		border-radius: 100% 0 0 0;
	}
	
	@keyframes cornerPulse {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
