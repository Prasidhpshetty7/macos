<script lang="ts">
	import { system, toggleDarkMode } from '🍎/state/system.svelte';
	
	let isOpen = $state(false);
	
	function toggleControlCenter() {
		isOpen = !isOpen;
	}
	
	function closeControlCenter() {
		isOpen = false;
	}
</script>

<svelte:window onclick={closeControlCenter} />

<button class="control-center-btn" onclick={(e) => { e.stopPropagation(); toggleControlCenter(); }} aria-label="Control Center">
	<svg viewBox="0 0 24 24" fill="currentColor">
		<path d="M3 9h4V5H3v4zm0 5h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zM8 9h4V5H8v4zm5-4v4h4V5h-4zm5 9h4v-4h-4v4zM3 19h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zm5 0h4v-4h-4v4zm0-14v4h4V5h-4z"/>
	</svg>
</button>

{#if isOpen}
	<div class="control-center-panel" onclick={(e) => e.stopPropagation()}>
		<div class="cc-grid">
			<!-- WiFi -->
			<button class="cc-tile large" class:active={system.wifi}>
				<div class="cc-tile-header">
					<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
					</svg>
					<span class="cc-label">Wi-Fi</span>
				</div>
				<div class="cc-detail">Home Network</div>
			</button>
			
			<!-- Bluetooth -->
			<button class="cc-tile large" class:active={system.bluetooth}>
				<div class="cc-tile-header">
					<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
					</svg>
					<span class="cc-label">Bluetooth</span>
				</div>
				<div class="cc-detail">On</div>
			</button>
			
			<!-- AirDrop -->
			<button class="cc-tile large">
				<div class="cc-tile-header">
					<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
					</svg>
					<span class="cc-label">AirDrop</span>
				</div>
				<div class="cc-detail">Contacts Only</div>
			</button>
			
			<!-- Do Not Disturb -->
			<button class="cc-tile">
				<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
				</svg>
				<span class="cc-label-small">Focus</span>
			</button>
			
			<!-- Screen Mirroring -->
			<button class="cc-tile">
				<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
				</svg>
				<span class="cc-label-small">Display</span>
			</button>
			
			<!-- Sound -->
			<button class="cc-tile">
				<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
				</svg>
				<span class="cc-label-small">Sound</span>
			</button>
			
			<!-- Dark Mode Toggle -->
			<button class="cc-tile" class:active={system.darkMode} onclick={toggleDarkMode}>
				<svg class="cc-icon" viewBox="0 0 24 24" fill="currentColor">
					{#if system.darkMode}
						<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
					{:else}
						<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
					{/if}
				</svg>
				<span class="cc-label-small">{system.darkMode ? 'Dark' : 'Light'}</span>
			</button>
		</div>
		
		<!-- Brightness & Volume Sliders -->
		<div class="cc-sliders">
			<div class="cc-slider-row">
				<svg class="cc-slider-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
				</svg>
				<input type="range" min="0" max="100" value="75" class="cc-slider" />
			</div>
			
			<div class="cc-slider-row">
				<svg class="cc-slider-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
				</svg>
				<input type="range" min="0" max="100" value="60" class="cc-slider" />
			</div>
		</div>
	</div>
{/if}

<style>
	.control-center-panel {
		position: fixed;
		top: 32px;
		right: 8px;
		width: 340px;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(40px);
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
		z-index: 99998;
		animation: ccAppear 0.2s ease;
	}
	
	@keyframes ccAppear {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.cc-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 16px;
	}
	
	.cc-tile {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 12px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: left;
	}
	
	.cc-tile.large {
		grid-column: span 1;
	}
	
	.cc-tile:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	
	.cc-tile.active {
		background: #007aff;
		border-color: #007aff;
	}
	
	.cc-tile-header {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.cc-icon {
		width: 20px;
		height: 20px;
		color: #fff;
	}
	
	.cc-label {
		font-size: 14px;
		font-weight: 600;
		color: #fff;
	}
	
	.cc-label-small {
		font-size: 13px;
		font-weight: 500;
		color: #fff;
	}
	
	.cc-detail {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.6);
		margin-top: 4px;
	}
	
	.cc-sliders {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.cc-slider-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 12px;
	}
	
	.cc-slider-icon {
		width: 20px;
		height: 20px;
		color: #fff;
		flex-shrink: 0;
	}
	
	.cc-slider {
		flex: 1;
		height: 4px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.2);
		outline: none;
		-webkit-appearance: none;
	}
	
	.cc-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}
	
	.cc-slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}
</style>
