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
				output.push({ type: 'output', text: '  File System:' });
				output.push({ type: 'output', text: '    ls, pwd, cd, cat, mkdir, touch, rm, cp, mv' });
				output.push({ type: 'output', text: '  System:' });
				output.push({ type: 'output', text: '    whoami, hostname, uname, date, uptime, df, top' });
				output.push({ type: 'output', text: '  Network:' });
				output.push({ type: 'output', text: '    ping, curl, ifconfig' });
				output.push({ type: 'output', text: '  Utilities:' });
				output.push({ type: 'output', text: '    echo, clear, history, grep, wc, sort' });
				output.push({ type: 'output', text: '  Fun:' });
				output.push({ type: 'output', text: '    cowsay, figlet, fortune, matrix' });
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
				
			case 'hostname':
				output.push({ type: 'output', text: 'MacBook-Pro.local' });
				break;
				
			case 'uptime':
				const uptime = Math.floor(performance.now() / 1000);
				const hours = Math.floor(uptime / 3600);
				const minutes = Math.floor((uptime % 3600) / 60);
				output.push({ type: 'output', text: `up ${hours}:${minutes.toString().padStart(2, '0')}` });
				break;
				
			case 'df':
				output.push({ type: 'output', text: 'Filesystem     Size   Used  Avail  Use%' });
				output.push({ type: 'output', text: '/dev/disk1    500G   250G   250G   50%' });
				break;
				
			case 'top':
				output.push({ type: 'output', text: 'Processes: 421 total, 3 running' });
				output.push({ type: 'output', text: 'CPU: 15% user, 5% system, 80% idle' });
				output.push({ type: 'output', text: 'Memory: 8GB used (16GB total)' });
				break;
				
			case 'history':
				commandHistory.forEach((cmd, i) => {
					output.push({ type: 'output', text: `  ${i + 1}  ${cmd}` });
				});
				break;
				
			case 'mkdir':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'mkdir: missing operand' });
				} else {
					output.push({ type: 'output', text: `Created directory: ${args[0]}` });
				}
				break;
				
			case 'touch':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'touch: missing file operand' });
				} else {
					output.push({ type: 'output', text: `Created file: ${args[0]}` });
				}
				break;
				
			case 'rm':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'rm: missing operand' });
				} else {
					output.push({ type: 'output', text: `Removed: ${args[0]}` });
				}
				break;
				
			case 'cp':
				if (args.length < 2) {
					output.push({ type: 'error', text: 'cp: missing destination' });
				} else {
					output.push({ type: 'output', text: `Copied ${args[0]} to ${args[1]}` });
				}
				break;
				
			case 'mv':
				if (args.length < 2) {
					output.push({ type: 'error', text: 'mv: missing destination' });
				} else {
					output.push({ type: 'output', text: `Moved ${args[0]} to ${args[1]}` });
				}
				break;
				
			case 'grep':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'grep: missing pattern' });
				} else {
					output.push({ type: 'output', text: `Searching for: ${args[0]}` });
				}
				break;
				
			case 'wc':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'wc: missing file operand' });
				} else {
					output.push({ type: 'output', text: '  5  25  150 ' + args[0] });
				}
				break;
				
			case 'sort':
				output.push({ type: 'output', text: 'Sorting...' });
				break;
				
			case 'ping':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'ping: missing host operand' });
				} else {
					output.push({ type: 'output', text: `PING ${args[0]} (93.184.216.34): 56 data bytes` });
					output.push({ type: 'output', text: '64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=12.3 ms' });
				}
				break;
				
			case 'curl':
				if (args.length === 0) {
					output.push({ type: 'error', text: 'curl: no URL specified' });
				} else {
					output.push({ type: 'output', text: `Fetching ${args[0]}...` });
					output.push({ type: 'output', text: 'HTTP/1.1 200 OK' });
				}
				break;
				
			case 'ifconfig':
				output.push({ type: 'output', text: 'en0: flags=8863<UP,BROADCAST,SMART,RUNNING>' });
				output.push({ type: 'output', text: '\tinet 192.168.1.100 netmask 0xffffff00' });
				break;
				
			case 'cowsay':
				const message = args.join(' ') || 'Hello!';
				output.push({ type: 'output', text: ' ' + '_'.repeat(message.length + 2) });
				output.push({ type: 'output', text: '< ' + message + ' >' });
				output.push({ type: 'output', text: ' ' + '-'.repeat(message.length + 2) });
				output.push({ type: 'output', text: '        \\   ^__^' });
				output.push({ type: 'output', text: '         \\  (oo)\\_______' });
				output.push({ type: 'output', text: '            (__)\\       )\\/\\' });
				output.push({ type: 'output', text: '                ||----w |' });
				output.push({ type: 'output', text: '                ||     ||' });
				break;
				
			case 'figlet':
				const text = args.join(' ') || 'Hello';
				output.push({ type: 'output', text: ' _   _      _ _       ' });
				output.push({ type: 'output', text: '| | | | ___| | | ___  ' });
				output.push({ type: 'output', text: '| |_| |/ _ \\ | |/ _ \\ ' });
				output.push({ type: 'output', text: '|  _  |  __/ | | (_) |' });
				output.push({ type: 'output', text: '|_| |_|\\___|_|_|\\___/ ' });
				break;
				
			case 'fortune':
				const fortunes = [
					'The best time to plant a tree was 20 years ago. The second best time is now.',
					'You will have a pleasant surprise.',
					'Good things come to those who code.',
					'A bug in the code is worth two in the documentation.',
					'The Mac is the best computer ever made.',
				];
				const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
				output.push({ type: 'output', text: randomFortune });
				break;
				
			case 'matrix':
				output.push({ type: 'output', text: '01101101 01100001 01100011 01001111 01010011' });
				output.push({ type: 'output', text: '01110111 01100101 01100010 00100000 01101001' });
				output.push({ type: 'output', text: '01110011 00100000 01100001 01110111 01100101' });
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
			// Enhanced tab completion
			const commands = [
				'help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'date', 'whoami', 
				'uname', 'hostname', 'uptime', 'df', 'top', 'history',
				'mkdir', 'touch', 'rm', 'cp', 'mv', 'grep', 'wc', 'sort',
				'ping', 'curl', 'ifconfig', 'cowsay', 'figlet', 'fortune', 'matrix'
			];
			const matches = commands.filter(cmd => cmd.startsWith(currentCommand));
			if (matches.length === 1) {
				currentCommand = matches[0];
			} else if (matches.length > 1) {
				output.push({ type: 'output', text: matches.join('  ') });
				output.push({ type: 'output', text: '' });
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
