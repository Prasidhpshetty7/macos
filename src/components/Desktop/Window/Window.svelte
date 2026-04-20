<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { rand_int } from '🍎/helpers/random.ts';
	import { sleep } from '🍎/helpers/sleep';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { stopMusic } from '🍎/state/music.svelte.ts';
	import { spacesManager } from '🍎/state/spaces.svelte';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);
	let minimized_transform = $state<string>();
	let is_snapped = $state<'left' | 'right' | null>(null);
	let pre_snap_transform = $state<string>();
	let pre_snap_size = $state<{ width: string; height: string }>();

	let windowEl = $state<HTMLElement>();
	
	// Show snap preview zones
	let showSnapPreview = $state<'left' | 'right' | null>(null);
	
	// Shake detection for minimize others
	let shakeStartX = 0;
	let shakeCount = 0;
	let shakeTimer: number;
	let lastShakeTime = 0;

	const { height, width } = apps_config[app_id];

	const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	// All apps open at the same fixed position (center-left of screen)
	let defaultPosition = {
		x: 150,
		y: 80,
	};

	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;

		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}

	async function maximizeApp() {
		if (!is_maximized) {
			dragging_enabled = false;
			minimized_transform = windowEl.style.transform;
			
			// Position window between menu bar and dock, shifted left and up
			// Use z-index 85 to be above dock (80) but below menus
			windowEl.setAttribute('style', `
				position: fixed;
				top: -40px;
				left: 40%;
				transform: translateX(-50%);
				width: 98%;
				height: 92%;
				z-index: 85;
				border-radius: 0.75rem;
			`);
		} else {
			dragging_enabled = true;
			windowEl.setAttribute('style', `
				position: absolute;
				transform: ${minimized_transform || 'none'};
				width: ${+width / remModifier}rem;
				height: ${+height / remModifier}rem;
				z-index: ${apps.z_indices[app_id]};
				border-radius: 0.75rem;
			`);
		}

		is_maximized = !is_maximized;
		apps.fullscreen[app_id] = is_maximized;
	}

	function closeApp() {
		// Stop music if closing the music app
		if (app_id === 'music') {
			stopMusic();
		}
		apps.open[app_id] = false;
		apps.running[app_id] = false;
		apps.fullscreen[app_id] = false;
		apps.minimized[app_id] = false;
		// Clear space assignment so app can be opened fresh on any desktop
		spacesManager.removeWindowSpace(app_id);
	}

	function minimizeApp() {
		// Get dock icon position for genie effect
		const dockIcon = document.querySelector(`.dock-open-app-button.${app_id}`);
		
		if (dockIcon && windowEl) {
			const windowRect = windowEl.getBoundingClientRect();
			const iconRect = dockIcon.getBoundingClientRect();
			
			// Calculate the transform needed to move window to dock icon
			const scaleX = iconRect.width / windowRect.width;
			const scaleY = iconRect.height / windowRect.height;
			const translateX = iconRect.left - windowRect.left + (iconRect.width - windowRect.width) / 2;
			const translateY = iconRect.top - windowRect.top + (iconRect.height - windowRect.height) / 2;
			
			// Set CSS variables for animation
			windowEl.style.setProperty('--minimize-x', `${translateX}px`);
			windowEl.style.setProperty('--minimize-y', `${translateY}px`);
			windowEl.style.setProperty('--minimize-scale-x', `${scaleX}`);
			windowEl.style.setProperty('--minimize-scale-y', `${scaleY}`);
			
			// Add minimizing class to trigger animation
			windowEl.classList.add('minimizing');
			
			// After animation, hide the window
			setTimeout(() => {
				apps.minimized[app_id] = true;
				apps.open[app_id] = false;
				windowEl?.classList.remove('minimizing');
			}, 500);
		} else {
			// Fallback if dock icon not found
			apps.open[app_id] = false;
			apps.minimized[app_id] = true;
		}
		// apps.running stays true
	}

	function onAppDragStart() {
		// If maximized, restore window when user starts dragging
		if (is_maximized) {
			maximizeApp(); // This will restore it
		}
		// If snapped, restore window
		if (is_snapped) {
			restoreFromSnap();
		}
		focusApp();
		apps.is_being_dragged = true;
		
		// Initialize shake detection
		shakeStartX = 0;
		shakeCount = 0;
		clearTimeout(shakeTimer);
	}

	function onAppDrag(data: { offsetX: number; offsetY: number }) {
		// Check if near edges for snap preview
		const x = data.offsetX;
		const screenWidth = window.innerWidth;
		const snapThreshold = 50; // pixels from edge
		
		if (x < snapThreshold) {
			showSnapPreview = 'left';
		} else if (x > screenWidth - snapThreshold) {
			showSnapPreview = 'right';
		} else {
			showSnapPreview = null;
		}
		
		// Detect shake gesture (rapid left-right movement)
		const now = Date.now();
		if (shakeStartX === 0) {
			shakeStartX = x;
			lastShakeTime = now;
		} else {
			const deltaX = Math.abs(x - shakeStartX);
			const deltaTime = now - lastShakeTime;
			
			// If moved more than 100px in less than 150ms
			if (deltaX > 100 && deltaTime < 150) {
				shakeCount++;
				shakeStartX = x;
				lastShakeTime = now;
				
				// If shaken 3 times, minimize all other windows
				if (shakeCount >= 3) {
					minimizeAllOthers();
					shakeCount = 0;
				}
				
				// Reset shake count after 500ms of no shaking
				clearTimeout(shakeTimer);
				shakeTimer = setTimeout(() => {
					shakeCount = 0;
				}, 500);
			}
		}
	}
	
	function minimizeAllOthers() {
		// Minimize all windows except this one
		Object.keys(apps.open).forEach((id) => {
			if (id !== app_id && apps.open[id as AppID] && !apps.minimized[id as AppID]) {
				apps.minimized[id as AppID] = true;
				apps.open[id as AppID] = false;
			}
		});
	}

	function onAppDragEnd(data: { offsetX: number; offsetY: number }) {
		apps.is_being_dragged = false;
		
		// Check if should snap to edge
		const x = data.offsetX;
		const screenWidth = window.innerWidth;
		const snapThreshold = 50;
		
		if (x < snapThreshold) {
			snapWindow('left');
		} else if (x > screenWidth - snapThreshold) {
			snapWindow('right');
		}
		
		showSnapPreview = null;
	}
	
	function snapWindow(side: 'left' | 'right') {
		if (!windowEl) return;
		
		// Save current state
		pre_snap_transform = windowEl.style.transform;
		pre_snap_size = {
			width: windowEl.style.width,
			height: windowEl.style.height
		};
		
		dragging_enabled = false;
		is_snapped = side;
		
		// Snap to half screen
		const topOffset = 29; // Below menu bar
		const bottomOffset = 5; // Above dock
		const height = window.innerHeight - topOffset - bottomOffset;
		const width = window.innerWidth / 2;
		
		windowEl.setAttribute('style', `
			position: fixed;
			top: ${topOffset}px;
			left: ${side === 'left' ? 0 : width}px;
			width: ${width}px;
			height: ${height}px;
			z-index: ${apps.z_indices[app_id]};
			border-radius: ${side === 'left' ? '0 0.75rem 0.75rem 0' : '0.75rem 0 0 0.75rem'};
			transition: all 0.3s ease;
		`);
	}
	
	function restoreFromSnap() {
		if (!windowEl || !is_snapped) return;
		
		dragging_enabled = true;
		is_snapped = null;
		
		// Restore previous size and position
		windowEl.setAttribute('style', `
			position: absolute;
			transform: ${pre_snap_transform || 'none'};
			width: ${pre_snap_size?.width || `${+width / remModifier}rem`};
			height: ${pre_snap_size?.height || `${+height / remModifier}rem`};
			z-index: ${apps.z_indices[app_id]};
			border-radius: 0.75rem;
		`);
	}

	onMount(() => {
		windowEl?.focus();
		// Set initial size
		windowEl.style.width = `${+width / remModifier}rem`;
		windowEl.style.height = `${+height / remModifier}rem`;
		
		// Add window open animation
		windowEl.style.opacity = '0';
		windowEl.style.transform = 'scale(0.95)';
		
		requestAnimationFrame(() => {
			if (windowEl) {
				windowEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
				windowEl.style.opacity = '1';
				windowEl.style.transform = 'scale(1)';
				
				setTimeout(() => {
					if (windowEl) {
						windowEl.style.transition = '';
					}
				}, 200);
			}
		});
		
		// If app should open fullscreen (like Drift), maximize it
		if (apps.fullscreen[app_id] && !is_maximized) {
			setTimeout(() => maximizeApp(), 50);
		}
		
		// Add double-click handler to drag handle for maximize/restore
		const dragHandle = windowEl?.querySelector('.app-window-drag-handle');
		if (dragHandle) {
			dragHandle.addEventListener('dblclick', handleTitleBarDoubleClick);
		}
		
		return () => {
			const dragHandle = windowEl?.querySelector('.app-window-drag-handle');
			if (dragHandle) {
				dragHandle.removeEventListener('dblclick', handleTitleBarDoubleClick);
			}
		};
	});
	
	function handleTitleBarDoubleClick() {
		if (is_snapped) {
			restoreFromSnap();
		} else {
			maximizeApp();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:maximized={is_maximized}
	class:minimized={apps.minimized[app_id]}
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	data-app-id={app_id}
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 })),
		disabledComp,
		position({ default: defaultPosition }),
		events({ 
			onDragStart: onAppDragStart, 
			onDrag: onAppDrag,
			onDragEnd: onAppDragEnd 
		}),
	])}
	onclick={focusApp}
	onkeydown={() => {}}
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights {app_id} on_maximize_click={maximizeApp} on_close_app={closeApp} on_minimize_click={minimizeApp} />
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />
</section>

