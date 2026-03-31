<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [
		-distanceLimit,
		-distanceLimit / 1.25,
		-distanceLimit / 2,
		0,
		distanceLimit / 2,
		distanceLimit / 1.25,
		distanceLimit,
	];
	const widthOutput = [
		baseWidth,
		baseWidth * 1.1,
		baseWidth * 1.414,
		baseWidth * 2,
		baseWidth * 1.414,
		baseWidth * 1.1,
		baseWidth,
	];
	// Vertical lift output - icons rise based on proximity to cursor
	const liftOutput = [
		0,
		8,
		20,
		35,
		20,
		8,
		0,
	];
</script>

<script lang="ts">
	import { interpolate } from 'popmotion';
	import { onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { preferences } from '🍎/state/preferences.svelte';
	import { spacesManager } from '🍎/state/spaces.svelte';

	const {
		mouse_x,
		app_id,
		needs_update = false,
	}: {
		mouse_x: number | null;
		app_id: AppID;
		needs_update?: boolean;
	} = $props();

	let image_el = $state<HTMLElement>();

	let distance = $state(beyond_the_distance_limit);

	const width_px = spring(baseWidth, {
		damping: 0.47,
		stiffness: 0.12,
	});

	const lift_px = spring(0, {
		damping: 0.47,
		stiffness: 0.12,
	});

	const get_width_from_distance = interpolate(distanceInput, widthOutput);
	const get_lift_from_distance = interpolate(distanceInput, liftOutput);

	$effect(() => {
		distance;

		untrack(() => {
			$width_px = get_width_from_distance(distance);
			$lift_px = get_lift_from_distance(distance);
		});
	});

	let raf: number;
	function animate() {
		if (image_el && mouse_x !== null) {
			const rect = image_el.getBoundingClientRect();

			// get the x coordinate of the img DOMElement's center
			// the left x coordinate plus the half of the width
			const img_center_x = rect.left + rect.width / 2;

			// difference between the x coordinate value of the mouse pointer
			// and the img center x coordinate value
			const distance_delta = mouse_x - img_center_x;
			distance = distance_delta;
			return;
		}

		distance = beyond_the_distance_limit;
	}

	$effect(() => {
		mouse_x;
		// Always run animation for lift effect, only skip size magnification if reduced motion
		raf = requestAnimationFrame(animate);
	});

	const {
		title,
		should_open_window: shouldOpenWindow,
		external_action: externalAction,
	} = apps_config[app_id];

	// Spring animation for the click animation
	const appOpenIconBounceTransform = tweened(0, {
		duration: 400,
		easing: sineInOut,
	});

	async function bounceEffect() {
		// Animate the icon
		await appOpenIconBounceTransform.set(-40);

		// Now animate it back to its place
		appOpenIconBounceTransform.set(0);
	}

	// Check if app is running in current space
	const isRunningInCurrentSpace = $derived(
		apps.running[app_id] && spacesManager.isWindowInActiveSpace(app_id)
	);

	async function openApp(e: MouseEvent) {
		if (!shouldOpenWindow) return externalAction?.(e);

		// For the bounce animation
		const isAppAlreadyOpen = apps.open[app_id];

		apps.open[app_id] = true;
		apps.running[app_id] = true;
		apps.minimized[app_id] = false; // Restore from minimized state
		apps.active = app_id;
		
		// Assign window to current space when opening
		spacesManager.assignWindowToCurrentSpace(app_id);

		if (isAppAlreadyOpen) return;

		bounceEffect();
	}

	onDestroy(() => {
		cancelAnimationFrame(raf);
	});

	const is_app_store = $derived(app_id === 'appstore');
	const show_pwa_badge = $derived(is_app_store && needs_update);

	$effect(() => {
		if (show_pwa_badge) bounceEffect();
	});
	
	// Context menu state
	let showContextMenu = $state(false);
	let contextMenuPos = $state({ x: 0, y: 0 });
	
	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		showContextMenu = true;
		contextMenuPos = { x: e.clientX, y: e.clientY };
	}
	
	function closeContextMenu() {
		showContextMenu = false;
	}
	
	function handleQuit() {
		apps.open[app_id] = false;
		apps.running[app_id] = false;
		apps.minimized[app_id] = false;
		closeContextMenu();
	}
	
	function handleHide() {
		apps.minimized[app_id] = true;
		closeContextMenu();
	}
	
	function handleShowAllWindows() {
		apps.minimized[app_id] = false;
		apps.active = app_id;
		closeContextMenu();
	}
</script>

<svelte:window onclick={closeContextMenu} />

