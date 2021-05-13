<style>
img {
	text-align: center;
	width: 90%;
	display: block;
	margin: auto;
}

.carousel-inner {
	max-height: 560px;
}
</style>

<script>
	import { NUM_IMAGES } from '../constants';
	const randomImage=Math.floor(Math.random() * NUM_IMAGES-1);
	const imageUrl = `CroppedCouplePictures/${randomImage}.jpg`;
	const imageURIs = Array(NUM_IMAGES).fill().map((_, index) => `CroppedCouplePictures/${index}.jpg`);
</script>

<svelte:head>
	<title>Adrian & Jenny's Wedding</title>
</svelte:head>

<h1>Finally!</h1>
<p>After 8 years of dating, two years of engagement, and on COVID delay, we are getting married in Novemeber, 2021! We hope you will be available to join us!</p>

{#if typeof window !== undefined}
<div id="carouselCouplePictures" class="carousel slide" data-ride="carousel" data-interval="7000">
	<div class="carousel-inner">
		{#each imageURIs as imgSrc, i}
			<div class={`carousel-item ${i == randomImage ? 'active' : ''}`}>
				<img class="d-block w-100" src={imgSrc} alt={`Slide ${i+1} of the couple pictures carousel`}>
			</div>
		{/each}
	</div>
</div>
{/if}