// Shared music state for menu bar integration

export type Song = {
	id: number;
	title: string;
	artist: string;
	album: string;
	duration: string;
	durationSec: number;
	cover: string;
	audioUrl: string;
	explicit?: boolean;
	spotifyUrl?: string;
};

export type Playlist = {
	id: string;
	name: string;
	cover: string;
	songs: Song[];
};

// Audio element singleton
let audioElement: HTMLAudioElement | null = null;

export function getAudio(): HTMLAudioElement {
	if (!audioElement) {
		audioElement = new Audio();
	}
	return audioElement;
}

export const musicState = $state({
	currentSong: null as Song | null,
	currentPlaylist: null as Playlist | null,
	isPlaying: false,
	progress: 0,
	currentTime: 0,
	volume: 80,
	showMenuPopup: false,
});

// Playlists with real artist names and explicit tags
export const playlists: Playlist[] = [
	{
		id: '1', name: 'Chill Beats', cover: '🎵',
		songs: [
			{ id: 1, title: 'Jazzy Abstract', artist: 'Coma-Media', album: 'Chill Beats', duration: '2:08', durationSec: 128, cover: '🎷', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/jazzy%20abstract' },
			{ id: 2, title: 'Smooth Groove', artist: 'SoundHelix', album: 'Chill Beats', duration: '3:45', durationSec: 225, cover: '🌙', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/smooth%20groove' },
			{ id: 3, title: 'Night Drive', artist: 'SoundHelix', album: 'Chill Beats', duration: '4:02', durationSec: 242, cover: '🚗', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/night%20drive' },
			{ id: 4, title: 'Mellow Vibes', artist: 'SoundHelix', album: 'Chill Beats', duration: '3:28', durationSec: 208, cover: '☕', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/mellow%20vibes' },
			{ id: 5, title: 'Lazy Sunday', artist: 'Coma-Media', album: 'Chill Beats', duration: '3:15', durationSec: 195, cover: '🛋️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/lazy%20sunday' },
			{ id: 6, title: 'Rainy Mood', artist: 'Lesfm', album: 'Chill Beats', duration: '4:12', durationSec: 252, cover: '🌧️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/rainy%20mood' },
		]
	},
	{
		id: '2', name: 'Electronic', cover: '🎧',
		songs: [
			{ id: 7, title: 'Digital Dreams', artist: 'Alexi Action', album: 'Electronic', duration: '4:15', durationSec: 255, cover: '⚡', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/digital%20dreams' },
			{ id: 8, title: 'Cyber Wave', artist: 'Infraction', album: 'Electronic', duration: '3:52', durationSec: 232, cover: '🤖', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/cyber%20wave' },
			{ id: 9, title: 'Neon Lights', artist: 'FASSounds', album: 'Electronic', duration: '4:08', durationSec: 248, cover: '🔊', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/neon%20lights' },
			{ id: 10, title: 'Synthwave Runner', artist: 'Alexi Action', album: 'Electronic', duration: '3:38', durationSec: 218, cover: '🏃', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/synthwave' },
			{ id: 11, title: 'Bass Drop', artist: 'Infraction', album: 'Electronic', duration: '2:55', durationSec: 175, cover: '💥', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/bass%20drop' },
			{ id: 12, title: 'Future Funk', artist: 'FASSounds', album: 'Electronic', duration: '3:42', durationSec: 222, cover: '🚀', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/future%20funk' },
		]
	},
	{
		id: '3', name: 'Acoustic', cover: '🎸',
		songs: [
			{ id: 13, title: 'Morning Coffee', artist: 'Benjamin Tissot', album: 'Acoustic', duration: '3:35', durationSec: 215, cover: '🌿', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/morning%20coffee' },
			{ id: 14, title: 'Sunset Beach', artist: 'Rafael Krux', album: 'Acoustic', duration: '4:22', durationSec: 262, cover: '🌅', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/sunset%20beach' },
			{ id: 15, title: 'Forest Walk', artist: 'Olexy', album: 'Acoustic', duration: '3:48', durationSec: 228, cover: '🌲', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/forest%20walk' },
			{ id: 16, title: 'Campfire Stories', artist: 'Benjamin Tissot', album: 'Acoustic', duration: '4:05', durationSec: 245, cover: '🔥', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/campfire' },
			{ id: 17, title: 'Mountain Air', artist: 'Rafael Krux', album: 'Acoustic', duration: '3:28', durationSec: 208, cover: '⛰️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/mountain' },
		]
	},
	{
		id: '4', name: 'Upbeat', cover: '🎉',
		songs: [
			{ id: 18, title: 'Party Time', artist: 'Lesfm', album: 'Upbeat', duration: '4:05', durationSec: 245, cover: '☀️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/party%20time' },
			{ id: 19, title: 'Energy Boost', artist: 'Lexin Music', album: 'Upbeat', duration: '3:42', durationSec: 222, cover: '🚀', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/energy%20boost' },
			{ id: 20, title: 'Summer Fun', artist: 'BoDleasons', album: 'Upbeat', duration: '4:18', durationSec: 258, cover: '🏖️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/summer%20fun' },
			{ id: 21, title: 'Dance Floor', artist: 'Lesfm', album: 'Upbeat', duration: '3:25', durationSec: 205, cover: '💃', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/dance%20floor' },
			{ id: 22, title: 'Good Vibes Only', artist: 'Lexin Music', album: 'Upbeat', duration: '3:58', durationSec: 238, cover: '✨', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/good%20vibes' },
		]
	},
	{
		id: '5', name: 'Hip Hop', cover: '🎤',
		songs: [
			{ id: 23, title: 'Street Dreams', artist: 'Coma-Media', album: 'Hip Hop', duration: '3:45', durationSec: 225, cover: '🏙️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/street%20dreams' },
			{ id: 24, title: 'Flow State', artist: 'Infraction', album: 'Hip Hop', duration: '4:02', durationSec: 242, cover: '🎯', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/flow%20state' },
			{ id: 25, title: 'Hustle Hard', artist: 'FASSounds', album: 'Hip Hop', duration: '3:38', durationSec: 218, cover: '💪', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/hustle%20hard' },
			{ id: 26, title: 'City Lights', artist: 'Alexi Action', album: 'Hip Hop', duration: '4:15', durationSec: 255, cover: '🌃', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/city%20lights' },
			{ id: 27, title: 'Real Talk', artist: 'Coma-Media', album: 'Hip Hop', duration: '3:52', durationSec: 232, cover: '💬', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/real%20talk' },
		]
	},
	{
		id: '6', name: 'Lo-Fi', cover: '📻',
		songs: [
			{ id: 28, title: 'Study Session', artist: 'Olexy', album: 'Lo-Fi', duration: '3:22', durationSec: 202, cover: '📚', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/study%20lofi' },
			{ id: 29, title: 'Late Night Coding', artist: 'Benjamin Tissot', album: 'Lo-Fi', duration: '4:08', durationSec: 248, cover: '💻', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/coding%20lofi' },
			{ id: 30, title: 'Dreamy Haze', artist: 'Rafael Krux', album: 'Lo-Fi', duration: '3:35', durationSec: 215, cover: '💭', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/dreamy%20lofi' },
			{ id: 31, title: 'Vinyl Crackle', artist: 'Olexy', album: 'Lo-Fi', duration: '3:48', durationSec: 228, cover: '🎹', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/vinyl%20lofi' },
			{ id: 32, title: 'Midnight Jazz', artist: 'Benjamin Tissot', album: 'Lo-Fi', duration: '4:25', durationSec: 265, cover: '🌙', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/midnight%20jazz' },
			{ id: 33, title: 'Cozy Afternoon', artist: 'Rafael Krux', album: 'Lo-Fi', duration: '3:15', durationSec: 195, cover: '🍵', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/cozy%20lofi' },
		]
	},
	{
		id: '7', name: 'Rock', cover: '🎸',
		songs: [
			{ id: 34, title: 'Thunder Road', artist: 'Lexin Music', album: 'Rock', duration: '4:32', durationSec: 272, cover: '⚡', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/thunder%20road' },
			{ id: 35, title: 'Rebel Heart', artist: 'BoDleasons', album: 'Rock', duration: '3:58', durationSec: 238, cover: '🔥', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/rebel%20heart' },
			{ id: 36, title: 'Highway Star', artist: 'Lesfm', album: 'Rock', duration: '4:15', durationSec: 255, cover: '🛣️', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/highway%20star' },
			{ id: 37, title: 'Electric Soul', artist: 'Lexin Music', album: 'Rock', duration: '3:42', durationSec: 222, cover: '🎵', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/electric%20soul' },
			{ id: 38, title: 'Wild Nights', artist: 'BoDleasons', album: 'Rock', duration: '4:05', durationSec: 245, cover: '🌟', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', explicit: true, spotifyUrl: 'https://open.spotify.com/search/wild%20nights' },
		]
	},
	{
		id: '8', name: 'Classical', cover: '🎻',
		songs: [
			{ id: 39, title: 'Moonlight Sonata', artist: 'Classical Masters', album: 'Classical', duration: '5:15', durationSec: 315, cover: '🌙', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/moonlight%20sonata' },
			{ id: 40, title: 'Spring Waltz', artist: 'Orchestra Elite', album: 'Classical', duration: '4:42', durationSec: 282, cover: '🌸', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/spring%20waltz' },
			{ id: 41, title: 'Symphony No. 5', artist: 'Classical Masters', album: 'Classical', duration: '6:08', durationSec: 368, cover: '🎼', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/symphony%205' },
			{ id: 42, title: 'Piano Dreams', artist: 'Orchestra Elite', album: 'Classical', duration: '4:35', durationSec: 275, cover: '🎹', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', explicit: false, spotifyUrl: 'https://open.spotify.com/search/piano%20dreams' },
		]
	},
];

export const allSongs = playlists.flatMap(p => p.songs);

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function playSong(song: Song, playlist?: Playlist) {
	const audio = getAudio();
	musicState.currentSong = song;
	if (playlist) musicState.currentPlaylist = playlist;
	
	// Stop current playback and reset
	audio.pause();
	audio.currentTime = 0;
	
	// Set new source and play immediately
	audio.src = song.audioUrl;
	audio.volume = musicState.volume / 100;
	audio.load(); // Force load
	
	// Play immediately - don't wait
	musicState.isPlaying = true;
	audio.play().catch(e => {
		console.log('Playback failed:', e);
		musicState.isPlaying = false;
	});
}

export function togglePlay() {
	const audio = getAudio();
	if (!musicState.currentSong) return;
	if (musicState.isPlaying) {
		audio.pause();
		musicState.isPlaying = false;
	} else {
		audio.play().catch(e => console.log('Playback failed:', e));
		musicState.isPlaying = true;
	}
}

export function playNext() {
	if (!musicState.currentSong) return;
	const playlist = musicState.currentPlaylist || playlists[0];
	const currentIndex = playlist.songs.findIndex(s => s.id === musicState.currentSong?.id);
	const nextIndex = (currentIndex + 1) % playlist.songs.length;
	playSong(playlist.songs[nextIndex], playlist);
}

export function playPrev() {
	const audio = getAudio();
	if (!musicState.currentSong) return;
	if (audio.currentTime > 3) {
		audio.currentTime = 0;
		return;
	}
	const playlist = musicState.currentPlaylist || playlists[0];
	const currentIndex = playlist.songs.findIndex(s => s.id === musicState.currentSong?.id);
	const prevIndex = currentIndex <= 0 ? playlist.songs.length - 1 : currentIndex - 1;
	playSong(playlist.songs[prevIndex], playlist);
}

export function setVolume(vol: number) {
	const audio = getAudio();
	musicState.volume = vol;
	audio.volume = vol / 100;
}

export function stopMusic() {
	const audio = getAudio();
	audio.pause();
	audio.currentTime = 0;
	musicState.isPlaying = false;
	musicState.currentSong = null;
	musicState.currentPlaylist = null;
	musicState.progress = 0;
	musicState.currentTime = 0;
}

export function seekTo(percent: number) {
	const audio = getAudio();
	if (audio.duration) {
		audio.currentTime = percent * audio.duration;
	}
}

// Initialize audio event listeners
export function initAudioListeners() {
	const audio = getAudio();
	audio.addEventListener('timeupdate', () => {
		if (musicState.currentSong) {
			musicState.currentTime = audio.currentTime;
			musicState.progress = (audio.currentTime / audio.duration) * 100 || 0;
		}
	});
	audio.addEventListener('ended', () => {
		playNext();
	});
	
	// Preload next song when current song is 80% done
	audio.addEventListener('timeupdate', () => {
		if (musicState.currentSong && audio.duration) {
			const percentPlayed = (audio.currentTime / audio.duration) * 100;
			if (percentPlayed > 80) {
				preloadNextSong();
			}
		}
	});
}

// Preload next song for faster transitions
let preloadedUrl = '';
function preloadNextSong() {
	if (!musicState.currentSong || !musicState.currentPlaylist) return;
	const playlist = musicState.currentPlaylist;
	const currentIndex = playlist.songs.findIndex(s => s.id === musicState.currentSong?.id);
	const nextIndex = (currentIndex + 1) % playlist.songs.length;
	const nextSong = playlist.songs[nextIndex];
	
	if (nextSong && nextSong.audioUrl !== preloadedUrl) {
		preloadedUrl = nextSong.audioUrl;
		const preloadAudio = new Audio();
		preloadAudio.preload = 'auto';
		preloadAudio.src = nextSong.audioUrl;
	}
}
