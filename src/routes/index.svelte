<style>
img {
	text-align: center;
	width: 90%;
	display: block;
	margin: auto;
}
</style>

<script>
	const NUM_IMAGES = 73;
	const randomImage=Math.floor(Math.random() * NUM_IMAGES);
</script>

<svelte:head>
	<title>Adrian & Jenny's Wedding</title>
</svelte:head>

<h1>Finally!</h1>
<p>After 8 years of dating, two years of engagement, and on COVID delay, we are getting married in Novemeber, 2021! We hope you will be available to join us!</p>

<img alt="Adrian & Jenny" src={`CouplePictures/${randomImage}.jpg`}>