<!-- Snap Preview Overlays -->
{#if showSnapPreview}
	<div class="snap-preview {showSnapPreview}"></div>
{/if}

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height;

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;

		&.active {
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}
	}

	.tl-container {
		position: absolute;
		top: 1rem;
		left: 1rem;

		/* // Necessary, as `.container` tries to apply shadow on it */
		box-shadow: none !important;
	}

	.container.minimized {
		/* Keep visible during animation */
		pointer-events: none;
	}
	
	.container.minimized:not([style*="opacity: 0"]) {
		/* Only hide after animation completes */
		visibility: visible;
	}
	
	.container.minimizing {
		animation: minimizeToIcon 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
		transform-origin: bottom center;
	}
	
	@keyframes minimizeToIcon {
		from {
			transform: translate(0, 0) scale(1, 1);
			opacity: 1;
		}
		to {
			transform: translate(var(--minimize-x), var(--minimize-y)) scale(var(--minimize-scale-x), var(--minimize-scale-y));
			opacity: 0;
		}
	}


	
	:global(.snap-preview) {
		position: fixed;
		top: 29px;
		width: 50%;
		height: calc(100vh - 34px);
		background: rgba(0, 122, 255, 0.2);
		border: 3px solid rgba(0, 122, 255, 0.6);
		pointer-events: none;
		z-index: 99999;
		animation: snapFadeIn 0.2s ease;
	}
	
	:global(.snap-preview.left) {
		left: 0;
		border-radius: 0 12px 12px 0;
		border-left: none;
	}
	
	:global(.snap-preview.right) {
		right: 0;
		border-radius: 12px 0 0 12px;
		border-right: none;
	}
	
	@keyframes snapFadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
