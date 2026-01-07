<script lang="ts">
	import { systemState, boot, confirmShutdown, confirmRestart, confirmLogout, cancelConfirm, wake, unlock } from '🍎/state/system.svelte.ts';
	import AppleIcon from '~icons/mdi/apple';
	
	let showPowerButton = $state(false);
	let showWakeMessage = $state(false);
	let password = $state('');
	let showPasswordError = $state(false);
	
	// Show power button 2 seconds after shutdown completes
	$effect(() => {
		if (systemState.state === 'off') {
			showPowerButton = false;
			setTimeout(() => {
				showPowerButton = true;
			}, 2000);
		} else {
			showPowerButton = false;
		}
	});
	
	// Show wake message 3 seconds after sleep
	$effect(() => {
		if (systemState.state === 'sleeping') {
			showWakeMessage = false;
			setTimeout(() => {
				showWakeMessage = true;
			}, 3000);
		} else {
			showWakeMessage = false;
		}
	});
	
	// Reset password when locked
	$effect(() => {
		if (systemState.state === 'locked') {
			password = '';
			showPasswordError = false;
		}
	});
	
	function handleWake() {
		if (systemState.state === 'sleeping' && showWakeMessage) {
			wake();
		}
	}
	
	function handleKeyDown(e: KeyboardEvent) {
		if (systemState.state === 'sleeping' && showWakeMessage) {
			wake();
		}
	}
	
	function handleLogin() {
		if (password.length > 0) {
			unlock();
		} else {
			showPasswordError = true;
			setTimeout(() => showPasswordError = false, 500);
		}
	}
	
	function handlePasswordKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if systemState.state !== 'running'}
	
	<!-- Shutdown Confirmation Dialog -->
	{#if systemState.state === 'confirm-shutdown'}
		<div class="dialog-backdrop">
			<div class="confirm-dialog">
				<div class="dialog-icon shutdown-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
					</svg>
				</div>
				<div class="dialog-content">
					<h3>Are you sure you want to shut down your computer now?</h3>
				</div>
				<div class="dialog-buttons">
					<button class="btn btn-cancel" onclick={cancelConfirm}>Cancel</button>
					<button class="btn btn-primary" onclick={confirmShutdown}>Shut Down</button>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Restart Confirmation Dialog -->
	{#if systemState.state === 'confirm-restart'}
		<div class="dialog-backdrop">
			<div class="confirm-dialog">
				<div class="dialog-icon restart-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
					</svg>
				</div>
				<div class="dialog-content">
					<h3>Are you sure you want to restart your computer now?</h3>
				</div>
				<div class="dialog-buttons">
					<button class="btn btn-cancel" onclick={cancelConfirm}>Cancel</button>
					<button class="btn btn-primary" onclick={confirmRestart}>Restart</button>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Logout Confirmation Dialog -->
	{#if systemState.state === 'confirm-logout'}
		<div class="dialog-backdrop">
			<div class="confirm-dialog">
				<div class="dialog-icon logout-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
					</svg>
				</div>
				<div class="dialog-content">
					<h3>Are you sure you want to log out now?</h3>
				</div>
				<div class="dialog-buttons">
					<button class="btn btn-cancel" onclick={cancelConfirm}>Cancel</button>
					<button class="btn btn-primary" onclick={confirmLogout}>Log Out</button>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Sleep Mode -->
	{#if systemState.state === 'sleeping'}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="overlay sleep-overlay" onclick={handleWake}>
			{#if showWakeMessage}
				<div class="wake-message">
					<div class="wake-text">Click or press any key to wake</div>
				</div>
			{/if}
		</div>
	{/if}
	
	<!-- Lock Screen -->
	{#if systemState.state === 'locked'}
		<div class="lock-screen">
			<div class="lock-content">
				<div class="profile-picture">
					<img src="/purus-profile/pexels-ahmedadly-1270184.jpg" alt="Profile" />
				</div>
				<div class="profile-name">Prasidh P Shetty</div>
				<div class="password-container" class:shake={showPasswordError}>
					<input 
						type="password" 
						placeholder="Enter Password"
						bind:value={password}
						onkeydown={handlePasswordKeydown}
					/>
					<button class="login-arrow" onclick={handleLogin}>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
						</svg>
					</button>
				</div>
				<div class="hint-text">Enter any password to unlock</div>
			</div>
		</div>
	{/if}
	
	<!-- Shutdown Animation -->
	{#if systemState.state === 'shutting-down'}
		<div class="overlay shutting-down">
			<div class="shutdown-content">
				<div class="apple-logo">
					<AppleIcon />
				</div>
				<div class="progress-container">
					<div class="progress-bar">
						<div class="progress"></div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Restart Animation -->
	{#if systemState.state === 'restarting'}
		<div class="overlay restarting">
			<div class="restart-content">
				<div class="apple-logo restart-logo">
					<AppleIcon />
				</div>
				<div class="progress-container restart-progress-container">
					<div class="progress-bar">
						<div class="progress restart-progress"></div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Off State - Power Button -->
	{#if systemState.state === 'off'}
		<div class="overlay off">
			{#if showPowerButton}
				<button class="power-button" onclick={boot} aria-label="Power on">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
					</svg>
				</button>
			{/if}
		</div>
	{/if}
	
	<!-- Boot Animation -->
	{#if systemState.state === 'booting'}
		<div class="overlay booting">
			<div class="boot-content">
				<div class="apple-logo boot-logo">
					<AppleIcon />
				</div>
				<div class="progress-container">
					<div class="progress-bar">
						<div class="progress boot-progress"></div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}


<style>
	/* Confirmation Dialog */
	.dialog-backdrop {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(5px);
		animation: backdropFadeIn 0.2s ease;
	}

	@keyframes backdropFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.confirm-dialog {
		background: rgba(40, 40, 40, 0.95);
		border-radius: 12px;
		padding: 20px 24px;
		min-width: 280px;
		max-width: 320px;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		animation: dialogSlideIn 0.25s ease;
	}

	@keyframes dialogSlideIn {
		from { opacity: 0; transform: scale(0.95) translateY(-10px); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}

	.dialog-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 12px;
	}

	.dialog-icon.shutdown-icon { color: #ff5f57; }
	.dialog-icon.restart-icon { color: #febc2e; }
	.dialog-icon.logout-icon { color: #28c840; }

	.dialog-icon svg {
		width: 100%;
		height: 100%;
	}

	.dialog-content h3 {
		color: #fff;
		font-size: 13px;
		font-weight: 400;
		line-height: 1.5;
		margin: 0 0 20px;
	}

	.dialog-buttons {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.btn {
		padding: 6px 16px;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
	}

	.btn-cancel {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.btn-cancel:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.btn-primary {
		background: #0a84ff;
		color: #fff;
	}

	.btn-primary:hover {
		background: #409cff;
	}

	/* Sleep Mode */
	.sleep-overlay {
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		animation: sleepFadeIn 2s ease forwards;
	}

	@keyframes sleepFadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	.wake-message {
		animation: wakeFadeIn 1s ease forwards;
		opacity: 0;
	}

	@keyframes wakeFadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	.wake-text {
		color: rgba(255, 255, 255, 0.5);
		font-size: 14px;
		font-weight: 300;
		letter-spacing: 0.5px;
		animation: wakePulse 2s ease-in-out infinite;
	}

	@keyframes wakePulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 0.8; }
	}

	/* Lock Screen */
	.lock-screen {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		background-size: cover;
		animation: lockFadeIn 0.5s ease forwards;
	}

	@keyframes lockFadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	.lock-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.profile-picture {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.profile-picture img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-name {
		color: #fff;
		font-size: 20px;
		font-weight: 500;
		margin-top: 8px;
	}

	.password-container {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 25px;
		padding: 4px 4px 4px 16px;
		margin-top: 8px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.password-container.shake {
		animation: shake 0.5s ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-10px); }
		40% { transform: translateX(10px); }
		60% { transform: translateX(-10px); }
		80% { transform: translateX(10px); }
	}

	.password-container input {
		background: transparent;
		border: none;
		outline: none;
		color: #fff;
		font-size: 14px;
		width: 160px;
		padding: 8px 0;
	}

	.password-container input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.login-arrow {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.login-arrow:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.login-arrow svg {
		width: 18px;
		height: 18px;
	}

	.hint-text {
		color: rgba(255, 255, 255, 0.4);
		font-size: 11px;
		margin-top: 4px;
	}

	/* Overlay Base */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	/* Shutdown Animation */
	.overlay.shutting-down {
		animation: quickDim 0.5s ease forwards;
	}

	@keyframes quickDim {
		0% { background: rgba(0, 0, 0, 0); }
		100% { background: #000; }
	}

	.shutdown-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		animation: contentFadeIn 0.8s ease forwards;
		animation-delay: 0.5s;
		opacity: 0;
	}

	.apple-logo {
		color: #fff;
		opacity: 0;
		animation: logoFadeIn 0.8s ease forwards;
		animation-delay: 0.6s;
	}

	.apple-logo :global(svg) {
		font-size: 5rem;
		filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.15));
	}

	@keyframes logoFadeIn {
		0% { opacity: 0; transform: scale(0.95); }
		100% { opacity: 1; transform: scale(1); }
	}

	@keyframes contentFadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	.progress-container {
		width: 180px;
		opacity: 0;
		animation: progressFadeIn 0.5s ease forwards;
		animation-delay: 1s;
	}

	@keyframes progressFadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	.progress-bar {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background: #fff;
		border-radius: 2px;
		width: 0%;
		animation: progressShutdown 3.5s ease-in-out forwards;
		animation-delay: 1.2s;
	}

	@keyframes progressShutdown {
		0% { width: 0%; }
		10% { width: 8%; }
		25% { width: 22%; }
		40% { width: 40%; }
		55% { width: 58%; }
		70% { width: 75%; }
		85% { width: 90%; }
		100% { width: 100%; }
	}

	/* Restart Animation */
	.overlay.restarting {
		background: #000;
		animation: restartFadeOut 0.8s ease forwards;
		animation-delay: 11s;
	}

	@keyframes restartFadeOut {
		0% { opacity: 1; }
		100% { opacity: 0; pointer-events: none; }
	}

	.restart-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		opacity: 1;
	}

	.restart-logo {
		opacity: 0;
		animation: logoFadeIn 0.8s ease forwards;
		animation-delay: 3s;
	}

	.restart-progress-container {
		opacity: 0;
		animation: progressFadeIn 0.5s ease forwards;
		animation-delay: 6s;
	}

	.restart-progress {
		animation: progressRestart 5s ease-in-out forwards;
		animation-delay: 6.3s;
	}

	@keyframes progressRestart {
		0% { width: 0%; }
		8% { width: 5%; }
		20% { width: 18%; }
		35% { width: 35%; }
		50% { width: 52%; }
		65% { width: 70%; }
		80% { width: 88%; }
		95% { width: 98%; }
		100% { width: 100%; }
	}

	/* Off State */
	.overlay.off {
		background: #000;
	}

	.power-button {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background: transparent;
		border: 1.5px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		transition: all 0.4s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: powerButtonFadeIn 1s ease forwards;
		opacity: 0;
	}

	.power-button svg {
		width: 32px;
		height: 32px;
	}

	.power-button:hover {
		border-color: rgba(255, 255, 255, 0.6);
		color: rgba(255, 255, 255, 0.8);
		transform: scale(1.08);
		box-shadow: 0 0 50px rgba(255, 255, 255, 0.1);
	}

	.power-button:active {
		transform: scale(0.95);
		transition: transform 0.1s ease;
	}

	@keyframes powerButtonFadeIn {
		0% { opacity: 0; transform: scale(0.9); }
		100% { opacity: 1; transform: scale(1); }
	}

	/* Boot Animation */
	.overlay.booting {
		background: #000;
		animation: bootFadeOut 0.8s ease forwards;
		animation-delay: 4.2s;
	}

	@keyframes bootFadeOut {
		0% { opacity: 1; }
		100% { opacity: 0; pointer-events: none; }
	}

	.boot-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		animation: contentFadeIn 0.6s ease forwards;
		animation-delay: 0.2s;
		opacity: 0;
	}

	.boot-logo {
		animation: logoFadeIn 0.6s ease forwards, bootLogoGlow 2.5s ease-in-out infinite;
		animation-delay: 0.2s, 0.8s;
	}

	@keyframes bootLogoGlow {
		0%, 100% { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.15)); }
		50% { filter: drop-shadow(0 0 50px rgba(255, 255, 255, 0.35)); }
	}

	.boot-content .progress-container {
		animation-delay: 0.5s;
	}

	.boot-progress {
		animation: progressBoot 3.5s ease-out forwards;
		animation-delay: 0.7s;
	}

	@keyframes progressBoot {
		0% { width: 0%; }
		5% { width: 3%; }
		15% { width: 12%; }
		30% { width: 28%; }
		45% { width: 45%; }
		60% { width: 62%; }
		75% { width: 80%; }
		90% { width: 95%; }
		100% { width: 100%; }
	}
</style>
