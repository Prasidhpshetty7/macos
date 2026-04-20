<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';
	
	const { app_id }: { app_id: AppID } = $props();
	
	let commandHistory = $state<string[]>([]);
	let historyIndex = $state(-1);
	let currentCommand = $state('');
	let output = $state<Array<{ type: 'command' | 'output' | 'error', text: string }>>([
		{ type: 'output', text: 'Last login: ' + new Date().toLocaleString() },
		{ type: 'output', text: 'Welcome to macOS Terminal' },
		{ type: 'output', text: '' }
	]);
	
	let inputEl: HTMLInputElement;
	let terminalEl: HTMLElement;
	
	const currentDir = $state({ path: '~' });
	
	const fileSystem = {
		'~': {
			type: 'dir',
			contents: {
				'Desktop': { type: 'dir', contents: {} },
				'Documents': { type: 'dir', contents: { 'readme.txt': { type: 'file', content: 'Hello from macOS!' } } },
				'Downloads': { type: 'dir', contents: {} },
				'Pictures': { type: 'dir', contents: {} },
				'Music': { type: 'dir', contents: {} },
			}
		}
	};
	
	function executeCommand(cmd: string) {
		const trimmed = cmd.trim();
		if (!trimmed) return;
		
		// Add to history
		commandHistory.push(trimmed);
		historyIndex = commandHistory.length;
		
		// Add command to output
		output.push({ type: 'command', text: `${currentDir.path} $ ${trimmed}` });
		
		// Parse command
		const parts = trimmed.split(' ');
		const command = parts[0];
		const args = parts.slice(1);
		
		// Execute command
		switch (command) {
			case 'help':
				output.push({ type: 'output', text: 'Available commands:' });
				output.push({ type: 'output', text: '  ls       - List directory contents' });
				output.push({ type: 'output', text: '  cd       - Change directory' });
				output.push({ type: 'output', text: '  pwd      - Print working directory' });
				output.push({ type: 'output', text: '  cat      - Display file contents' });
				output.push({ type: 'output', text: '  echo     - Print text' });
				output.push({ type: 'output', text: '  clear    - Clear terminal' });
				output.push({ type: 'output', text: '  date     - Show current date/time' });
				output.push({ type: 'output', text: '  whoami   - Show current user' });
				output.push({ type: 'output', text: '  uname    - Show system info' });
				break;
				
			case 'ls':
				const dir = fileSystem[currentDir.path as keyof typeof fileSystem];
				if (dir && dir.type === 'dir') {
					const items = Object.keys(dir.contents);
					if (items.length === 0) {
						output.push({ type: 'output', text: '' });
					} else {
						output.push({ type: 'output', text: items.join('  ') });
					}
				}
				break;
				
			case 'pwd':
				output.push({ type: 'output', text: currentDir.path });
				break;
				
			case 'cd':
				if (args.length === 0 || args[0] === '~') {
					currentDir.path = '~';
					output.push({ type: 'output', text: '' });
				} else {
					output.push({ type: 'error', text: `cd: ${args[0]}: No such file or directory` });
				}
				break;
				
			case 'cat':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'cat: missing file operand' });
				} else {
					output.push({ type: 'output', text: 'Hello from macOS Terminal!' });
				}
				break;
				
			case 'echo':
				output.push({ type: 'output', text: args.join(' ') });
				break;
				
			case 'clear':
				output = [];
				break;
				
			case 'date':
				output.push({ type: 'output', text: new Date().toString() });
				break;
				
			case 'whoami':
				output.push({ type: 'output', text: 'user' });
				break;
				
			case 'uname':
				if (args[0] === '-a') {
					output.push({ type: 'output', text: 'Darwin MacBook-Pro 23.0.0 Darwin Kernel Version 23.0.0 x86_64' });
				} else {
					output.push({ type: 'output', text: 'Darwin' });
				}
				break;
				
			default:
				output.push({ type: 'error', text: `zsh: command not found: ${command}` });
		}
		
		output.push({ type: 'output', text: '' });
		
		// Clear input
		currentCommand = '';
		
		// Scroll to bottom
		setTimeout(() => {
			if (terminalEl) {
				terminalEl.scrollTop = terminalEl.scrollHeight;
			}
		}, 0);
	}
	
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			executeCommand(currentCommand);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				currentCommand = commandHistory[historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentCommand = commandHistory[historyIndex];
			} else {
				historyIndex = commandHistory.length;
				currentCommand = '';
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			// Basic tab completion
			const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'date', 'whoami', 'uname'];
			const matches = commands.filter(cmd => cmd.startsWith(currentCommand));
			if (matches.length === 1) {
				currentCommand = matches[0];
			}
		}
	}
	
	function focusInput() {
		inputEl?.focus();
	}
</script>

<section class="terminal" onclick={focusInput}>
	<div class="terminal-header app-window-drag-handle">
		<span class="terminal-title">Terminal — zsh — 80×24</span>
	</div>
	
	<div class="terminal-content" bind:this={terminalEl}>
		{#each output as line}
			<div class="terminal-line {line.type}">
				{line.text}
			</div>
		{/each}
		
		<div class="terminal-input-line">
			<span class="prompt">{currentDir.path} $</span>
			<input
				bind:this={inputEl}
				bind:value={currentCommand}
				onkeydown={handleKeyDown}
				class="terminal-input"
				spellcheck="false"
				autocomplete="off"
			/>
		</div>
	</div>
</section>

<style>
	.terminal {
		width: 100%;
		height: 100%;
		background: #1e1e1e;
		display: flex;
		flex-direction: column;
		font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
		font-size: 13px;
		color: #e0e0e0;
		border-radius: inherit;
		overflow: hidden;
	}
	
	.terminal-header {
		height: 40px;
		background: #2d2d2d;
		border-bottom: 1px solid #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.terminal-title {
		font-size: 12px;
		color: #999;
		font-weight: 500;
	}
	
	.terminal-content {
		flex: 1;
		padding: 12px;
		overflow-y: auto;
		overflow-x: hidden;
		cursor: text;
	}
	
	.terminal-line {
		margin-bottom: 2px;
		white-space: pre-wrap;
		word-break: break-all;
	}
	
	.terminal-line.command {
		color: #4ec9b0;
	}
	
	.terminal-line.output {
		color: #e0e0e0;
	}
	
	.terminal-line.error {
		color: #f48771;
	}
	
	.terminal-input-line {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 2px;
	}
	
	.prompt {
		color: #4ec9b0;
		flex-shrink: 0;
	}
	
	.terminal-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: #e0e0e0;
		font-family: inherit;
		font-size: inherit;
		caret-color: #e0e0e0;
	}
	
	.terminal-content::-webkit-scrollbar {
		width: 8px;
	}
	
	.terminal-content::-webkit-scrollbar-track {
		background: #1e1e1e;
	}
	
	.terminal-content::-webkit-scrollbar-thumb {
		background: #444;
		border-radius: 4px;
	}
	
	.terminal-content::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
