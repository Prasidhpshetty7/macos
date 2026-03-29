<script lang="ts">
	let isOpen = $state(false);
	
	function toggleNotifications() {
		isOpen = !isOpen;
	}
	
	function closeNotifications() {
		isOpen = false;
	}
	
	const notifications = [
		{ app: 'Messages', title: 'New Message', body: 'Hey, how are you?', time: '2m ago', icon: 'messages' },
		{ app: 'Mail', title: 'New Email', body: 'Meeting scheduled for tomorrow', time: '1h ago', icon: 'mail' },
		{ app: 'Calendar', title: 'Upcoming Event', body: 'Team standup in 30 minutes', time: '3h ago', icon: 'calendar' },
	];
</script>

<svelte:window onclick={closeNotifications} />

<button class="notification-btn" onclick={(e) => { e.stopPropagation(); toggleNotifications(); }} aria-label="Notification Center">
	<svg viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
	</svg>
</button>

{#if isOpen}
	<div class="notification-panel" onclick={(e) => e.stopPropagation()}>
		<div class="notification-header">
			<h3>Notification Center</h3>
		</div>
		
		<div class="notification-list">
			{#each notifications as notif}
				<div class="notification-item">
					<div class="notif-icon">
						<img src="/app-icons/{notif.icon}/256.webp" alt={notif.app} />
					</div>
					<div class="notif-content">
						<div class="notif-app">{notif.app}</div>
						<div class="notif-title">{notif.title}</div>
						<div class="notif-body">{notif.body}</div>
					</div>
					<div class="notif-time">{notif.time}</div>
				</div>
			{/each}
		</div>
		
		<div class="notification-footer">
			<button class="clear-all-btn">Clear All</button>
		</div>
	</div>
{/if}

<style>
	.notification-btn {
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
	
	.notification-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
	}
	
	.notification-btn svg {
		width: 16px;
		height: 16px;
	}
	
	.notification-panel {
		position: fixed;
		top: 32px;
		right: 8px;
		width: 360px;
		max-height: 600px;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(40px);
		border-radius: 16px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
		z-index: 99998;
		display: flex;
		flex-direction: column;
		animation: notifAppear 0.2s ease;
		overflow: hidden;
	}
	
	@keyframes notifAppear {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.notification-header {
		padding: 16px 20px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.notification-header h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
	}
	
	.notification-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
	}
	
	.notification-item {
		display: flex;
		gap: 12px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		margin-bottom: 8px;
		cursor: pointer;
		transition: background 0.15s;
	}
	
	.notification-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	
	.notif-icon {
		width: 36px;
		height: 36px;
		flex-shrink: 0;
	}
	
	.notif-icon img {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}
	
	.notif-content {
		flex: 1;
		min-width: 0;
	}
	
	.notif-app {
		font-size: 12px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 2px;
	}
	
	.notif-title {
		font-size: 13px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 2px;
	}
	
	.notif-body {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.6);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.notif-time {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.4);
		flex-shrink: 0;
	}
	
	.notification-footer {
		padding: 12px 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: flex-end;
	}
	
	.clear-all-btn {
		background: transparent;
		border: none;
		color: #007aff;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		padding: 6px 12px;
		border-radius: 6px;
		transition: background 0.15s;
	}
	
	.clear-all-btn:hover {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
