<script>
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";

    let swatches = $derived(imageStore.swatches);
    let bins = $derived(imageStore.hueBins);
    let greyScale = $derived(imageStore.greyScale);
    let greyScaleFlattened = $derived(imageStore.greyScaleFlattened);
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
    {#if swatches?.length > 0}
        <div class="row">
            <h4 class="row-label">Extracted colors:</h4>
            <div class="divider"></div>
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
                {/each}
            </div>
        </div>
    {:else if !greyScale?.length && !greyScaleFlattened?.length && !bins?.length}
        <p class="empty-message">Empty for now. Upload an image to view its color swatches.</p>
    {/if}

    {#if greyScaleFlattened?.length > 0}
        <div class="row">
            <h4 class="row-label">greyscale:</h4>
            <div class="divider"></div>
            <div class="swatchpalette">
                {#each greyScaleFlattened as g}
                    <div
                        class="swatch"
                        style="background-color: {g}"
                        onclick={() => handleClick(g)}
                        onmouseenter={() => setHoveredHex(g)}
                        onmouseleave={() => setHoveredHex(null)}
                        role="button"
                        tabindex="0"
                    ></div>
                {/each}
            </div>
        </div>
    {/if}

    {#if greyScale?.length > 0}
        <div class="row">
            <h4 class="row-label">near-greys:</h4>
            <div class="divider"></div>
            <div class="swatchpalette">
                {#each greyScale as g}
                    <div
                        class="swatch"
                        style="background-color: {g}"
                        onclick={() => handleClick(g)}
                        onmouseenter={() => setHoveredHex(g)}
                        onmouseleave={() => setHoveredHex(null)}
                        role="button"
                        tabindex="0"
                    ></div>
                {/each}
            </div>
        </div>
    {/if}

    {#each bins as b, i}
        <div class="row">
            <!-- name the bin: -->
            <h4 class="row-label">{b.name.replaceAll("_", " ") ?? "unknown"}{b.name?.includes("misc") ? "" : "s"}:</h4>
            <div class="divider"></div>
            <div class="swatchpalette">
                {#each b.set as s}
                    <div
                        class="swatch"
                        style="background-color: {s}"
                        onclick={() => handleClick(s)}
                        onmouseenter={() => setHoveredHex(s)}
                        onmouseleave={() => setHoveredHex(null)}
                        role="button"
                        tabindex="0"
                    ></div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .container {
        border: none;
        padding: 1rem;
        max-width: 100%;
        min-width: 10rem;

        display: grid;
        grid-template-columns: 5rem 1px 1fr;
        align-items: center; /* centers each row's items against its own tallest item */
        column-gap: 0.75rem;
        row-gap: 1rem;
    }

    /* lets the row's children (label, divider, palette) become direct grid items
       of .container, so they land in the shared column tracks */
    .row {
        display: contents;
    }

    .row-label {
        margin: 0;
        text-align: right;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.15;

        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        text-transform: capitalize;
        color: var(--text-secondary, var(--text));
        opacity: 0.85;
    }

    .divider {
        width: 1px;
        align-self: stretch; /* full row height, unlike the centered label/palette */
        background: var(--border);
    }

    .swatchpalette {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0px;
        min-width: 0;
        padding: 0px;
        margin: 0px;

        justify-content: center;
    }
    .swatch {
        min-width: 1.7rem;
        aspect-ratio: 1;
        padding: 0px;
        margin: 0px;
        cursor: pointer;
    }

    .empty-message {
        grid-column: 1 / -1;
        text-align: center;
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
