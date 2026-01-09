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

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);
	let minimized_transform = $state<string>();

	let windowEl = $state<HTMLElement>();

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
		apps.open[app_id] = false;
		apps.running[app_id] = false;
		apps.fullscreen[app_id] = false;
		apps.minimized[app_id] = false;
	}

	function minimizeApp() {
		// Hide the window but keep it mounted (for iframe state preservation)
		apps.open[app_id] = false;
		apps.minimized[app_id] = true;
		// apps.running stays true
	}

	function onAppDragStart() {
		// If maximized, restore window when user starts dragging
		if (is_maximized) {
			maximizeApp(); // This will restore it
		}
		focusApp();
		apps.is_being_dragged = true;
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}

	onMount(() => {
		windowEl?.focus();
		// Set initial size
		windowEl.style.width = `${+width / remModifier}rem`;
		windowEl.style.height = `${+height / remModifier}rem`;
	});
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
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 })),
		disabledComp,
		position({ default: defaultPosition }),
		events({ onDragStart: onAppDragStart, onDragEnd: onAppDragEnd }),
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
		visibility: hidden;
		pointer-events: none;
		opacity: 0;
	}
</style>
