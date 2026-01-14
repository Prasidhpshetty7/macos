// Desktop files state - files that appear on desktop and can be opened in VSCode

export type DesktopFile = {
	id: string;
	name: string;
	type: 'file' | 'folder' | 'app';
	icon: string;
	content?: string;
	children?: DesktopFile[];
	appId?: string;
	position?: 'left'; // For positioning next to another icon
};

const portfolioHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prasidh P Shetty | Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:#6c5ce7;--accent:#00cec9;--gradient:linear-gradient(135deg,#6c5ce7 0%,#a29bfe 100%)}
html{scroll-behavior:smooth}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6}
.bg{position:fixed;inset:0;z-index:-1;overflow:hidden}
.bg span{position:absolute;display:block;background:rgba(108,92,231,0.1);animation:move 25s infinite;bottom:-150px;border-radius:50%}
.bg span:nth-child(1){left:25%;width:80px;height:80px}
.bg span:nth-child(2){left:10%;width:20px;height:20px;animation-delay:2s}
.bg span:nth-child(3){left:70%;width:20px;height:20px;animation-delay:4s}
.bg span:nth-child(4){left:40%;width:60px;height:60px;animation-duration:18s}
.bg span:nth-child(5){left:65%;width:20px;height:20px}
@keyframes move{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-1000px) rotate(720deg);opacity:0}}
nav{position:fixed;top:0;width:100%;padding:20px 50px;display:flex;justify-content:space-between;align-items:center;z-index:1000;background:rgba(10,10,10,0.8);backdrop-filter:blur(10px)}
.logo{font-size:1.8rem;font-weight:700;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:30px;list-style:none}
.nav-links a{color:#fff;text-decoration:none;font-weight:500;transition:color 0.3s}
.nav-links a:hover{color:var(--accent)}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 50px}
.hero-content{max-width:800px;text-align:center}
.hero h1{font-size:3.5rem;margin-bottom:20px;animation:fadeUp 1s ease}
.hero h1 span{background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:1.4rem;color:#aaa;margin-bottom:30px;animation:fadeUp 1s ease 0.2s both}
.desc{color:#666;margin-bottom:40px;animation:fadeUp 1s ease 0.4s both}
.btns{display:flex;gap:20px;justify-content:center;animation:fadeUp 1s ease 0.6s both}
.btn{padding:15px 40px;border-radius:50px;font-weight:600;text-decoration:none;transition:all 0.3s;cursor:pointer;border:none;font-size:1rem}
.btn-p{background:var(--gradient);color:#fff;box-shadow:0 10px 30px rgba(108,92,231,0.3)}
.btn-p:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(108,92,231,0.4)}
.btn-s{background:transparent;color:#fff;border:2px solid var(--primary)}
.btn-s:hover{background:var(--primary)}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
section{padding:100px 50px}
.title{font-size:2.5rem;text-align:center;margin-bottom:60px;position:relative}
.title::after{content:'';position:absolute;bottom:-15px;left:50%;transform:translateX(-50%);width:80px;height:4px;background:var(--gradient);border-radius:2px}
</style>
</head>
<body>
<div class="bg"><span></span><span></span><span></span><span></span><span></span></div>
<nav>
<div class="logo">Prasidh</div>
<ul class="nav-links">
<li><a href="#home">Home</a></li>
<li><a href="#about">About</a></li>
<li><a href="#skills">Skills</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</nav>
<section class="hero" id="home">
<div class="hero-content">
<h1>Hi, I'm <span>Prasidh P Shetty</span></h1>
<p class="subtitle">Web Designer & Full-Stack Developer</p>
<p class="desc">I craft beautiful, responsive web experiences. Passionate about clean code and modern design.</p>
<div class="btns">
<a href="#contact" class="btn btn-p">Get In Touch</a>
<a href="https://github.com/Prasidhpshetty7" class="btn btn-s" target="_blank">GitHub</a>
</div>
</div>
</section>
<section id="about">
<h2 class="title">About Me</h2>
<div style="max-width:800px;margin:0 auto;text-align:center">
<p style="font-size:1.2rem;color:#aaa;margin-bottom:30px">
I'm a passionate developer based in India, specializing in creating exceptional digital experiences.
</p>
</div>
</section>
<section id="skills">
<h2 class="title">Skills</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:800px;margin:0 auto">
<div style="background:rgba(255,255,255,0.05);padding:20px;border-radius:12px;text-align:center">
<div style="font-size:2rem;margin-bottom:10px">⚛️</div>
<h3>React / Next.js</h3>
</div>
<div style="background:rgba(255,255,255,0.05);padding:20px;border-radius:12px;text-align:center">
<div style="font-size:2rem;margin-bottom:10px">🟦</div>
<h3>TypeScript</h3>
</div>
<div style="background:rgba(255,255,255,0.05);padding:20px;border-radius:12px;text-align:center">
<div style="font-size:2rem;margin-bottom:10px">🟢</div>
<h3>Node.js</h3>
</div>
<div style="background:rgba(255,255,255,0.05);padding:20px;border-radius:12px;text-align:center">
<div style="font-size:2rem;margin-bottom:10px">🎨</div>
<h3>CSS / Tailwind</h3>
</div>
</div>
</section>
<section id="contact">
<h2 class="title">Contact</h2>
<div style="text-align:center">
<p style="color:#888;margin-bottom:30px">Let's work together!</p>
<div style="display:flex;justify-content:center;gap:20px">
<a href="https://github.com/Prasidhpshetty7" target="_blank" style="width:50px;height:50px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.5rem;transition:background 0.3s">📂</a>
<a href="https://linkedin.com/in/prasidh-shetty" target="_blank" style="width:50px;height:50px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.5rem;transition:background 0.3s">💼</a>
</div>
</div>
</section>
<footer style="text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.1);color:#666">
<p>© 2024 Prasidh P Shetty. Built with ❤️</p>
</footer>
</body>
</html>`;

export const desktopFilesState = $state({
	files: [
		{
			id: 'drift-app',
			name: 'Drift',
			type: 'app',
			icon: '🌊',
			appId: 'drift',
			position: 'left' // Special position - left of portfolio
		},
		{
			id: 'portfolio-folder',
			name: 'Portfolio',
			type: 'folder',
			icon: '📁',
			content: portfolioHTML
		},
		{
			id: 'music-app',
			name: 'Music',
			type: 'app',
			icon: '🎵',
			appId: 'music'
		},
		{
			id: 'chess-app',
			name: 'Chess',
			type: 'app',
			icon: '♟️',
			appId: 'chess'
		}
	] as DesktopFile[],
	fileToOpen: null as DesktopFile | null,
	folderToOpen: null as DesktopFile | null, // For opening folder in Finder
	finderSection: null as string | null, // For opening Finder to a specific section (recents, applications, etc.)
	editingFileId: null as string | null, // For renaming
	newlyCreatedId: null as string | null, // To auto-focus new folder name
});

// Create a new folder on desktop
let folderCounter = 1;
export function createNewFolder(): DesktopFile {
	// Find unique name
	let name = 'untitled folder';
	const existingNames = desktopFilesState.files.map(f => f.name.toLowerCase());
	
	if (existingNames.includes(name)) {
		while (existingNames.includes(`untitled folder ${folderCounter}`)) {
			folderCounter++;
		}
		name = `untitled folder ${folderCounter}`;
		folderCounter++;
	}
	
	const newFolder: DesktopFile = {
		id: `folder-${Date.now()}`,
		name,
		type: 'folder',
		icon: '📁',
		children: []
	};
	
	desktopFilesState.files = [...desktopFilesState.files, newFolder];
	desktopFilesState.editingFileId = newFolder.id;
	desktopFilesState.newlyCreatedId = newFolder.id;
	
	return newFolder;
}

// Rename a file/folder
export function renameFile(id: string, newName: string) {
	const file = desktopFilesState.files.find(f => f.id === id);
	if (file && newName.trim()) {
		file.name = newName.trim();
	}
	desktopFilesState.editingFileId = null;
	desktopFilesState.newlyCreatedId = null;
}

// Delete a file/folder
export function deleteFile(id: string) {
	desktopFilesState.files = desktopFilesState.files.filter(f => f.id !== id);
}

// Start editing a file name
export function startEditing(id: string) {
	desktopFilesState.editingFileId = id;
}

// Stop editing
export function stopEditing() {
	desktopFilesState.editingFileId = null;
	desktopFilesState.newlyCreatedId = null;
}
