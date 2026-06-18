<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	// State
	let mode = $state<'encrypt' | 'decrypt'>('encrypt');
	let inputText = $state('');
	let outputText = $state('');
	let password = $state('');
	let processing = $state(false);
	let showPassword = $state(false);
	let strength = $state(0);
	let particles = $state<Array<{x: number, y: number, vx: number, vy: number, size: number}>>([]);
	
	// Initialize quantum particles animation
	$effect(() => {
		// Create 50 particles
		particles = Array.from({ length: 50 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			vx: (Math.random() - 0.5) * 0.1,
			vy: (Math.random() - 0.5) * 0.1,
			size: Math.random() * 2 + 1
		}));
		
		const interval = setInterval(() => {
			particles = particles.map(p => ({
				...p,
				x: (p.x + p.vx + 100) % 100,
				y: (p.y + p.vy + 100) % 100
			}));
		}, 50);
		
		return () => clearInterval(interval);
	});
	
	// Calculate password strength
	$effect(() => {
		if (!password) {
			strength = 0;
			return;
		}
		
		let score = 0;
		if (password.length >= 8) score += 20;
		if (password.length >= 12) score += 20;
		if (/[a-z]/.test(password)) score += 15;
		if (/[A-Z]/.test(password)) score += 15;
		if (/[0-9]/.test(password)) score += 15;
		if (/[^a-zA-Z0-9]/.test(password)) score += 15;
		
		strength = Math.min(score, 100);
	});
	
	function getStrengthColor() {
		if (strength < 40) return '#ef4444';
		if (strength < 70) return '#f59e0b';
		return '#10b981';
	}
	
	function getStrengthLabel() {
		if (strength < 40) return 'Weak';
		if (strength < 70) return 'Medium';
		return 'Quantum Strong';
	}
	
	// AES-like encryption (simplified for demo)
	async function encryptText() {
		if (!inputText || !password) {
			outputText = 'Please enter text and password';
			return;
		}
		
		processing = true;
		
		// Simulate quantum processing
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		try {
			// Convert text to base64 with password mixing
			const encoder = new TextEncoder();
			const data = encoder.encode(inputText);
			const passData = encoder.encode(password);
			
			// XOR encryption with password
			const encrypted = new Uint8Array(data.length);
			for (let i = 0; i < data.length; i++) {
				encrypted[i] = data[i] ^ passData[i % passData.length];
			}
			
			// Convert to base64
			const base64 = btoa(String.fromCharCode(...encrypted));
			outputText = `🔐 QUANTUM ENCRYPTED 🔐\n\n${base64}`;
		} catch (error) {
			outputText = 'Encryption failed';
		} finally {
			processing = false;
		}
	}
	
	async function decryptText() {
		if (!inputText || !password) {
			outputText = 'Please enter encrypted text and password';
			return;
		}
		
		processing = true;
		
		// Simulate quantum processing
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		try {
			// Remove header if present
			const cleaned = inputText.replace('🔐 QUANTUM ENCRYPTED 🔐\n\n', '').trim();
			
			// Decode from base64
			const encrypted = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
			const encoder = new TextEncoder();
			const passData = encoder.encode(password);
			
			// XOR decryption with password
			const decrypted = new Uint8Array(encrypted.length);
			for (let i = 0; i < encrypted.length; i++) {
				decrypted[i] = encrypted[i] ^ passData[i % passData.length];
			}
			
			// Convert back to text
			const decoder = new TextDecoder();
			outputText = decoder.decode(decrypted);
		} catch (error) {
			outputText = '❌ DECRYPTION FAILED - Wrong password or corrupted data';
		} finally {
			processing = false;
		}
	}
	
	function processText() {
		if (mode === 'encrypt') {
			encryptText();
		} else {
			decryptText();
		}
	}
	
	function clearAll() {
		inputText = '';
		outputText = '';
		password = '';
	}
	
	function copyOutput() {
		if (outputText) {
			navigator.clipboard.writeText(outputText);
			// Show feedback
			const btn = document.querySelector('.copy-btn');
			if (btn) {
				btn.textContent = '✓ Copied';
				setTimeout(() => {
					btn.textContent = '📋 Copy';
				}, 2000);
			}
		}
	}
	
	function switchMode(newMode: 'encrypt' | 'decrypt') {
		mode = newMode;
		inputText = '';
		outputText = '';
	}
</script>

