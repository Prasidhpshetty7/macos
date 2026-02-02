<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte';
	
	let selectedSection = $state<string | null>(null);
	
	const settingsCategories = [
		{
			title: '',
			items: [
				{ id: 'wifi', name: 'Wi-Fi', icon: '📶', color: '#007AFF' },
				{ id: 'bluetooth', name: 'Bluetooth', icon: '🔵', color: '#007AFF' },
				{ id: 'network', name: 'Network', icon: '🌐', color: '#34C759' },
			]
		},
		{
			title: '',
			items: [
				{ id: 'notifications', name: 'Notifications', icon: '🔔', color: '#FF3B30' },
				{ id: 'sound', name: 'Sound', icon: '🔊', color: '#FF3B30' },
				{ id: 'focus', name: 'Focus', icon: '🌙', color: '#5E5CE6' },
			]
		},
		{
			title: '',
			items: [
				{ id: 'appearance', name: 'Appearance', icon: '🎨', color: '#FF9500' },
				{ id: 'accessibility', name: 'Accessibility', icon: '♿', color: '#007AFF' },
				{ id: 'control-center', name: 'Control Center', icon: '⚙️', color: '#8E8E93' },
			]
		},
		{
			title: '',
			items: [
				{ id: 'siri', name: 'Siri & Spotlight', icon: '🎤', color: '#5E5CE6' },
				{ id: 'privacy', name: 'Privacy & Security', icon: '🔒', color: '#007AFF' },
			]
		},
		{
			title: '',
			items: [
				{ id: 'desktop', name: 'Desktop & Dock', icon: '🖥️', color: '#007AFF' },
				{ id: 'displays', name: 'Displays', icon: '📺', color: '#007AFF' },
				{ id: 'wallpaper', name: 'Wallpaper', icon: '🖼️', color: '#FF9500' },
			]
		},
		{
			title: '',
			items: [
				{ id: 'battery', name: 'Battery', icon: '🔋', color: '#34C759' },
				{ id: 'lock-screen', name: 'Lock Screen', icon: '🔐', color: '#FF3B30' },
			]
		},
	];
</script>

