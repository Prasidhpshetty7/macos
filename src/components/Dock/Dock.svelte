<svelte:options runes={true} />

<script lang="ts">
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import { is_dock_hidden } from '🍎/state/dock.svelte';
	import DockItem from './DockItem.svelte';
	import { untrack } from 'svelte';

	// Get apps that are hidden from dock but currently running (open or minimized)
	// These show on the right side of dock like real macOS
	const hiddenDockApps = $derived(
		Object.entries(apps_config)
			.filter(([appId, config]) => {
				if (!config.hide_from_dock) return false;
				// Show if app is running (either open or minimized)
				return apps.running[appId as AppID];
			})
			.map(([appId]) => appId as AppID)
	);

	function openHiddenApp(appId: AppID) {
		apps.open[appId] = true;
		apps.minimized[appId] = false;
		apps.active = appId;
	}

	let dock_mouse_x = $state<number | null>(null);

	const HIDDEN_DOCK_THRESHOLD = 30;
	let bodyHeight = $state(0);
	let mouseY = $state(0);

	let dockContainerEl = $state<HTMLElement>();

	$effect(() => {
		// Due to how pointer-events: none works, if dock auto opens, you move away, it won't close automatically.
		// So close it manually if mouse pointer goes out of the dock area.
		if (Math.abs(mouseY - bodyHeight) > dockContainerEl?.clientHeight) {
			untrack(() => (dock_mouse_x = null));
		}

		/**
		 * if mouseX != null then show the dock. No matter what
		 * When it becomes null, Then use the mouseY and bodyHeight to determine if the dock should be hidden
		 */
		if (dock_mouse_x !== null) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		if (!Object.values(apps.fullscreen).some(Boolean)) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		untrack(() => (is_dock_hidden.value = Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD));
	});
</script>

<svelte:body onmousemove={({ y }) => (mouseY = y)} />

<svelte:window bind:innerHeight={bodyHeight} />

<section
	class="dock-container"
	class:dock-hidden={is_dock_hidden.value}
	bind:this={dockContainerEl}
	use:elevation={'dock'}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dock-el"
		class:hidden={is_dock_hidden.value}
		onmousemove={(event) => (dock_mouse_x = event.x)}
		onmouseleave={() => (dock_mouse_x = null)}
	>
					{#each Object.entries(apps_config) as [appID, config]}
			{#if !config.hide_from_dock}
				{#if config.dock_breaks_before}
					<div class="divider" aria-hidden="true"></div>
				{/if}

				<DockItem mouse_x={dock_mouse_x} app_id={appID} needs_update={system_needs_update.value} />
			{/if}
		{/each}

		<!-- Apps hidden from dock but running (like Music, Chess) -->
		{#if hiddenDockApps.length > 0}
			<div class="divider" aria-hidden="true"></div>
			{#each hiddenDockApps as appId}
				<button 
					class="hidden-dock-app"
					class:minimized={apps.minimized[appId]}
					onclick={() => openHiddenApp(appId)}
					aria-label="{apps.minimized[appId] ? 'Restore' : 'Focus'} {apps_config[appId].title}"
				>
					<div class="hidden-app-icon">
						<img 
							src="/app-icons/{appId}/256.webp" 
							onerror={(e) => { e.currentTarget.src = `/app-icons/${appId}/256.png`; }}
							alt="{apps_config[appId].title}"
							draggable="false"
						/>
					</div>
					<div class="dot" style:--opacity="1"></div>
					<span class="hidden-app-label">{apps_config[appId].title}</span>
				</button>
			{/each}
		{/if}
	</div>
</section>

<style>
	.dock-container {
		padding-bottom: 0.7rem;
		left: 0;
		bottom: 0;

		width: 100%;
		height: 5.2rem;

		padding: 0.4rem;

		display: flex;
		justify-content: center;

		&:not(.dock-hidden) {
			pointer-events: none;
		}
	}

	.dock-el {
		background-color: hsla(var(--system-color-light-hsl), 0.4);

		box-shadow:
			inset 0 0 0 0.2px hsla(var(--system-color-grey-100-hsl), 0.7),
			0 0 0 0.2px hsla(var(--system-color-grey-900-hsl), 0.7),
			hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

		position: relative;

		padding: 0.3rem;

		border-radius: 1.2rem;

		height: 100%;

		display: flex;
		align-items: flex-end;

		transition: transform 0.3s ease;

		&:not(.hidden) {
			pointer-events: auto;
		}

		&.hidden {
			transform: translate3d(0, 200%, 0);

			&::before {
				width: calc(100% - 2px);
				height: calc(100% - 2px);

				margin-top: 1px;
				margin-left: 1px;
			}
		}

		&::before {
			content: '';

			border-radius: 20px;

			width: 100%;
			height: 100%;

			border: inherit;

			backdrop-filter: blur(10px);

			position: absolute;
			top: 0;
			left: 0;

			z-index: -1;
		}
	}

	.divider {
		height: 100%;
		width: 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 0 4px;
	}

	/* Hidden dock apps (Music, Chess, etc.) - shown on right side when running */
	.hidden-dock-app {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding: 0 2px;
		cursor: pointer;
		position: relative;
		transition: transform 0.2s ease;
	}

	.hidden-dock-app:hover {
		transform: translateY(-8px);
	}

	.hidden-dock-app:hover .hidden-app-label {
		opacity: 1;
		transform: translate(-50%, -8px);
	}

	.hidden-app-icon {
		width: 48px;
		height: 48px;
		border-radius: 22%;
		overflow: hidden;
		transition: opacity 0.2s ease;
	}

	/* Dimmed when minimized */
	.hidden-dock-app.minimized .hidden-app-icon {
		opacity: 0.6;
	}

	.hidden-app-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}

	.hidden-dock-app .dot {
		height: 4px;
		width: 4px;
		margin: 0px;
		border-radius: 50%;
		background-color: var(--system-color-dark);
		opacity: var(--opacity);
	}

	.hidden-app-label {
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
</style>
