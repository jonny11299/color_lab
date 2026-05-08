<script>
    import ImageLoader from "$lib/components/ImageLoader.svelte";
    import SwatchRender from "./SwatchRender.svelte";
</script>

<div class="container">
    <ImageLoader />
    <SwatchRender />
</div>

<style>
    .container {
        max-width: 50rem;
        border: none; /* 1px solid blue;*/
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 8rem;
    }
</style>
