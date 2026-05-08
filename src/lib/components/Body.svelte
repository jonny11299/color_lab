<!-- This part of the app is used to arrange the components and how they function together. -->

<script>
    import ImageAndSwatch from "./ImageAndSwatch.svelte";
    import DummyElement from "$lib/components/DummyElement.svelte";
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import Palette from "./Palette.svelte";
    import { fade } from "svelte/transition";

    let renderSelections = $derived(imageStore.swatches?.length > 0);
</script>

<div class="bodycontainer">
    <ImageAndSwatch />
    <!-- <DummyElement /> -->
    {#if renderSelections}
        <div transition:fade={{ duration: 2000 }}>
            <Palette />
        </div>
    {/if}
    <pre>
        Pending:
        - format Palette colors correctly (should show the colored text on background, accents, etc)
        - figure out if "swatches" is a real word
        - Make the auto-convert in the "Palette"
            - as well as the darker/lighter versions of the color
            - that'll be a separate .js file



        - Parameterize the "Image" uploader
        - add a cube to the "Image" uploader
        - make it sexy
    </pre>
</div>

<style>
    .bodycontainer {
        margin: 2rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
    }
</style>
