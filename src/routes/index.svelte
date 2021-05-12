<style>
img {
	text-align: center;
	width: 90%;
	display: block;
	margin: auto;
}
</style>

<script>
	import { NUM_IMAGES } from '../constants';
	const randomImage=Math.floor(Math.random() * NUM_IMAGES-1);
	const imageUrl = `CouplePictures/${randomImage}.jpg`;
</script>

<svelte:head>
	<title>Adrian & Jenny's Wedding</title>
</svelte:head>

<h1>Finally!</h1>
<p>After 8 years of dating, two years of engagement, and on COVID delay, we are getting married in Novemeber, 2021! We hope you will be available to join us!</p>

{#if typeof window !== 'undefined'}
<img alt="Adrian & Jenny" src={imageUrl}>
{/if}