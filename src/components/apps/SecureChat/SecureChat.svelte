<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	// Security: Block DevTools
	let devtoolsInterval: number;
	
	// State
	let isLoggedIn = $state(false);
	let username = $state('');
	let password = $state('');
	let currentUser = $state<any>(null);
	let contacts = $state<any[]>([]);
	let selectedContact = $state<any>(null);
	let messages = $state<any[]>([]);
	let newMessage = $state('');
	let loginError = $state('');
	let isLoading = $state(false);
	
	// Supabase config (placeholder - you'll add your credentials)
	const SUPABASE_URL = 'YOUR_SUPABASE_URL';
	const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
	
	// Security: Detect and block DevTools
	function blockDevTools() {
		const threshold = 160;
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		
		if (widthThreshold || heightThreshold) {
			document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px;">Access Denied</div>';
			window.location.reload();
		}
	}
	
	// Security: Prevent screenshots
	onMount(() => {
		// Block DevTools detection
		devtoolsInterval = window.setInterval(blockDevTools, 1000);
		
		// Disable right click
		const preventContext = (e: Event) => e.preventDefault();
		document.addEventListener('contextmenu', preventContext);
		
		// Disable keyboard shortcuts
		const preventKeys = (e: KeyboardEvent) => {
			// F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
			if (
				e.key === 'F12' ||
				(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
				(e.ctrlKey && e.key === 'U')
			) {
				e.preventDefault();
			}
			
			// Print Screen
			if (e.key === 'PrintScreen') {
				navigator.clipboard.writeText('');
				alert('Screenshots are disabled');
			}
		};
		document.addEventListener('keydown', preventKeys);
		
		return () => {
			clearInterval(devtoolsInterval);
			document.removeEventListener('contextmenu', preventContext);
			document.removeEventListener('keydown', preventKeys);
		};
	});
	
	onDestroy(() => {
		if (devtoolsInterval) clearInterval(devtoolsInterval);
	});
	
	// Authentication function (will connect to Supabase)
	async function handleLogin() {
		if (!username || !password) {
			loginError = 'Please enter username and password';
			return;
		}
		
		isLoading = true;
		loginError = '';
		
		try {
			// TODO: Connect to Supabase authentication
			// For now, temporary mock
			await new Promise(resolve => setTimeout(resolve, 800));
			
			// Mock user
			currentUser = {
				id: '1',
				username: username,
			};
			
			// Mock contacts
			contacts = [
				{ id: '2', username: 'friend1', online: true },
				{ id: '3', username: 'friend2', online: false },
			];
			
			isLoggedIn = true;
		} catch (error) {
			loginError = 'Invalid credentials';
		} finally {
			isLoading = false;
		}
	}
	
	function selectContact(contact: any) {
		selectedContact = contact;
		loadMessages(contact.id);
	}
	
	async function loadMessages(contactId: string) {
		isLoading = true;
		try {
			// TODO: Load from Supabase with 24h filter
			await new Promise(resolve => setTimeout(resolve, 500));
			
			messages = [
				{ id: '1', sender_id: contactId, text: 'Hey!', timestamp: new Date() },
				{ id: '2', sender_id: currentUser.id, text: 'Hi there!', timestamp: new Date() },
			];
		} finally {
			isLoading = false;
		}
	}
	
	async function sendMessage() {
		if (!newMessage.trim() || !selectedContact) return;
		
		const message = {
			id: Date.now().toString(),
			sender_id: currentUser.id,
			receiver_id: selectedContact.id,
			text: newMessage,
			timestamp: new Date(),
		};
		
		try {
			// TODO: Send to Supabase
			messages = [...messages, message];
			newMessage = '';
		} catch (error) {
			console.error('Failed to send message');
		}
	}
	
	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
	
	function logout() {
		isLoggedIn = false;
		currentUser = null;
		contacts = [];
		selectedContact = null;
		messages = [];
		username = '';
		password = '';
	}
</script>

<section class="secure-chat" style="user-select: none; -webkit-user-select: none;">
	{#if !isLoggedIn}
		<!-- Login Screen -->
		<div class="login-container">
			<div class="login-card">
				<div class="login-header">
					<div class="logo">🔐</div>
					<h1>SecureChat</h1>
					<p>Your messages disappear in 24 hours</p>
				</div>
				
				<div class="login-form">
					<div class="input-group">
						<input
							type="text"
							bind:value={username}
							placeholder="Username"
							class="modern-input"
							autocomplete="off"
						/>
					</div>
					
					<div class="input-group">
						<input
							type="password"
							bind:value={password}
							placeholder="Password"
							class="modern-input"
							autocomplete="off"
							onkeydown={(e) => e.key === 'Enter' && handleLogin()}
						/>
					</div>
					
					{#if loginError}
						<div class="error-message">{loginError}</div>
					{/if}
					
					<button 
						class="login-btn" 
						onclick={handleLogin}
						disabled={isLoading}
					>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>
					
					<div class="login-footer">
						<p>🔒 End-to-end encrypted</p>
						<p>⏰ Messages auto-delete after 24h</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Chat Interface -->
		<div class="chat-container">
			<!-- Sidebar -->
			<div class="sidebar">
				<div class="sidebar-header">
					<div class="user-info">
						<div class="user-avatar">{currentUser.username[0].toUpperCase()}</div>
						<span class="user-name">{currentUser.username}</span>
					</div>
					<button class="logout-btn" onclick={logout}>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
						</svg>
					</button>
				</div>
				
				<div class="contacts-list">
					{#each contacts as contact}
						<button 
							class="contact-item"
							class:active={selectedContact?.id === contact.id}
							onclick={() => selectContact(contact)}
						>
							<div class="contact-avatar">{contact.username[0].toUpperCase()}</div>
							<div class="contact-info">
								<div class="contact-name">{contact.username}</div>
								<div class="contact-status">
									<span class="status-dot" class:online={contact.online}></span>
									{contact.online ? 'Online' : 'Offline'}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
			
			<!-- Chat Area -->
			<div class="chat-area">
				{#if selectedContact}
					<div class="chat-header">
						<div class="chat-user">
							<div class="chat-avatar">{selectedContact.username[0].toUpperCase()}</div>
							<div>
								<div class="chat-user-name">{selectedContact.username}</div>
								<div class="chat-status">
									<span class="status-dot" class:online={selectedContact.online}></span>
									{selectedContact.online ? 'Online' : 'Offline'}
								</div>
							</div>
						</div>
						<div class="chat-info">
							<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
							</svg>
							<span>Messages delete after 24h</span>
						</div>
					</div>
					
					<div class="messages-container">
						{#each messages as message}
							<div class="message" class:own={message.sender_id === currentUser.id}>
								<div class="message-bubble">
									{message.text}
									<div class="message-time">
										{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
									</div>
								</div>
							</div>
						{/each}
					</div>
					
					<div class="message-input-container">
						<input
							type="text"
							bind:value={newMessage}
							placeholder="Type a message..."
							class="message-input"
							onkeydown={handleKeyPress}
							autocomplete="off"
						/>
						<button class="send-btn" onclick={sendMessage} disabled={!newMessage.trim()}>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
							</svg>
						</button>
					</div>
				{:else}
					<div class="no-chat">
						<div class="no-chat-icon">💬</div>
						<h2>Select a contact to start chatting</h2>
						<p>Your messages are end-to-end encrypted</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	.secure-chat {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: inherit;
		overflow: hidden;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
	}
	
	/* Login Screen */
	.login-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	
	.login-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		padding: 40px;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}
	
	.login-header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.logo {
		font-size: 64px;
		margin-bottom: 16px;
	}
	
	.login-header h1 {
		margin: 0 0 8px 0;
		font-size: 28px;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.login-header p {
		margin: 0;
		color: #666;
		font-size: 14px;
	}
	
	.input-group {
		margin-bottom: 16px;
	}
	
	.modern-input {
		width: 100%;
		padding: 16px;
		border: 2px solid #e0e0e0;
		border-radius: 12px;
		font-size: 16px;
		transition: all 0.3s;
		background: #f9f9f9;
	}
	
	.modern-input:focus {
		outline: none;
		border-color: #667eea;
		background: #fff;
	}
	
	.error-message {
		background: #fee;
		color: #c33;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
	}
	
	.login-btn {
		width: 100%;
		padding: 16px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.login-btn:hover:not(:disabled) {
		transform: translateY(-2px);
	}
	
	.login-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.login-footer {
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid #e0e0e0;
		text-align: center;
	}
	
	.login-footer p {
		margin: 8px 0;
		color: #666;
		font-size: 13px;
	}
	
	/* Chat Interface */
	.chat-container {
		display: flex;
		width: 100%;
		height: 100%;
		background: #fff;
	}
	
	.sidebar {
		width: 320px;
		background: #f7f7f7;
		border-right: 1px solid #e0e0e0;
		display: flex;
		flex-direction: column;
	}
	
	.sidebar-header {
		padding: 16px;
		background: #fff;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	
	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 18px;
	}
	
	.user-name {
		font-weight: 600;
		color: #333;
	}
	
	.logout-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: #f0f0f0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}
	
	.logout-btn svg {
		width: 20px;
		height: 20px;
		color: #666;
	}
	
	.logout-btn:hover {
		background: #e0e0e0;
	}
	
	.contacts-list {
		flex: 1;
		overflow-y: auto;
	}
	
	.contact-item {
		width: 100%;
		padding: 16px;
		border: none;
		background: transparent;
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		transition: background 0.2s;
		text-align: left;
	}
	
	.contact-item:hover {
		background: #fff;
	}
	
	.contact-item.active {
		background: #fff;
		border-left: 3px solid #667eea;
	}
	
	.contact-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 20px;
		flex-shrink: 0;
	}
	
	.contact-info {
		flex: 1;
	}
	
	.contact-name {
		font-weight: 600;
		color: #333;
		margin-bottom: 4px;
	}
	
	.contact-status {
		font-size: 12px;
		color: #666;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ccc;
	}
	
	.status-dot.online {
		background: #4caf50;
	}
	
	.chat-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #fff;
	}
	
	.chat-header {
		padding: 16px;
		background: #fff;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.chat-user {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	
	.chat-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 18px;
	}
	
	.chat-user-name {
		font-weight: 600;
		color: #333;
	}
	
	.chat-status {
		font-size: 12px;
		color: #666;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	
	.chat-info {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #ff9800;
		font-size: 12px;
		font-weight: 500;
	}
	
	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
		background: #f9f9f9;
	}
	
	.message {
		display: flex;
		margin-bottom: 12px;
	}
	
	.message.own {
		justify-content: flex-end;
	}
	
	.message-bubble {
		max-width: 70%;
		padding: 12px 16px;
		border-radius: 18px;
		background: #e0e0e0;
		color: #333;
		position: relative;
	}
	
	.message.own .message-bubble {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.message-time {
		font-size: 10px;
		opacity: 0.7;
		margin-top: 4px;
	}
	
	.message-input-container {
		padding: 16px;
		background: #fff;
		border-top: 1px solid #e0e0e0;
		display: flex;
		gap: 12px;
	}
	
	.message-input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 24px;
		font-size: 14px;
		outline: none;
	}
	
	.message-input:focus {
		border-color: #667eea;
	}
	
	.send-btn {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
	}
	
	.send-btn:hover:not(:disabled) {
		transform: scale(1.05);
	}
	
	.send-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.send-btn svg {
		width: 24px;
		height: 24px;
	}
	
	.no-chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #999;
		padding: 40px;
		text-align: center;
	}
	
	.no-chat-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}
	
	.no-chat h2 {
		margin: 0 0 8px 0;
		color: #666;
		font-size: 20px;
	}
	
	.no-chat p {
		margin: 0;
		font-size: 14px;
	}
</style>
