<script lang="ts">
import { musicState, togglePlay, playNext, playPrev, setVolume, seekTo, formatTime } from '🍎/state/music.svelte.ts';

let showPopup = $state(false);

function togglePopup() {
	showPopup = !showPopup;
}

function closePopup() {
	showPopup = false;
}
</script>

<svelte:window onclick={closePopup} />

{#if musicState.currentSong}
	<div class="music-control">
		<button class="music-btn" onclick={(e) => { e.stopPropagation(); togglePopup(); }} aria-label="Music controls">
			<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
				<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
			</svg>
		</button>
		
		{#if showPopup}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="music-popup" onclick={(e) => e.stopPropagation()}>
				<div class="popup-header">
					<div class="popup-cover">{musicState.currentSong.cover}</div>
					<div class="popup-info">
						<span class="popup-title">{musicState.currentSong.title}</span>
						<span class="popup-artist">{musicState.currentSong.artist}</span>
					</div>
				</div>
				
				<div class="popup-progress">
					<div class="progress-times">
						<span>{formatTime(musicState.currentTime)}</span>
						<span>{musicState.currentSong.duration}</span>
					</div>
					<input 
						type="range" 
						class="progress-slider"
						min="0" 
						max="100" 
						value={musicState.progress} 
						style="--progress-percent: {musicState.progress}%"
						onclick={(e) => e.stopPropagation()}
						onmousedown={(e) => e.stopPropagation()}
						oninput={(e) => seekTo(parseInt((e.target as HTMLInputElement).value) / 100)} 
					/>
				</div>
				
				<div class="popup-controls">
					<button class="ctrl-btn" onclick={() => playPrev()}>
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
					</button>
					<button class="ctrl-btn play" onclick={() => togglePlay()}>
						{#if musicState.isPlaying}
							<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
						{/if}
					</button>
					<button class="ctrl-btn" onclick={() => playNext()}>
						<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
					</button>
				</div>
				
				<div class="popup-volume">
					<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
					</svg>
					<input 
						type="range" 
						min="0" 
						max="100" 
						value={musicState.volume} 
						style="--vol-percent: {musicState.volume}%" 
						onclick={(e) => e.stopPropagation()}
						onmousedown={(e) => e.stopPropagation()}
						oninput={(e) => setVolume(parseInt((e.target as HTMLInputElement).value))} 
					/>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.music-control {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.music-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
		height: 100%;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		border-radius: 4px;
	}
	
	.music-btn:hover {
		background: rgba(255,255,255,0.1);
	}
	
	.music-popup {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		width: 300px;
		background: rgba(40, 40, 40, 0.98);
		backdrop-filter: blur(30px);
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 10px 50px rgba(0,0,0,0.6);
		z-index: 1000;
		border: 1px solid rgba(255,255,255,0.1);
		animation: slideDown 0.15s ease-out;
	}
	
	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.popup-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}
	
	.popup-cover {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		flex-shrink: 0;
	}
	
	.popup-info {
		flex: 1;
		overflow: hidden;
	}
	
	.popup-title {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.popup-artist {
		display: block;
		font-size: 11px;
		color: #888;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.popup-progress {
		margin-bottom: 12px;
	}
	
	.progress-times {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		color: #888;
		margin-bottom: 6px;
	}
	
	.progress-slider {
		width: 100%;
		height: 4px;
		-webkit-appearance: none;
		background: linear-gradient(to right, #fa2d48 0%, #fa2d48 var(--progress-percent, 0%), rgba(255,255,255,0.2) var(--progress-percent, 0%), rgba(255,255,255,0.2) 100%);
		border-radius: 2px;
		cursor: pointer;
		outline: none;
	}
	
	.progress-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	}
	
	.progress-slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}
	
	.popup-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 12px;
	}
	
	.ctrl-btn {
		width: 32px;
		height: 32px;
		background: transparent;
		border: none;
		color: #fff;
		cursor: pointer;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.ctrl-btn:hover {
		background: rgba(255,255,255,0.1);
	}
	
	.ctrl-btn svg {
		width: 18px;
		height: 18px;
	}
	
	.ctrl-btn.play {
		width: 40px;
		height: 40px;
		background: #fff;
		color: #000;
	}
	
	.ctrl-btn.play:hover {
		transform: scale(1.05);
	}
	
	.ctrl-btn.play svg {
		width: 20px;
		height: 20px;
	}
	
	.popup-volume {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.popup-volume svg {
		color: #888;
		flex-shrink: 0;
	}
	
	.popup-volume input[type="range"] {
		flex: 1;
		height: 4px;
		-webkit-appearance: none;
		background: linear-gradient(to right, #fa2d48 0%, #fa2d48 var(--vol-percent, 80%), rgba(255,255,255,0.2) var(--vol-percent, 80%), rgba(255,255,255,0.2) 100%);
		border-radius: 2px;
		cursor: pointer;
		outline: none;
	}
	
	.popup-volume input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	}
	
	.popup-volume input[type="range"]::-moz-range-thumb {
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}
</style>
