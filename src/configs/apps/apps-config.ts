import { create_app_config } from '🍎/helpers/create-app-config.ts';

const wallpapers = create_app_config({
	title: 'Wallpapers',
	resizable: true,

	height: 600,
	width: 800,

	dock_breaks_before: true,
});

const calculator = create_app_config({
	title: 'Calculator',

	expandable: true,
	resizable: false,

	height: 250 * 1.414,
	width: 250,
});

const calendar = create_app_config({
	title: 'Calendar',
	resizable: true,
	height: 600,
	width: 800,
});

const vscode = create_app_config({
	title: 'VSCode',
	resizable: true,

	height: 600,
	width: 800,
});

const finder = create_app_config({
	title: 'Finder',
	resizable: true,

	// dockBreaksBefore: true,
	should_open_window: false,
});

const safari = create_app_config({
	title: 'Safari',
	resizable: true,
	height: 600,
	width: 800,
});

const systemPreferences = create_app_config({
	title: 'System Preferences',
	resizable: true,
	height: 600,
	width: 800,
});

const purusTwitter = create_app_config({
	title: `About Prasidh`,
	resizable: true,

	dock_breaks_before: true,

	height: 600,
	width: 800,
});

const viewSource = create_app_config({
	title: `GitHub`,
	resizable: true,

	should_open_window: false,
	external_action: () => window.open('https://github.com/Prasidhpshetty7', '_blank'),
});

const vercel = create_app_config({
	title: `Powered by Vercel`,
	resizable: true,

	should_open_window: false,
	external_action: () =>
		window.open('https://vercel.com/?utm_source=purus-projects&utm_campaign=oss', '_blank'),

	dock_breaks_before: true,
});

const appstore = create_app_config({
	title: 'App Store',
	resizable: true,
	height: 600,
	width: 800,
});

const music = create_app_config({
	title: 'Music',
	resizable: true,
	height: 600,
	width: 900,
	hide_from_dock: true,
});

const chess = create_app_config({
	title: 'Chess',
	resizable: true,
	height: 620,
	width: 520,
	hide_from_dock: true,
});

export const apps_config = {
	finder,
	safari,
	wallpapers,
	calculator,
	calendar,
	vscode,
	appstore,
	music,
	chess,

	// 'system-preferences': systemPreferences,

	'purus-twitter': purusTwitter,
	'view-source': viewSource,

	vercel,
};
