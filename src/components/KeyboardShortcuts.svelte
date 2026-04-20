<script lang="ts">
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { openLaunchpad, closeLaunchpad, launchpadState } from '🍎/state/launchpad.svelte';
	import { missionControl } from '🍎/state/mission-control.svelte';
	
	let showAppSwitcher = $state(false);
	let appSwitcherApps = $state<AppID[]>([]);
	let appSwitcherIndex = $state(0);
	let cmdPressed = $state(false);
	
	function handleKeyDown(e: KeyboardEvent) {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		const cmdKey = isMac ? e.metaKey : e.ctrlKey;
		
		// Cmd+Q - Quit app
		if (cmdKey && e.key === 'q') {
			e.preventDefault();
			if (apps.active) {
				apps.open[apps.active] = false;
				apps.running[apps.active] = false;
				apps.minimized[apps.active] = false;
			}
		}
		
		// Cmd+W - Close window
		else if (cmdKey && e.key === 'w') {
			e.preventDefault();
			if (apps.active) {
				apps.open[apps.active] = false;
			}
		}
		
		// Cmd+M - Minimize window
		else if (cmdKey && e.key === 'm') {
			e.preventDefault();
			if (apps.active && apps.open[apps.active]) {
				apps.minimized[apps.active] = true;
				apps.open[apps.active] = false;
			}
		}
		
		// Cmd+H - Hide app
		else if (cmdKey && e.key === 'h') {
			e.preventDefault();
			if (apps.active) {
				apps.minimized[apps.active] = true;
				apps.open[apps.active] = false;
			}
		}
		
		// Cmd+Space - Spotlight (already handled in Spotlight component)
		
		// Cmd+Tab - App Switcher
		else if (cmdKey && e.key === 'Tab') {
			e.preventDefault();
			
			// Get all running apps
			const runningApps = Object.entries(apps.running)
				.filter(([_, isRunning]) => isRunning)
				.map(([id]) => id as AppID);
			
			if (runningApps.length === 0) return;
			
			if (!showAppSwitcher) {
				appSwitcherApps = runningApps;
				appSwitcherIndex = 0;
				showAppSwitcher = true;
				cmdPressed = true;
			} else {
				// Cycle through apps
				if (e.shiftKey) {
					appSwitcherIndex = (appSwitcherIndex - 1 + appSwitcherApps.length) % appSwitcherApps.length;
				} else {
					appSwitcherIndex = (appSwitcherIndex + 1) % appSwitcherApps.length;
				}
			}
		}
		
		// Cmd+Option+D - Toggle Dock
		else if (cmdKey && e.altKey && e.key === 'd') {
			e.preventDefault();
			// Dock auto-hide is already handled by the Dock component
		}
		
		// F3 or Cmd+Up - Mission Control
		else if (e.key === 'F3' || (cmdKey && e.key === 'ArrowUp')) {
			e.preventDefault();
			missionControl.toggle();
		}
		
		// F4 or Cmd+Space - Launchpad
		else if (e.key === 'F4') {
			e.preventDefault();
			if (launchpadState.isOpen) {
				closeLaunchpad();
			} else {
				openLaunchpad();
			}
		}
		
		// Escape - Close overlays
		else if (e.key === 'Escape') {
			if (showAppSwitcher) {
				showAppSwitcher = false;
			}
		}
	}
	
	function handleKeyUp(e: KeyboardEvent) {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		const cmdKey = isMac ? e.metaKey : e.ctrlKey;
		
		// When Cmd is released, switch to selected app
		if (!cmdKey && showAppSwitcher && cmdPressed) {
			const selectedApp = appSwitcherApps[appSwitcherIndex];
			if (selectedApp) {
				apps.open[selectedApp] = true;
				apps.minimized[selectedApp] = false;
				apps.active = selectedApp;
			}
			showAppSwitcher = false;
			cmdPressed = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

{#if showAppSwitcher}
	<div class="app-switcher-overlay">
		<div class="app-switcher">
			{#each appSwitcherApps as appId, index}
				<div class="switcher-app" class:active={index === appSwitcherIndex}>
					<div class="switcher-icon">
						<img 
							src="/app-icons/{appId}/256.webp" 
							alt={apps_config[appId]?.title}
							onerror={(e) => { e.currentTarget.src = `/app-icons/${appId}/256.png`; }}
						/>
					</div>
					<span class="switcher-name">{apps_config[appId]?.title}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.app-switcher-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		animation: fadeIn 0.15s ease;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.app-switcher {
		display: flex;
		gap: 20px;
		padding: 30px 40px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(40px);
	}
	
	:global(.dark-mode) .app-switcher {
		background: rgba(40, 40, 40, 0.95);
	}
	
	.switcher-app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 15px;
		border-radius: 12px;
		transition: all 0.2s ease;
		min-width: 100px;
	}
	
	.switcher-app.active {
		background: rgba(0, 122, 255, 0.2);
		transform: scale(1.05);
	}
	
	.switcher-icon {
		width: 80px;
		height: 80px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}
	
	.switcher-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.switcher-name {
		font-size: 13px;
		font-weight: 500;
		color: #333;
		text-align: center;
	}
	
	:global(.dark-mode) .switcher-name {
		color: #fff;
	}
</style>
