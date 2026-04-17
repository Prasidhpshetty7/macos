// Hot Corners state - trigger actions by moving mouse to screen corners

export type HotCornerAction = 'mission-control' | 'launchpad' | 'desktop' | 'sleep' | 'none';

export const hotCornersState = $state({
	topLeft: 'mission-control' as HotCornerAction,
	topRight: 'desktop' as HotCornerAction,
	bottomLeft: 'launchpad' as HotCornerAction,
	bottomRight: 'none' as HotCornerAction,
	enabled: true,
	triggerDelay: 500, // ms to hover before triggering
});

export function setHotCorner(corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', action: HotCornerAction) {
	hotCornersState[corner] = action;
}

export function toggleHotCorners() {
	hotCornersState.enabled = !hotCornersState.enabled;
}
