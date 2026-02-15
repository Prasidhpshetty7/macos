<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte';
	
	let selectedSection = $state('appearance');
	
	const sections = [
		// Network & Connectivity
		{ id: 'wifi', name: 'Wi-Fi', icon: 'wifi', color: '#007AFF' },
		{ id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', color: '#007AFF' },
		{ id: 'network', name: 'Network', icon: 'network', color: '#34C759' },
		{ id: 'vpn', name: 'VPN', icon: 'vpn', color: '#007AFF' },
		
		// System
		{ id: 'notifications', name: 'Notifications', icon: 'notifications', color: '#FF3B30' },
		{ id: 'sound', name: 'Sound', icon: 'sound', color: '#FF3B30' },
		{ id: 'focus', name: 'Focus', icon: 'focus', color: '#5E5CE6' },
		{ id: 'screen-time', name: 'Screen Time', icon: 'screentime', color: '#5E5CE6' },
		{ id: 'general', name: 'General', icon: 'general', color: '#8E8E93' },
		{ id: 'appearance', name: 'Appearance', icon: 'appearance', color: '#FF9500' },
		{ id: 'accessibility', name: 'Accessibility', icon: 'accessibility', color: '#007AFF' },
		{ id: 'control-center', name: 'Control Center', icon: 'controlcenter', color: '#8E8E93' },
		{ id: 'siri', name: 'Siri & Spotlight', icon: 'siri', color: '#5E5CE6' },
		{ id: 'privacy', name: 'Privacy & Security', icon: 'privacy', color: '#007AFF' },
		
		// Desktop & Display
		{ id: 'desktop', name: 'Desktop & Dock', icon: 'desktop', color: '#007AFF' },
		{ id: 'displays', name: 'Displays', icon: 'displays', color: '#007AFF' },
		{ id: 'wallpaper', name: 'Wallpaper', icon: 'wallpaper', color: '#FF9500' },
		{ id: 'screen-saver', name: 'Screen Saver', icon: 'screensaver', color: '#34C759' },
		{ id: 'battery', name: 'Battery', icon: 'battery', color: '#34C759' },
		
		// Security
		{ id: 'lock-screen', name: 'Lock Screen', icon: 'lockscreen', color: '#8E8E93' },
		{ id: 'touch-id', name: 'Touch ID & Password', icon: 'touchid', color: '#FF3B30' },
		{ id: 'users', name: 'Users & Groups', icon: 'users', color: '#007AFF' },
		{ id: 'passwords', name: 'Passwords', icon: 'passwords', color: '#007AFF' },
		
		// Accounts
		{ id: 'internet-accounts', name: 'Internet Accounts', icon: 'accounts', color: '#007AFF' },
		{ id: 'game-center', name: 'Game Center', icon: 'gamecenter', color: '#34C759' },
		{ id: 'wallet', name: 'Wallet & Apple Pay', icon: 'wallet', color: '#1D1D1F' },
		
		// Input Devices
		{ id: 'keyboard', name: 'Keyboard', icon: 'keyboard', color: '#007AFF' },
		{ id: 'trackpad', name: 'Trackpad', icon: 'trackpad', color: '#007AFF' },
		{ id: 'mouse', name: 'Mouse', icon: 'mouse', color: '#007AFF' },
		{ id: 'printers', name: 'Printers & Scanners', icon: 'printers', color: '#8E8E93' },
	];
	
	function getIcon(iconName: string) {
		const icons: Record<string, string> = {
			wifi: '<path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-2.2 0-4 1.8-4 4h2c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.2-1.8-4-4-4zm0-4c-3.3 0-6 2.7-6 6h2c0-2.2 1.8-4 4-4s4 1.8 4 4h2c0-3.3-2.7-6-6-6zm0-4C7.6 6 4 9.6 4 14h2c0-3.3 2.7-6 6-6s6 2.7 6 6h2c0-4.4-3.6-8-8-8z"/>',
			bluetooth: '<path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>',
			network: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
			vpn: '<path d="M12.65 10C11.7 7.31 8.9 5.5 5.77 6.12c-2.29.46-4.15 2.29-4.63 4.58C.32 14.57 3.26 18 7 18c2.61 0 4.83-1.67 5.65-4H17v2c0 1.1.9 2 2 2s2-.9 2-2v-2c1.1 0 2-.9 2-2s-.9-2-2-2h-8.35zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
			notifications: '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>',
			sound: '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>',
			focus: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
			screentime: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
			battery: '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>',
			general: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
			accessibility: '<path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>',
			controlcenter: '<path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>',
			appearance: '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
			siri: '<path d="M12 1c1.27 0 2.42.45 3.33 1.21l-1.42 1.42C13.29 3.23 12.68 3 12 3c-2.21 0-4 1.79-4 4 0 .68.23 1.29.63 1.91l-1.42 1.42C6.45 9.42 6 8.27 6 7c0-3.31 2.69-6 6-6zm0 22c-1.27 0-2.42-.45-3.33-1.21l1.42-1.42c.62.4 1.23.63 1.91.63 2.21 0 4-1.79 4-4 0-.68-.23-1.29-.63-1.91l1.42-1.42c.76.91 1.21 2.06 1.21 3.33 0 3.31-2.69 6-6 6z"/>',
			privacy: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
			desktop: '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>',
			displays: '<path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>',
			wallpaper: '<path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>',
			screensaver: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>',
			lockscreen: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
			touchid: '<path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28z"/>',
			users: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
			passwords: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
			accounts: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
			gamecenter: '<path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>',
			wallet: '<path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
			keyboard: '<path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>',
			trackpad: '<path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/>',
			mouse: '<path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/>',
			printers: '<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>',
		};
		return icons[iconName] || icons.general;
	}
</script>


<section class="system-settings">
	<!-- Drag handle area for traffic lights -->
	<div class="drag-handle app-window-drag-handle"></div>
	
	<div class="sidebar">
		<div class="search-bar">
			<span class="search-icon">🔍</span>
			<input type="text" placeholder="Search" />
		</div>
		
		<div class="user-profile">
			<div class="avatar">👤</div>
			<div class="user-info">
				<div class="user-name">Prasidh P Shetty</div>
				<div class="user-account">Apple Account</div>
			</div>
		</div>
		
		<div class="sections">
			{#each sections as section}
				<button 
					class="section-item"
					class:active={selectedSection === section.id}
					onclick={() => selectedSection = section.id}
				>
					<div class="section-icon" style="background: {section.color}">
						<svg viewBox="0 0 24 24" fill="white">
							{@html getIcon(section.icon)}
						</svg>
					</div>
					<span class="section-name">{section.name}</span>
				</button>
			{/each}
		</div>
	</div>
	
	<div class="content">
		<div class="content-header">
			<button class="nav-btn">‹</button>
			<button class="nav-btn">›</button>
			<h2>{sections.find(s => s.id === selectedSection)?.name}</h2>
		</div>
		
		<div class="content-body">
			{#if selectedSection === 'appearance'}
				<div class="setting-section">
					<h3>Appearance</h3>
					<div class="appearance-options">
						<button 
							class="appearance-card"
							class:active={preferences.theme.scheme === 'light'}
							onclick={() => preferences.theme.scheme = 'light'}
						>
							<div class="appearance-preview light-preview">
								<div class="preview-bar"></div>
								<div class="preview-content"></div>
							</div>
							<span>Light</span>
						</button>
						<button 
							class="appearance-card"
							class:active={preferences.theme.scheme === 'dark'}
							onclick={() => preferences.theme.scheme = 'dark'}
						>
							<div class="appearance-preview dark-preview">
								<div class="preview-bar"></div>
								<div class="preview-content"></div>
							</div>
							<span>Dark</span>
						</button>
						<button class="appearance-card">
							<div class="appearance-preview auto-preview">
								<div class="preview-bar"></div>
								<div class="preview-content"></div>
							</div>
							<span>Auto</span>
						</button>
					</div>
				</div>
				
				<div class="setting-section">
					<h3>Accent Color</h3>
					<div class="color-options">
						<button class="color-btn multicolor">🌈</button>
						<button class="color-btn" style="background: #007AFF"></button>
						<button class="color-btn" style="background: #5E5CE6"></button>
						<button class="color-btn" style="background: #FF2D55"></button>
						<button class="color-btn" style="background: #FF3B30"></button>
						<button class="color-btn" style="background: #FF9500"></button>
						<button class="color-btn" style="background: #FFCC00"></button>
						<button class="color-btn" style="background: #34C759"></button>
						<button class="color-btn" style="background: #8E8E93"></button>
					</div>
				</div>
				
				<div class="setting-section">
					<h3>Sidebar Icon Size</h3>
					<div class="dropdown">
						<select>
							<option>Small</option>
							<option selected>Medium</option>
							<option>Large</option>
						</select>
					</div>
				</div>
				
				<div class="setting-section">
					<label class="checkbox-label">
						<input 
							type="checkbox" 
							checked={preferences.reduced_motion}
							onchange={(e) => preferences.reduced_motion = e.currentTarget.checked}
						/>
						<span>Reduce motion</span>
					</label>
				</div>
			{:else}
				<div class="setting-section">
					<p class="description">Settings for {sections.find(s => s.id === selectedSection)?.name} coming soon...</p>
				</div>
			{/if}
		</div>
	</div>
</section>


<style>
	.system-settings {
		display: flex;
		height: 100%;
		background: #f5f5f7;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
		position: relative;
	}
	
	.drag-handle {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 52px;
		z-index: 1;
		pointer-events: auto;
	}
	
	.sidebar {
		width: 280px;
		background: rgba(242, 242, 247, 0.95);
		backdrop-filter: blur(20px);
		border-right: 1px solid rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding-top: 52px;
	}
	
	.search-bar {
		padding: 12px 16px;
		position: relative;
	}
	
	.search-icon {
		position: absolute;
		left: 28px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 13px;
		opacity: 0.5;
	}
	
	.search-bar input {
		width: 100%;
		padding: 6px 12px 6px 32px;
		border: none;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.8);
		font-size: 13px;
	}
	
	.search-bar input:focus {
		outline: none;
		background: white;
	}
	
	.user-profile {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		margin: 8px 12px;
		background: white;
		border-radius: 10px;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.user-profile:hover {
		background: rgba(255, 255, 255, 0.8);
	}
	
	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
	}
	
	.user-info {
		flex: 1;
	}
	
	.user-name {
		font-size: 14px;
		font-weight: 600;
		color: #1d1d1f;
	}
	
	.user-account {
		font-size: 12px;
		color: #86868b;
	}
	
	.sections {
		flex: 1;
		padding: 8px 12px;
	}
	
	.section-item {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		border-radius: 8px;
		cursor: pointer;
		font-size: 13px;
		color: #1d1d1f;
		transition: background 0.15s;
		text-align: left;
		margin-bottom: 2px;
	}
	
	.section-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	
	.section-item.active {
		background: rgba(0, 122, 255, 0.15);
		color: #007aff;
	}
	
	.section-icon {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.section-icon svg {
		width: 16px;
		height: 16px;
	}
	
	.section-name {
		flex: 1;
	}
	
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: white;
		padding-top: 52px;
	}
	
	.content-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 24px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}
	
	.nav-btn {
		width: 28px;
		height: 28px;
		border: none;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 6px;
		cursor: pointer;
		font-size: 18px;
		color: #86868b;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.nav-btn:hover {
		background: rgba(0, 0, 0, 0.08);
	}
	
	.content-header h2 {
		font-size: 20px;
		font-weight: 600;
		margin: 0;
		color: #1d1d1f;
	}
	
	.content-body {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
	}
	
	.setting-section {
		margin-bottom: 32px;
	}
	
	.setting-section h3 {
		font-size: 14px;
		font-weight: 600;
		color: #1d1d1f;
		margin: 0 0 12px 0;
	}
	
	.description {
		font-size: 13px;
		color: #86868b;
		margin: 0;
	}
	
	.appearance-options {
		display: flex;
		gap: 16px;
	}
	
	.appearance-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 12px;
		background: #f5f5f7;
		border: 2px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.appearance-card:hover {
		background: #e8e8ed;
	}
	
	.appearance-card.active {
		border-color: #007aff;
		background: rgba(0, 122, 255, 0.05);
	}
	
	.appearance-preview {
		width: 100%;
		height: 80px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}
	
	.preview-bar {
		height: 20px;
		background: rgba(0, 0, 0, 0.05);
	}
	
	.preview-content {
		height: 60px;
		background: rgba(0, 0, 0, 0.02);
	}
	
	.light-preview {
		background: white;
	}
	
	.light-preview .preview-bar {
		background: #f5f5f7;
	}
	
	.dark-preview {
		background: #1c1c1e;
		border-color: #2c2c2e;
	}
	
	.dark-preview .preview-bar {
		background: #2c2c2e;
	}
	
	.dark-preview .preview-content {
		background: #1c1c1e;
	}
	
	.auto-preview {
		background: linear-gradient(90deg, white 0%, white 50%, #1c1c1e 50%, #1c1c1e 100%);
	}
	
	.appearance-card span {
		font-size: 13px;
		font-weight: 500;
		color: #1d1d1f;
	}
	
	.color-options {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	
	.color-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.color-btn:hover {
		transform: scale(1.1);
	}
	
	.color-btn.multicolor {
		background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dropdown select {
		padding: 6px 32px 6px 12px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 6px;
		background: white;
		font-size: 13px;
		cursor: pointer;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #1d1d1f;
		cursor: pointer;
	}
	
	.checkbox-label input {
		cursor: pointer;
	}
</style>
