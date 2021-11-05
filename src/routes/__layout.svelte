<script>
	import Nav from '../components/Nav.svelte';
	import { page } from '$app/stores';
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
	:global(html){
		background: url("/pinkwave.jpg") no-repeat center center fixed;
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	}
	/* .mainContentScrollWrapper {
		flex-grow: 1;
		overflow-y: auto;
		width: 100vw;
		max-width: 100vw;
		scroll-behavior: smooth;
	} */
	.pageWrapper {
		display: flex;
		flex-direction: column;
		/* height: 100vh; TODO: This breaks nav expansion but is necessary for sticking nav to top. */
	}
</style>

<div class="pageWrapper">
	<Nav path={$page.path} />
	<div class='mainContentScrollWrapper'>
		<main>
			<slot></slot>
		</main>
	</div>
</div>

