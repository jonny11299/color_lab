<script>
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";

    let swatches = $derived(imageStore.swatches);
    let copied = $state(null);
    let hoveredHex = $state(null);

    let selectedSwatch = $derived(colorStore.curIndex);

    let launchedPreviewYet = $state(false);
    let selectedAllColors = $state(false);

    $effect(() => {
        let i = colorStore.curIndex;
        if (!selectedAllColors) {
            if (!colorStore.tailored.some((t) => t.color.includes("var"))) {
                selectedAllColors = true;
                console.log("Setting selectAllColors to True");
                phaseStore.advance(3);
            }
        }
    });

    function handleClick(hex) {
        copyHex(hex);
        colorStore.setColor(selectedSwatch, hex);
        if (phaseStore.phase < 3) colorStore.iterate(); // we should stop auto-iterating the selections upon clicking palette, after all colors are selected

        console.log("selection now " + selectedSwatch);

        if (!launchedPreviewYet) {
            launchedPreviewYet = true;
            phaseStore.advance(2);
        }
    }
    function copyHex(hex) {
        navigator.clipboard.writeText(hex);
        copied = hex;
        setTimeout(() => (copied = null), 1500);
    }

    function setHoveredHex(hex) {
        hoveredHex = hex;
        colorStore.setHoveredPreview(hex);
    }
</script>

<div class="container">
    <!--
    <div class="swatch-preview-wrapper">
        <div
            class="swatch-preview"
            style="background-color: {hoveredHex ?? 'var(--bg'}"
        ></div>
        <div
            class="copiedHex"
            style="visibility: {hoveredHex ? 'visible' : 'hidden'}"
        >
            {copied ? "Copied!" : (hoveredHex ?? "l")}
        </div>
    </div>
    <p>
        Maybe add a little plus or minus button here for changing the size of
        each item
    </p>
    -->
    <div class="swatchpalette">
        {#each swatches as s}
            <div
                class="swatch"
                style="background-color: {s.hex}"
                onclick={() => handleClick(s.hex)}
                onmouseenter={() => setHoveredHex(s.hex)}
                onmouseleave={() => setHoveredHex(null)}
                role="button"
                tabindex="0"
            ></div>
        {:else}
            <p>Empty for now. Upload an image to view its color swatches.</p>
        {/each}
    </div>
</div>

<style>
    .container {
        border: none;
        padding: 1rem;
        max-width: 100%;
        min-width: 10rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .swatchpalette {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0px;
        width: 100%;
        padding: 0px;
        margin: 0px;

        justify-content: center;
    }
    .swatch {
        /* border: 1px solid var(--border);*/
        min-width: 2rem;
        aspect-ratio: 1;
        padding: 0px;
        margin: 0px;
        cursor: pointer;
    }

    .tooltip {
        display: none;
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 0.65rem;
        padding: 2px 5px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
    }

    .swatch:hover .tooltip {
        display: block;
    }

    .swatch-preview-wrapper {
        width: 100%;
        display: block;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0rem;
        margin-bottom: 1rem;

        font-size: 0.85rem;
        font-family: monospace;
    }

    .swatch-preview {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 3px;
        border: 0px solid var(--border);
        margin-bottom: 0.5rem;
    }
    .copiedHex {
        text-align: center;
        color: var(--text);
    }
</style>
