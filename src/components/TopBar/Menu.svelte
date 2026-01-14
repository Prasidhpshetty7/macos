<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { requestShutdown, requestRestart, requestLogout, sleep, lockScreen, openAboutMac, openAboutFinder } from '🍎/state/system.svelte.ts';
	import { menubar_state } from '🍎/state/menubar.svelte';
	import { apps } from '🍎/state/apps.svelte.ts';

	const { menu }: { menu: any } = $props();

	function handleMenuClick(key: string) {
		menubar_state.active = '';
		
		// System menu actions
		if (key === 'shutdown') {
			requestShutdown();
		} else if (key === 'restart') {
			requestRestart();
		} else if (key === 'logout') {
			requestLogout();
		} else if (key === 'sleep') {
			sleep();
		} else if (key === 'lock-screen') {
			lockScreen();
		} else if (key === 'about-this-mac') {
			openAboutMac();
		}
		// Finder menu actions
		else if (key === 'about-finder') {
			openAboutFinder();
		} else if (key === 'preferences') {
			// Open System Preferences if it exists
			if (apps.open['system-preferences'] !== undefined) {
				apps.open['system-preferences'] = true;
				apps.running['system-preferences'] = true;
				apps.active = 'system-preferences';
			}
		} else if (key === 'empty-trash') {
			// Could show a dialog - for now just a simple action
		} else if (key === 'hide-finder') {
			apps.open['finder'] = false;
			apps.minimized['finder'] = true;
		} else if (key === 'hide-others') {
			// Hide all apps except finder
			Object.keys(apps.open).forEach(appId => {
				if (appId !== 'finder' && apps.open[appId]) {
					apps.open[appId] = false;
					apps.minimized[appId] = true;
				}
			});
		} else if (key === 'show-all') {
			// Show all minimized apps
			Object.keys(apps.minimized).forEach(appId => {
				if (apps.minimized[appId]) {
					apps.open[appId] = true;
					apps.minimized[appId] = false;
				}
			});
		}
		// File menu actions
		else if (key === 'new-finder-window') {
			apps.open['finder'] = true;
			apps.running['finder'] = true;
			apps.minimized['finder'] = false;
			apps.active = 'finder';
		}
		// Go menu actions
		else if (key === 'applications') {
			apps.open['finder'] = true;
			apps.running['finder'] = true;
			apps.active = 'finder';
		} else if (key === 'desktop' || key === 'documents' || key === 'downloads' || key === 'recents') {
			apps.open['finder'] = true;
			apps.running['finder'] = true;
			apps.active = 'finder';
		}
		// Window menu actions
		else if (key === 'minimize') {
			const activeApp = apps.active;
			if (activeApp) {
				apps.open[activeApp] = false;
				apps.minimized[activeApp] = true;
			}
		} else if (key === 'bring-all-to-front') {
			Object.keys(apps.minimized).forEach(appId => {
				if (apps.running[appId]) {
					apps.open[appId] = true;
					apps.minimized[appId] = false;
				}
			});
		}
		// Help menu
		else if (key === 'macos-help') {
			window.open('https://support.apple.com/macos', '_blank');
		} else if (key === 'send-finder-feedback') {
			window.open('https://github.com/Prasidhpshetty7', '_blank');
		}
	}
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	{#each Object.entries(menu) as Array<[any, any]> as [key, val]}
		<button class="menu-item" disabled={val.disabled} onclick={() => handleMenuClick(key)}>{val.title}</button>
		{#if val.breakAfter}
			<div class="divider"></div>
		{/if}
	{/each}
</section>

<style>
	.container {
		/* // Initial invisible border */
		--additional-box-shadow: 0 0 0 0 white;

		display: block;

		min-width: 16rem;
		width: max-content;

		padding: 0.5rem;

		position: relative;

		user-select: none;

		background-color: hsla(var(--system-color-light-hsl), 0.3);
		backdrop-filter: blur(25px);

		border-radius: 0.5rem;

		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px,
			var(--additional-box-shadow);

		&.dark {
			--additional-box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.menu-item {
		--alpha: 1;

		display: flex;
		justify-content: flex-start;

		width: 100%;

		padding: 0.2rem 0.4rem;
		margin: 0.1rem;

		letter-spacing: 0.4px;
		font-weight: 400 !important;
		font-size: 0.9rem !important;

		border-radius: 0.3rem;

		transition: none;

		color: hsla(var(--system-color-dark-hsl), var(--alpha));

		&:disabled {
			--alpha: 0.5;
		}

		&:not(:disabled) {
			&:hover,
			&:focus-visible {
				background-color: var(--system-color-primary);
				color: var(--system-color-primary-contrast);
				font-weight: 500 !important;
			}
		}
	}

	.divider {
		width: 100%;
		height: 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 2px 0;
	}
</style>
