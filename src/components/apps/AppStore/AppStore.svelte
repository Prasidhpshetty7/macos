<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();
	
	let selectedTab = $state('discover');
	
	const featuredApps = [
		{ 
			name: 'Final Cut Pro', 
			category: 'Photo & Video', 
			price: '$299.99', 
			rating: 4.5, 
			description: 'Revolutionary video editing',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			icon: 'https://img.icons8.com/color/512/final-cut-pro.png'
		},
		{ 
			name: 'Logic Pro', 
			category: 'Music', 
			price: '$199.99', 
			rating: 4.8,
			description: 'Professional music production',
			gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
			icon: 'https://img.icons8.com/color/512/logic-pro.png'
		},
		{ 
			name: 'Affinity Photo', 
			category: 'Photo & Video', 
			price: '$69.99', 
			rating: 4.7,
			description: 'Professional photo editing',
			gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
			icon: 'https://img.icons8.com/color/512/affinity-photo.png'
		},
	];
	
	const apps = [
		{ name: 'Slack', category: 'Business', price: 'Free', rating: 4.4, reviews: '2.5M', icon: 'https://img.icons8.com/color/512/slack-new.png' },
		{ name: 'Notion', category: 'Productivity', price: 'Free', rating: 4.7, reviews: '890K', icon: 'https://img.icons8.com/color/512/notion.png' },
		{ name: 'Figma', category: 'Graphics & Design', price: 'Free', rating: 4.6, reviews: '1.2M', icon: 'https://img.icons8.com/color/512/figma.png' },
		{ name: 'Discord', category: 'Social Networking', price: 'Free', rating: 4.5, reviews: '5.8M', icon: 'https://img.icons8.com/color/512/discord-logo.png' },
		{ name: 'Spotify', category: 'Music', price: 'Free', rating: 4.8, reviews: '12M', icon: 'https://img.icons8.com/color/512/spotify.png' },
		{ name: 'Adobe Photoshop', category: 'Photo & Video', price: '$20.99/mo', rating: 4.5, reviews: '3.2M', icon: 'https://img.icons8.com/color/512/adobe-photoshop.png' },
		{ name: 'Microsoft Office', category: 'Productivity', price: 'Free', rating: 4.3, reviews: '8.5M', icon: 'https://img.icons8.com/color/512/microsoft-office-2019.png' },
		{ name: 'Zoom', category: 'Business', price: 'Free', rating: 4.4, reviews: '15M', icon: 'https://img.icons8.com/color/512/zoom.png' },
		{ name: 'Telegram', category: 'Social Networking', price: 'Free', rating: 4.6, reviews: '4.2M', icon: 'https://img.icons8.com/color/512/telegram-app.png' },
		{ name: 'VLC', category: 'Entertainment', price: 'Free', rating: 4.7, reviews: '6.8M', icon: 'https://img.icons8.com/color/512/vlc.png' },
		{ name: 'Xcode', category: 'Developer Tools', price: 'Free', rating: 4.2, reviews: '1.8M', icon: 'https://img.icons8.com/color/512/xcode.png' },
		{ name: 'Visual Studio Code', category: 'Developer Tools', price: 'Free', rating: 4.8, reviews: '9.2M', icon: 'https://img.icons8.com/color/512/visual-studio-code-2019.png' },
		{ name: 'Docker', category: 'Developer Tools', price: 'Free', rating: 4.5, reviews: '2.1M', icon: 'https://img.icons8.com/color/512/docker.png' },
		{ name: 'Postman', category: 'Developer Tools', price: 'Free', rating: 4.6, reviews: '1.5M', icon: 'https://img.icons8.com/dusk/512/postman-api.png' },
		{ name: 'GitHub', category: 'Developer Tools', price: 'Free', rating: 4.4, reviews: '3.4M', icon: 'https://img.icons8.com/color/512/github.png' },
		{ name: 'MongoDB', category: 'Developer Tools', price: 'Free', rating: 4.7, reviews: '450K', icon: 'https://img.icons8.com/color/512/mongodb.png' },
	];
	
	const games = [
		{ name: 'Minecraft', category: 'Adventure', price: '$26.95', rating: 4.6, reviews: '45M', icon: 'https://img.icons8.com/color/512/minecraft-logo.png' },
		{ name: 'Among Us', category: 'Strategy', price: 'Free', rating: 4.3, reviews: '28M', icon: 'https://img.icons8.com/color/512/among-us.png' },
		{ name: 'Stardew Valley', category: 'Simulation', price: '$14.99', rating: 4.8, reviews: '12M', icon: 'https://img.icons8.com/color/512/stardew-valley.png' },
		{ name: 'Terraria', category: 'Adventure', price: '$9.99', rating: 4.7, reviews: '18M', icon: 'https://img.icons8.com/color/512/terraria.png' },
		{ name: 'The Sims', category: 'Simulation', price: 'Free', rating: 4.2, reviews: '35M', icon: 'https://img.icons8.com/color/512/the-sims.png' },
		{ name: 'Fortnite', category: 'Action', price: 'Free', rating: 4.5, reviews: '52M', icon: 'https://img.icons8.com/color/512/fortnite.png' },
		{ name: 'Roblox', category: 'Adventure', price: 'Free', rating: 4.4, reviews: '68M', icon: 'https://img.icons8.com/color/512/roblox.png' },
		{ name: 'League of Legends', category: 'Strategy', price: 'Free', rating: 4.6, reviews: '42M', icon: 'https://img.icons8.com/color/512/league-of-legends.png' },
		{ name: 'Valorant', category: 'Action', price: 'Free', rating: 4.5, reviews: '25M', icon: 'https://img.icons8.com/color/512/valorant.png' },
		{ name: 'Steam', category: 'Platform', price: 'Free', rating: 4.7, reviews: '38M', icon: 'https://img.icons8.com/color/512/steam.png' },
		{ name: 'Epic Games', category: 'Platform', price: 'Free', rating: 4.4, reviews: '32M', icon: 'https://img.icons8.com/color/512/epic-games.png' },
		{ name: 'Unity', category: 'Game Engine', price: 'Free', rating: 4.6, reviews: '22M', icon: 'https://img.icons8.com/color/512/unity.png' },
	];
	
	const categories = [
		{ name: 'Productivity', count: 1250 },
		{ name: 'Graphics & Design', count: 890 },
		{ name: 'Developer Tools', count: 650 },
		{ name: 'Business', count: 980 },
		{ name: 'Entertainment', count: 1500 },
		{ name: 'Music', count: 450 },
		{ name: 'Photo & Video', count: 720 },
		{ name: 'Games', count: 2100 },
		{ name: 'Social Networking', count: 340 },
		{ name: 'Education', count: 890 },
		{ name: 'Health & Fitness', count: 560 },
		{ name: 'Utilities', count: 1100 },
	];
