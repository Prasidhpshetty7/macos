<script lang="ts">
let files = $state<Record<string, string>>({});
let openTabs = $state<string[]>(['index.html']);
let activeFile = $state('index.html');
let showModal = $state(false);
let newName = $state('');
let menu = $state<string | null>(null);
let view = $state<'code' | 'split' | 'preview'>('split');

$effect(() => {
files = {
'index.html': '<!DOCTYPE html>\n<html>\n<head>\n<title>Project</title>\n</head>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>',
'style.css': 'body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }',
'script.js': 'console.log("Hello");',
'README.md': '# Project\nBy Prasidh'
};
});

function getPreview() {
return files['index.html'] + '<st' + 'yle>' + files['style.css'] + '</st' + 'yle>';
}
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
<button onclick={() => { if(activeFile) { delete files[activeFile]; openTabs = openTabs.filter(t => t !== activeFile); activeFile = openTabs[0] || ''; } menu = null; }}>Delete</button>
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
<div class="mw">
<button class="mb" onclick={(e) => { e.stopPropagation(); menu = menu === 'h' ? null : 'h'; }}>Help</button>
{#if menu === 'h'}
<div class="dd" onclick={(e) => e.stopPropagation()}>
<button onclick={() => { window.open('https://github.com/Prasidhpshetty7'); menu = null; }}>GitHub</button>
<button onclick={() => { alert('Prasidh Editor v1'); menu = null; }}>About</button>
</div>
{/if}
</div>
</div>
<span class="tt">Prasidh's Editor</span>
</div>
<div class="main">
<div class="side">
<div class="hd">EXPLORER <button onclick={() => showModal = true}>+</button></div>
{#each Object.keys(files) as f}
<div class="fi" class:act={activeFile === f} onclick={() => { activeFile = f; if(!openTabs.includes(f)) openTabs = [...openTabs, f]; }}>{f}</div>
{/each}
</div>
<div class="ed">
<div class="tabs">
{#each openTabs as t}
<div class="tb" class:act={activeFile === t} onclick={() => activeFile = t}>{t} <button onclick={(e) => { e.stopPropagation(); openTabs = openTabs.filter(x => x !== t); if(activeFile === t) activeFile = openTabs[0] || ''; }}>x</button></div>
{/each}
<div class="vb">
<button class:act={view === 'code'} onclick={() => view = 'code'}>Code</button>
<button class:act={view === 'split'} onclick={() => view = 'split'}>Split</button>
<button class:act={view === 'preview'} onclick={() => view = 'preview'}>Preview</button>
</div>
</div>
<div class="cnt" class:sp={view === 'split'}>
{#if view !== 'preview'}
<div class="code"><textarea bind:value={files[activeFile]} spellcheck="false"></textarea></div>
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
<div class="mb2"><button onclick={() => showModal = false}>Cancel</button><button onclick={() => { if(newName) { files[newName] = ''; openTabs = [...openTabs, newName]; activeFile = newName; } showModal = false; newName = ''; }}>Create</button></div>
</div>
</div>
{/if}

<style>
.box{background:#1e1e1e;border-radius:inherit;display:flex;flex-direction:column;height:100%;font:13px system-ui;color:#ccc}
.bar{display:flex;align-items:center;background:#3c3c3c;padding:0 10px 0 75px;height:30px}
.menus{display:flex;gap:2px}
.mb{background:0;border:0;color:#ccc;padding:4px 8px;font-size:12px;cursor:pointer;border-radius:4px}
.mb:hover{background:rgba(255,255,255,.1)}
.mw{position:relative}
.dd{position:absolute;top:100%;left:0;background:#252526;border:1px solid #454545;border-radius:6px;padding:4px 0;min-width:120px;z-index:1000}
.dd button{display:block;width:100%;padding:6px 12px;background:0;border:0;color:#ccc;text-align:left;cursor:pointer;font-size:12px}
.dd button:hover{background:#094771}
.tt{flex:1;text-align:center;font-size:12px;color:#888}
.main{display:flex;flex:1;overflow:hidden}
.side{background:#252526;width:180px;padding:8px}
.hd{display:flex;justify-content:space-between;padding:8px;font-size:11px;color:#bbb}
.hd button{background:0;border:0;color:#888;cursor:pointer}
.fi{padding:4px 8px;cursor:pointer;border-radius:4px}
.fi:hover{background:rgba(255,255,255,.05)}
.fi.act{background:rgba(255,255,255,.1)}
.ed{flex:1;display:flex;flex-direction:column;overflow:hidden}
.tabs{display:flex;background:#252526;align-items:center;min-height:35px}
.tb{display:flex;align-items:center;gap:6px;padding:8px 12px;background:#2d2d2d;cursor:pointer;font-size:12px}
.tb.act{background:#1e1e1e;border-top:1px solid #007acc}
.tb button{background:0;border:0;color:#888;cursor:pointer}
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
