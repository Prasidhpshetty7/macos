<script lang="ts">
type Song = {
	id: number;
	title: string;
	artist: string;
	album: string;
	duration: string;
	durationSec: number;
	cover: string;
};

type Playlist = {
	id: string;
	name: string;
	cover: string;
	songs: Song[];
};

let activeTab = $state<'listen' | 'browse' | 'radio' | 'library'>('listen');
let currentSong = $state<Song | null>(null);
let isPlaying = $state(false);
let progress = $state(0);
let currentTime = $state(0);
let volume = $state(80);
let currentPlaylist = $state<Playlist | null>(null);
let searchQuery = $state('');
let searchResults = $state<Song[]>([]);
let progressInterval: number | null = null;

const playlists: Playlist[] = [
	{
		id: '1', name: 'Today\'s Hits', cover: '🎵',
		songs: [
			{ id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', durationSec: 200, cover: '🌃' },
			{ id: 2, title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', duration: '3:53', durationSec: 233, cover: '🎸' },
			{ id: 3, title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming', duration: '3:29', durationSec: 209, cover: '🐒' },
			{ id: 4, title: 'Someone You Loved', artist: 'Lewis Capaldi', album: 'Divinely Uninspired', duration: '3:02', durationSec: 182, cover: '💔' },
		]
	},
	{
		id: '2', name: 'Chill Vibes', cover: '😌',
		songs: [
			{ id: 5, title: 'Sunflower', artist: 'Post Malone', album: 'Spider-Man OST', duration: '2:38', durationSec: 158, cover: '🌻' },
			{ id: 6, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', durationSec: 174, cover: '🍉' },
			{ id: 7, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', durationSec: 203, cover: '✨' },
		]
	},
	{
		id: '3', name: 'Workout Mix', cover: '💪',
		songs: [
			{ id: 8, title: 'Stronger', artist: 'Kanye West', album: 'Graduation', duration: '5:11', durationSec: 311, cover: '🏋️' },
			{ id: 9, title: 'Eye of the Tiger', artist: 'Survivor', album: 'Eye of the Tiger', duration: '4:05', durationSec: 245, cover: '🐯' },
			{ id: 10, title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile', duration: '5:26', durationSec: 326, cover: '🎤' },
		]
	},
	{
		id: '4', name: 'Pop Classics', cover: '🎤',
		songs: [
			{ id: 11, title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep', duration: '3:14', durationSec: 194, cover: '😈' },
			{ id: 12, title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', duration: '4:30', durationSec: 270, cover: '🕺' },
			{ id: 13, title: 'Rolling in the Deep', artist: 'Adele', album: '21', duration: '3:48', durationSec: 228, cover: '🔥' },
		]
	},
];

const allSongs = playlists.flatMap(p => p.songs);
const recentlyPlayed = playlists[0].songs.slice(0, 4);

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startProgressTimer() {
	stopProgressTimer();
	progressInterval = window.setInterval(() => {
		if (currentSong && isPlaying) {
			currentTime += 1;
			progress = (currentTime / currentSong.durationSec) * 100;
			if (currentTime >= currentSong.durationSec) {
				playNext();
			}
		}
	}, 1000);
}

function stopProgressTimer() {
	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
	}
}

function playSong(song: Song) {
	currentSong = song;
	isPlaying = true;
	progress = 0;
	currentTime = 0;
	startProgressTimer();
}

function togglePlay() {
	if (currentSong) {
		isPlaying = !isPlaying;
		if (isPlaying) {
			startProgressTimer();
		} else {
			stopProgressTimer();
		}
	}
}

function playNext() {
	if (!currentSong) return;
	const playlist = currentPlaylist || playlists[0];
	const currentIndex = playlist.songs.findIndex(s => s.id === currentSong?.id);
	const nextIndex = (currentIndex + 1) % playlist.songs.length;
	playSong(playlist.songs[nextIndex]);
}

function playPrev() {
	if (!currentSong) return;
	const playlist = currentPlaylist || playlists[0];
	const currentIndex = playlist.songs.findIndex(s => s.id === currentSong?.id);
	const prevIndex = currentIndex <= 0 ? playlist.songs.length - 1 : currentIndex - 1;
	playSong(playlist.songs[prevIndex]);
}

function openPlaylist(playlist: Playlist) {
	currentPlaylist = playlist;
}

function handleSearch() {
	if (searchQuery.trim() === '') {
		searchResults = [];
		return;
	}
	const query = searchQuery.toLowerCase();
	searchResults = allSongs.filter(song => 
		song.title.toLowerCase().includes(query) ||
		song.artist.toLowerCase().includes(query) ||
		song.album.toLowerCase().includes(query)
	);
}

function seekTo(e: MouseEvent) {
	if (!currentSong) return;
	const bar = e.currentTarget as HTMLElement;
	const rect = bar.getBoundingClientRect();
	const percent = (e.clientX - rect.left) / rect.width;
	currentTime = percent * currentSong.durationSec;
	progress = percent * 100;
}

function handleVolumeChange(e: Event) {
	const target = e.target as HTMLInputElement;
	volume = parseInt(target.value);
}
</script>

<section class="music-app">
	<!-- Sidebar -->
	<div class="sidebar">
		<div class="sidebar-section">
			<button class="nav-item" class:active={activeTab === 'listen' && !searchResults.length} onclick={() => { activeTab = 'listen'; currentPlaylist = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
				Listen Now
			</button>
			<button class="nav-item" class:active={activeTab === 'browse'} onclick={() => { activeTab = 'browse'; currentPlaylist = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
				Browse
			</button>
			<button class="nav-item" class:active={activeTab === 'radio'} onclick={() => { activeTab = 'radio'; currentPlaylist = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>
				Radio
			</button>
		</div>
		<div class="sidebar-section">
			<h3 class="section-label">Library</h3>
			<button class="nav-item" class:active={activeTab === 'library'} onclick={() => { activeTab = 'library'; currentPlaylist = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>
				Playlists
			</button>
		</div>
		<div class="sidebar-section playlists-list">
			<h3 class="section-label">Playlists</h3>
			{#each playlists as playlist}
				<button class="playlist-item" class:active={currentPlaylist?.id === playlist.id} onclick={() => openPlaylist(playlist)}>
					<span class="playlist-icon">{playlist.cover}</span>
					{playlist.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Main Content -->
	<div class="main-content">
		<div class="topbar app-window-drag-handle">
			<div class="nav-controls">
				<button class="nav-btn" onclick={() => { currentPlaylist = null; searchQuery = ''; searchResults = []; }}>◀</button>
				<button class="nav-btn">▶</button>
			</div>
			<div class="search-container">
				<svg class="search-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
				<input type="text" placeholder="Search songs, artists, albums..." bind:value={searchQuery} oninput={handleSearch} />
			</div>
		</div>
		
		<div class="content-area">
			{#if searchResults.length > 0}
				<!-- Search Results -->
				<h1 class="page-title">Search Results</h1>
				<div class="songs-list">
					<div class="songs-header">
						<span class="col-num">#</span>
						<span class="col-title">Title</span>
						<span class="col-album">Album</span>
						<span class="col-duration">🕐</span>
					</div>
					{#each searchResults as song, i}
						<button class="song-row" class:playing={currentSong?.id === song.id} onclick={() => playSong(song)}>
							<span class="col-num">{i + 1}</span>
							<div class="col-title">
								<span class="song-cover">{song.cover}</span>
								<div class="song-info">
									<span class="song-title">{song.title}</span>
									<span class="song-artist">{song.artist}</span>
								</div>
							</div>
							<span class="col-album">{song.album}</span>
							<span class="col-duration">{song.duration}</span>
						</button>
					{/each}
				</div>
			{:else if currentPlaylist}
				<!-- Playlist View -->
				<div class="playlist-view">
					<div class="playlist-header">
						<div class="playlist-cover-large">{currentPlaylist.cover}</div>
						<div class="playlist-info">
							<span class="playlist-type">PLAYLIST</span>
							<h1>{currentPlaylist.name}</h1>
							<p>{currentPlaylist.songs.length} songs</p>
							<button class="play-all-btn" onclick={() => playSong(currentPlaylist.songs[0])}>
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
								Play
							</button>
						</div>
					</div>
					<div class="songs-list">
						<div class="songs-header">
							<span class="col-num">#</span>
							<span class="col-title">Title</span>
							<span class="col-album">Album</span>
							<span class="col-duration">🕐</span>
						</div>
						{#each currentPlaylist.songs as song, i}
							<button class="song-row" class:playing={currentSong?.id === song.id} onclick={() => playSong(song)}>
								<span class="col-num">{i + 1}</span>
								<div class="col-title">
									<span class="song-cover">{song.cover}</span>
									<div class="song-info">
										<span class="song-title">{song.title}</span>
										<span class="song-artist">{song.artist}</span>
									</div>
								</div>
								<span class="col-album">{song.album}</span>
								<span class="col-duration">{song.duration}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'listen'}
				<!-- Listen Now -->
				<h1 class="page-title">Listen Now</h1>
				<section class="content-section">
					<h2>Recently Played</h2>
					<div class="album-grid">
						{#each recentlyPlayed as song}
							<button class="album-card" onclick={() => playSong(song)}>
								<div class="album-cover">{song.cover}</div>
								<span class="album-title">{song.title}</span>
								<span class="album-artist">{song.artist}</span>
							</button>
						{/each}
					</div>
				</section>
				<section class="content-section">
					<h2>Made For You</h2>
					<div class="playlist-grid">
						{#each playlists as playlist}
							<button class="playlist-card" onclick={() => openPlaylist(playlist)}>
								<div class="playlist-cover">{playlist.cover}</div>
								<span class="playlist-name">{playlist.name}</span>
							</button>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'browse'}
				<h1 class="page-title">Browse</h1>
				<section class="content-section">
					<h2>Top Playlists</h2>
					<div class="playlist-grid">
						{#each playlists as playlist}
							<button class="playlist-card" onclick={() => openPlaylist(playlist)}>
								<div class="playlist-cover">{playlist.cover}</div>
								<span class="playlist-name">{playlist.name}</span>
							</button>
						{/each}
					</div>
				</section>
				<section class="content-section">
					<h2>All Songs</h2>
					<div class="album-grid">
						{#each allSongs.slice(0, 8) as song}
							<button class="album-card" onclick={() => playSong(song)}>
								<div class="album-cover">{song.cover}</div>
								<span class="album-title">{song.title}</span>
								<span class="album-artist">{song.artist}</span>
							</button>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'radio'}
				<h1 class="page-title">Radio</h1>
				<section class="content-section">
					<h2>Stations For You</h2>
					<div class="radio-grid">
						<button class="radio-card" onclick={() => playSong(playlists[0].songs[0])}>
							<div class="radio-cover">📻</div>
							<span class="radio-name">Hits Radio</span>
							<span class="radio-desc">Today's biggest hits</span>
						</button>
						<button class="radio-card" onclick={() => playSong(playlists[1].songs[0])}>
							<div class="radio-cover">🎧</div>
							<span class="radio-name">Chill Radio</span>
							<span class="radio-desc">Relax and unwind</span>
						</button>
						<button class="radio-card" onclick={() => playSong(playlists[2].songs[0])}>
							<div class="radio-cover">🔥</div>
							<span class="radio-name">Workout Radio</span>
							<span class="radio-desc">Get pumped up</span>
						</button>
					</div>
				</section>
			{:else if activeTab === 'library'}
				<h1 class="page-title">Your Library</h1>
				<div class="playlist-grid">
					{#each playlists as playlist}
						<button class="playlist-card" onclick={() => openPlaylist(playlist)}>
							<div class="playlist-cover">{playlist.cover}</div>
							<span class="playlist-name">{playlist.name}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Now Playing Bar -->
	{#if currentSong}
		<div class="now-playing">
			<div class="np-song">
				<div class="np-cover">{currentSong.cover}</div>
				<div class="np-info">
					<span class="np-title">{currentSong.title}</span>
					<span class="np-artist">{currentSong.artist}</span>
				</div>
			</div>
			<div class="np-controls">
				<button class="control-btn" type="button" onclick={() => playPrev()}>⏮</button>
				<button class="control-btn play-btn" type="button" onclick={() => togglePlay()}>
					{isPlaying ? '⏸' : '▶'}
				</button>
				<button class="control-btn" type="button" onclick={() => playNext()}>⏭</button>
			</div>
			<div class="np-progress">
				<span class="time">{formatTime(currentTime)}</span>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="progress-bar" onclick={seekTo}>
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
				<span class="time">{currentSong.duration}</span>
			</div>
			<div class="np-volume">
				<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
					{#if volume === 0}
						<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
					{:else if volume < 50}
						<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
					{:else}
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
					{/if}
				</svg>
				<input type="range" min="0" max="100" bind:value={volume} />
			</div>
		</div>
	{/if}
</section>


<style>
.music-app { display: flex; flex-direction: column; height: 100%; background: #1c1c1e; border-radius: inherit; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #fff; position: relative; }
.sidebar { width: 240px; background: rgba(0,0,0,0.3); padding: 10px 0; display: flex; flex-direction: column; position: absolute; left: 0; top: 0; bottom: 72px; overflow-y: auto; }
.sidebar-section { padding: 8px 12px; }
.section-label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 8px; padding: 0 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; background: transparent; border: none; color: #aaa; font-size: 13px; cursor: pointer; border-radius: 6px; text-align: left; }
.nav-item:hover { background: rgba(255,255,255,0.1); }
.nav-item.active { background: rgba(255,255,255,0.15); color: #fff; }
.nav-item svg { width: 18px; height: 18px; }
.playlists-list { flex: 1; overflow-y: auto; }
.playlist-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 12px; background: transparent; border: none; color: #aaa; font-size: 12px; cursor: pointer; border-radius: 4px; text-align: left; }
.playlist-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.playlist-item.active { background: rgba(250,45,72,0.2); color: #fa2d48; }
.playlist-icon { font-size: 14px; }
.main-content { flex: 1; margin-left: 240px; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 72px; }
.topbar { display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(0,0,0,0.2); }
.nav-controls { display: flex; gap: 8px; }
.nav-btn { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: #888; cursor: pointer; font-size: 12px; }
.nav-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.search-container { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 8px; flex: 1; max-width: 400px; }
.search-icon { width: 16px; height: 16px; color: #888; flex-shrink: 0; }
.search-container input { flex: 1; background: transparent; border: none; color: #fff; font-size: 13px; outline: none; }
.search-container input::placeholder { color: #666; }
.content-area { flex: 1; overflow-y: auto; padding: 20px; }
.page-title { font-size: 28px; font-weight: 700; margin-bottom: 24px; }
.content-section { margin-bottom: 32px; }
.content-section h2 { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
.album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
.album-card { background: transparent; border: none; cursor: pointer; text-align: left; padding: 12px; border-radius: 8px; transition: background 0.2s; }
.album-card:hover { background: rgba(255,255,255,0.1); }
.album-cover { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 10px; }
.album-title { display: block; color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
.album-artist { display: block; color: #888; font-size: 12px; }
.playlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
.playlist-card { background: rgba(255,255,255,0.05); border: none; cursor: pointer; text-align: left; padding: 16px; border-radius: 12px; transition: all 0.2s; }
.playlist-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-4px); }
.playlist-cover { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #fa2d48 0%, #ff6b81 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 56px; margin-bottom: 12px; }
.playlist-name { display: block; color: #fff; font-size: 14px; font-weight: 500; }
.radio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
.radio-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; cursor: pointer; text-align: left; padding: 20px; border-radius: 12px; transition: all 0.2s; }
.radio-card:hover { transform: scale(1.02); }
.radio-cover { font-size: 40px; margin-bottom: 12px; }
.radio-name { display: block; color: #fff; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.radio-desc { display: block; color: rgba(255,255,255,0.7); font-size: 12px; }

/* Playlist View */
.playlist-view { padding-bottom: 20px; }
.playlist-header { display: flex; gap: 24px; margin-bottom: 24px; }
.playlist-cover-large { width: 200px; height: 200px; background: linear-gradient(135deg, #fa2d48 0%, #ff6b81 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 80px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); flex-shrink: 0; }
.playlist-info { display: flex; flex-direction: column; justify-content: flex-end; }
.playlist-type { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.playlist-info h1 { font-size: 42px; font-weight: 700; margin: 8px 0; }
.playlist-info p { color: #888; margin-bottom: 16px; }
.play-all-btn { display: flex; align-items: center; gap: 8px; padding: 12px 32px; background: #fa2d48; border: none; color: #fff; font-size: 15px; font-weight: 600; border-radius: 24px; cursor: pointer; transition: all 0.2s; width: fit-content; }
.play-all-btn:hover { background: #ff4d64; transform: scale(1.02); }
.play-all-btn svg { width: 20px; height: 20px; }
.songs-list { background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; }
.songs-header { display: grid; grid-template-columns: 40px 1fr 1fr 60px; gap: 16px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-transform: uppercase; }
.song-row { display: grid; grid-template-columns: 40px 1fr 1fr 60px; gap: 16px; padding: 12px 16px; background: transparent; border: none; color: #fff; cursor: pointer; width: 100%; text-align: left; transition: background 0.2s; }
.song-row:hover { background: rgba(255,255,255,0.1); }
.song-row.playing { background: rgba(250,45,72,0.2); }
.col-num { color: #888; font-size: 14px; display: flex; align-items: center; }
.col-title { display: flex; align-items: center; gap: 12px; overflow: hidden; }
.song-cover { width: 40px; height: 40px; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.song-info { display: flex; flex-direction: column; overflow: hidden; }
.song-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.song-artist { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-album { color: #888; font-size: 13px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-duration { color: #888; font-size: 13px; display: flex; align-items: center; }

/* Now Playing Bar */
.now-playing { position: absolute; bottom: 0; left: 0; right: 0; height: 72px; background: #282828; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; padding: 0 16px; gap: 16px; z-index: 100; }
.np-song { display: flex; align-items: center; gap: 12px; width: 220px; flex-shrink: 0; }
.np-cover { width: 48px; height: 48px; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.np-info { display: flex; flex-direction: column; overflow: hidden; }
.np-title { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-artist { font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-controls { display: flex; align-items: center; gap: 12px; }
.control-btn { width: 32px; height: 32px; background: transparent; border: none; color: #fff; cursor: pointer; font-size: 14px; border-radius: 50%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.control-btn:hover { background: rgba(255,255,255,0.1); }
.play-btn { width: 36px; height: 36px; background: #fff; color: #000; font-size: 16px; }
.play-btn:hover { transform: scale(1.05); background: #fff; }
.np-progress { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
.time { font-size: 11px; color: #888; min-width: 35px; text-align: center; }
.progress-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer; position: relative; }
.progress-bar:hover { height: 6px; }
.progress-fill { height: 100%; background: #fa2d48; border-radius: 2px; transition: width 0.1s linear; }
.np-volume { display: flex; align-items: center; gap: 8px; width: 140px; flex-shrink: 0; }
.np-volume svg { color: #888; width: 18px; height: 18px; flex-shrink: 0; }
.np-volume input[type="range"] { flex: 1; height: 4px; -webkit-appearance: none; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer; }
.np-volume input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; }
.np-volume input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; border: none; }
</style>
