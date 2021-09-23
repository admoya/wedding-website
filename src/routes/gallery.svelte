<style>
    @media (min-width: 768px) {
        img {
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
    }
    .imageContainer {
        width: 20rem!important;
        max-height: 20rem;
        overflow: hidden;
        padding-top: 1rem;
        cursor: pointer;
    }
    .galleryContainer {
        width: 80vw;
        position: absolute;
        left: 50%;
        margin-left: -40vw;
    }
</style>
<script>
    import { Modal } from 'sveltestrap/src';
    import { NUM_IMAGES } from '../constants';
    const imageURIs = Array(NUM_IMAGES).fill().map((_, index) => `CompressedCroppedCouplePictures/${index}.jpg`);
    let imageSrcForModal = '';
    let showModal = false;
    const toggle = () => (showModal = !showModal);
    const handleClick = (imgSrc) => {
        imageSrcForModal=imgSrc.replace('CompressedCropped', '');
        toggle();
    }
</script>

<svelte:head>
	<title>Gallery</title>
</svelte:head>

<h1>Gallery</h1>
<p>Here's a bunch of pictures of us, in case you don't know what we look like!</p>
<div class="galleryContainer d-flex flex-wrap justify-content-around">
    {#each imageURIs as imgSrc, i}
    <div class="imageContainer" on:click={() => {handleClick(imgSrc)}} data-toggle="modal" data-target="#showcaseModal">
        <img class="img-fluid rounded" src={imgSrc} alt={`Picture ${i+1} of Adrian and Jenny`}>
    </div>
    {/each}
</div>

<Modal body isOpen={showModal} size="lg" {toggle} aria-describedby="A modal for enlarging a picture in the gallery">
    <img class="rounded w-100" src={imageSrcForModal} alt="Adrian and Jenny" />
</Modal>
