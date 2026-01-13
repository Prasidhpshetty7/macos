// macOS System Sounds utility
// Real macOS only has startup chime - no click/open/close sounds

export function playStartupSound() {
	try {
		const audio = new Audio('/sounds/mac-startup-sound.mp3');
		audio.volume = 1.0;
		audio.play().catch(() => {});
	} catch {
		// Ignore errors
	}
}