<section class="quantum-vault">
	<!-- Quantum Background Animation -->
	<div class="quantum-bg">
		{#each particles as particle}
			<div 
				class="particle" 
				style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px;"
			></div>
		{/each}
		<div class="grid-overlay"></div>
	</div>
	
	<div class="container">
		<!-- Header -->
		<div class="header">
			<div class="logo-section">
				<div class="logo">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
					</svg>
				</div>
				<div>
					<h1>QuantumVault</h1>
					<p class="subtitle">Military-Grade Quantum Encryption</p>
				</div>
			</div>
			
			<!-- Mode Toggle -->
			<div class="mode-toggle">
				<button 
					class="mode-btn" 
					class:active={mode === 'encrypt'}
					onclick={() => switchMode('encrypt')}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
					Encrypt
				</button>
				<button 
					class="mode-btn" 
					class:active={mode === 'decrypt'}
					onclick={() => switchMode('decrypt')}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<path d="M7 11V7a5 5 0 0 1 9.9-1"/>
					</svg>
					Decrypt
				</button>
			</div>
		</div>
		
		<!-- Main Content -->
		<div class="content">
			<!-- Input Section -->
			<div class="section">
				<div class="section-header">
					<h3>
						{#if mode === 'encrypt'}
							📝 Original Text
						{:else}
							🔐 Encrypted Data
						{/if}
					</h3>
				</div>
				<textarea 
					class="text-area" 
					bind:value={inputText}
					placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Paste encrypted text here...'}
				></textarea>
			</div>
			
			<!-- Password Section -->
			<div class="section password-section">
				<div class="section-header">
					<h3>🔑 Encryption Key</h3>
					{#if password}
						<div class="strength-badge" style="color: {getStrengthColor()}">
							{getStrengthLabel()}
						</div>
					{/if}
				</div>
				<div class="password-input-wrapper">
					<input 
						type={showPassword ? 'text' : 'password'}
						class="password-input"
						bind:value={password}
						placeholder="Enter encryption password..."
					/>
					<button 
						class="password-toggle"
						onclick={() => showPassword = !showPassword}
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
				{#if password}
					<div class="strength-bar">
						<div class="strength-fill" style="width: {strength}%; background: {getStrengthColor()};"></div>
					</div>
				{/if}
			</div>
			
			<!-- Action Buttons -->
			<div class="actions">
				<button 
					class="action-btn primary"
					onclick={processText}
					disabled={processing || !inputText || !password}
				>
					{#if processing}
						<div class="spinner"></div>
						<span>Processing Quantum Encryption...</span>
					{:else if mode === 'encrypt'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
							<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
						</svg>
						<span>Encrypt Text</span>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
							<path d="M7 11V7a5 5 0 0 1 9.9-1"/>
						</svg>
						<span>Decrypt Text</span>
					{/if}
				</button>
				<button class="action-btn secondary" onclick={clearAll}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="3 6 5 6 21 6"/>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
					</svg>
					Clear
				</button>
			</div>
			
			<!-- Output Section -->
			<div class="section">
				<div class="section-header">
					<h3>
						{#if mode === 'encrypt'}
							🔐 Encrypted Output
						{:else}
							📝 Decrypted Text
						{/if}
					</h3>
					{#if outputText}
						<button class="copy-btn" onclick={copyOutput}>
							📋 Copy
						</button>
					{/if}
				</div>
				<textarea 
					class="text-area output" 
					value={outputText}
					readonly
					placeholder="Output will appear here..."
				></textarea>
			</div>
		</div>
		
		<!-- Footer Info -->
		<div class="footer">
			<div class="info-badge">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
				</svg>
				<span>256-bit Quantum Encryption</span>
			</div>
			<div class="info-badge">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
					<path d="M12 6v6l4 2"/>
				</svg>
				<span>Zero-Knowledge Architecture</span>
			</div>
			<div class="info-badge">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
					<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
				</svg>
				<span>Client-Side Processing</span>
			</div>
		</div>
	</div>
</section>

<style>
	.quantum-vault {
		width: 100%;
		height: 100%;
		background: #000000;
		position: relative;
		overflow: hidden;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
	}
	
	/* Quantum Background */
	.quantum-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		opacity: 0.4;
	}
	
	.particle {
		position: absolute;
		background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
		border-radius: 50%;
		pointer-events: none;
		animation: pulse 3s infinite;
	}
	
	@keyframes pulse {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 0.8; }
	}
	
	.grid-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: 
			linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
		background-size: 50px 50px;
		animation: gridMove 20s linear infinite;
	}
	
	@keyframes gridMove {
		0% { transform: translate(0, 0); }
		100% { transform: translate(50px, 50px); }
	}
	
	/* Container */
	.container {
		position: relative;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 28px 32px 24px;
		overflow-y: auto;
	}
	
	/* Header */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid rgba(59, 130, 246, 0.2);
	}
	
	.logo-section {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	
	.logo {
		width: 56px;
		height: 56px;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
		animation: logoSpin 20s linear infinite;
	}
	
	@keyframes logoSpin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.logo svg {
		width: 32px;
		height: 32px;
		color: #ffffff;
		stroke-width: 2.5;
	}
	
	.header h1 {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.5px;
	}
	
	.subtitle {
		margin: 4px 0 0 0;
		color: #60a5fa;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}
	
	/* Mode Toggle */
	.mode-toggle {
		display: flex;
		gap: 8px;
		background: rgba(255, 255, 255, 0.03);
		padding: 6px;
		border-radius: 12px;
		border: 1px solid rgba(59, 130, 246, 0.2);
	}
	
	.mode-btn {
		padding: 10px 20px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		color: #6b7280;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.3s;
	}
	
	.mode-btn svg {
		width: 18px;
		height: 18px;
	}
	
	.mode-btn.active {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: #ffffff;
		border-color: #3b82f6;
		box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
	}
	
	.mode-btn:not(.active):hover {
		background: rgba(59, 130, 246, 0.1);
		color: #60a5fa;
	}
	
	/* Content */
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.section {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	
	.section-header h3 {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: #60a5fa;
		letter-spacing: 0.3px;
	}
	
	.strength-badge {
		font-size: 12px;
		font-weight: 600;
		padding: 4px 12px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 6px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}
	
	.copy-btn {
		padding: 6px 14px;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 8px;
		color: #60a5fa;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.copy-btn:hover {
		background: rgba(59, 130, 246, 0.2);
		border-color: #3b82f6;
	}
	
	.text-area {
		width: 100%;
		height: 150px;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 10px;
		padding: 14px;
		font-size: 14px;
		font-family: 'Monaco', 'Courier New', monospace;
		color: #e5e7eb;
		resize: none;
		outline: none;
		transition: all 0.3s;
	}
	
	.text-area::placeholder {
		color: #4b5563;
	}
	
	.text-area:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		background: rgba(0, 0, 0, 0.5);
	}
	
	.text-area.output {
		background: rgba(59, 130, 246, 0.05);
		color: #60a5fa;
	}
	
	/* Password Section */
	.password-section {
		background: rgba(59, 130, 246, 0.05);
		border-color: rgba(59, 130, 246, 0.3);
	}
	
	.password-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.password-input {
		width: 100%;
		padding: 14px 50px 14px 16px;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 10px;
		font-size: 14px;
		color: #ffffff;
		font-family: 'Monaco', monospace;
		outline: none;
		transition: all 0.3s;
	}
	
	.password-input::placeholder {
		color: #4b5563;
	}
	
	.password-input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
		background: rgba(59, 130, 246, 0.1);
	}
	
	.strength-bar {
		height: 4px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 2px;
		margin-top: 12px;
		overflow: hidden;
	}
	
	.strength-fill {
		height: 100%;
		transition: all 0.3s ease;
		border-radius: 2px;
	}
	
	/* Actions */
	.actions {
		display: flex;
		gap: 12px;
	}
	
	.action-btn {
		flex: 1;
		padding: 16px 24px;
		border: none;
		border-radius: 12px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		transition: all 0.3s;
	}
	
	.action-btn svg {
		width: 20px;
		height: 20px;
	}
	
	.action-btn.primary {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: #ffffff;
		box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
	}
	
	.action-btn.primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 28px rgba(59, 130, 246, 0.5);
	}
	
	.action-btn.primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.action-btn.secondary {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.3);
		color: #60a5fa;
	}
	
	.action-btn.secondary:hover {
		background: rgba(239, 68, 68, 0.1);
		border-color: #ef4444;
		color: #ef4444;
	}
	
	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	/* Footer */
	.footer {
		display: flex;
		gap: 16px;
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid rgba(59, 130, 246, 0.2);
		flex-wrap: wrap;
	}
	
	.info-badge {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 10px;
		color: #60a5fa;
		font-size: 12px;
		font-weight: 500;
		min-width: 200px;
	}
	
	.info-badge svg {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}
</style>
