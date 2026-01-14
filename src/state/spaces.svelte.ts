// Desktop Spaces state - for Mission Control multiple desktops

import { apps, type AppID } from './apps.svelte';

export type DesktopSpace = {
	id: number;
	wallpaper: string;
	windows: AppID[]; // Windows assigned to this desktop
};

// Default wallpaper
const defaultWallpaper = 'ventura-dark';

// Create initial desktop
const initialSpaces: DesktopSpace[] = [
	{ id: 1, wallpaper: defaultWallpaper, windows: [] }
];

export const spacesState = $state({
	spaces: initialSpaces as DesktopSpace[],
	activeSpaceId: 1,
	maxSpaces: 10,
});

// Get current active space
export function getActiveSpace(): DesktopSpace {
	return spacesState.spaces.find(s => s.id === spacesState.activeSpaceId) || spacesState.spaces[0];
}

// Add a new desktop space
export function addSpace(): DesktopSpace | null {
	if (spacesState.spaces.length >= spacesState.maxSpaces) return null;
	
	const newId = Math.max(...spacesState.spaces.map(s => s.id)) + 1;
	const newSpace: DesktopSpace = {
		id: newId,
		wallpaper: defaultWallpaper,
		windows: []
	};
	
	spacesState.spaces = [...spacesState.spaces, newSpace];
	return newSpace;
}

// Remove a desktop space (can't remove last one)
export function removeSpace(spaceId: number): boolean {
	if (spacesState.spaces.length <= 1) return false;
	
	const space = spacesState.spaces.find(s => s.id === spaceId);
	if (!space) return false;
	
	// Move windows to first space
	const firstSpace = spacesState.spaces[0];
	if (firstSpace && space.windows.length > 0) {
		firstSpace.windows = [...firstSpace.windows, ...space.windows];
	}
	
	spacesState.spaces = spacesState.spaces.filter(s => s.id !== spaceId);
	
	// If active space was removed, switch to first
	if (spacesState.activeSpaceId === spaceId) {
		spacesState.activeSpaceId = spacesState.spaces[0].id;
	}
	
	return true;
}

// Switch to a different desktop space
export function switchToSpace(spaceId: number) {
	const space = spacesState.spaces.find(s => s.id === spaceId);
	if (space) {
		spacesState.activeSpaceId = spaceId;
	}
}

// Move a window to a different space
export function moveWindowToSpace(appId: AppID, targetSpaceId: number) {
	// Remove from all spaces first
	spacesState.spaces.forEach(space => {
		space.windows = space.windows.filter(w => w !== appId);
	});
	
	// Add to target space
	const targetSpace = spacesState.spaces.find(s => s.id === targetSpaceId);
	if (targetSpace) {
		targetSpace.windows = [...targetSpace.windows, appId];
	}
}

// Get which space a window belongs to (or null if not assigned)
export function getWindowSpace(appId: AppID): number | null {
	for (const space of spacesState.spaces) {
		if (space.windows.includes(appId)) {
			return space.id;
		}
	}
	return null;
}

// Set wallpaper for a space
export function setSpaceWallpaper(spaceId: number, wallpaper: string) {
	const space = spacesState.spaces.find(s => s.id === spaceId);
	if (space) {
		space.wallpaper = wallpaper;
	}
}

// Get windows for current active space (or all if not assigned)
export function getVisibleWindows(): AppID[] {
	const activeSpace = getActiveSpace();
	
	// Get all open windows
	const allOpenWindows = Object.entries(apps.open)
		.filter(([_, isOpen]) => isOpen)
		.map(([id]) => id as AppID);
	
	// If window is assigned to a space, only show if it's the active space
	// If window is not assigned to any space, show it on all spaces
	return allOpenWindows.filter(appId => {
		const windowSpace = getWindowSpace(appId);
		return windowSpace === null || windowSpace === activeSpace.id;
	});
}
