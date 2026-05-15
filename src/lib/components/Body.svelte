<!-- This part of the app is used to arrange the components and how they function together. -->

<script>
    import ImageAndSwatch from "./ImageAndSwatch.svelte";
    import PreviewSite from "./PreviewSite.svelte";
    import DummyElement from "$lib/components/DummyElement.svelte";
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { paramStore } from "$lib/stores/paramStore.svelte.js";
    import Palette from "./Palette.svelte";
    import { fade } from "svelte/transition";
    import Tailored from "./Tailored.svelte";

    let renderTailored = $state(false);
    let renderSelections = $derived(imageStore.swatches?.length > 0);

    // Renders tailored once the user has selected all colors.
    // determined via "no more placeholder colors"
    $effect(() => {
        if (!colorStore.tailored.some((c) => c.color.includes("var(--"))) {
            renderTailored = true;
        } else {
            renderTailored = false;
        }
    });

    let tailoredColors = $derived(colorStore.tailored);

</script>

<div class="bodycontainer">
    <ImageAndSwatch />
    <!-- <DummyElement /> -->
    {#if renderSelections}
        <div class="leftrightgrid">
            <div transition:fade={{ duration: 2000 }}>
                <Palette />
            </div>

            {#if renderTailored}
                <div transition:fade={{ duration: 2000 }}>
                    <Tailored />
                </div>
            {/if}
        </div>
    {/if}
    
    <PreviewSite
        background={tailoredColors[0].color}
        backgroundSubtle={tailoredColors[1].color}
        text={tailoredColors[2].color}
        primary={tailoredColors[3].color}
        secondary={tailoredColors[4].color}
        accent={tailoredColors[5].color}
        muteStrength={paramStore.params[0].cur ?? 0.5}
        typeScale={paramStore.params[1].cur ?? 1.2}
        borderWidth={paramStore.params[2].cur ?? 3}
        borderRadius={paramStore.params[3].cur ?? 10}
    />
</div>

<style>
    /* Drop them in left-to-right, enable scroll right */
    .bodycontainer {
        padding: 2rem; /* padding instead of margin so overflow-x works */
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start; /* was: center */
        align-items: flex-start;
        gap: 2rem;
        overflow-x: auto;
        box-sizing: border-box;
        overscroll-behavior-x: contain; /* Disable scrolling left-right causing page navigation */
    }

    .leftrightgrid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: start;
        gap: 1rem;
    }
</style>
