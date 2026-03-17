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
			icon: 'https://logo.clearbit.com/apple.com'
		},
		{ 
			name: 'Logic Pro', 
			category: 'Music', 
			price: '$199.99', 
			rating: 4.8,
			description: 'Professional music production',
			gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
			icon: 'https://logo.clearbit.com/apple.com'
		},
		{ 
			name: 'Affinity Photo', 
			category: 'Photo & Video', 
			price: '$69.99', 
			rating: 4.7,
			description: 'Professional photo editing',
			gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
			icon: 'https://logo.clearbit.com/affinity.serif.com'
		},
	];
	
	const apps = [
		{ name: 'Slack', category: 'Business', price: 'Free', rating: 4.4, reviews: '2.5M', icon: 'https://logo.clearbit.com/slack.com' },
		{ name: 'Notion', category: 'Productivity', price: 'Free', rating: 4.7, reviews: '890K', icon: 'https://logo.clearbit.com/notion.so' },
		{ name: 'Figma', category: 'Graphics & Design', price: 'Free', rating: 4.6, reviews: '1.2M', icon: 'https://logo.clearbit.com/figma.com' },
		{ name: 'Discord', category: 'Social Networking', price: 'Free', rating: 4.5, reviews: '5.8M', icon: 'https://logo.clearbit.com/discord.com' },
		{ name: 'Spotify', category: 'Music', price: 'Free', rating: 4.8, reviews: '12M', icon: 'https://logo.clearbit.com/spotify.com' },
		{ name: 'Adobe Photoshop', category: 'Photo & Video', price: '$20.99/mo', rating: 4.5, reviews: '3.2M', icon: 'https://logo.clearbit.com/adobe.com' },
		{ name: 'Microsoft Office', category: 'Productivity', price: 'Free', rating: 4.3, reviews: '8.5M', icon: 'https://logo.clearbit.com/microsoft.com' },
		{ name: 'Zoom', category: 'Business', price: 'Free', rating: 4.4, reviews: '15M', icon: 'https://logo.clearbit.com/zoom.us' },
		{ name: 'Telegram', category: 'Social Networking', price: 'Free', rating: 4.6, reviews: '4.2M', icon: 'https://logo.clearbit.com/telegram.org' },
		{ name: 'VLC', category: 'Entertainment', price: 'Free', rating: 4.7, reviews: '6.8M', icon: 'https://logo.clearbit.com/videolan.org' },
		{ name: 'Xcode', category: 'Developer Tools', price: 'Free', rating: 4.2, reviews: '1.8M', icon: 'https://logo.clearbit.com/apple.com' },
		{ name: 'Visual Studio Code', category: 'Developer Tools', price: 'Free', rating: 4.8, reviews: '9.2M', icon: 'https://logo.clearbit.com/code.visualstudio.com' },
		{ name: 'Docker', category: 'Developer Tools', price: 'Free', rating: 4.5, reviews: '2.1M', icon: 'https://logo.clearbit.com/docker.com' },
		{ name: 'Postman', category: 'Developer Tools', price: 'Free', rating: 4.6, reviews: '1.5M', icon: 'https://logo.clearbit.com/postman.com' },
		{ name: 'GitHub', category: 'Developer Tools', price: 'Free', rating: 4.4, reviews: '3.4M', icon: 'https://logo.clearbit.com/github.com' },
		{ name: 'MongoDB', category: 'Developer Tools', price: 'Free', rating: 4.7, reviews: '450K', icon: 'https://logo.clearbit.com/mongodb.com' },
	];
	
	const games = [
		{ name: 'Minecraft', category: 'Adventure', price: '$26.95', rating: 4.6, reviews: '45M', icon: 'https://logo.clearbit.com/minecraft.net' },
		{ name: 'Among Us', category: 'Strategy', price: 'Free', rating: 4.3, reviews: '28M', icon: 'https://logo.clearbit.com/innersloth.com' },
		{ name: 'Stardew Valley', category: 'Simulation', price: '$14.99', rating: 4.8, reviews: '12M', icon: 'https://logo.clearbit.com/stardewvalley.net' },
		{ name: 'Terraria', category: 'Adventure', price: '$9.99', rating: 4.7, reviews: '18M', icon: 'https://logo.clearbit.com/terraria.org' },
		{ name: 'The Sims', category: 'Simulation', price: 'Free', rating: 4.2, reviews: '35M', icon: 'https://logo.clearbit.com/ea.com' },
		{ name: 'Fortnite', category: 'Action', price: 'Free', rating: 4.5, reviews: '52M', icon: 'https://logo.clearbit.com/epicgames.com' },
		{ name: 'Roblox', category: 'Adventure', price: 'Free', rating: 4.4, reviews: '68M', icon: 'https://logo.clearbit.com/roblox.com' },
		{ name: 'League of Legends', category: 'Strategy', price: 'Free', rating: 4.6, reviews: '42M', icon: 'https://logo.clearbit.com/leagueoflegends.com' },
		{ name: 'Valorant', category: 'Action', price: 'Free', rating: 4.5, reviews: '25M', icon: 'https://logo.clearbit.com/playvalorant.com' },
		{ name: 'Steam', category: 'Platform', price: 'Free', rating: 4.7, reviews: '38M', icon: 'https://logo.clearbit.com/steampowered.com' },
		{ name: 'Epic Games', category: 'Platform', price: 'Free', rating: 4.4, reviews: '32M', icon: 'https://logo.clearbit.com/epicgames.com' },
		{ name: 'Unity', category: 'Game Engine', price: 'Free', rating: 4.6, reviews: '22M', icon: 'https://logo.clearbit.com/unity.com' },
	];
	
	const categories = [
		{ name: 'Productivity', icon: '📊', count: 1250 },
		{ name: 'Graphics & Design', icon: '🎨', count: 890 },
		{ name: 'Developer Tools', icon: '⚙️', count: 650 },
		{ name: 'Business', icon: '💼', count: 980 },
		{ name: 'Entertainment', icon: '🎬', count: 1500 },
		{ name: 'Music', icon: '🎵', count: 450 },
		{ name: 'Photo & Video', icon: '📷', count: 720 },
		{ name: 'Games', icon: '🎮', count: 2100 },
		{ name: 'Social Networking', icon: '👥', count: 340 },
		{ name: 'Education', icon: '📚', count: 890 },
		{ name: 'Health & Fitness', icon: '💪', count: 560 },
		{ name: 'Utilities', icon: '🔧', count: 1100 },
	];