<button onclick={openApp} oncontextmenu={handleContextMenu} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p
		class="tooltip"
		class:tooltip-enabled={!apps.is_being_dragged}
		class:dark={preferences.theme.scheme === 'dark'}
		style:top={preferences.reduced_motion ? '-50px' : '-35%'}
		style:transform="translate(0, {$appOpenIconBounceTransform}px)"
		use:elevation={'dock-tooltip'}
	>
		{title}
	</p>

	<span style:transform="translate(0, {$appOpenIconBounceTransform - $lift_px}px)">
		{#if app_id === 'calendar'}
			<div 
				bind:this={image_el}
				class="calendar-icon"
				style:width="{$width_px / 16}rem"
				style:height="{$width_px / 16}rem"
			>
				<span class="calendar-day">{new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
				<span class="calendar-date">{new Date().getDate()}</span>
			</div>
		{:else if app_id === 'mission-control'}
			<div 
				bind:this={image_el}
				class="mission-control-icon"
				style:width="{$width_px / 16}rem"
				style:height="{$width_px / 16}rem"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<rect x="2" y="2" width="9" height="9" rx="2" />
					<rect x="13" y="2" width="9" height="9" rx="2" />
					<rect x="2" y="13" width="9" height="9" rx="2" />
					<rect x="13" y="13" width="9" height="9" rx="2" />
				</svg>
			</div>
		{:else}
			<img
				bind:this={image_el}
				src="/app-icons/{app_id}/256.webp"
				onerror={(e) => { e.currentTarget.src = `/app-icons/${app_id}/256.png`; }}
				alt="{title} app"
				style:width="{$width_px / 16}rem"
				draggable="false"
			/>
		{/if}
	</span>

	<div class="dot" style:--opacity={+isRunningInCurrentSpace}></div>

	{#if show_pwa_badge}
		<div class="pwa-badge" style:transform="scale({$width_px / baseWidth})">1</div>
	{/if}
</button>

{#if showContextMenu}
	<div 
		class="dock-context-menu"
		style:left="{contextMenuPos.x - 90}px"
		style:top="{contextMenuPos.y - (apps.running[app_id] ? 140 : 80)}px"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="context-menu-header">{title}</div>
		<div class="context-divider"></div>
		
		{#if apps.running[app_id]}
			{#if apps.minimized[app_id]}
				<button onclick={handleShowAllWindows}>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
					</svg>
					Show
				</button>
			{:else}
				<button onclick={handleHide}>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13H5v-2h14v2z"/>
					</svg>
					Hide
				</button>
			{/if}
			<div class="context-divider"></div>
			<button onclick={handleQuit} class="quit-btn">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
				</svg>
				Quit
			</button>
		{:else}
			<button onclick={openApp}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
				</svg>
				Open
			</button>
		{/if}
	</div>
{/if}

<style>
	img {
		will-change: width;
		border-radius: 22%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	.calendar-icon {
		will-change: width;
		border-radius: 22%;
		aspect-ratio: 1 / 1;
		background: linear-gradient(180deg, #ff3b30 0%, #ff3b30 26%, #ffffff 26%, #ffffff 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		transform: scale(0.85);
	}

	.calendar-day {
		color: white;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.8px;
		margin-top: 4%;
		line-height: 1;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
	}

	.calendar-date {
		color: #333;
		font-size: 38px;
		font-weight: 300;
		line-height: 1;
		margin-top: 4%;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
	}

	.mission-control-icon {
		will-change: width;
		border-radius: 22%;
		aspect-ratio: 1 / 1;
		background: linear-gradient(180deg, #3a3a3c 0%, #1c1c1e 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.mission-control-icon svg {
		width: 60%;
		height: 60%;
		color: #fff;
	}

	button {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		position: relative;

		border-radius: 0.5rem;

		&:hover,
		&:focus-visible {
			.tooltip.tooltip-enabled {
				display: block;
			}
		}

		& > span {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tooltip {
		--double-border: 0 0 0 0 white;

		white-space: nowrap;

		position: absolute;

		background-color: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(5px);

		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;

		box-shadow:
			hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px,
			var(--double-border);

		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.4px;

		display: none;

		&.dark {
			--double-border: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.dot {
		height: 4px;
		width: 4px;

		margin: 0px;

		border-radius: 50%;

		background-color: var(--system-color-dark);

		opacity: var(--opacity);
	}
	.pwa-badge {
		position: absolute;
		top: 1px;
		right: -1px;

		background-color: rgba(248, 58, 58, 0.85);

		box-shadow: hsla(var(--system-color-dark-hsl), 0.4) 0px 0.5px 2px;
		border-radius: 50%;

		pointer-events: none;
		vertical-align: middle;

		width: 1.5rem;
		height: 1.5rem;

		margin: 0;
		padding: 0;

		text-align: center;
		color: white;

		font-size: 1rem;
		line-height: 1.5;
	}
	
	.dock-context-menu {
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
	
	.dock-context-menu button {
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
	
	.dock-context-menu button:hover {
		background: #007aff;
	}
	
	.dock-context-menu button.quit-btn:hover {
		background: #ff3b30;
	}
	
	.dock-context-menu button svg {
		width: 16px;
		height: 16px;
	}
	
	.context-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 4px 0;
	}
</style>
