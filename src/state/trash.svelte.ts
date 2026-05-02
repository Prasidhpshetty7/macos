// Trash state - manages deleted files

import type { DesktopFile } from './desktop-files.svelte';

export const trashState = $state({
	items: [] as DesktopFile[],
	isOpen: false
});

// Move file to trash
export function moveToTrash(file: DesktopFile) {
	trashState.items = [...trashState.items, file];
}

// Restore file from trash
export function restoreFromTrash(fileId: string) {
	trashState.items = trashState.items.filter(f => f.id !== fileId);
}

// Empty trash
export function emptyTrash() {
	trashState.items = [];
}

// Check if trash has items
export function isTrashFull() {
	return trashState.items.length > 0;
}
