// Desktop Spaces state for Mission Control
// Each desktop is independent - apps can only exist on ONE desktop at a time
// Moving an app transfers it completely to the new desktop

import { apps, type AppID } from './apps.svelte';

export interface DesktopSpace {
	id: number;
	wallpaper: string;
}

class SpacesManager {
	spaces = $state<DesktopSpace[]>([{ id: 1, wallpaper: 'default' }]);
	activeSpaceId = $state(1);
	windowSpaces = $state<Record<string, number>>({}); // appId -> spaceId (which desktop owns this window)
	maxSpaces = 10;
	
	get activeSpace() {
		return this.spaces.find(s => s.id === this.activeSpaceId) || this.spaces[0];
	}
	
	addSpace() {
		if (this.spaces.length >= this.maxSpaces) return null;
		const newId = Math.max(...this.spaces.map(s => s.id)) + 1;
		const newSpace: DesktopSpace = { id: newId, wallpaper: 'default' };
		this.spaces = [...this.spaces, newSpace];
		return newSpace;
	}
	
	removeSpace(spaceId: number) {
		if (this.spaces.length <= 1) return false;
		
		// Move all windows from this space to space 1
		Object.keys(this.windowSpaces).forEach(appId => {
			if (this.windowSpaces[appId] === spaceId) {
				this.windowSpaces[appId] = 1;
			}
		});
		
		this.spaces = this.spaces.filter(s => s.id !== spaceId);
		
		if (this.activeSpaceId === spaceId) {
			this.activeSpaceId = this.spaces[0].id;
		}
		return true;
	}
	
	switchToSpace(spaceId: number) {
		if (this.spaces.find(s => s.id === spaceId)) {
			this.activeSpaceId = spaceId;
		}
	}
	
	// Move window to another space - the window now belongs ONLY to that space
	moveWindowToSpace(appId: string, spaceId: number) {
		this.windowSpaces[appId] = spaceId;
	}
	
	getWindowSpace(appId: string): number {
		return this.windowSpaces[appId] || this.activeSpaceId;
	}
	
	// When opening an app, assign it to current active space
	assignWindowToCurrentSpace(appId: string) {
		if (!this.windowSpaces[appId]) {
			this.windowSpaces[appId] = this.activeSpaceId;
		}
	}
	
	// When closing an app, remove its space assignment
	removeWindowSpace(appId: string) {
		delete this.windowSpaces[appId];
	}
	
	setSpaceWallpaper(spaceId: number, wallpaper: string) {
		const space = this.spaces.find(s => s.id === spaceId);
		if (space) {
			space.wallpaper = wallpaper;
		}
	}
	
	isWindowInActiveSpace(appId: string): boolean {
		const windowSpace = this.getWindowSpace(appId);
		return windowSpace === this.activeSpaceId;
	}
	
	// Check if an app is open in a specific space
	isAppOpenInSpace(appId: string, spaceId: number): boolean {
		if (!apps.open[appId as AppID] && !apps.running[appId as AppID]) return false;
		return this.getWindowSpace(appId) === spaceId;
	}
	
	// Get all open apps in a specific space
	getAppsInSpace(spaceId: number): string[] {
		return Object.entries(this.windowSpaces)
			.filter(([appId, space]) => space === spaceId && (apps.open[appId as AppID] || apps.running[appId as AppID]))
			.map(([appId]) => appId);
	}
}

export const spacesManager = new SpacesManager();
