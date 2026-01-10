import { persisted } from './persisted.svelte.ts';
import { stopMusic } from './music.svelte.ts';

export type SystemState = 'running' | 'confirm-shutdown' | 'confirm-restart' | 'confirm-logout' | 'shutting-down' | 'restarting' | 'sleeping' | 'locked' | 'off' | 'booting';

// Original system_needs_update for PWA updates
export const system_needs_update = $state({ value: false });

export const systemState = persisted('macos:system', {
	state: 'running' as SystemState,
});

// Reset stuck states on page load (transitional states shouldn't persist)
if (['shutting-down', 'restarting', 'booting', 'confirm-shutdown', 'confirm-restart', 'confirm-logout'].includes(systemState.state)) {
	systemState.state = 'running';
}

// About This Mac dialog state
export const showAboutMac = $state({ value: false });

export function openAboutMac() {
	showAboutMac.value = true;
}

export function closeAboutMac() {
	showAboutMac.value = false;
}

// Show shutdown confirmation dialog
export function requestShutdown() {
	if (systemState.state !== 'running') return;
	systemState.state = 'confirm-shutdown';
}

// Show restart confirmation dialog
export function requestRestart() {
	if (systemState.state !== 'running') return;
	systemState.state = 'confirm-restart';
}

// Show logout confirmation dialog
export function requestLogout() {
	if (systemState.state !== 'running') return;
	systemState.state = 'confirm-logout';
}

// Cancel any confirmation
export function cancelConfirm() {
	if (!systemState.state.startsWith('confirm-')) return;
	systemState.state = 'running';
}

// Confirm and start shutdown
export function confirmShutdown() {
	if (systemState.state !== 'confirm-shutdown') return;
	stopMusic(); // Stop music on shutdown
	systemState.state = 'shutting-down';
	
	setTimeout(() => {
		systemState.state = 'off';
	}, 5000);
}

// Confirm and start restart
export function confirmRestart() {
	if (systemState.state !== 'confirm-restart') return;
	stopMusic(); // Stop music on restart
	systemState.state = 'restarting';
	
	setTimeout(() => {
		systemState.state = 'running';
	}, 11500);
}

// Confirm logout - goes to lock screen
export function confirmLogout() {
	if (systemState.state !== 'confirm-logout') return;
	stopMusic(); // Stop music on logout
	systemState.state = 'locked';
}

// Sleep mode
export function sleep() {
	if (systemState.state !== 'running') return;
	stopMusic(); // Stop music on sleep
	systemState.state = 'sleeping';
}

// Wake from sleep
export function wake() {
	if (systemState.state !== 'sleeping') return;
	systemState.state = 'running';
}

// Lock screen
export function lockScreen() {
	if (systemState.state !== 'running') return;
	stopMusic(); // Stop music on lock
	systemState.state = 'locked';
}

// Unlock screen
export function unlock() {
	if (systemState.state !== 'locked') return;
	systemState.state = 'running';
}

// Boot from off
export function boot() {
	if (systemState.state !== 'off') return;
	systemState.state = 'booting';
	
	setTimeout(() => {
		systemState.state = 'running';
	}, 5000);
}
