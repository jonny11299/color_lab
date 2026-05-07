<!-- This part of the app is used to arrange the components and how they function together. -->

<script>
    import { themeStore } from "$lib/stores/theme.svelte.js";
    import ImageLoader from "$lib/components/ImageLoader.svelte";
    import DummyElement from "$lib/components/DummyElement.svelte";
</script>

<div class="bodycontainer">
    <ImageLoader />
    <DummyElement />
</div>

<style>
    .bodycontainer {
        margin: 2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        place-items: center;
    }
</style>
