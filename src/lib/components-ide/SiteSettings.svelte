<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import Raw from "./Raw.svelte";
    import Tailored from "./Tailored.svelte";
    import ColorSelections from "./ColorSelections.svelte";
    import AboutSelections from "./AboutSelections.svelte";

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
    <ColorSelections />

    <AboutSelections />
</div>

<style>
    .columns {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr; /* four equal columns */
        align-items: start; /* center items on the top of their column */
        justify-items: start; /* left-justify within each cell */
        gap: 0.5rem 0.4rem;
    }
</style>
