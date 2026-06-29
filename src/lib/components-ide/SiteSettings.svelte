<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import ColorSelections from "./ColorSelections.svelte";
    import About from "./About.svelte";
    import Adjustments from "./Adjustments.svelte";
    import NotesToSelf from "./NotesToSelf.svelte";
    import ScaleSelections from "./ScaleSelections.svelte";

    let renderRaw = $state(false);

    // Renders tailored once the user has selected all colors.
    // determined via "no more placeholder colors"
    $effect(() => {
        if (!colorStore.tailored.some((c) => c.color.includes("var(--"))) {
            renderRaw = true;
        } else {
            renderRaw = false;
        }
    });

    let tailoredColors = $derived(colorStore.tailored);
</script>

<div class="columns">
    <!-- muted because of reactivity delays in Picker
    <ColorSelections />
    <div class="adjustmentsColumn">
        <Adjustments selectedColorMod={2} />
        <Adjustments selectedColorMod={0} />
        <!-- <Adjustments selectedColorMod={1} /> 
        <Adjustments selectedColorMod={3} />
    </div>

    <ScaleSelections />

    <About />
    <NotesToSelf />
    -->
</div>

<style>
    .columns {
        display: grid;
        grid-template-columns: 1fr 2fr 2fr; /* two equal columns */
        align-items: start; /* center items on the top of their column */
        justify-items: center; /* left-justify within each cell */
        gap: 0;

        overflow: scroll;
    }

    .adjustmentsColumn {
        display: flex;
        flex-direction: column;
        gap: 0;
        margin: 0;
        padding: 0;
    }
</style>
