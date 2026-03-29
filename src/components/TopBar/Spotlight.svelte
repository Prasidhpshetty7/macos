<script lang="ts">
	let isOpen = $state(false);
	let searchQuery = $state('');
	
	function toggleSpotlight() {
		isOpen = !isOpen;
		if (isOpen) {
			setTimeout(() => {
				document.getElementById('spotlight-input')?.focus();
			}, 50);
		}
	}
	
	function closeSpotlight() {
		isOpen = false;
		searchQuery = '';
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeSpotlight();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<button class="spotlight-btn" onclick={toggleSpotlight} aria-label="Spotlight Search">
	<svg viewBox="0 0 24 24" fill="currentColor">
		<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
	</svg>
</button>

{#if isOpen}
	<div class="spotlight-overlay" onclick={closeSpotlight}>
		<div class="spotlight-window" onclick={(e) => e.stopPropagation()}>
			<div class="spotlight-search">
				<svg class="spotlight-search-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
				</svg>
				<input 
					id="spotlight-input"
					type="text" 
					placeholder="Spotlight Search" 
					bind:value={searchQuery}
				/>
			</div>
			
			{#if searchQuery.trim()}
				<div class="spotlight-results">
					<div class="spotlight-section">
						<div class="spotlight-section-title">Top Hit</div>
						<div class="spotlight-item">
							<svg class="spotlight-item-icon" viewBox="0 0 24 24" fill="#007aff">
								<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
							</svg>
							<div class="spotlight-item-info">
								<div class="spotlight-item-name">{searchQuery}</div>
								<div class="spotlight-item-path">Application</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="spotlight-empty">
					<div class="spotlight-hint">Search your Mac and the web</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.spotlight-btn {
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
	}
	
	.spotlight-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
	}
	
	.spotlight-btn svg {
		width: 16px;
		height: 16px;
	}
	
	.spotlight-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 99999;
		display: flex;
		justify-content: center;
		padding-top: 120px;
		backdrop-filter: blur(8px);
	}
	
	.spotlight-window {
		width: 680px;
		max-height: 600px;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(40px);
		border-radius: 16px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		animation: spotlightAppear 0.3s ease;
	}
	
	@keyframes spotlightAppear {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	
	.spotlight-search {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.spotlight-search-icon {
		width: 24px;
		height: 24px;
		opacity: 0.5;
		flex-shrink: 0;
	}
	
	.spotlight-search input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: #fff;
		font-size: 24px;
		font-weight: 300;
	}
	
	.spotlight-search input::placeholder {
		color: rgba(255, 255, 255, 0.3);
	}
	
	.spotlight-results {
		max-height: 500px;
		overflow-y: auto;
	}
	
	.spotlight-section {
		padding: 12px 0;
	}
	
	.spotlight-section-title {
		padding: 8px 20px;
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.spotlight-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 20px;
		cursor: pointer;
		transition: background 0.15s;
	}
	
	.spotlight-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	
	.spotlight-item-icon {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
	}
	
	.spotlight-item-info {
		flex: 1;
	}
	
	.spotlight-item-name {
		font-size: 14px;
		color: #fff;
		font-weight: 500;
		margin-bottom: 2px;
	}
	
	.spotlight-item-path {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
	}
	
	.spotlight-empty {
		padding: 60px 20px;
		text-align: center;
	}
	
	.spotlight-hint {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.4);
	}
</style>
