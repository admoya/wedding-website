<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
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
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>