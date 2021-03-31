<script>
import { select_multiple_value } from "svelte/internal";
	export let segment;
</script>

<style>
	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	.navContainer {
		display: flex;
		flex-direction: row;
		align-items: left;
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}
	.headerMessage {
		position: absolute;
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		text-align: center;
		padding-top: 1rem;
		font-family: "Brush Script MT", cursive;
		font-size: 1.5rem;
		z-index: -1;
	}
</style>

<div class="navContainer">
	<nav>
		<ul>
			<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a></li>
			<li><a aria-current="{segment === 'event' ? 'page' : undefined}" href="event">event</a></li>

			<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
				the blog data when we hover over the link or tap it on a touchscreen -->
			<li><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">blog</a></li>
		</ul>
	</nav>
	<h3 class="headerMessage">Adrian + Jenny · 11.13.21</h3>
</div>
