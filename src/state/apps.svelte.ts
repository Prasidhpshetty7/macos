import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

export const apps = $state({
	open: {
		finder: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,

	// Track which apps are running (even if minimized)
	running: {
		finder: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
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
		finder: 0,
		safari: 0,
		wallpapers: 0,
		calculator: 0,
		calendar: 0,
		vscode: 0,
		appstore: 0,
		'purus-twitter': 0,
		'view-source': 0,
		vercel: 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		finder: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,

	minimized: {
		finder: false,
		safari: false,
		wallpapers: false,
		calculator: false,
		calendar: false,
		vscode: false,
		appstore: false,
		'purus-twitter': false,
		'view-source': false,
		vercel: false,
	} as Record<AppID, boolean>,
});