</script>


<section class="app-store">
	<!-- Drag handle -->
	<div class="drag-handle app-window-drag-handle"></div>
	
	<!-- Sidebar -->
	<div class="sidebar">
		<div class="sidebar-section">
			<button class="sidebar-item" class:active={selectedTab === 'discover'} onclick={() => selectedTab = 'discover'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
				<span>Discover</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'arcade'} onclick={() => selectedTab = 'arcade'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9h4v2H6V9m14 0v2h-4V9m-2 3h-4v2h4v-2m-6 3H6v2h4v-2m8 0v2h4v-2m-2 3h-4v2h4v-2m-6 3H6v2h4v-2m8 0v2h4v-2M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
				<span>Arcade</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'create'} onclick={() => selectedTab = 'create'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41zM7 14a3 3 0 0 0-3 3c0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4a3 3 0 0 0-3-3z"/></svg>
				<span>Create</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'work'} onclick={() => selectedTab = 'work'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8c0-1.11.89-2 2-2h4V4c0-1.11.89-2 2-2m4 4V4h-4v2h4z"/></svg>
				<span>Work</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'play'} onclick={() => selectedTab = 'play'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
				<span>Play</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'develop'} onclick={() => selectedTab = 'develop'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/></svg>
				<span>Develop</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'categories'} onclick={() => selectedTab = 'categories'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm10 0h-6c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM10 14H4c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2v-6c0-1.11-.89-2-2-2zm10 0h-6c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2v-6c0-1.11-.89-2-2-2z"/></svg>
				<span>Categories</span>
			</button>
		</div>
		
		<div class="sidebar-divider"></div>
		
		<div class="sidebar-section">
			<button class="sidebar-item" class:active={selectedTab === 'updates'} onclick={() => selectedTab = 'updates'}>
				<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>
				<span>Updates</span>
			</button>
		</div>
	</div>
	
	<!-- Main Content -->
	<div class="main-content">
		<!-- Search Bar -->
		<div class="search-bar">
			<svg class="search-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>
			<input type="text" placeholder="Search for apps and games" />
		</div>
		
		<!-- Content Area -->
		<div class="content-area">
			{#if selectedTab === 'discover'}
				<h1 class="page-title">Discover</h1>
				
				<!-- Featured Apps -->
				<section class="section">
					<h2 class="section-title">Featured Apps</h2>
					<div class="featured-grid">
						{#each featuredApps as app}
							<div class="featured-card">
								<div class="featured-image" style="background: {app.gradient}">
									<div class="app-icon-large">
										<img src={app.icon} alt={app.name} class="featured-icon-img" />
									</div>
								</div>
								<div class="featured-info">
									<h3>{app.name}</h3>
									<p class="category">{app.category}</p>
									<p class="description">{app.description}</p>
									<div class="rating">
										<span class="stars">{'★'.repeat(Math.floor(app.rating))}</span>
										<span class="rating-text">{app.rating}</span>
									</div>
									<button class="get-btn">{app.price}</button>
								</div>
							</div>
						{/each}
					</div>
				</section>
				
				<!-- Popular Apps -->
				<section class="section">
					<h2 class="section-title">Popular Apps</h2>
					<div class="apps-list">
						{#each apps.slice(0, 8) as app}
							<div class="app-row">
								<div class="app-icon-round">
									<img src={app.icon} alt={app.name} class="app-icon-img" />
								</div>
								<div class="app-info-row">
									<h4>{app.name}</h4>
									<p class="app-category">{app.category}</p>
									<div class="app-meta">
										<span class="rating-small">★ {app.rating}</span>
										<span class="reviews">{app.reviews} Ratings</span>
									</div>
								</div>
								<button class="get-btn-small">{app.price}</button>
							</div>
						{/each}
					</div>
				</section>
				
				<!-- Top Games -->
				<section class="section">
					<h2 class="section-title">Top Games</h2>
					<div class="apps-list">
						{#each games.slice(0, 6) as game}
							<div class="app-row">
								<div class="app-icon-round">
									<img src={game.icon} alt={game.name} class="app-icon-img" />
								</div>
								<div class="app-info-row">
									<h4>{game.name}</h4>
									<p class="app-category">{game.category}</p>
									<div class="app-meta">
										<span class="rating-small">★ {game.rating}</span>
										<span class="reviews">{game.reviews} Ratings</span>
									</div>
								</div>
								<button class="get-btn-small">{game.price}</button>
							</div>
						{/each}
					</div>
				</section>
				
			{:else if selectedTab === 'arcade' || selectedTab === 'play'}
				<h1 class="page-title">Games</h1>
				
				<section class="section">
					<h2 class="section-title">All Games</h2>
					<div class="apps-list">
						{#each games as game}
							<div class="app-row">
								<div class="app-icon-round">
									<img src={game.icon} alt={game.name} class="app-icon-img" />
								</div>
								<div class="app-info-row">
									<h4>{game.name}</h4>
									<p class="app-category">{game.category}</p>
									<div class="app-meta">
										<span class="rating-small">★ {game.rating}</span>
										<span class="reviews">{game.reviews} Ratings</span>
									</div>
								</div>
								<button class="get-btn-small">{game.price}</button>
							</div>
						{/each}
					</div>
				</section>
				
			{:else if selectedTab === 'develop'}
				<h1 class="page-title">Developer Tools</h1>
				
				<section class="section">
					<h2 class="section-title">Essential Tools</h2>
					<div class="apps-list">
						{#each apps.filter(a => a.category === 'Developer Tools') as app}
							<div class="app-row">
								<div class="app-icon-round">
									<img src={app.icon} alt={app.name} class="app-icon-img" />
								</div>
								<div class="app-info-row">
									<h4>{app.name}</h4>
									<p class="app-category">{app.category}</p>
									<div class="app-meta">
										<span class="rating-small">★ {app.rating}</span>
										<span class="reviews">{app.reviews} Ratings</span>
									</div>
								</div>
								<button class="get-btn-small">{app.price}</button>
							</div>
						{/each}
					</div>
				</section>
				
			{:else if selectedTab === 'categories'}
				<h1 class="page-title">Categories</h1>
				
				<div class="categories-grid">
					{#each categories as category}
						<button class="category-card">
							<span class="category-name">{category.name}</span>
							<span class="category-count">{category.count} apps</span>
						</button>
					{/each}
				</div>
				
			{:else}
				<h1 class="page-title">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h1>
				
				<section class="section">
					<div class="apps-list">
						{#each apps.slice(0, 10) as app}
							<div class="app-row">
								<div class="app-icon-round">
									<img src={app.icon} alt={app.name} class="app-icon-img" />
								</div>
								<div class="app-info-row">
									<h4>{app.name}</h4>
									<p class="app-category">{app.category}</p>
									<div class="app-meta">
										<span class="rating-small">★ {app.rating}</span>
										<span class="reviews">{app.reviews} Ratings</span>
									</div>
								</div>
								<button class="get-btn-small">{app.price}</button>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</div>
</section>


<style>
	.app-store {
		display: flex;
		height: 100%;
		background: #f5f5f7;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
		position: relative;
		border-radius: inherit;
		overflow: hidden;
	}
	
	.drag-handle {
		position: absolute;
		top: 0;
		left: 80px;
		right: 0;
		height: 52px;
		z-index: 100;
		pointer-events: auto;
	}
	
	/* Sidebar */
	.sidebar {
		width: 220px;
		background: rgba(242, 242, 247, 0.95);
		backdrop-filter: blur(20px);
		border-right: 1px solid rgba(0, 0, 0, 0.08);
		padding-top: 60px;
		overflow-y: auto;
	}
	
	.sidebar-section {
		padding: 8px;
	}
	
	.sidebar-divider {
		height: 1px;
		background: rgba(0, 0, 0, 0.1);
		margin: 8px 16px;
	}
	
	.sidebar-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		color: #1d1d1f;
		transition: background 0.15s;
		text-align: left;
	}
	
	.sidebar-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	
	.sidebar-item.active {
		background: rgba(0, 122, 255, 0.15);
		color: #007aff;
		font-weight: 500;
	}
	
	.sidebar-icon {
		width: 18px;
		height: 18px;
		opacity: 0.7;
	}
	
	.sidebar-item.active .sidebar-icon {
		opacity: 1;
	}
	
	/* Main Content */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: white;
		overflow: hidden;
	}
	
	.search-bar {
		padding: 16px 24px;
		padding-top: 68px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		position: relative;
	}
	
	.search-icon {
		position: absolute;
		left: 36px;
		top: 50%;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		opacity: 0.5;
	}
	
	.search-bar input {
		width: 100%;
		padding: 10px 16px 10px 40px;
		border: none;
		border-radius: 8px;
		background: #f5f5f7;
		font-size: 14px;
	}
	
	.search-bar input:focus {
		outline: none;
		background: #e8e8ed;
	}
	
	.content-area {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
	}
	
	.page-title {
		font-size: 32px;
		font-weight: 700;
		margin: 0 0 24px 0;
		color: #1d1d1f;
	}
	
	.section {
		margin-bottom: 40px;
	}
	
	.section-title {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 16px 0;
		color: #1d1d1f;
	}
	
	/* Featured Grid */
	.featured-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 20px;
	}
	
	.featured-card {
		background: #f5f5f7;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.featured-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}
	
	.featured-image {
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.app-icon-large {
		width: 110px;
		height: 110px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
		padding: 16px;
	}
	
	.featured-icon-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.featured-info {
		padding: 20px;
	}
	
	.featured-info h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 4px 0;
		color: #1d1d1f;
	}
	
	.category {
		font-size: 13px;
		color: #86868b;
		margin: 0 0 4px 0;
	}
	
	.description {
		font-size: 13px;
		color: #1d1d1f;
		margin: 0 0 12px 0;
	}
	
	.rating {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 12px;
	}
	
	.stars {
		font-size: 14px;
		color: #ffb800;
		letter-spacing: 1px;
	}
	
	.rating-text {
		font-size: 13px;
		color: #86868b;
		font-weight: 500;
	}
	
	.get-btn {
		padding: 8px 24px;
		background: #007aff;
		color: white;
		border: none;
		border-radius: 20px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.get-btn:hover {
		background: #0051d5;
	}
	
	/* Apps List (Row Layout) */
	.apps-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.app-row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px;
		background: white;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.app-row:hover {
		background: #f9f9f9;
		border-color: rgba(0, 0, 0, 0.1);
		transform: translateX(4px);
	}
	
	.app-icon-round {
		width: 64px;
		height: 64px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
	}
	
	.icon-letter {
		font-size: 28px;
		font-weight: 700;
		color: white;
	}
	
	.app-icon-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.app-info-row {
		flex: 1;
		min-width: 0;
	}
	
	.app-info-row h4 {
		font-size: 16px;
		font-weight: 600;
		margin: 0 0 4px 0;
		color: #1d1d1f;
	}
	
	.app-category {
		font-size: 13px;
		color: #86868b;
		margin: 0 0 6px 0;
	}
	
	.app-meta {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 12px;
		color: #86868b;
	}
	
	.rating-small {
		display: flex;
		align-items: center;
		gap: 4px;
		color: #ffb800;
		font-weight: 500;
	}
	
	.reviews {
		color: #86868b;
	}
	
	.get-btn-small {
		padding: 7px 20px;
		background: #007aff;
		color: white;
		border: none;
		border-radius: 16px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		flex-shrink: 0;
		white-space: nowrap;
	}
	
	.get-btn-small:hover {
		background: #0051d5;
	}
	
	/* Categories Grid */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
	}
	
	.category-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 32px 24px;
		background: #f5f5f7;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		min-height: 120px;
	}
	
	.category-card:hover {
		background: #e8e8ed;
		transform: translateY(-2px);
	}
	
	.category-name {
		font-size: 16px;
		font-weight: 600;
		color: #1d1d1f;
		text-align: center;
	}
	
	.category-count {
		font-size: 13px;
		color: #86868b;
	}
</style>
