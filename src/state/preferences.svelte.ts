import { colors } from '🍎/configs/theme/colors.config.ts';
import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
import { wallpapers_config } from '🍎/configs/wallpapers/wallpaper.config.ts';
import { persisted } from './persisted.svelte.ts';

export type WallpaperSettings = {
	id: WallpaperID;
	image: string;
	canControlTheme: boolean;
};

export type Theme = {
	scheme: 'light' | 'dark';
	primaryColor: keyof typeof colors;
};

// Check if we need to reset preferences (for wallpaper fix)
const PREFERENCES_VERSION = 2;
const storedPrefs = localStorage.getItem('macos:preferences');
let needsReset = false;

if (storedPrefs) {
	try {
		const parsed = JSON.parse(storedPrefs);
		if (!parsed.version || parsed.version < PREFERENCES_VERSION) {
			needsReset = true;
			localStorage.removeItem('macos:preferences');
		}
	} catch (e) {
		needsReset = true;
		localStorage.removeItem('macos:preferences');
	}
}

export const preferences = persisted('macos:preferences', {
	version: PREFERENCES_VERSION,
	reduced_motion: matchMedia('(prefers-reduced-motion)').matches,
	theme: {
		scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primaryColor: 'blue',
	} as Theme,
	wallpaper: {
		image: wallpapers_config.iridescence.image,
		id: 'iridescence',
		canControlTheme: true,
	} as WallpaperSettings,
});

$effect.root(() => {
	$effect(() => {
		// Color scheme
		const { classList } = document.body;
		classList.remove('light', 'dark');
		classList.add(preferences.theme.scheme);

		// Primary color
		const colorObj = colors[preferences.theme.primaryColor][preferences.theme.scheme];
		document.body.style.setProperty('--system-color-primary', `hsl(${colorObj.hsl})`);
		document.body.style.setProperty('--system-color-primary-hsl', `${colorObj.hsl}`);
		document.body.style.setProperty(
			'--system-color-primary-contrast',
			`hsl(${colorObj.contrastHsl})`,
		);
		document.body.style.setProperty(
			'--system-color-primary-contrast-hsl',
			`${colorObj.contrastHsl}`,
		);
	});
});
