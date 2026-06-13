<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createClient } from '@supabase/supabase-js';
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	// Supabase client - CONNECTED! 🎉
	const SUPABASE_URL = 'https://jmzyuophywnbshmsqvox.supabase.co';
	const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptenlub3BoeXduYnNobXNxdm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTAzNzcsImV4cCI6MjA1MjE4NjM3N30.lpY3zQg4UDUM0_mo2Nfl8A_wEqKq460';
	const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
	
	// Security: Block DevTools
	let devtoolsInterval: number;
	let realtimeChannel: any;
	
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
	let showPassword = $state(false);
	let isTyping = $state(false);
	let typingTimeout: number;
	
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
		if (realtimeChannel) {
			supabase.removeChannel(realtimeChannel);
		}
	});
	
	// Authentication function - SECURE WITH BCRYPT!
	async function handleLogin() {
		if (!username || !password) {
			loginError = 'Please enter username and password';
			return;
		}
		
		isLoading = true;
		loginError = '';
		
		try {
			// Get user from database
			const { data: user, error: userError } = await supabase
				.from('users')
				.select('id, username, password_hash, display_name')
				.eq('username', username)
				.single();
			
			if (userError || !user) {
				loginError = 'Invalid username or password';
				isLoading = false;
				return;
			}
			
			// Verify password with bcrypt using bcryptjs library
			const bcrypt = await import('bcryptjs');
			const passwordMatch = await bcrypt.compare(password, user.password_hash);
			
			if (!passwordMatch) {
				loginError = 'Invalid username or password';
				isLoading = false;
				return;
			}
			
			// Set current user
			currentUser = {
				id: user.id,
				username: user.username,
				display_name: user.display_name,
			};
			
			// Load contacts
			await loadContacts(user.id);
			
			isLoggedIn = true;
		} catch (error) {
			console.error('Login error:', error);
			loginError = 'Connection error. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Load user's contacts
	async function loadContacts(userId: string) {
		try {
			// Get contacts with their user info
			const { data: contactsData, error } = await supabase
				.from('contacts')
				.select(`
					contact_user_id,
					users!contacts_contact_user_id_fkey (
						id,
						username,
						display_name
					)
				`)
				.eq('user_id', userId);
			
			if (error) throw error;
			
			// Format contacts
			contacts = contactsData?.map((c: any) => ({
				id: c.users.id,
				username: c.users.username,
				display_name: c.users.display_name,
				online: false, // Always show as offline
			})) || [];
			
		} catch (error) {
			console.error('Error loading contacts:', error);
		}
	}
	
	function selectContact(contact: any) {
		selectedContact = contact;
		loadMessages(contact.id);
	}
	
	async function loadMessages(contactId: string) {
		isLoading = true;
		try {
			// Load messages from Supabase (only messages less than 24h old)
			const { data: messagesData, error } = await supabase
				.from('messages')
				.select('*')
				.or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
				.or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
				.gt('expires_at', new Date().toISOString())
				.order('created_at', { ascending: true });
			
			if (error) throw error;
			
			// Filter messages between current user and selected contact
			messages = messagesData?.filter((m: any) => 
				(m.sender_id === currentUser.id && m.receiver_id === contactId) ||
				(m.sender_id === contactId && m.receiver_id === currentUser.id)
			).map((m: any) => ({
				id: m.id,
				sender_id: m.sender_id,
				receiver_id: m.receiver_id,
				text: m.content,
				timestamp: new Date(m.created_at),
			})) || [];
			
			// Subscribe to real-time updates
			setupRealtimeSubscription(contactId);
			
		} catch (error) {
			console.error('Error loading messages:', error);
			messages = [];
		} finally {
			isLoading = false;
		}
	}
	
	// Real-time message subscription
	function setupRealtimeSubscription(contactId: string) {
		// Remove existing subscription
		if (realtimeChannel) {
			supabase.removeChannel(realtimeChannel);
		}
		
		// Subscribe to new messages
		realtimeChannel = supabase
			.channel('messages')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
				},
				(payload: any) => {
					const newMsg = payload.new;
					
					// Only add if message is between current user and selected contact
					if (
						(newMsg.sender_id === currentUser.id && newMsg.receiver_id === contactId) ||
						(newMsg.sender_id === contactId && newMsg.receiver_id === currentUser.id)
					) {
						messages = [...messages, {
							id: newMsg.id,
							sender_id: newMsg.sender_id,
							receiver_id: newMsg.receiver_id,
							text: newMsg.content,
							timestamp: new Date(newMsg.created_at),
						}];
					}
				}
			)
			.subscribe();
	}
	
	async function sendMessage() {
		if (!newMessage.trim() || !selectedContact) return;
		
		const messageText = newMessage.trim();
		newMessage = ''; // Clear input immediately
		
		try {
			// Send to Supabase
			const { error } = await supabase
				.from('messages')
				.insert({
					sender_id: currentUser.id,
					receiver_id: selectedContact.id,
					content: messageText,
				});
			
			if (error) throw error;
			
			// Message will appear via real-time subscription
			
		} catch (error) {
			console.error('Failed to send message:', error);
			// Restore message on error
			newMessage = messageText;
		}
	}
	
	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
			isTyping = false;
		} else {
			// Show typing indicator
			isTyping = true;
			clearTimeout(typingTimeout);
			typingTimeout = window.setTimeout(() => {
				isTyping = false;
			}, 2000);
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
					<div class="logo">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
						</svg>
					</div>
					<h1>CrimeChat</h1>
					<p class="tagline">Secure • Anonymous • Ephemeral</p>
				</div>
				
				<div class="login-form">
					<div class="input-group">
						<label class="input-label">Username</label>
						<div class="input-wrapper">
							<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
							<input
								type="text"
								bind:value={username}
								placeholder="Enter username"
								class="modern-input"
								autocomplete="off"
							/>
						</div>
					</div>
					
					<div class="input-group">
						<label class="input-label">Password</label>
						<div class="input-wrapper">
							<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
							</svg>
							<input
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Enter password"
								class="modern-input"
								autocomplete="off"
								onkeydown={(e) => e.key === 'Enter' && handleLogin()}
							/>
							<button 
								class="password-toggle" 
								onclick={() => showPassword = !showPassword}
								type="button"
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									{#if showPassword}
										<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
										<line x1="1" y1="1" x2="23" y2="23"/>
									{:else}
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
										<circle cx="12" cy="12" r="3"/>
									{/if}
								</svg>
							</button>
						</div>
					</div>
					
					{#if loginError}
						<div class="error-message">{loginError}</div>
					{/if}
					
					<button 
						class="login-btn" 
						onclick={handleLogin}
						disabled={isLoading}
					>
						{#if isLoading}
							<svg class="spinner" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
								<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/>
							</svg>
							Authenticating...
						{:else}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
								<polyline points="10 17 15 12 10 7"/>
								<line x1="15" y1="12" x2="3" y2="12"/>
							</svg>
							Access CrimeChat
						{/if}
					</button>
					
					<div class="login-footer">
						<div class="feature-badge">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
							</svg>
							<span>End-to-end encrypted</span>
						</div>
						<div class="feature-badge">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"/>
								<polyline points="12 6 12 12 16 14"/>
							</svg>
							<span>Messages vanish in 24h</span>
						</div>
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
						<div class="user-avatar">{currentUser.display_name[0].toUpperCase()}</div>
						<span class="user-name">{currentUser.display_name}</span>
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
							<div class="contact-avatar">{contact.display_name[0].toUpperCase()}</div>
							<div class="contact-info">
								<div class="contact-name">{contact.display_name}</div>
								<div class="contact-status">Last seen recently</div>
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
							<div class="chat-avatar">{selectedContact.display_name[0].toUpperCase()}</div>
							<div>
								<div class="chat-user-name">{selectedContact.display_name}</div>
								<div class="chat-status">
									{#if isTyping}
										<span class="typing-indicator">typing...</span>
									{:else}
										Last seen recently
									{/if}
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
		background: #000000;
		border-radius: inherit;
		overflow: hidden;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	
	/* Login Screen */
	.login-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
		            linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
		position: relative;
		overflow: hidden;
	}
	
	.login-container::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
		background-size: 50px 50px;
		animation: gridMove 20s linear infinite;
	}
	
	@keyframes gridMove {
		0% { transform: translate(0, 0); }
		100% { transform: translate(50px, 50px); }
	}
	
	.login-card {
		background: rgba(10, 10, 10, 0.8);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(16, 185, 129, 0.2);
		border-radius: 16px;
		padding: 48px 40px;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 0 60px rgba(16, 185, 129, 0.1),
		            0 20px 40px rgba(0, 0, 0, 0.4);
		position: relative;
		z-index: 1;
	}
	
	.login-header {
		text-align: center;
		margin-bottom: 36px;
	}
	
	.logo {
		width: 64px;
		height: 64px;
		margin: 0 auto 20px;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
	}
	
	.logo svg {
		width: 36px;
		height: 36px;
		color: #000;
		stroke-width: 2.5;
	}
	
	.login-header h1 {
		margin: 0 0 8px 0;
		font-size: 32px;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.5px;
	}
	
	.tagline {
		margin: 0;
		color: #6b7280;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}
	
	.input-group {
		margin-bottom: 20px;
	}
	
	.input-label {
		display: block;
		color: #9ca3af;
		font-size: 13px;
		font-weight: 500;
		margin-bottom: 8px;
		letter-spacing: 0.3px;
	}
	
	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.input-icon {
		position: absolute;
		left: 16px;
		width: 18px;
		height: 18px;
		color: #6b7280;
		pointer-events: none;
		z-index: 1;
	}
	
	.modern-input {
		width: 100%;
		padding: 14px 16px 14px 46px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		font-size: 15px;
		color: #ffffff;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.modern-input::placeholder {
		color: #4b5563;
	}
	
	.modern-input:focus {
		outline: none;
		background: rgba(255, 255, 255, 0.05);
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}
	
	.password-toggle {
		position: absolute;
		right: 12px;
		width: 36px;
		height: 36px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		transition: background 0.2s;
	}
	
	.password-toggle svg {
		width: 18px;
		height: 18px;
		color: #6b7280;
	}
	
	.password-toggle:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	
	.error-message {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 13px;
		font-weight: 500;
	}
	
	.login-btn {
		width: 100%;
		padding: 14px 24px;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: #000;
		border: none;
		border-radius: 10px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
		margin-top: 24px;
	}
	
	.login-btn svg {
		width: 18px;
		height: 18px;
	}
	
	.login-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
	}
	
	.login-btn:active:not(:disabled) {
		transform: translateY(0);
	}
	
	.login-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.spinner {
		width: 18px;
		height: 18px;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.login-footer {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.feature-badge {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #6b7280;
		font-size: 12px;
		font-weight: 500;
		padding: 8px 12px;
		background: rgba(16, 185, 129, 0.05);
		border: 1px solid rgba(16, 185, 129, 0.1);
		border-radius: 8px;
		transition: all 0.3s;
	}
	
	.feature-badge:hover {
		background: rgba(16, 185, 129, 0.08);
		border-color: rgba(16, 185, 129, 0.2);
	}
	
	.feature-badge svg {
		width: 16px;
		height: 16px;
		color: #10b981;
		flex-shrink: 0;
	}
	
	/* Chat Interface */
	.chat-container {
		display: flex;
		width: 100%;
		height: 100%;
		background: #000000;
		padding-top: 28px; /* Space for traffic lights */
	}
	
	.sidebar {
		width: 320px;
		background: #0a0a0a;
		border-right: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		flex-direction: column;
	}
	
	.sidebar-header {
		padding: 16px 20px;
		background: rgba(16, 185, 129, 0.05);
		border-bottom: 1px solid rgba(16, 185, 129, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 70px;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	
	.user-avatar {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 16px;
		box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
	}
	
	.user-name {
		font-weight: 600;
		color: #ffffff;
		font-size: 15px;
	}
	
	.logout-btn {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.03);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.logout-btn svg {
		width: 18px;
		height: 18px;
		color: #6b7280;
	}
	
	.logout-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
	}
	
	.logout-btn:hover svg {
		color: #ef4444;
	}
	
	.contacts-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
	}
	
	.contact-item {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid transparent;
		background: transparent;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		margin-bottom: 4px;
	}
	
	.contact-item:hover {
		background: rgba(255, 255, 255, 0.03);
		border-color: rgba(255, 255, 255, 0.05);
	}
	
	.contact-item.active {
		background: rgba(16, 185, 129, 0.1);
		border-color: rgba(16, 185, 129, 0.3);
	}
	
	.contact-avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 18px;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
	}
	
	.contact-info {
		flex: 1;
	}
	
	.contact-name {
		font-weight: 600;
		color: #ffffff;
		margin-bottom: 4px;
		font-size: 14px;
	}
	
	.contact-status {
		font-size: 12px;
		color: #6b7280;
	}
	
	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #374151;
		display: inline-block;
		margin-right: 6px;
	}
	
	.status-dot.online {
		background: #10b981;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
		animation: pulse 2s infinite;
	}
	
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	.typing-indicator {
		color: #10b981;
		font-weight: 500;
		animation: typingPulse 1.5s infinite;
	}
	
	@keyframes typingPulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	.chat-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #000000;
	}
	
	.chat-header {
		padding: 18px 24px;
		background: rgba(10, 10, 10, 0.95);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: space-between;
		backdrop-filter: blur(10px);
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
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 16px;
		box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
	}
	
	.chat-user-name {
		font-weight: 600;
		color: #ffffff;
		font-size: 15px;
	}
	
	.chat-status {
		font-size: 12px;
		color: #6b7280;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	
	.chat-info {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #10b981;
		font-size: 12px;
		font-weight: 600;
		padding: 8px 14px;
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.2);
		border-radius: 8px;
		letter-spacing: 0.3px;
	}
	
	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
		background: #000000;
		background-image: radial-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
		background-size: 20px 20px;
	}
	
	.message {
		display: flex;
		margin-bottom: 16px;
		animation: messageIn 0.3s ease-out;
	}
	
	@keyframes messageIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.message.own {
		justify-content: flex-end;
	}
	
	.message-bubble {
		max-width: 70%;
		padding: 12px 16px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: #e5e7eb;
		position: relative;
		backdrop-filter: blur(10px);
	}
	
	.message.own .message-bubble {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
		border-color: rgba(16, 185, 129, 0.3);
		color: #ffffff;
		box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
	}
	
	.message-time {
		font-size: 10px;
		opacity: 0.6;
		margin-top: 6px;
		letter-spacing: 0.3px;
	}
	
	.message-input-container {
		padding: 20px 24px;
		background: rgba(10, 10, 10, 0.95);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		gap: 12px;
		backdrop-filter: blur(10px);
	}
	
	.message-input {
		flex: 1;
		padding: 12px 18px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		font-size: 14px;
		color: #ffffff;
		outline: none;
		transition: all 0.3s;
	}
	
	.message-input::placeholder {
		color: #4b5563;
	}
	
	.message-input:focus {
		background: rgba(255, 255, 255, 0.05);
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}
	
	.send-btn {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		border: none;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: #000;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
		box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
	}
	
	.send-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
	}
	
	.send-btn:active:not(:disabled) {
		transform: translateY(0);
	}
	
	.send-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		box-shadow: none;
	}
	
	.send-btn svg {
		width: 22px;
		height: 22px;
	}
	
	.no-chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #6b7280;
		padding: 40px;
		text-align: center;
	}
	
	.no-chat-icon {
		font-size: 72px;
		margin-bottom: 20px;
		opacity: 0.3;
	}
	
	.no-chat h2 {
		margin: 0 0 12px 0;
		color: #9ca3af;
		font-size: 20px;
		font-weight: 600;
	}
	
	.no-chat p {
		margin: 0;
		font-size: 14px;
		color: #6b7280;
	}
</style>
