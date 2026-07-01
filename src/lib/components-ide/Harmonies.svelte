<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { generateHarmonies } from "$lib/utils/harmonies.js";

    let { hexVal } = $props();

    let bg1 = $derived.by(() => colorStore.resolveToHex(colorStore.tailored[0].color ?? "#ffffff"));
    let bg2 = $derived.by(() => colorStore.resolveToHex(colorStore.tailored[1].color ?? "#ffffff"));

    let rows = $derived(generateHarmonies(hexVal, { bg1, bg2 }));
    let copied = $state(null);

    function handleClick(hex) {
        navigator.clipboard.writeText(hex);
        copied = hex;
        // setTimeout(() => (copied = null), 1500);
    }
    function setHoveredHex(hex) {
        colorStore.setHoveredPreview(hex);
    }
</script>

<div class="container">
    {#each rows as b}
        <div class="row">
            <h4 class="row-label">{b.name}:</h4>
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
        grid-template-columns: 7rem 1px 1fr; /* wider label track — harmony names are longer */
        align-items: center;
        column-gap: 0.75rem;
        row-gap: 1rem;
    }

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
        /* no text-transform: names are display-ready and mixed-case (& , °, +150) */
        color: var(--text-secondary, var(--text));
        opacity: 0.85;
    }

    .divider {
        width: 1px;
        align-self: stretch;
        background: var(--border);
    }

    .swatchpalette {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap; /* allow wrapping instead of forcing a shrink-to-fit single line */
        gap: 0px;
        min-width: 0;
        padding: 0;
        margin: 0;
        justify-content: flex-start;
    }

    .swatch {
        flex: 0 0 auto; /* fixed size — never grow or shrink */
        width: 1.7rem;
        aspect-ratio: 1;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transition: outline 0.1s;
    }

    .swatch:hover {
        z-index: 1;
    }
    .swatch.copied {
        outline: 2px solid var(--text);
        outline-offset: -2px;
    }
</style>
