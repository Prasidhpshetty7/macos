<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationId: number;
	
	// Matrix settings
	let speed = $state(50);
	let color = $state('#0F0'); // Matrix green
	let fontSize = $state(16);
	let isRunning = $state(true);
	let showControls = $state(true);
	let columns = 0;
	let drops: number[] = [];
	
	// Character set - Katakana + Latin + Numbers
	const chars = 'ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
	
	onMount(() => {
		if (!canvas) return;
		
		ctx = canvas.getContext('2d');
		resizeCanvas();
		
		window.addEventListener('resize', resizeCanvas);
		
		if (isRunning) {
			draw();
		}
		
		// Hide controls after 3 seconds
		setTimeout(() => {
			showControls = false;
		}, 3000);
		
		return () => {
			window.removeEventListener('resize', resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
	
	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});
	
	function resizeCanvas() {
		if (!canvas) return;
		
		const container = canvas.parentElement;
		if (!container) return;
		
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;
		
		// Calculate columns and reset drops
		columns = Math.floor(canvas.width / fontSize);
		drops = Array(columns).fill(1);
	}
	
	function draw() {
		if (!ctx || !canvas) return;
		
		// Semi-transparent black for fade effect
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = color;
		ctx.font = `${fontSize}px monospace`;
		
		// Draw characters
		for (let i = 0; i < drops.length; i++) {
			// Random character
			const char = chars[Math.floor(Math.random() * chars.length)];
			const x = i * fontSize;
			const y = drops[i] * fontSize;
			
			ctx.fillText(char, x, y);
			
			// Reset drop randomly or when it reaches bottom
			if (y > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			}
			
			drops[i]++;
		}
		
		if (isRunning) {
			animationId = requestAnimationFrame(draw);
		}
	}
	
	function togglePause() {
		isRunning = !isRunning;
		if (isRunning) {
			draw();
		}
	}
	
	function reset() {
		drops = Array(columns).fill(1);
		if (ctx && canvas) {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}
	
	function changeColor(newColor: string) {
		color = newColor;
	}
	
	$effect(() => {
		if (fontSize) {
			resizeCanvas();
			reset();
		}
	});
	
	function toggleControls() {
		showControls = !showControls;
	}
</script>

<section class="matrix-rain" onmousemove={() => { showControls = true; setTimeout(() => showControls = false, 3000); }}>
	<canvas bind:this={canvas}></canvas>
	
	<div class="controls" class:visible={showControls}>
		<div class="control-panel">
			<div class="panel-header">
				<h3>🎮 Matrix Controls</h3>
				<button class="close-btn" onclick={toggleControls}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"/>
						<line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				</button>
			</div>
			
			<div class="control-group">
				<label>Speed: {speed}ms</label>
				<input 
					type="range" 
					min="10" 
					max="100" 
					bind:value={speed}
					class="slider"
				/>
			</div>
			
			<div class="control-group">
				<label>Font Size: {fontSize}px</label>
				<input 
					type="range" 
					min="10" 
					max="30" 
					bind:value={fontSize}
					class="slider"
				/>
			</div>
			
			<div class="control-group">
				<label>Color Theme</label>
				<div class="color-buttons">
					<button 
						class="color-btn" 
						class:active={color === '#0F0'}
						style="background: #0F0;"
						onclick={() => changeColor('#0F0')}
						title="Matrix Green"
					></button>
					<button 
						class="color-btn" 
						class:active={color === '#00F0FF'}
						style="background: #00F0FF;"
						onclick={() => changeColor('#00F0FF')}
						title="Cyan"
					></button>
					<button 
						class="color-btn" 
						class:active={color === '#FF00FF'}
						style="background: #FF00FF;"
						onclick={() => changeColor('#FF00FF')}
						title="Magenta"
					></button>
					<button 
						class="color-btn" 
						class:active={color === '#FFF'}
						style="background: #FFF;"
						onclick={() => changeColor('#FFF')}
						title="White"
					></button>
					<button 
						class="color-btn" 
						class:active={color === '#F00'}
						style="background: #F00;"
						onclick={() => changeColor('#F00')}
						title="Red"
					></button>
					<button 
						class="color-btn" 
						class:active={color === '#FFD700'}
						style="background: #FFD700;"
						onclick={() => changeColor('#FFD700')}
						title="Gold"
					></button>
				</div>
			</div>
			
			<div class="action-buttons">
				<button class="action-btn" onclick={togglePause}>
					{#if isRunning}
						<svg viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="4" width="4" height="16"/>
							<rect x="14" y="4" width="4" height="16"/>
						</svg>
						Pause
					{:else}
						<svg viewBox="0 0 24 24" fill="currentColor">
							<polygon points="5 3 19 12 5 21 5 3"/>
						</svg>
						Resume
					{/if}
				</button>
				<button class="action-btn" onclick={reset}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
					</svg>
					Reset
				</button>
			</div>
			
			<div class="info">
				<div class="info-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="7" height="7"/>
						<rect x="14" y="3" width="7" height="7"/>
						<rect x="14" y="14" width="7" height="7"/>
						<rect x="3" y="14" width="7" height="7"/>
					</svg>
					<span>{columns} Columns</span>
				</div>
				<div class="info-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
					</svg>
					<span>{chars.length} Characters</span>
				</div>
			</div>
		</div>
	</div>
	
	{#if !showControls}
		<button class="show-controls-btn" onclick={toggleControls}>
			⚙️
		</button>
	{/if}
</section>

<style>
	.matrix-rain {
		width: 100%;
		height: 100%;
		background: #000;
		position: relative;
		overflow: hidden;
		border-radius: inherit;
	}
	
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	
	.controls {
		position: absolute;
		top: 28px;
		right: 20px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		z-index: 10;
	}
	
	.controls.visible {
		opacity: 1;
		pointer-events: auto;
	}
	
	.control-panel {
		background: rgba(0, 0, 0, 0.95);
		border: 2px solid #0F0;
		border-radius: 12px;
		padding: 20px;
		width: 280px;
		box-shadow: 0 0 30px rgba(0, 255, 0, 0.3),
		            inset 0 0 20px rgba(0, 255, 0, 0.1);
		backdrop-filter: blur(10px);
	}
	
	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(0, 255, 0, 0.3);
	}
	
	.panel-header h3 {
		margin: 0;
		color: #0F0;
		font-size: 16px;
		font-weight: 700;
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}
	
	.close-btn {
		width: 28px;
		height: 28px;
		background: transparent;
		border: 1px solid rgba(0, 255, 0, 0.3);
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.close-btn svg {
		width: 16px;
		height: 16px;
		color: #0F0;
	}
	
	.close-btn:hover {
		background: rgba(0, 255, 0, 0.1);
		border-color: #0F0;
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
	}
	
	.control-group {
		margin-bottom: 20px;
	}
	
	.control-group label {
		display: block;
		color: #0F0;
		font-size: 13px;
		font-weight: 600;
		margin-bottom: 8px;
		text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
	}
	
	.slider {
		width: 100%;
		height: 6px;
		background: rgba(0, 255, 0, 0.2);
		border-radius: 3px;
		outline: none;
		-webkit-appearance: none;
	}
	
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		background: #0F0;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
		transition: all 0.2s;
	}
	
	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
	}
	
	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #0F0;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}
	
	.color-buttons {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
	}
	
	.color-btn {
		width: 36px;
		height: 36px;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
	}
	
	.color-btn:hover {
		transform: scale(1.1);
		border-color: rgba(255, 255, 255, 0.5);
	}
	
	.color-btn.active {
		border-color: #FFF;
		border-width: 3px;
		box-shadow: 0 0 15px currentColor;
	}
	
	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: 20px;
	}
	
	.action-btn {
		padding: 12px;
		background: rgba(0, 255, 0, 0.1);
		border: 1px solid rgba(0, 255, 0, 0.3);
		border-radius: 8px;
		color: #0F0;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: all 0.2s;
		text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
	}
	
	.action-btn svg {
		width: 16px;
		height: 16px;
	}
	
	.action-btn:hover {
		background: rgba(0, 255, 0, 0.2);
		border-color: #0F0;
		box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
		transform: translateY(-1px);
	}
	
	.info {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 16px;
		border-top: 1px solid rgba(0, 255, 0, 0.3);
	}
	
	.info-item {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #0F0;
		font-size: 12px;
		font-weight: 500;
	}
	
	.info-item svg {
		width: 18px;
		height: 18px;
		opacity: 0.7;
	}
	
	.show-controls-btn {
		position: absolute;
		top: 32px;
		right: 20px;
		width: 44px;
		height: 44px;
		background: rgba(0, 0, 0, 0.8);
		border: 2px solid #0F0;
		border-radius: 50%;
		cursor: pointer;
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
		z-index: 5;
	}
	
	.show-controls-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
		background: rgba(0, 0, 0, 0.95);
	}
</style>
