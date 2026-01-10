<script lang="ts">
import { onMount } from 'svelte';
import { musicState, playlists, allSongs, formatTime, playSong, togglePlay, playNext, playPrev, setVolume, seekTo, initAudioListeners, type Playlist } from '🍎/state/music.svelte.ts';

let activeTab = $state<'listen' | 'browse' | 'radio' | 'library'>('listen');
let currentPlaylistView = $state<Playlist | null>(null);
let searchQuery = $state('');
let searchResults = $state<typeof allSongs>([]);

const recentlyPlayed = playlists[0].songs.slice(0, 4);

onMount(() => {
	initAudioListeners();
});

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

function openPlaylist(playlist: Playlist) {
	currentPlaylistView = playlist;
	musicState.currentPlaylist = playlist;
}
</script>

<section class="music-app">
	<div class="sidebar">
		<div class="sidebar-section">
			<button class="nav-item" class:active={activeTab === 'listen' && !searchResults.length} onclick={() => { activeTab = 'listen'; currentPlaylistView = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
				Listen Now
			</button>
			<button class="nav-item" class:active={activeTab === 'browse'} onclick={() => { activeTab = 'browse'; currentPlaylistView = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
				Browse
			</button>
			<button class="nav-item" class:active={activeTab === 'radio'} onclick={() => { activeTab = 'radio'; currentPlaylistView = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>
				Radio
			</button>
		</div>
		<div class="sidebar-section">
			<h3 class="section-label">Library</h3>
			<button class="nav-item" class:active={activeTab === 'library'} onclick={() => { activeTab = 'library'; currentPlaylistView = null; searchQuery = ''; searchResults = []; }}>
				<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>
				Playlists
			</button>
		</div>
		<div class="sidebar-section playlists-list">
			<h3 class="section-label">Playlists</h3>
			{#each playlists as playlist}
				<button class="playlist-item" class:active={currentPlaylistView?.id === playlist.id} onclick={() => openPlaylist(playlist)}>
					<span class="playlist-icon">{playlist.cover}</span>
					<span class="playlist-text">{playlist.name}</span>
					{#if musicState.currentPlaylist?.id === playlist.id && musicState.currentSong}
						<span class="now-playing-indicator" class:paused={!musicState.isPlaying}>
							<span class="bar"></span>
							<span class="bar"></span>
							<span class="bar"></span>
						</span>
					{/if}
				</button>
			{/each}
		</div>
		
		{#if musicState.currentSong}
			<div class="sidebar-now-playing">
				<div class="snp-cover">{musicState.currentSong.cover}</div>
				<div class="snp-info">
					<span class="snp-title">{musicState.currentSong.title}</span>
					<span class="snp-artist">{musicState.currentSong.artist}</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="main-content">
		<div class="topbar app-window-drag-handle">
			<div class="nav-controls">
				<button class="nav-btn" type="button" onclick={() => { currentPlaylistView = null; searchQuery = ''; searchResults = []; }}>◀</button>
				<button class="nav-btn" type="button">▶</button>
			</div>
			<div class="search-container">
				<svg class="search-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
				<input type="text" placeholder="Search songs, artists, albums..." bind:value={searchQuery} oninput={handleSearch} />
			</div>
		</div>
		
		<div class="content-area">
			{#if searchResults.length > 0}
				<h1 class="page-title">Search Results</h1>
				<div class="songs-list">
					<div class="songs-header">
						<span class="col-num">#</span>
						<span class="col-title">Title</span>
						<span class="col-album">Album</span>
						<span class="col-duration">🕐</span>
						<span class="col-link"></span>
					</div>
					{#each searchResults as song, i}
						<button class="song-row" class:playing={musicState.currentSong?.id === song.id} onclick={() => playSong(song)}>
							<span class="col-num">{i + 1}</span>
							<div class="col-title">
								<span class="song-cover">{song.cover}</span>
								<div class="song-info">
									<div class="song-title-row">
										<span class="song-title">{song.title}</span>
										{#if song.explicit}<span class="explicit-tag">E</span>{/if}
									</div>
									<span class="song-artist">{song.artist}</span>
								</div>
							</div>
							<span class="col-album">{song.album}</span>
							<span class="col-duration">{song.duration}</span>
							<a class="col-link spotify-link" href={song.spotifyUrl} target="_blank" onclick={(e) => e.stopPropagation()} title="Open in Spotify">
								<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
							</a>
						</button>
					{/each}
				</div>
			{:else if currentPlaylistView}
				<div class="playlist-view">
					<div class="playlist-header">
						<div class="playlist-cover-large">{currentPlaylistView.cover}</div>
						<div class="playlist-info">
							<span class="playlist-type">PLAYLIST</span>
							<h1>{currentPlaylistView.name}</h1>
							<p>{currentPlaylistView.songs.length} songs</p>
							<button 
								class="play-all-btn" 
								class:playing={musicState.isPlaying && musicState.currentPlaylist?.id === currentPlaylistView.id}
								type="button" 
								onclick={() => {
									if (musicState.currentPlaylist?.id === currentPlaylistView.id && musicState.currentSong) {
										togglePlay();
									} else {
										playSong(currentPlaylistView.songs[0], currentPlaylistView);
									}
								}}
							>
								{#if musicState.isPlaying && musicState.currentPlaylist?.id === currentPlaylistView.id}
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
									Pause
								{:else if musicState.currentPlaylist?.id === currentPlaylistView.id && musicState.currentSong}
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
									Resume
								{:else}
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
									Play
								{/if}
							</button>
						</div>
						
						{#if musicState.currentSong && musicState.currentPlaylist?.id === currentPlaylistView.id}
							<div class="header-now-playing">
								<div class="hnp-bars" class:paused={!musicState.isPlaying}>
									<span class="bar"></span>
									<span class="bar"></span>
									<span class="bar"></span>
									<span class="bar"></span>
								</div>
								<div class="hnp-info">
									<span class="hnp-title">{musicState.currentSong.title}</span>
									<span class="hnp-artist">{musicState.currentSong.artist}</span>
								</div>
								<div class="hnp-controls">
									<button class="hnp-btn" onclick={() => playPrev()}>⏮</button>
									<button class="hnp-btn play" onclick={() => togglePlay()}>
										{musicState.isPlaying ? '⏸' : '▶'}
									</button>
									<button class="hnp-btn" onclick={() => playNext()}>⏭</button>
								</div>
							</div>
						{/if}
					</div>
					<div class="songs-list">
						<div class="songs-header">
							<span class="col-num">#</span>
							<span class="col-title">Title</span>
							<span class="col-album">Album</span>
							<span class="col-duration">🕐</span>
							<span class="col-link"></span>
						</div>
						{#each currentPlaylistView.songs as song, i}
							<button class="song-row" class:playing={musicState.currentSong?.id === song.id} onclick={() => playSong(song, currentPlaylistView)}>
								<span class="col-num">{musicState.currentSong?.id === song.id && musicState.isPlaying ? '🔊' : i + 1}</span>
								<div class="col-title">
									<span class="song-cover">{song.cover}</span>
									<div class="song-info">
										<div class="song-title-row">
											<span class="song-title">{song.title}</span>
											{#if song.explicit}<span class="explicit-tag">E</span>{/if}
										</div>
										<span class="song-artist">{song.artist}</span>
									</div>
								</div>
								<span class="col-album">{song.album}</span>
								<span class="col-duration">{song.duration}</span>
								<a class="col-link spotify-link" href={song.spotifyUrl} target="_blank" onclick={(e) => e.stopPropagation()} title="Open in Spotify">
									<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
								</a>
							</button>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'listen'}
				<h1 class="page-title">Listen Now</h1>
				<section class="content-section">
					<h2>Recently Played</h2>
					<div class="album-grid">
						{#each recentlyPlayed as song}
							<button class="album-card" onclick={() => playSong(song, playlists[0])}>
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
					<h2>All Playlists</h2>
					<div class="playlist-grid">
						{#each playlists as playlist}
							<button class="playlist-card" onclick={() => openPlaylist(playlist)}>
								<div class="playlist-cover">{playlist.cover}</div>
								<span class="playlist-name">{playlist.name}</span>
							</button>
						{/each}
					</div>
				</section>
			{:else if activeTab === 'radio'}
				<h1 class="page-title">Radio</h1>
				<section class="content-section">
					<h2>Stations</h2>
					<div class="radio-grid">
						{#each playlists as playlist}
							<button class="radio-card" onclick={() => { openPlaylist(playlist); playSong(playlist.songs[0], playlist); }}>
								<div class="radio-cover">{playlist.cover}</div>
								<span class="radio-name">{playlist.name} Radio</span>
								<span class="radio-desc">Based on {playlist.name}</span>
							</button>
						{/each}
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
	
	<div class="now-playing" class:has-song={musicState.currentSong}>
		{#if musicState.currentSong}
			<div class="np-song">
				<div class="np-cover">{musicState.currentSong.cover}</div>
				<div class="np-info">
					<div class="np-title-row">
						<span class="np-title">{musicState.currentSong.title}</span>
						{#if musicState.currentSong.explicit}<span class="explicit-tag">E</span>{/if}
					</div>
					<span class="np-artist">{musicState.currentSong.artist}</span>
				</div>
			</div>
			<div class="np-controls">
				<button class="control-btn" type="button" onclick={() => playPrev()}>⏮</button>
				<button class="control-btn play-btn" type="button" onclick={() => togglePlay()}>
					{musicState.isPlaying ? '⏸' : '▶'}
				</button>
				<button class="control-btn" type="button" onclick={() => playNext()}>⏭</button>
			</div>
			<div class="np-progress">
				<span class="time">{formatTime(musicState.currentTime)}</span>
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
				<span class="time">{musicState.currentSong.duration}</span>
			</div>
			<div class="np-volume">
				<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
					{#if musicState.volume === 0}
						<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
					{:else if musicState.volume < 50}
						<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
					{:else}
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
					{/if}
				</svg>
				<input 
					type="range" 
					min="0" 
					max="100" 
					value={musicState.volume} 
					style="--volume-percent: {musicState.volume}%" 
					onclick={(e) => e.stopPropagation()}
					onmousedown={(e) => e.stopPropagation()}
					oninput={(e) => setVolume(parseInt((e.target as HTMLInputElement).value))} 
				/>
			</div>
		{:else}
			<div class="np-empty">Select a song to play</div>
		{/if}
	</div>
</section>


<style>
.music-app { display: flex; flex-direction: column; height: 100%; background: #1c1c1e; border-radius: inherit; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #fff; position: relative; }
.sidebar { width: 240px; background: rgba(0,0,0,0.3); padding: 10px 0; padding-top: 40px; display: flex; flex-direction: column; position: absolute; left: 0; top: 0; bottom: 72px; overflow-y: auto; z-index: 1; }
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
.playlist-text { flex: 1; }
.now-playing-indicator { display: flex; gap: 2px; align-items: flex-end; height: 12px; }
.now-playing-indicator .bar { width: 3px; background: #fa2d48; border-radius: 1px; animation: soundbar 0.5s ease infinite alternate; }
.now-playing-indicator .bar:nth-child(1) { height: 4px; animation-delay: 0s; }
.now-playing-indicator .bar:nth-child(2) { height: 8px; animation-delay: 0.2s; }
.now-playing-indicator .bar:nth-child(3) { height: 6px; animation-delay: 0.4s; }
.now-playing-indicator.paused .bar { animation: none; height: 4px; background: #888; }
@keyframes soundbar { to { height: 12px; } }
.sidebar-now-playing { padding: 12px; background: rgba(0,0,0,0.3); margin: 8px; border-radius: 8px; display: flex; align-items: center; gap: 10px; }
.snp-cover { width: 40px; height: 40px; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.snp-info { flex: 1; overflow: hidden; }
.snp-title { display: block; font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.snp-artist { display: block; font-size: 10px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.main-content { flex: 1; margin-left: 240px; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 72px; }
.topbar { display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: rgba(0,0,0,0.2); }
.nav-controls { display: flex; gap: 8px; }
.nav-btn { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: #888; cursor: pointer; font-size: 12px; }
.nav-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.search-container { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 8px; flex: 1; max-width: 400px; }
.search-icon { width: 16px; height: 16px; color: #888; flex-shrink: 0; }
.search-container input { flex: 1; background: transparent; border: none; color: #fff; font-size: 13px; outline: none; }
.search-container input::placeholder { color: #666; }
.content-area { flex: 1; overflow-y: auto; padding: 20px; min-height: 0; }
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
.songs-list { background: rgba(0,0,0,0.2); border-radius: 8px; }
.songs-header { display: grid; grid-template-columns: 40px 1fr 1fr 60px 40px; gap: 16px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-transform: uppercase; }
.song-row { display: grid; grid-template-columns: 40px 1fr 1fr 60px 40px; gap: 16px; padding: 12px 16px; background: transparent; border: none; color: #fff; cursor: pointer; width: 100%; text-align: left; transition: background 0.2s; }
.song-row:hover { background: rgba(255,255,255,0.1); }
.song-row.playing { background: rgba(250,45,72,0.2); }
.col-num { color: #888; font-size: 14px; display: flex; align-items: center; }
.col-title { display: flex; align-items: center; gap: 12px; overflow: hidden; }
.song-cover { width: 40px; height: 40px; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.song-info { display: flex; flex-direction: column; overflow: hidden; }
.song-title-row { display: flex; align-items: center; gap: 6px; }
.song-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.explicit-tag { background: rgba(255,255,255,0.2); color: #aaa; font-size: 9px; font-weight: 600; padding: 2px 4px; border-radius: 2px; flex-shrink: 0; }
.song-artist { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-album { color: #888; font-size: 13px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-duration { color: #888; font-size: 13px; display: flex; align-items: center; }
.col-link { display: flex; align-items: center; justify-content: center; }
.spotify-link { color: #888; text-decoration: none; padding: 4px; border-radius: 4px; transition: all 0.2s; }
.spotify-link:hover { color: #1DB954; background: rgba(29, 185, 84, 0.1); }
.spotify-link svg { width: 16px; height: 16px; }
.now-playing { position: absolute; bottom: 0; left: 0; right: 0; height: 72px; background: #282828; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; padding: 0 16px; gap: 16px; z-index: 10; }
.now-playing.has-song { }
.np-empty { color: #666; font-size: 13px; width: 100%; text-align: center; }
.np-song { display: flex; align-items: center; gap: 12px; width: 220px; flex-shrink: 0; }
.np-cover { width: 48px; height: 48px; background: linear-gradient(135deg, #fa2d48 0%, #a02d48 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.np-info { display: flex; flex-direction: column; overflow: hidden; }
.np-title-row { display: flex; align-items: center; gap: 6px; }
.np-title { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-artist { font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-controls { display: flex; align-items: center; gap: 12px; }
.control-btn { width: 32px; height: 32px; background: transparent; border: none; color: #fff; cursor: pointer; font-size: 14px; border-radius: 50%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.control-btn:hover { background: rgba(255,255,255,0.1); }
.play-btn { width: 36px; height: 36px; background: #fff; color: #000; font-size: 16px; }
.play-btn:hover { transform: scale(1.05); background: #fff; }
.np-progress { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
.time { font-size: 11px; color: #888; min-width: 35px; text-align: center; }
.progress-slider { flex: 1; height: 4px; -webkit-appearance: none; background: linear-gradient(to right, #fa2d48 0%, #fa2d48 var(--progress-percent, 0%), rgba(255,255,255,0.2) var(--progress-percent, 0%), rgba(255,255,255,0.2) 100%); border-radius: 2px; cursor: pointer; outline: none; }
.progress-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.progress-slider::-moz-range-thumb { width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.np-volume { display: flex; align-items: center; gap: 8px; width: 140px; flex-shrink: 0; }
.np-volume svg { color: #888; width: 18px; height: 18px; flex-shrink: 0; }
.np-volume input[type="range"] { flex: 1; height: 4px; -webkit-appearance: none; background: linear-gradient(to right, #fa2d48 0%, #fa2d48 var(--volume-percent, 80%), rgba(255,255,255,0.2) var(--volume-percent, 80%), rgba(255,255,255,0.2) 100%); border-radius: 2px; cursor: pointer; outline: none; }
.np-volume input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.np-volume input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; border: none; }

/* Header now-playing section */
.header-now-playing { margin-left: auto; display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 12px; }
.hnp-bars { display: flex; gap: 3px; align-items: flex-end; height: 24px; }
.hnp-bars .bar { width: 4px; background: #fa2d48; border-radius: 2px; animation: hnpbar 0.5s ease infinite alternate; }
.hnp-bars .bar:nth-child(1) { height: 8px; animation-delay: 0s; }
.hnp-bars .bar:nth-child(2) { height: 16px; animation-delay: 0.15s; }
.hnp-bars .bar:nth-child(3) { height: 12px; animation-delay: 0.3s; }
.hnp-bars .bar:nth-child(4) { height: 20px; animation-delay: 0.45s; }
.hnp-bars.paused .bar { animation: none; height: 6px; background: #888; }
@keyframes hnpbar { to { height: 24px; } }
.hnp-info { display: flex; flex-direction: column; min-width: 100px; max-width: 150px; }
.hnp-title { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hnp-artist { font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hnp-controls { display: flex; align-items: center; gap: 8px; }
.hnp-btn { width: 28px; height: 28px; background: transparent; border: none; color: #fff; cursor: pointer; font-size: 12px; border-radius: 50%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.hnp-btn:hover { background: rgba(255,255,255,0.1); }
.hnp-btn.play { width: 32px; height: 32px; background: #fa2d48; font-size: 14px; }
.hnp-btn.play:hover { background: #ff4d64; transform: scale(1.05); }

/* Play button playing state */
.play-all-btn.playing { background: #fa2d48; box-shadow: 0 0 20px rgba(250, 45, 72, 0.4); }
</style>