</script>


<section class="app-store">
	<!-- Drag handle -->
	<div class="drag-handle app-window-drag-handle"></div>
	
	<!-- Sidebar -->
	<div class="sidebar">
		<div class="sidebar-section">
			<button class="sidebar-item" class:active={selectedTab === 'discover'} onclick={() => selectedTab = 'discover'}>
				<span class="sidebar-icon">✨</span>
				<span>Discover</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'arcade'} onclick={() => selectedTab = 'arcade'}>
				<span class="sidebar-icon">🎮</span>
				<span>Arcade</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'create'} onclick={() => selectedTab = 'create'}>
				<span class="sidebar-icon">🎨</span>
				<span>Create</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'work'} onclick={() => selectedTab = 'work'}>
				<span class="sidebar-icon">💼</span>
				<span>Work</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'play'} onclick={() => selectedTab = 'play'}>
				<span class="sidebar-icon">🎯</span>
				<span>Play</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'develop'} onclick={() => selectedTab = 'develop'}>
				<span class="sidebar-icon">⚙️</span>
				<span>Develop</span>
			</button>
			<button class="sidebar-item" class:active={selectedTab === 'categories'} onclick={() => selectedTab = 'categories'}>
				<span class="sidebar-icon">📂</span>
				<span>Categories</span>
			</button>
		</div>
		
		<div class="sidebar-divider"></div>
		
		<div class="sidebar-section">
			<button class="sidebar-item" class:active={selectedTab === 'updates'} onclick={() => selectedTab = 'updates'}>
				<span class="sidebar-icon">⬇️</span>
				<span>Updates</span>
			</button>
		</div>
	</div>
	
	<!-- Main Content -->
	<div class="main-content">
		<!-- Search Bar -->
		<div class="search-bar">
			<span class="search-icon">🔍</span>
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
							<span class="category-icon">{category.icon}</span>
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
		left: 0;
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
		font-size: 18px;
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
		font-size: 16px;
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
		padding: 20px;
	}
	
	.featured-icon-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.icon-emoji {
		font-size: 56px;
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
		background: white;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
		padding: 12px;
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
		gap: 8px;
		padding: 24px;
		background: #f5f5f7;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.category-card:hover {
		background: #e8e8ed;
		transform: translateY(-2px);
	}
	
	.category-icon {
		font-size: 48px;
	}
	
	.category-name {
		font-size: 15px;
		font-weight: 600;
		color: #1d1d1f;
	}
	
	.category-count {
		font-size: 12px;
		color: #86868b;
	}
</style>
