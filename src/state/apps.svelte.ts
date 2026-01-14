import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

export const apps = $state({
	open: {
		'mission-control': false,
		finder: false,
		launchpad: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		music: false,
		chess: false,
		drift: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,

	// Track which apps are running (even if minimized)
	running: {
		'mission-control': false,
		finder: false,
		launchpad: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		music: false,
		chess: false,
		drift: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,

	active: 'finder' satisfies AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: {
		'mission-control': 0,
		finder: 0,
		launchpad: 0,
		safari: 0,
		wallpapers: 0,
		calculator: 0,
		calendar: 0,
		vscode: 0,
		appstore: 0,
		music: 0,
		chess: 0,
		drift: 0,
		'purus-twitter': 0,
		'view-source': 0,
		vercel: 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		'mission-control': false,
		finder: false,
		launchpad: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		music: false,
		chess: false,
		drift: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,

	minimized: {
		'mission-control': false,
		finder: false,
		launchpad: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		music: false,
		chess: false,
		drift: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,
});
