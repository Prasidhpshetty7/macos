<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrame: number;
	let columns: number[] = [];
	let fontSize = 14;
	let isRunning = $state(true);
	let speed = $state(50); // 1-100
	let colorScheme = $state('green'); // green, blue, red, purple, rainbow
	
	// Matrix characters (mix of katakana, latin, numbers, symbols)
	const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
	
	const colors = {
		green: { main: '#0F0', trail: 'rgba(0, 255, 0, 0.05)' },
		blue: { main: '#00F', trail: 'rgba(0, 100, 255, 0.05)' },
		red: { main: '#F00', trail: 'rgba(255, 0, 0, 0.05)' },
		purple: { main: '#B026FF', trail: 'rgba(176, 38, 255, 0.05)' },
		rainbow: { main: '#0F0', trail: 'rgba(0, 255, 0, 0.05)' } // changes dynamically
	};
	
	function initMatrix() {
		if (!canvas) return;
		
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		ctx = canvas.getContext('2d');
		
		const columnCount = Math.floor(canvas.width / fontSize);
		columns = Array(columnCount).fill(1);
	}
	
	function drawMatrix() {
		if (!ctx || !canvas || !isRunning) return;
		
		// Fade effect for trail
		ctx.fillStyle = colors[colorScheme].trail;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Draw characters
		ctx.font = `${fontSize}px monospace`;
		
		for (let i = 0; i < columns.length; i++) {
			const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
			const x = i * fontSize;
			const y = columns[i] * fontSize;
			
			// Rainbow mode changes color per column
			if (colorScheme === 'rainbow') {
				const hue = (i * 137.5) % 360; // Golden angle for nice distribution
				ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
			} else {
				ctx.fillStyle = colors[colorScheme].main;
			}
			
			ctx.fillText(char, x, y);
			
			// Reset column to top randomly based on speed
			const resetChance = (101 - speed) / 100;
			if (y > canvas.height && Math.random() > resetChance) {
				columns[i] = 0;
			}
			
			columns[i]++;
		}
		
		// Adjust frame rate based on speed
		const delay = Math.max(10, 100 - speed);
		setTimeout(() => {
			animationFrame = requestAnimationFrame(drawMatrix);
		}, delay);
	}
	
	function togglePause() {
		isRunning = !isRunning;
		if (isRunning) {
			drawMatrix();
		}
	}
	
	function resetMatrix() {
		columns = columns.map(() => Math.floor(Math.random() * canvas.height / fontSize));
	}
	
	onMount(() => {
		initMatrix();
		drawMatrix();
		
		// Resize handler
		const handleResize = () => {
			initMatrix();
		};
		window.addEventListener('resize', handleResize);
		
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
	
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<section class="matrix-rain">
	<canvas bind:this={canvas}></canvas>
	
	<div class="controls">
		<div class="control-panel">
			<button class="control-btn" onclick={togglePause}>
				{#if isRunning}
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
					</svg>
					Pause
				{:else}
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z"/>
					</svg>
					Play
				{/if}
			</button>
			
			<button class="control-btn" onclick={resetMatrix}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M1 4v6h6M23 20v-6h-6"/>
					<path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
				</svg>
				Reset
			</button>
			
			<div class="control-group">
				<label>Speed</label>
				<input 
					type="range" 
					min="1" 
					max="100" 
					bind:value={speed}
					class="slider"
				/>
				<span class="value">{speed}%</span>
			</div>
			
			<div class="control-group">
				<label>Color</label>
				<div class="color-buttons">
					<button 
						class="color-btn green" 
						class:active={colorScheme === 'green'}
						onclick={() => colorScheme = 'green'}
					></button>
					<button 
						class="color-btn blue" 
						class:active={colorScheme === 'blue'}
						onclick={() => colorScheme = 'blue'}
					></button>
					<button 
						class="color-btn red" 
						class:active={colorScheme === 'red'}
						onclick={() => colorScheme = 'red'}
					></button>
					<button 
						class="color-btn purple" 
						class:active={colorScheme === 'purple'}
						onclick={() => colorScheme = 'purple'}
					></button>
					<button 
						class="color-btn rainbow" 
						class:active={colorScheme === 'rainbow'}
						onclick={() => colorScheme = 'rainbow'}
					></button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="info">
		<div class="info-text">Matrix Digital Rain</div>
		<div class="info-subtext">Press ESC to show/hide controls</div>
	</div>
</section>

<style>
	.matrix-rain {
		width: 100%;
		height: 100%;
		position: relative;
		background: #000;
		border-radius: inherit;
		overflow: hidden;
	}
	
	canvas {
		width: 100%;
		height: 100%;
		display: block;
		background: #000;
	}
	
	.controls {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 70%, transparent 100%);
		padding: 20px;
		transform: translateY(0);
		transition: transform 0.3s ease;
		z-index: 10;
	}
	
	.matrix-rain:not(:hover) .controls {
		transform: translateY(-100%);
	}
	
	.control-panel {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
	}
	
	.control-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: rgba(0, 255, 0, 0.1);
		border: 1px solid rgba(0, 255, 0, 0.3);
		border-radius: 8px;
		color: #0f0;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'SF Pro Text', -apple-system, sans-serif;
	}
	
	.control-btn:hover {
		background: rgba(0, 255, 0, 0.2);
		border-color: rgba(0, 255, 0, 0.5);
		transform: translateY(-1px);
	}
	
	.control-btn svg {
		width: 16px;
		height: 16px;
	}
	
	.control-group {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		background: rgba(0, 255, 0, 0.05);
		border: 1px solid rgba(0, 255, 0, 0.2);
		border-radius: 8px;
	}
	
	.control-group label {
		color: #0f0;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.slider {
		width: 120px;
		height: 4px;
		background: rgba(0, 255, 0, 0.2);
		border-radius: 2px;
		outline: none;
		-webkit-appearance: none;
	}
	
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: #0f0;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}
	
	.slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: #0f0;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}
	
	.value {
		color: #0f0;
		font-size: 12px;
		font-weight: 700;
		min-width: 40px;
		font-family: monospace;
	}
	
	.color-buttons {
		display: flex;
		gap: 8px;
	}
	
	.color-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
	}
	
	.color-btn:hover {
		transform: scale(1.1);
	}
	
	.color-btn.active {
		border-color: #fff;
		box-shadow: 0 0 12px currentColor;
	}
	
	.color-btn.green {
		background: #0f0;
	}
	
	.color-btn.blue {
		background: #00f;
	}
	
	.color-btn.red {
		background: #f00;
	}
	
	.color-btn.purple {
		background: #b026ff;
	}
	
	.color-btn.rainbow {
		background: linear-gradient(135deg, 
			#ff0000 0%, 
			#ff7f00 16.66%, 
			#ffff00 33.33%, 
			#00ff00 50%, 
			#0000ff 66.66%, 
			#4b0082 83.33%, 
			#9400d3 100%
		);
	}
	
	.info {
		position: absolute;
		bottom: 20px;
		left: 20px;
		pointer-events: none;
		opacity: 0.7;
		transition: opacity 0.3s;
	}
	
	.matrix-rain:hover .info {
		opacity: 0.3;
	}
	
	.info-text {
		color: #0f0;
		font-size: 14px;
		font-weight: 700;
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
		font-family: monospace;
		margin-bottom: 4px;
	}
	
	.info-subtext {
		color: #0f0;
		font-size: 11px;
		opacity: 0.6;
		font-family: monospace;
	}
</style>
