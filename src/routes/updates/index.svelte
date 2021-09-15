<script context="module">
	export function load({ fetch }) {
		return fetch(`updates.json`).then(r => r.json()).then(posts => {
			return {props: { posts }};
		}).catch((error) => ({ error }));
	}
</script>

<script>
	export let posts;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Event Updates</h1>
<p>Be sure to check back here occasionally for new info about the event!</p>
<ul>
	{#each posts as post}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li><a rel="prefetch" href="updates/{post.slug}">{post.title}</a></li>
	{/each}
</ul>
