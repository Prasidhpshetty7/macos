<script lang="ts">
	// Personal Drift browser - opens directly to your profile
</script>

<section class="drift-app">
	<div class="iframe-container">
		<iframe 
			src="https://drift.rip/ps" 
			title="Drift - PS"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
</section>

<style>
	.drift-app {
		height: 100%;
		width: 100%;
		background: #000;
		border-radius: inherit;
		overflow: hidden;
	}
	
	.iframe-container {
		width: 100%;
		height: 100%;
		padding-top: 28px;
	}
	
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
