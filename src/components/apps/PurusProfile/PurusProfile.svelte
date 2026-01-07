<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import GithubIcon from '~icons/mdi/github';
	import LinkedInIcon from '~icons/mdi/linkedin';
	import InstagramIcon from '~icons/mdi/instagram';
	import TwitterIcon from '~icons/mdi/twitter';
	import DiscordIcon from '~icons/mdi/discord';
	import TelegramIcon from '~icons/mdi/telegram';

	function external(node: HTMLAnchorElement) {
		node.rel = 'noopener noreferrer';
		node.target = '_blank';
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>About the Developer</span>
	</header>

	<aside class:light={preferences.theme.scheme === 'light'}>
		<nav>
			<a href="https://github.com/Prasidhpshetty7" use:external> <GithubIcon /> GitHub </a>
			<a href="https://www.linkedin.com/in/prasidh-shetty7/" use:external> <LinkedInIcon /> LinkedIn </a>

			<hr />

			<a href="https://www.instagram.com/mr__shxtty/" use:external>
				<InstagramIcon />
				Instagram
			</a>
			<a href="https://x.com/ShettyPrasidh7" use:external> <TwitterIcon /> X / Twitter </a>
			<a href="https://discord.com/users/prasidhshetty" use:external> <DiscordIcon /> Discord </a>
			<a href="https://t.me/FINALSKULL" use:external> <TelegramIcon /> Telegram </a>
		</nav>
	</aside>

	<section class="content">
		<img height="200" width="200" src="/purus-profile/pexels-ahmedadly-1270184.jpg" alt="Prasidh P Shetty Profile pic" />

		<br />

		<h1>Hi, I'm Prasidh</h1>

		<h2>
			Web Designer & Full-Stack Developer
			<img src="/emojis/star-struck.png" alt="Star Struck face emoji" class="emoji" />
		</h2>

		<br /><br />

		<p>
			I'm passionate about creating modern, visually refined, and user-centric digital experiences.
			I build responsive, high-performance websites and web applications that look great and deliver
			seamless functionality.
			<img src="/emojis/wink.png" alt="Wink emoji" class="emoji" />
		</p>

		<br /><br />

		<p>
			As a full-stack developer, I work across the entire development lifecycle — from designing
			intuitive frontend interfaces to building robust backend systems, APIs, and database architectures.
			I believe great digital products are built at the intersection of design, usability, and engineering.
		</p>
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);

		display: grid;
		grid-template-columns: 12rem 1fr;
		grid-template-rows: 3rem 1fr;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) 12rem,
			hsla(var(--color), 1) 12rem 100%
		);

		transition: --color 200ms ease-in;

		color: var(--system-color-dark);
	}

	.titlebar {
		grid-area: 1 / 1 / span 1 / span 2;

		display: flex;
		justify-content: center;

		z-index: 1;

		padding: 0.9rem 1rem;

		width: 100%;

		border-top-left-radius: inherit;
		border-top-right-radius: inherit;

		user-select: none;

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	aside {
		grid-area: 1 / 1 / span 2 / span 1;

		transform: translateZ(0);

		height: calc(100% - 2.7px);
		width: calc(12rem - 2.27px);

		margin: 1.8px 0 0px 1.8px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;

		&::before {
			content: '';

			width: inherit;
			height: inherit;

			border-radius: inherit;

			position: fixed;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}

		&.light {
			height: calc(100% - 3px);
			width: calc(12rem - 2.5px);

			margin: 1.7px 0 0px 1.7px;

			border-top-left-radius: 0.5rem;
			border-bottom-left-radius: 0.5rem;
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			margin: 4rem 0.6rem;

			hr {
				display: block;

				width: 100%;
				height: 1px;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				border: none;
			}

			a {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}
			}
		}
	}

	.content {
		grid-area: 2 / 2 / span 1 / span 1;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;

		overflow-y: auto;

		img {
			border-radius: 50%;
			object-fit: cover;
			box-shadow: 0 4px 20px hsla(0, 0%, 0%, 0.3);
		}
	}

	.emoji {
		height: 1em;
		width: 1em;

		vertical-align: middle;
	}

	h1 {
		font-size: 2.618rem;
		line-height: 1.618;
	}

	h2 {
		font-size: 1.418rem;
		line-height: 1.2;
		text-align: center;
	}

	p {
		line-height: 1.618rem;
		text-align: center;
		max-width: 500px;
	}
</style>