<section class="system-settings">
	{#if !selectedSection}
		<!-- Main grid view -->
		<div class="settings-header">
			<h1>System Settings</h1>
			<div class="search-box">
				<span class="search-icon">🔍</span>
				<input type="text" placeholder="Search" />
			</div>
		</div>
		
		<div class="settings-grid">
			{#each settingsCategories as category}
				<div class="category-section">
					{#if category.title}
						<h2 class="category-title">{category.title}</h2>
					{/if}
					<div class="settings-items">
						{#each category.items as item}
							<button 
								class="setting-card"
								onclick={() => selectedSection = item.id}
							>
								<div class="setting-icon" style="background: {item.color}">
									<span>{item.icon}</span>
								</div>
								<span class="setting-name">{item.name}</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Detail view -->
		<div class="settings-detail">
			<button class="back-button" onclick={() => selectedSection = null}>
				← Back
			</button>
			
			{#if selectedSection === 'appearance'}
				<div class="detail-content">
					<h2>Appearance</h2>
					<div class="setting-group">
						<label class="setting-label">Appearance</label>
						<div class="appearance-options">
							<button 
								class="appearance-btn"
								class:active={preferences.theme.scheme === 'light'}
								onclick={() => preferences.theme.scheme = 'light'}
							>
								<div class="preview light-preview">☀️</div>
								<span>Light</span>
							</button>
							<button 
								class="appearance-btn"
								class:active={preferences.theme.scheme === 'dark'}
								onclick={() => preferences.theme.scheme = 'dark'}
							>
								<div class="preview dark-preview">🌙</div>
								<span>Dark</span>
							</button>
							<button class="appearance-btn">
								<div class="preview auto-preview">⚙️</div>
								<span>Auto</span>
							</button>
						</div>
					</div>
					
					<div class="setting-group">
						<label class="setting-label">
							<input 
								type="checkbox" 
								checked={preferences.reduced_motion}
								onchange={(e) => preferences.reduced_motion = e.currentTarget.checked}
							/>
							Reduce motion
						</label>
						<p class="setting-description">Reduce the motion of user interface elements</p>
					</div>
				</div>
			{:else if selectedSection === 'desktop'}
				<div class="detail-content">
					<h2>Desktop & Dock</h2>
					<div class="setting-group">
						<label class="setting-label">Dock Settings</label>
						<p class="setting-description">Customize your dock appearance and behavior</p>
					</div>
				</div>
			{:else if selectedSection === 'displays'}
				<div class="detail-content">
					<h2>Displays</h2>
					<div class="setting-group">
						<label class="setting-label">Display Settings</label>
						<p class="setting-description">Adjust your display resolution and arrangement</p>
					</div>
				</div>
			{:else if selectedSection === 'wallpaper'}
				<div class="detail-content">
					<h2>Wallpaper</h2>
					<div class="setting-group">
						<label class="setting-label">Desktop Wallpaper</label>
						<p class="setting-description">Choose a wallpaper for your desktop</p>
					</div>
				</div>
			{:else}
				<div class="detail-content">
					<h2>{settingsCategories.flatMap(c => c.items).find(i => i.id === selectedSection)?.name}</h2>
					<p class="setting-description">Settings for this section coming soon...</p>
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	.system-settings {
		height: 100%;
		background: #f5f5f7;
		overflow-y: auto;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
	}
	
	.settings-header {
		padding: 32px 40px 24px;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		position: sticky;
		top: 0;
		z-index: 10;
	}
	
	.settings-header h1 {
		font-size: 32px;
		font-weight: 700;
		margin: 0 0 16px 0;
		color: #1d1d1f;
	}
	
	.search-box {
		position: relative;
		max-width: 400px;
	}
	
	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 14px;
		opacity: 0.5;
	}
	
	.search-box input {
		width: 100%;
		padding: 8px 12px 8px 36px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		font-size: 14px;
		transition: all 0.2s;
	}
	
	.search-box input:focus {
		outline: none;
		border-color: #007aff;
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
	}
	
	.settings-grid {
		padding: 24px 40px;
	}
	
	.category-section {
		margin-bottom: 32px;
	}
	
	.category-title {
		font-size: 13px;
		font-weight: 600;
		color: #86868b;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin: 0 0 12px 0;
	}
	
	.settings-items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 16px;
	}
	
	.setting-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 20px 16px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}
	
	.setting-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: rgba(0, 0, 0, 0.12);
	}
	
	.setting-icon {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
	
	.setting-name {
		font-size: 13px;
		font-weight: 500;
		color: #1d1d1f;
		text-align: center;
	}
	
	/* Detail view */
	.settings-detail {
		padding: 24px 40px;
	}
	
	.back-button {
		background: none;
		border: none;
		color: #007aff;
		font-size: 14px;
		cursor: pointer;
		padding: 8px 0;
		margin-bottom: 16px;
	}
	
	.back-button:hover {
		text-decoration: underline;
	}
	
	.detail-content h2 {
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 24px 0;
		color: #1d1d1f;
	}
	
	.setting-group {
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 16px;
	}
	
	.setting-label {
		font-size: 14px;
		font-weight: 600;
		color: #1d1d1f;
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	
	.setting-description {
		font-size: 13px;
		color: #86868b;
		margin: 8px 0 0 0;
	}
	
	.appearance-options {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}
	
	.appearance-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px;
		background: #f5f5f7;
		border: 2px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.appearance-btn:hover {
		background: #e8e8ed;
	}
	
	.appearance-btn.active {
		border-color: #007aff;
		background: rgba(0, 122, 255, 0.05);
	}
	
	.preview {
		width: 60px;
		height: 40px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
	}
	
	.light-preview {
		background: linear-gradient(180deg, #fff 0%, #f5f5f7 100%);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}
	
	.dark-preview {
		background: linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%);
	}
	
	.auto-preview {
		background: linear-gradient(90deg, #fff 0%, #fff 50%, #2c2c2e 50%, #2c2c2e 100%);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}
	
	.appearance-btn span {
		font-size: 12px;
		font-weight: 500;
		color: #1d1d1f;
	}
</style>
