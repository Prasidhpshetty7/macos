<script lang="ts">
import { desktopFilesState } from '🍎/state/desktop-files.svelte.ts';

type FileItem = { name: string; content: string };
type FolderItem = { name: string; files: FileItem[]; expanded: boolean };

let folders = $state<FolderItem[]>([
	{
		name: 'my-project',
		expanded: true,
		files: [
			{ name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n<title>Project</title>\n</head>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>' },
			{ name: 'style.css', content: 'body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }' },
			{ name: 'script.js', content: 'console.log("Hello");' },
			{ name: 'README.md', content: '# My Project\nBy Prasidh' }
		]
	}
]);

// Derive desktop folders to show in sidebar
const desktopFolders = $derived(
	desktopFilesState.files
		.filter(f => f.type === 'folder')
		.map(f => ({
			name: f.name,
			expanded: expandedDesktopFolders.has(f.name),
			files: f.content ? [{ name: 'index.html', content: f.content }] : [],
			isDesktopFolder: true
		}))
);

// Combined folders for display
const allFolders = $derived([...folders, ...desktopFolders]);

let openTabs = $state<string[]>(['my-project/index.html']);
let activeFile = $state('my-project/index.html');
let showModal = $state(false);
let newName = $state('');
let menu = $state<string | null>(null);
let view = $state<'code' | 'split' | 'preview'>('split');
let expandedDesktopFolders = $state<Set<string>>(new Set());

// Get file content by path (folder/file)
function getFileContent(path: string): string {
	const [folderName, fileName] = path.split('/');
	
	// Check regular folders first
	const folder = folders.find(f => f.name === folderName);
	if (folder) {
		const file = folder.files.find(f => f.name === fileName);
		return file?.content || '';
	}
	
	// Check desktop folders
	const desktopFolder = desktopFilesState.files.find(f => f.type === 'folder' && f.name === folderName);
	if (desktopFolder && desktopFolder.content && fileName === 'index.html') {
		return desktopFolder.content;
	}
	
	return '';
}

// Set file content by path
function setFileContent(path: string, content: string) {
	const [folderName, fileName] = path.split('/');
	
	// Check regular folders first
	const folder = folders.find(f => f.name === folderName);
	if (folder) {
		const file = folder.files.find(f => f.name === fileName);
		if (file) file.content = content;
		return;
	}
	
	// Check desktop folders
	const desktopFolder = desktopFilesState.files.find(f => f.type === 'folder' && f.name === folderName);
	if (desktopFolder && fileName === 'index.html') {
		desktopFolder.content = content;
	}
}

// Watch for files opened from desktop
$effect(() => {
	const fileToOpen = desktopFilesState.fileToOpen;
	if (fileToOpen && fileToOpen.content !== undefined) {
		const folderName = 'Portfolio';
		const fileName = fileToOpen.name || 'index.html';
		const fullPath = folderName + '/' + fileName;
		
		// Check if Portfolio folder exists
		let folder = folders.find(f => f.name === folderName);
		if (!folder) {
			folders = [...folders, { name: folderName, expanded: true, files: [] }];
			folder = folders.find(f => f.name === folderName);
		}
		
		// Add file to folder if not exists
		if (folder && !folder.files.find(f => f.name === fileName)) {
			folder.files = [...folder.files, { name: fileName, content: fileToOpen.content }];
		}
		
		if (!openTabs.includes(fullPath)) {
			openTabs = [...openTabs, fullPath];
		}
		activeFile = fullPath;
		desktopFilesState.fileToOpen = null;
	}
});

function toggleFolder(folderName: string, isDesktopFolder: boolean = false) {
	if (isDesktopFolder) {
		if (expandedDesktopFolders.has(folderName)) {
			expandedDesktopFolders.delete(folderName);
		} else {
			expandedDesktopFolders.add(folderName);
		}
		expandedDesktopFolders = new Set(expandedDesktopFolders); // Trigger reactivity
	} else {
		const folder = folders.find(f => f.name === folderName);
		if (folder) folder.expanded = !folder.expanded;
	}
}

function openFile(folderName: string, fileName: string) {
	const path = folderName + '/' + fileName;
	if (!openTabs.includes(path)) {
		openTabs = [...openTabs, path];
	}
	activeFile = path;
}

function closeTab(path: string) {
	openTabs = openTabs.filter(t => t !== path);
	if (activeFile === path) {
		activeFile = openTabs[0] || '';
	}
}

function getPreview() {
	const html = getFileContent('my-project/index.html');
	const css = getFileContent('my-project/style.css');
	return html + '<st' + 'yle>' + css + '</st' + 'yle>';
}

let currentContent = $derived(getFileContent(activeFile));
</script>

<svelte:window onclick={() => menu = null} />

<section class="box">
<div class="bar app-window-drag-handle">
<div class="menus">
<div class="mw">
<button class="mb" onclick={(e) => { e.stopPropagation(); menu = menu === 'f' ? null : 'f'; }}>File</button>
{#if menu === 'f'}
<div class="dd" onclick={(e) => e.stopPropagation()}>
<button onclick={() => { showModal = true; menu = null; }}>New File</button>
<button onclick={() => { alert('Saved'); menu = null; }}>Save</button>
</div>
{/if}
</div>
<div class="mw">
<button class="mb" onclick={(e) => { e.stopPropagation(); menu = menu === 'v' ? null : 'v'; }}>View</button>
{#if menu === 'v'}
<div class="dd" onclick={(e) => e.stopPropagation()}>
<button onclick={() => { view = 'code'; menu = null; }}>Code Only</button>
<button onclick={() => { view = 'split'; menu = null; }}>Split</button>
<button onclick={() => { view = 'preview'; menu = null; }}>Preview</button>
</div>
{/if}
</div>
</div>
<span class="tt">Prasidh's Editor</span>
</div>
<div class="main">
<div class="side">
<div class="hd">EXPLORER</div>
{#each allFolders as folder}
<div class="folder">
<button class="folder-btn" onclick={() => toggleFolder(folder.name, folder.isDesktopFolder || false)}>
<span class="arrow" class:open={folder.expanded}>▶</span>
<span class="folder-icon">📁</span>
{folder.name}
{#if folder.isDesktopFolder}<span class="desktop-badge">Desktop</span>{/if}
</button>
{#if folder.expanded}
<div class="folder-files">
{#each folder.files as file}
<button class="fi" class:act={activeFile === folder.name + '/' + file.name} onclick={() => openFile(folder.name, file.name)}>
<span class="file-icon">{file.name.endsWith('.html') ? '🌐' : file.name.endsWith('.css') ? '🎨' : file.name.endsWith('.js') ? '📜' : '📄'}</span>
{file.name}
</button>
{/each}
{#if folder.files.length === 0}
<div class="empty-folder">Empty folder</div>
{/if}
</div>
{/if}
</div>
{/each}
</div>
<div class="ed">
<div class="tabs">
{#each openTabs as t}
<div class="tb" class:act={activeFile === t} onclick={() => activeFile = t}>
<span class="tab-name">{t.split('/')[1]}</span>
<button class="tab-close" onclick={(e) => { e.stopPropagation(); closeTab(t); }}>×</button>
</div>
{/each}
<div class="vb">
<button class:act={view === 'code'} onclick={() => view = 'code'}>Code</button>
<button class:act={view === 'split'} onclick={() => view = 'split'}>Split</button>
<button class:act={view === 'preview'} onclick={() => view = 'preview'}>Preview</button>
</div>
</div>
<div class="cnt" class:sp={view === 'split'}>
{#if view !== 'preview'}
<div class="code"><textarea value={currentContent} oninput={(e) => setFileContent(activeFile, e.currentTarget.value)} spellcheck="false"></textarea></div>
{/if}
{#if view !== 'code'}
<div class="prev"><div class="ph">Preview</div><iframe srcdoc={getPreview()} title="P"></iframe></div>
{/if}
</div>
</div>
</div>
<div class="st"><span>Prasidh</span><span>{activeFile}</span></div>
</section>

{#if showModal}
<div class="mo" onclick={() => showModal = false}>
<div class="md" onclick={(e) => e.stopPropagation()}>
<h3>New File</h3>
<input bind:value={newName} placeholder="name.ext" />
<div class="mb2"><button onclick={() => showModal = false}>Cancel</button><button onclick={() => { if(newName && folders[0]) { folders[0].files = [...folders[0].files, {name: newName, content: ''}]; openTabs = [...openTabs, folders[0].name + '/' + newName]; activeFile = folders[0].name + '/' + newName; } showModal = false; newName = ''; }}>Create</button></div>
</div>
</div>
{/if}

<style>
.box{background:#1e1e1e;border-radius:inherit;display:flex;flex-direction:column;height:100%;font:13px system-ui;color:#ccc}
.bar{display:flex;align-items:center;background:#3c3c3c;padding:0 10px 0 75px;height:30px}
.menus{display:flex;gap:2px}
.mb{background:transparent;border:0;color:#ccc;padding:4px 8px;font-size:12px;cursor:pointer;border-radius:4px}
.mb:hover{background:rgba(255,255,255,.1)}
.mw{position:relative}
.dd{position:absolute;top:100%;left:0;background:#252526;border:1px solid #454545;border-radius:6px;padding:4px 0;min-width:120px;z-index:1000}
.dd button{display:block;width:100%;padding:6px 12px;background:transparent;border:0;color:#ccc;text-align:left;cursor:pointer;font-size:12px}
.dd button:hover{background:#094771}
.tt{flex:1;text-align:center;font-size:12px;color:#888}
.main{display:flex;flex:1;overflow:hidden}
.side{background:#252526;width:200px;padding:0;overflow-y:auto}
.hd{padding:10px 12px;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:1px}
.folder{margin-bottom:2px}
.folder-btn{display:flex;align-items:center;gap:6px;width:100%;padding:4px 8px;background:transparent;border:0;color:#ccc;cursor:pointer;font-size:13px;text-align:left}
.folder-btn:hover{background:rgba(255,255,255,.05)}
.arrow{font-size:10px;transition:transform 0.2s;color:#888}
.arrow.open{transform:rotate(90deg)}
.folder-icon{font-size:14px}
.folder-files{padding-left:20px}
.fi{display:flex;align-items:center;gap:6px;width:100%;padding:3px 8px;background:transparent;border:0;color:#ccc;cursor:pointer;font-size:12px;text-align:left}
.fi:hover{background:rgba(255,255,255,.05)}
.fi.act{background:rgba(255,255,255,.1)}
.file-icon{font-size:12px}
.desktop-badge{font-size:9px;background:#007acc;color:#fff;padding:1px 4px;border-radius:3px;margin-left:auto}
.empty-folder{padding:4px 8px;color:#666;font-size:11px;font-style:italic}
.ed{flex:1;display:flex;flex-direction:column;overflow:hidden}
.tabs{display:flex;background:#252526;align-items:center;min-height:35px;overflow-x:auto}
.tb{display:flex;align-items:center;gap:4px;padding:8px 8px 8px 12px;background:#2d2d2d;cursor:pointer;font-size:12px;border-right:1px solid #1e1e1e;white-space:nowrap}
.tb.act{background:#1e1e1e;border-top:1px solid #007acc}
.tab-name{color:#ccc}
.tab-close{background:transparent;border:0;color:#888;cursor:pointer;font-size:14px;padding:0 4px;border-radius:3px}
.tab-close:hover{background:rgba(255,255,255,.1);color:#fff}
.vb{margin-left:auto;display:flex;gap:4px;padding:0 8px}
.vb button{background:#3c3c3c;border:0;color:#888;padding:4px 8px;cursor:pointer;border-radius:4px;font-size:11px}
.vb button.act{background:#007acc;color:#fff}
.cnt{flex:1;display:flex;overflow:hidden}
.cnt.sp .code,.cnt.sp .prev{width:50%}
.code{flex:1;display:flex;background:#1e1e1e}
.code textarea{flex:1;background:#1e1e1e;color:#d4d4d4;border:0;padding:8px;font:13px Consolas,monospace;resize:none;outline:0}
.prev{flex:1;display:flex;flex-direction:column;background:#fff;border-left:1px solid #333}
.ph{padding:6px 12px;background:#252526;color:#ccc;font-size:12px}
.prev iframe{flex:1;border:0;background:#fff}
.st{display:flex;justify-content:space-between;background:#007acc;padding:3px 10px;font-size:12px;color:#fff}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.md{background:#252526;padding:20px;border-radius:8px;min-width:280px}
.md h3{margin:0 0 16px;color:#fff}
.md input{width:100%;padding:8px;background:#3c3c3c;border:1px solid #555;color:#fff;border-radius:4px;box-sizing:border-box}
.mb2{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.mb2 button{padding:8px 16px;border:0;border-radius:4px;cursor:pointer;background:#3c3c3c;color:#ccc}
:global(.tl-container.vscode){top:.6rem;left:.6rem}
</style>
