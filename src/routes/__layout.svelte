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
	:global(:root){
		background-image: url("/pinkwave.jpg");
		background-repeat: no-repeat;
    	background-size: cover;
	}
	.mainContentScrollWrapper {
		flex-grow: 1;
		overflow-y: auto;
		width: 100vw;
		max-width: 100vw;
		scroll-behavior: smooth;
	}
	.pageWrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>

<div class="pageWrapper">
	<Nav path={$page.path}/>
	<div class='mainContentScrollWrapper'>
		<main>
			<slot></slot>
		</main>
	</div>
</div>

