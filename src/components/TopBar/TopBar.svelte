<script lang="ts">
	import { fade_out } from '🍎/helpers/fade';
	import { should_show_notch } from '🍎/state/menubar.svelte';
	import { elevation } from '🍎/actions';
	import { apps } from '🍎/state/apps.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { missionControl } from '🍎/state/mission-control.svelte';
	import type { AppID } from '🍎/state/apps.svelte';

	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import ActionCenterToggle from './ActionCenterToggle.svelte';
	import MenuBar from './MenuBar.svelte';
	import TopBarTime from './TopBarTime.svelte';
	import MusicControl from './MusicControl.svelte';
	
	// Count open windows
	const openWindowCount = $derived(
		Object.entries(apps.open)
			.filter(([id, isOpen]) => {
				if (!isOpen) return false;
				const config = apps_config[id as AppID];
				return config && config.should_open_window !== false;
			})
			.length
	);
	
	function handleMCClick() {
		missionControl.open();
	}
</script>

<header use:elevation={'topbar'}>
	<MenuBar />

	<span style:flex="1 1 auto"></span>

	{#if should_show_notch.value}
		<div class="notch" in:fade={{ duration: 150, easing: sineIn }} out:fade_out>
			<span> <img src="/emojis/wink.png" alt="Wink emoji" class="emoji" /> </span>
		</div>
	{/if}

	<!-- Mission Control button - shows when 2+ windows open -->
	{#if openWindowCount >= 2}
	<button class="mission-control-btn" onclick={handleMCClick} aria-label="Mission Control">
		<svg viewBox="0 0 24 24" fill="currentColor">
			<rect x="2" y="2" width="9" height="9" rx="2" />
			<rect x="13" y="2" width="9" height="9" rx="2" />
			<rect x="2" y="13" width="9" height="9" rx="2" />
			<rect x="13" y="13" width="9" height="9" rx="2" />
		</svg>
	</button>
	{/if}

	<MusicControl />

	<ActionCenterToggle />

	<button>
		<TopBarTime />
	</button>
</header>

<style>
	header {
		display: flex;
		align-items: center;

		position: relative;

		width: 100%;
		height: 1.8rem;

		background-color: hsla(var(--system-color-light-hsl), 0.3);

		color: var(--system-color-light-contrast);
		fill: var(--system-color-light-contrast);

		button {
			font-weight: 500;
			font-size: 0.8rem;
			font-family: var(--system-font-family);

			letter-spacing: 0.3px;

			position: relative;

			height: 100%;

			text-shadow: 0 0 1px hsla(0, 0%, 0%, 0.1);
		}
	}

	.notch {
		--width: 140px;

		display: grid;
		place-items: center;

		position: absolute;
		top: 0;
		left: 50%;

		width: var(--width);
		height: 95%;

		background-color: #222;
		border-radius: 0 0 0.5rem 0.5rem;
		transform: translateX(-50%);

		& > span {
			opacity: 0;

			transition: opacity 0.2s ease-in-out;
		}

		&:hover {
			& > span {
				opacity: 1;
			}
		}

		/* // for outward curves */
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 0;
			height: 16px;
			width: 16px;
			border-radius: 50%;
		}
		&::before {
			left: -16px;
			box-shadow: 8px -8px #222;
		}
		&::after {
			right: -16px;
			box-shadow: -8px -8px #222;
		}
	}

	header::before {
		content: '';

		width: inherit;
		height: inherit;

		position: fixed;
		left: 0;
		top: 0;

		z-index: -1;
		backdrop-filter: blur(12px);
		pointer-events: none;
	}

	.emoji {
		height: 1.5em;
		width: 1.5em;

		vertical-align: middle;
	}
	
	.mission-control-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
		height: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		color: inherit;
		opacity: 0.9;
		transition: opacity 0.2s;
		z-index: 10;
		position: relative;
	}
	
	.mission-control-btn.hidden {
		display: none;
	}
	
	.mission-control-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
	}
	
	.mission-control-btn svg {
		width: 14px;
		height: 14px;
	}
</style>
