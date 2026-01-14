// Mission Control state - using object wrapper for reactivity across files

class MissionControlState {
	isOpen = $state(false);
	
	open() {
		this.isOpen = true;
	}
	
	close() {
		this.isOpen = false;
	}
	
	toggle() {
		this.isOpen = !this.isOpen;
	}
}

export const missionControl = new MissionControlState();
