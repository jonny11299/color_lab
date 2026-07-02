<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { generateHarmonies } from "$lib/utils/harmonies.js";

    let { hexVal } = $props();

    let bg1 = $derived.by(() => colorStore.resolveToHex(colorStore.tailored[0].color ?? "#ffffff"));
    let bg2 = $derived.by(() => colorStore.resolveToHex(colorStore.tailored[1].color ?? "#ffffff"));

    let selectedSwatch = $derived(colorStore.curIndex);

    let rows = $derived(generateHarmonies(hexVal, { bg1, bg2 }));
    let copied = $state(null);

    let launchedPreviewYet = $state(false);

    let justCopied = $state(false);

    let hexInputEl;

    function handleEnterClick() {
        hexEntered(hexInputEl.value);
    }

    function handleCopyClick() {
        copyHex(hexVal);
        justCopied = true;
        setTimeout(() => (justCopied = false), 1000);
    }

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
        colorStore.setHoveredPreview(hex);
    }

    function hexEntered(raw) {
        const hex = raw.trim();
        const isValidHex = /^#?[0-9a-fA-F]{6}$/.test(hex);

        if (!isValidHex) return;

        // handleClick(hex.startsWith("#") ? hex : `#${hex}`);
        colorStore.setColor(selectedSwatch, hex.startsWith("#") ? hex : `#${hex}`);

        if (!launchedPreviewYet) {
            launchedPreviewYet = true;
            phaseStore.advance(2);
        }
    }
</script>

<div class="container">
    <!-- Hex value row -->
    <div class="row">
        <h4 class="row-label">Hex:</h4>
        <div class="divider"></div>
        <div class="swatchpalette">
            <div class="hexRow">
                <input
                    bind:this={hexInputEl}
                    class="hexInput"
                    type="text"
                    spellcheck="false"
                    autocomplete="off"
                    value={hexVal}
                    onkeydown={(e) => e.key === "Enter" && hexEntered(e.target.value)}
                />
                <button class="copyBtn" onclick={handleEnterClick} aria-label="Set hex value" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
                <button class="copyBtn" onclick={handleCopyClick} aria-label="Copy hex value" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="9" y="9" width="12" height="12" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </button>
                {#if justCopied}
                    <span class="copiedLabel">Copied</span>
                {/if}
            </div>
        </div>
    </div>

    <!-- Each color row -->
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

    .hexRow {
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }

    .copiedLabel {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.7rem; /* matches .hexInput height for vertical alignment */
    }

    .hexInput {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--text);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 0 0.5rem;
        height: 1.7rem;
        width: 7ch;
    }

    .hexInput:focus {
        outline: none;
        border-color: var(--text);
    }

    .copyBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.9rem;
        width: 1.9rem;
        padding: 0;
        background: var(--surface);
        border: 0px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        transition:
            color var(--transition-time),
            border-color var(--transition-time);
    }

    .copyBtn:hover {
        color: var(--text);
        border-color: var(--text);
    }

    .copyBtn:active {
        transform: scale(0.9);
    }
</style>
