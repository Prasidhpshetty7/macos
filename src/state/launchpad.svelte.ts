// Launchpad state - controls the app launcher overlay

export const launchpadState = $state({
	isOpen: false
});

export function openLaunchpad() {
	launchpadState.isOpen = true;
}

export function closeLaunchpad() {
	launchpadState.isOpen = false;
}

export function toggleLaunchpad() {
	launchpadState.isOpen = !launchpadState.isOpen;
}
