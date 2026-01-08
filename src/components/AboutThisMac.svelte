<script lang="ts">
	import { showAboutMac, closeAboutMac } from '🍎/state/system.svelte.ts';
	
	let activeTab = $state('overview');
	let isUpdating = $state(false);
	let updateProgress = $state(0);
	let updateComplete = $state(false);
	let showSystemReport = $state(false);
	let showManageStorage = $state(false);
	
	function checkForUpdates() {
		isUpdating = true;
		updateProgress = 0;
		updateComplete = false;
		
		const interval = setInterval(() => {
			updateProgress += Math.random() * 15;
			if (updateProgress >= 100) {
				updateProgress = 100;
				clearInterval(interval);
				setTimeout(() => {
					isUpdating = false;
					updateComplete = true;
				}, 500);
			}
		}, 300);
	}
	
	function openSystemReport() {
		showSystemReport = true;
	}
	
	function openManageStorage() {
		showManageStorage = true;
	}
</script>

{#if showAboutMac.value}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={closeAboutMac}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="about-window" onclick={(e) => e.stopPropagation()}>
			<!-- Traffic Lights -->
			<div class="window-controls">
				<button class="control close" onclick={closeAboutMac} aria-label="Close">
					<svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
				</button>
				<button class="control minimize" aria-label="Minimize">
					<svg viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
				</button>
				<button class="control maximize" aria-label="Maximize">
					<svg viewBox="0 0 12 12"><path d="M2 2h8v8H2z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
				</button>
			</div>
			
			<!-- Tabs -->
			<div class="tabs">
				<button class="tab" class:active={activeTab === 'overview'} onclick={() => activeTab = 'overview'}>Overview</button>
				<button class="tab" class:active={activeTab === 'displays'} onclick={() => activeTab = 'displays'}>Displays</button>
				<button class="tab" class:active={activeTab === 'storage'} onclick={() => activeTab = 'storage'}>Storage</button>
				<button class="tab" class:active={activeTab === 'support'} onclick={() => activeTab = 'support'}>Support</button>
			</div>
			
			<!-- Content -->
			<div class="content">
				<!-- Overview Tab -->
				{#if activeTab === 'overview'}
					<div class="overview-layout">
						<div class="left-section">
							<div class="preview-circle">
								<img src="/purus-profile/pexels-ahmedadly-1270184.jpg" alt="Profile" />
							</div>
						</div>
						
						<div class="right-section">
							<div class="os-name">macOS Sonoma</div>
							<div class="os-version">Version 14.2</div>
							
							<div class="specs-list">
								<div class="spec-row model">
									<span>MacBook Pro (16-inch, 2024)</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Processor</span>
									<span class="spec-value">Apple M3 Max</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Memory</span>
									<span class="spec-value">36 GB</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Startup Disk</span>
									<span class="spec-value">Macintosh HD</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Graphics</span>
									<span class="spec-value">Apple M3 Max 40-Core GPU</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Serial Number</span>
									<span class="spec-value">FVFXM3XXXXXX</span>
								</div>
							</div>
							
							<div class="buttons-row">
								<button class="system-btn" onclick={openSystemReport}>System Report...</button>
								<button class="system-btn" onclick={checkForUpdates}>Software Update...</button>
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Displays Tab -->
				{#if activeTab === 'displays'}
					<div class="displays-layout">
						<div class="display-preview">
							<div class="monitor-icon">
								<div class="monitor-screen"></div>
								<div class="monitor-stand"></div>
							</div>
						</div>
						<div class="display-info">
							<div class="display-name">Built-in Liquid Retina XDR Display</div>
							<div class="display-specs">
								<div class="spec-row">
									<span class="spec-label">Resolution</span>
									<span class="spec-value">3456 x 2234 Retina</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Refresh Rate</span>
									<span class="spec-value">ProMotion (up to 120Hz)</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Brightness</span>
									<span class="spec-value">1600 nits peak (HDR)</span>
								</div>
								<div class="spec-row">
									<span class="spec-label">Color Profile</span>
									<span class="spec-value">P3 Wide Color</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Storage Tab -->
				{#if activeTab === 'storage'}
					<div class="storage-layout">
						<div class="storage-header">Macintosh HD</div>
						<div class="storage-bar">
							<div class="storage-segment apps" style="width: 25%"></div>
							<div class="storage-segment photos" style="width: 18%"></div>
							<div class="storage-segment documents" style="width: 12%"></div>
							<div class="storage-segment system" style="width: 15%"></div>
							<div class="storage-segment other" style="width: 10%"></div>
						</div>
						<div class="storage-summary">
							<span class="storage-used">512.4 GB available</span>
							<span class="storage-total">of 1 TB</span>
						</div>
						<div class="storage-legend">
							<div class="legend-item"><span class="dot apps"></span><span>Apps (256 GB)</span></div>
							<div class="legend-item"><span class="dot photos"></span><span>Photos (184 GB)</span></div>
							<div class="legend-item"><span class="dot documents"></span><span>Documents (122 GB)</span></div>
							<div class="legend-item"><span class="dot system"></span><span>macOS (153 GB)</span></div>
							<div class="legend-item"><span class="dot other"></span><span>Other (102 GB)</span></div>
						</div>
						<button class="manage-btn" onclick={openManageStorage}>Manage...</button>
					</div>
				{/if}
				
				<!-- Support Tab -->
				{#if activeTab === 'support'}
					<div class="support-layout">
						<div class="support-item">
							<div class="support-icon">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
							</div>
							<div class="support-text">
								<div class="support-title">macOS Help</div>
								<div class="support-desc">Get answers to your questions about macOS</div>
							</div>
						</div>
						<div class="support-item">
							<div class="support-icon">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
							</div>
							<div class="support-text">
								<div class="support-title">macOS Specifications</div>
								<div class="support-desc">Technical specifications for this Mac</div>
							</div>
						</div>
						<div class="support-item">
							<div class="support-icon">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
							</div>
							<div class="support-text">
								<div class="support-title">AppleCare & Warranty</div>
								<div class="support-desc">View your coverage and support options</div>
							</div>
						</div>
						<div class="support-item">
							<div class="support-icon apple">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
							</div>
							<div class="support-text">
								<div class="support-title">Apple Support</div>
								<div class="support-desc">Get help from Apple</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Footer -->
			<div class="footer">
				<span>TM and © 1983-2024 Apple Inc. All Rights Reserved.</span>
				<span class="owner">Prasidh P Shetty</span>
			</div>
		</div>
	</div>
	
	<!-- Software Update Modal -->
	{#if isUpdating || updateComplete}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="update-backdrop" onclick={() => { if (updateComplete) { updateComplete = false; } }}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="update-modal" onclick={(e) => e.stopPropagation()}>
				{#if isUpdating}
					<div class="update-icon spinning">
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
					</div>
					<div class="update-title">Checking for updates...</div>
					<div class="update-progress-bar">
						<div class="update-progress" style="width: {updateProgress}%"></div>
					</div>
				{:else if updateComplete}
					<div class="update-icon success">
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
					</div>
					<div class="update-title">Your Mac is up to date</div>
					<div class="update-subtitle">macOS Sonoma 14.2</div>
					<button class="update-ok-btn" onclick={() => updateComplete = false}>OK</button>
				{/if}
			</div>
		</div>
	{/if}
	
	<!-- System Report Modal -->
	{#if showSystemReport}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-backdrop" onclick={() => showSystemReport = false}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="system-report-modal" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<div class="modal-controls">
						<button class="control close" onclick={() => showSystemReport = false} aria-label="Close">
							<svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
						<button class="control minimize" aria-label="Minimize">
							<svg viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
						<button class="control maximize" aria-label="Maximize">
							<svg viewBox="0 0 12 12"><path d="M2 2h8v8H2z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
					</div>
					<button class="back-button" onclick={() => showSystemReport = false} aria-label="Back">
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
					</button>
					<span class="modal-title">System Information</span>
				</div>
				<div class="report-content">
					<div class="report-sidebar">
						<div class="sidebar-section">Hardware</div>
						<div class="sidebar-item active">Hardware Overview</div>
						<div class="sidebar-item">Audio</div>
						<div class="sidebar-item">Bluetooth</div>
						<div class="sidebar-item">Camera</div>
						<div class="sidebar-item">Displays</div>
						<div class="sidebar-item">Graphics/GPU</div>
						<div class="sidebar-item">Memory</div>
						<div class="sidebar-item">NVMExpress</div>
						<div class="sidebar-item">Power</div>
						<div class="sidebar-item">USB</div>
						<div class="sidebar-section">Network</div>
						<div class="sidebar-item">Wi-Fi</div>
						<div class="sidebar-item">Ethernet</div>
						<div class="sidebar-section">Software</div>
						<div class="sidebar-item">Applications</div>
						<div class="sidebar-item">Extensions</div>
					</div>
					<div class="report-main">
						<div class="report-title">Hardware Overview:</div>
						<div class="report-table">
							<div class="report-row">
								<span class="report-label">Model Name:</span>
								<span class="report-value">MacBook Pro</span>
							</div>
							<div class="report-row">
								<span class="report-label">Model Identifier:</span>
								<span class="report-value">Mac15,9</span>
							</div>
							<div class="report-row">
								<span class="report-label">Model Number:</span>
								<span class="report-value">MRW23LL/A</span>
							</div>
							<div class="report-row">
								<span class="report-label">Chip:</span>
								<span class="report-value">Apple M3 Max</span>
							</div>
							<div class="report-row">
								<span class="report-label">Total Number of Cores:</span>
								<span class="report-value">16 (12 performance and 4 efficiency)</span>
							</div>
							<div class="report-row">
								<span class="report-label">Memory:</span>
								<span class="report-value">36 GB</span>
							</div>
							<div class="report-row">
								<span class="report-label">System Firmware Version:</span>
								<span class="report-value">10151.101.3</span>
							</div>
							<div class="report-row">
								<span class="report-label">OS Loader Version:</span>
								<span class="report-value">10151.101.3</span>
							</div>
							<div class="report-row">
								<span class="report-label">Serial Number:</span>
								<span class="report-value">FVFXM3XXXXXX</span>
							</div>
							<div class="report-row">
								<span class="report-label">Hardware UUID:</span>
								<span class="report-value">XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</span>
							</div>
							<div class="report-row">
								<span class="report-label">Provisioning UDID:</span>
								<span class="report-value">XXXXXXXX-XXXXXXXXXXXXXXXX</span>
							</div>
							<div class="report-row">
								<span class="report-label">Activation Lock Status:</span>
								<span class="report-value">Enabled</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Manage Storage Modal -->
	{#if showManageStorage}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-backdrop" onclick={() => showManageStorage = false}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="manage-storage-modal" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<div class="modal-controls">
						<button class="control close" onclick={() => showManageStorage = false} aria-label="Close">
							<svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
						<button class="control minimize" aria-label="Minimize">
							<svg viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
						<button class="control maximize" aria-label="Maximize">
							<svg viewBox="0 0 12 12"><path d="M2 2h8v8H2z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
						</button>
					</div>
					<button class="back-button" onclick={() => showManageStorage = false} aria-label="Back">
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
					</button>
					<span class="modal-title">Storage Management</span>
				</div>
				<div class="manage-content">
					<div class="manage-sidebar">
						<div class="manage-item active">
							<div class="manage-icon apps-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Applications</span>
								<span class="manage-size">256 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon photos-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Photos</span>
								<span class="manage-size">184 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon docs-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Documents</span>
								<span class="manage-size">122 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon mail-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Mail</span>
								<span class="manage-size">2.4 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon music-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Music</span>
								<span class="manage-size">18.2 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon trash-icon"></div>
							<div class="manage-info">
								<span class="manage-name">Trash</span>
								<span class="manage-size">1.8 GB</span>
							</div>
						</div>
						<div class="manage-item">
							<div class="manage-icon system-icon"></div>
							<div class="manage-info">
								<span class="manage-name">System</span>
								<span class="manage-size">15.3 GB</span>
							</div>
						</div>
					</div>
					<div class="manage-main">
						<div class="manage-header">Applications</div>
						<div class="manage-description">Review and delete applications you no longer need.</div>
						<div class="app-list">
							<div class="app-row">
								<span class="app-name">Xcode.app</span>
								<span class="app-size">35.2 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Final Cut Pro.app</span>
								<span class="app-size">28.4 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Logic Pro.app</span>
								<span class="app-size">22.1 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Adobe Photoshop 2024.app</span>
								<span class="app-size">18.6 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Microsoft Word.app</span>
								<span class="app-size">4.2 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Slack.app</span>
								<span class="app-size">1.8 GB</span>
							</div>
							<div class="app-row">
								<span class="app-name">Spotify.app</span>
								<span class="app-size">1.2 GB</span>
							</div>
						</div>
						<div class="recommendations">
							<div class="rec-title">Recommendations</div>
							<div class="rec-item">
								<div class="rec-icon">
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
								</div>
								<div class="rec-text">
									<div class="rec-name">Store in iCloud</div>
									<div class="rec-desc">Save space by storing files in iCloud</div>
								</div>
								<button class="rec-btn">Store in iCloud...</button>
							</div>
							<div class="rec-item">
								<div class="rec-icon">
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
								</div>
								<div class="rec-text">
									<div class="rec-name">Empty Trash Automatically</div>
									<div class="rec-desc">Erase items in Trash after 30 days</div>
								</div>
								<button class="rec-btn">Turn On...</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
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

	.about-window {
		width: 580px;
		background: #f5f5f7;
		border-radius: 10px;
		box-shadow: 0 22px 70px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		animation: slideIn 0.25s ease;
		position: relative;
	}

	@keyframes slideIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}

	.window-controls {
		display: flex;
		gap: 8px;
		padding: 14px 16px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.control {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.control svg {
		width: 8px;
		height: 8px;
		opacity: 0;
		color: rgba(0, 0, 0, 0.5);
	}

	.control:hover svg { opacity: 1; }
	.close { background: #ff5f57; }
	.minimize { background: #febc2e; }
	.maximize { background: #28c840; }

	.tabs {
		display: flex;
		justify-content: center;
		gap: 0;
		padding: 40px 16px 0;
	}

	.tab {
		padding: 8px 16px;
		background: transparent;
		border: 1px solid transparent;
		border-bottom: none;
		color: #666;
		font-size: 12px;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tab:hover { color: #333; }

	.tab.active {
		background: #fff;
		color: #333;
		border-color: #d1d1d1;
		border-radius: 6px 6px 0 0;
	}

	.content {
		background: #fff;
		margin: 0 12px;
		border: 1px solid #d1d1d1;
		border-radius: 0 0 8px 8px;
		border-top: none;
		padding: 20px 24px;
		min-height: 260px;
	}

	/* Overview */
	.overview-layout {
		display: flex;
		gap: 24px;
	}

	.left-section { flex-shrink: 0; }

	.preview-circle {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
	}

	.preview-circle img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.right-section { flex: 1; }

	.os-name {
		font-size: 26px;
		font-weight: 600;
		color: #1d1d1f;
	}

	.os-version {
		font-size: 11px;
		color: #86868b;
		margin-bottom: 14px;
	}

	.specs-list { margin-bottom: 14px; }

	.spec-row {
		display: flex;
		justify-content: space-between;
		padding: 3px 0;
		font-size: 11px;
	}

	.spec-row.model {
		margin-bottom: 8px;
		font-weight: 500;
		color: #1d1d1f;
	}

	.spec-label { color: #86868b; }
	.spec-value { color: #1d1d1f; }

	.buttons-row {
		display: flex;
		gap: 8px;
	}

	.system-btn {
		padding: 5px 12px;
		background: #fff;
		border: 1px solid #c7c7c7;
		border-radius: 5px;
		font-size: 11px;
		color: #333;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	}

	.system-btn:hover { background: #f5f5f5; }
	.system-btn:active { background: #e8e8e8; }

	/* Displays */
	.displays-layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.display-preview { margin-bottom: 16px; }

	.monitor-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.monitor-screen {
		width: 120px;
		height: 75px;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		border-radius: 6px;
		border: 3px solid #333;
	}

	.monitor-stand {
		width: 40px;
		height: 20px;
		background: linear-gradient(180deg, #888 0%, #666 100%);
		border-radius: 0 0 4px 4px;
		margin-top: -2px;
	}

	.display-name {
		font-size: 14px;
		font-weight: 500;
		color: #1d1d1f;
		margin-bottom: 12px;
	}

	.display-specs { width: 280px; }

	/* Storage */
	.storage-layout {
		display: flex;
		flex-direction: column;
	}

	.storage-header {
		font-size: 13px;
		font-weight: 500;
		color: #1d1d1f;
		margin-bottom: 10px;
	}

	.storage-bar {
		height: 18px;
		background: #e5e5e5;
		border-radius: 4px;
		display: flex;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.storage-segment { height: 100%; }
	.storage-segment.apps { background: #ff5f57; }
	.storage-segment.photos { background: #febc2e; }
	.storage-segment.documents { background: #28c840; }
	.storage-segment.system { background: #5856d6; }
	.storage-segment.other { background: #8e8e93; }

	.storage-summary {
		font-size: 11px;
		color: #86868b;
		margin-bottom: 16px;
	}

	.storage-used {
		color: #1d1d1f;
		font-weight: 500;
	}

	.storage-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-bottom: 16px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		color: #666;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}

	.dot.apps { background: #ff5f57; }
	.dot.photos { background: #febc2e; }
	.dot.documents { background: #28c840; }
	.dot.system { background: #5856d6; }
	.dot.other { background: #8e8e93; }

	.manage-btn {
		align-self: flex-start;
		padding: 5px 14px;
		background: #fff;
		border: 1px solid #c7c7c7;
		border-radius: 5px;
		font-size: 11px;
		color: #333;
		cursor: pointer;
	}

	/* Support */
	.support-layout {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.support-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s;
	}

	.support-item:hover { background: #f5f5f7; }

	.support-icon {
		width: 32px;
		height: 32px;
		color: #0a84ff;
	}

	.support-icon.apple { color: #1d1d1f; }
	.support-icon svg { width: 100%; height: 100%; }

	.support-title {
		font-size: 12px;
		font-weight: 500;
		color: #1d1d1f;
	}

	.support-desc {
		font-size: 10px;
		color: #86868b;
	}

	/* Footer */
	.footer {
		display: flex;
		justify-content: space-between;
		padding: 10px 20px;
		font-size: 9px;
		color: #86868b;
	}

	.owner { font-weight: 500; color: #666; }

	/* Software Update Modal */
	.update-backdrop {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
	}

	.update-modal {
		background: #f5f5f7;
		border-radius: 12px;
		padding: 30px 40px;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		min-width: 280px;
	}

	.update-icon {
		width: 50px;
		height: 50px;
		margin: 0 auto 16px;
		color: #0a84ff;
	}

	.update-icon.spinning {
		animation: spin 1s linear infinite;
	}

	.update-icon.success { color: #28c840; }

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.update-icon svg { width: 100%; height: 100%; }

	.update-title {
		font-size: 14px;
		font-weight: 500;
		color: #1d1d1f;
		margin-bottom: 8px;
	}

	.update-subtitle {
		font-size: 11px;
		color: #86868b;
		margin-bottom: 16px;
	}

	.update-progress-bar {
		width: 200px;
		height: 4px;
		background: #e5e5e5;
		border-radius: 2px;
		margin: 0 auto;
		overflow: hidden;
	}

	.update-progress {
		height: 100%;
		background: #0a84ff;
		transition: width 0.3s ease;
	}

	.update-ok-btn {
		padding: 6px 24px;
		background: #0a84ff;
		border: none;
		border-radius: 6px;
		color: #fff;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
	}

	.update-ok-btn:hover { background: #0077ed; }

	/* System Report Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
	}

	.system-report-modal {
		width: 750px;
		height: 500px;
		background: #f5f5f7;
		border-radius: 10px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		padding: 10px 16px;
		background: #e8e8e8;
		border-bottom: 1px solid #d1d1d1;
		position: relative;
	}

	.modal-controls {
		display: flex;
		gap: 8px;
	}

	.modal-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 13px;
		font-weight: 500;
		color: #333;
	}

	.back-button {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: #e8e8e8;
		border: 1px solid #d1d1d1;
		color: #333;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 12px;
		transition: all 0.15s ease;
	}

	.back-button:hover {
		background: #ddd;
	}

	.back-button svg {
		width: 16px;
		height: 16px;
	}

	.report-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.report-sidebar {
		width: 200px;
		background: #fff;
		border-right: 1px solid #d1d1d1;
		overflow-y: auto;
		padding: 8px 0;
	}

	.sidebar-section {
		padding: 8px 12px 4px;
		font-size: 10px;
		font-weight: 600;
		color: #86868b;
		text-transform: uppercase;
	}

	.sidebar-item {
		padding: 6px 12px 6px 20px;
		font-size: 11px;
		color: #333;
		cursor: pointer;
	}

	.sidebar-item:hover { background: #f0f0f0; }
	.sidebar-item.active { background: #0a84ff; color: #fff; }

	.report-main {
		flex: 1;
		padding: 16px;
		overflow-y: auto;
		background: #fff;
	}

	.report-title {
		font-size: 13px;
		font-weight: 600;
		color: #333;
		margin-bottom: 12px;
	}

	.report-table {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.report-row {
		display: flex;
		font-size: 11px;
		padding: 4px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.report-label {
		width: 200px;
		color: #333;
		font-weight: 500;
	}

	.report-value {
		color: #666;
	}

	/* Manage Storage Modal */
	.manage-storage-modal {
		width: 800px;
		height: 520px;
		background: #f5f5f7;
		border-radius: 10px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.manage-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.manage-sidebar {
		width: 220px;
		background: #fff;
		border-right: 1px solid #d1d1d1;
		overflow-y: auto;
		padding: 12px 8px;
	}

	.manage-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border-radius: 6px;
		cursor: pointer;
	}

	.manage-item:hover { background: #f0f0f0; }
	.manage-item.active { background: #0a84ff; }
	.manage-item.active .manage-name,
	.manage-item.active .manage-size { color: #fff; }

	.manage-icon {
		width: 32px;
		height: 32px;
		border-radius: 6px;
	}

	.apps-icon { background: linear-gradient(135deg, #5856d6, #af52de); }
	.photos-icon { background: linear-gradient(135deg, #ff9500, #ff2d55); }
	.docs-icon { background: linear-gradient(135deg, #007aff, #5ac8fa); }
	.mail-icon { background: linear-gradient(135deg, #34c759, #30d158); }
	.music-icon { background: linear-gradient(135deg, #ff2d55, #ff375f); }
	.trash-icon { background: linear-gradient(135deg, #8e8e93, #636366); }
	.system-icon { background: linear-gradient(135deg, #636366, #48484a); }

	.manage-info {
		display: flex;
		flex-direction: column;
	}

	.manage-name {
		font-size: 12px;
		font-weight: 500;
		color: #333;
	}

	.manage-size {
		font-size: 10px;
		color: #86868b;
	}

	.manage-main {
		flex: 1;
		padding: 16px 20px;
		overflow-y: auto;
		background: #fff;
	}

	.manage-header {
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin-bottom: 4px;
	}

	.manage-description {
		font-size: 11px;
		color: #86868b;
		margin-bottom: 16px;
	}

	.app-list {
		background: #f5f5f7;
		border-radius: 8px;
		padding: 8px;
		margin-bottom: 20px;
	}

	.app-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		font-size: 11px;
		border-bottom: 1px solid #e5e5e5;
	}

	.app-row:last-child { border-bottom: none; }
	.app-name { color: #333; }
	.app-size { color: #86868b; }

	.recommendations {
		margin-top: 16px;
	}

	.rec-title {
		font-size: 13px;
		font-weight: 600;
		color: #333;
		margin-bottom: 12px;
	}

	.rec-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: #f5f5f7;
		border-radius: 8px;
		margin-bottom: 8px;
	}

	.rec-icon {
		width: 36px;
		height: 36px;
		color: #0a84ff;
	}

	.rec-icon svg { width: 100%; height: 100%; }

	.rec-text { flex: 1; }

	.rec-name {
		font-size: 12px;
		font-weight: 500;
		color: #333;
	}

	.rec-desc {
		font-size: 10px;
		color: #86868b;
	}

	.rec-btn {
		padding: 5px 12px;
		background: #fff;
		border: 1px solid #c7c7c7;
		border-radius: 5px;
		font-size: 11px;
		color: #333;
		cursor: pointer;
	}

	.rec-btn:hover { background: #f0f0f0; }
</style>
