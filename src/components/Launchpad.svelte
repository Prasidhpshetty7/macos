<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { launchpadState } from '🍎/state/launchpad.svelte.ts';
	
	let searchQuery = $state('');
	let searchInputEl = $state<HTMLInputElement>();
	
	// Get all apps including external ones, sorted alphabetically (exclude Launchpad itself)
	const allApps = Object.entries(apps_config)
		.filter(([id]) => id !== 'launchpad')
		.map(([id, config]) => ({
			id: id as AppID,
			title: config.title,
			isExternal: config.should_open_window === false && config.external_action !== undefined,
			externalAction: config.external_action,
		}))
		.sort((a, b) => a.title.localeCompare(b.title));
	
	// Filter apps based on search
	const filteredApps = $derived(
		searchQuery.trim() === '' 
			? allApps 
			: allApps.filter(app => 
				app.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);
	
	function openApp(app: typeof allApps[0]) {
		if (app.isExternal && app.externalAction) {
			// External apps like GitHub, Vercel
			app.externalAction(new MouseEvent('click'));
		} else {
			// Regular apps
			apps.open[app.id] = true;
			apps.running[app.id] = true;
			apps.minimized[app.id] = false;
			apps.active = app.id;
			
			// Drift opens maximized
			if (app.id === 'drift') {
				apps.fullscreen[app.id] = true;
			}
		}
		
		searchQuery = '';
		launchpadState.isOpen = false;
	}
	
	function closeLaunchpad() {
		searchQuery = '';
		launchpadState.isOpen = false;
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && launchpadState.isOpen) {
			searchQuery = '';
			launchpadState.isOpen = false;
		}
	}
	
	// Focus search input when launchpad opens
	$effect(() => {
		if (launchpadState.isOpen && searchInputEl) {
			setTimeout(() => searchInputEl?.focus(), 100);
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if launchpadState.isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="launchpad-overlay" onclick={closeLaunchpad}>
		<div class="launchpad-content" onclick={(e) => e.stopPropagation()}>
			<div class="launchpad-header">
				<div class="search-container">
					<svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
					</svg>
					<input 
						type="text" 
						placeholder="Search" 
						class="search-input"
						bind:this={searchInputEl}
						bind:value={searchQuery}
					/>
				</div>
			</div>
			<div class="apps-grid">
				{#each filteredApps as app}
					<button class="app-item" onclick={() => openApp(app)}>
						<div class="app-icon">
							<img 
								src="/app-icons/{app.id}/256.webp" 
								alt={app.title}
								onerror={(e) => { e.currentTarget.src = `/app-icons/${app.id}/256.png`; }}
							/>
						</div>
						<span class="app-name">{app.title}</span>
						{#if app.isExternal}
							<span class="external-badge">↗</span>
						{/if}
					</button>
				{/each}
				{#if filteredApps.length === 0}
					<div class="no-results">
						<span class="no-results-icon">🔍</span>
						<span class="no-results-text">No apps found for "{searchQuery}"</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.launchpad-overlay {
		position: fixed;
		inset: 0;
		z-index: 9998;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(30px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.3s ease;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.launchpad-content {
		width: 90%;
		max-width: 900px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		gap: 30px;
		animation: scaleIn 0.3s ease;
	}
	
	@keyframes scaleIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
	
	.launchpad-header {
		display: flex;
		justify-content: center;
	}
	
	.search-container {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 240px;
		padding: 8px 14px;
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		transition: all 0.2s;
	}
	
	.search-container:focus-within {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.35);
		width: 280px;
	}
	
	.search-icon {
		width: 16px;
		height: 16px;
		color: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 14px;
		outline: none;
	}
	
	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
	
	.apps-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 30px;
		justify-items: center;
		overflow-y: auto;
		padding: 20px;
	}
	
	.app-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 10px;
		border-radius: 12px;
		transition: all 0.2s ease;
		width: 90px;
		position: relative;
	}
	
	.app-item:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: scale(1.05);
	}
	
	.app-item:active {
		transform: scale(0.95);
	}
	
	.app-icon {
		width: 64px;
		height: 64px;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}
	
	.app-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.app-name {
		color: #fff;
		font-size: 12px;
		text-align: center;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.external-badge {
		position: absolute;
		top: 8px;
		right: 8px;
		font-size: 10px;
		color: rgba(255, 255, 255, 0.6);
		background: rgba(0, 0, 0, 0.3);
		padding: 2px 4px;
		border-radius: 4px;
	}
	
	.no-results {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 40px;
		color: rgba(255, 255, 255, 0.6);
	}
	
	.no-results-icon {
		font-size: 48px;
		opacity: 0.5;
	}
	
	.no-results-text {
		font-size: 14px;
	}
</style>
