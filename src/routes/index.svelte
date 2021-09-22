<style>
img {
    text-align: center;
    margin: auto;
    object-fit: contain;
}
.img-container {
    max-height: 560px;
}
</style>

<script>
    import { NUM_IMAGES } from '../constants';
    import { shuffle } from 'lodash-es';
    // Weird stuff below to get svelte-carousel to work on server
    import { onMount } from 'svelte';
    let Carousel; // for saving Carousel component class
    let carousel; // for calling methods of carousel instance
    onMount(async () => {
    const module = await import('svelte-carousel');
    Carousel = module.default;
    });

    const randomImage=Math.floor(Math.random() * NUM_IMAGES-1);
    const imageURIs = shuffle(Array(NUM_IMAGES).fill().map((_, index) => `CroppedCouplePictures/${index}.jpg`));
</script>

<svelte:head>
    <title>Adrian & Jenny's Wedding</title>
</svelte:head>

<h1>Finally!</h1>
<p>After 8 years of dating, two years of engagement, and one COVID delay, we are getting married in November 2021! We hope you will be available to join us!</p>

<svelte:component
  this={Carousel}
  bind:this={carousel}
  autoplay
  autoplayDuration={8000}
  arrows={false}
  dots={false}
  swiping={false}
  let:loaded
>
    {#each imageURIs as src, imageIndex (src)}
        <div class="img-container">
            {#if loaded.includes(imageIndex)}
                <img src={src} class="d-block w-100 h-100" alt={`${src} ${imageIndex + 1}`} />
            {/if}
        </div>
    {/each}
</svelte:component>