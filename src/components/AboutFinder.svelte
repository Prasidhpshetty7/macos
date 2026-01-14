<script lang="ts">
	import { showAboutFinder, closeAboutFinder } from '🍎/state/system.svelte.ts';
</script>

{#if showAboutFinder.value}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={closeAboutFinder}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="about-finder" onclick={(e) => e.stopPropagation()}>
			<div class="icon">
				<img src="/app-icons/finder/256.webp" alt="Finder" onerror={(e) => { e.currentTarget.src = '/app-icons/finder/256.png'; }} />
			</div>
			<div class="title">Finder</div>
			<div class="version">Version 13.0</div>
			<div class="copyright">
				Copyright © 1983-2024 Apple Inc.<br>
				All rights reserved.
			</div>
			<button class="ok-btn" onclick={closeAboutFinder}>OK</button>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 99998;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(2px);
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.about-finder {
		background: linear-gradient(180deg, #f5f5f7 0%, #e8e8ea 100%);
		border-radius: 12px;
		padding: 24px 40px;
		text-align: center;
		box-shadow: 
			0 20px 60px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		min-width: 280px;
		animation: slideIn 0.2s ease;
	}

	@keyframes slideIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}

	.icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 12px;
	}

	.icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.title {
		font-size: 18px;
		font-weight: 600;
		color: #1d1d1f;
		margin-bottom: 4px;
	}

	.version {
		font-size: 11px;
		color: #86868b;
		margin-bottom: 16px;
	}

	.copyright {
		font-size: 10px;
		color: #86868b;
		line-height: 1.5;
		margin-bottom: 20px;
	}

	.ok-btn {
		padding: 6px 32px;
		background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%);
		border: 1px solid #c7c7c7;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		color: #333;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.ok-btn:hover {
		background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
	}

	.ok-btn:active {
		background: #e0e0e0;
	}
</style>
