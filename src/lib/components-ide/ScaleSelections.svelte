<script>
    import { paramStore } from "$lib/stores/paramStore.svelte.js";

    /* Uses paramStore fields. */

    paramStore.params;

    const rangeFields = [
        { key: "muteStrength", label: "Mute strength", min: 0, max: 1, step: 0.02 },
        { key: "typeScale", label: "Type scale", min: 1, max: 1.6, step: 0.001 },
        { key: "borderWidth", label: "Border width", min: 0, max: 8, step: 1, unit: "px" },
        { key: "borderRadius", label: "Border radius", min: 0, max: 50, step: 1, unit: "px" },
    ];

    function fillPercent(f) {
        return ((f.cur - f.min) / (f.max - f.min)) * 100;
    }
</script>

<div class="container">
    <!--<h3>Scale:</h3>-->
    <div class="field-group">
        {#each paramStore.params as f}
            <label class="field field-range">
                <span class="field-label">
                    {f.name}
                    <span class="field-value">
                        {f.cur}{f.unit ?? ""}
                    </span>
                </span>
                <input type="range" min={f.min} max={f.max} step={f.step} bind:value={f.cur} style="--fill: {fillPercent(f)}%" />
            </label>
        {/each}
    </div>
</div>

<style>
    .container {
        min-width: 5rem;
        margin: 1rem;
    }
    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .field-label {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        font-weight: 500;
    }

    .field-value {
        font-variant-numeric: tabular-nums;
        color: var(--text-muted);
        font-weight: 500;
    }

    /* --- Themed range slider --- */
    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 1.25rem;
        background: transparent;
        cursor: pointer;
        margin: 0;
    }

    /* Track with left-fill gradient */
    input[type="range"]::-webkit-slider-runnable-track {
        height: 0.35rem;
        background: linear-gradient(to right, var(--bg) var(--fill), var(--surface) var(--fill));
        border: 1px solid var(--divider);
        border-radius: calc(var(--bradius) / 2);
    }

    input[type="range"]::-moz-range-track {
        height: 0.35rem;
        background: linear-gradient(to right, var(--bg) var(--fill), var(--surface) var(--fill));
        border: 1px solid var(--divider);
        border-radius: calc(var(--bradius) / 2);
    }

    /* Thumb */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.1rem;
        height: 1.1rem;
        margin-top: -0.4rem; /* centers thumb on 0.35rem track */
        background: var(--primary);
        border: 1px solid var(--border);
        border-radius: 50%;
        transition:
            background var(--transition-time),
            transform var(--transition-time);
        position: relative;
        z-index: 1;
    }

    input[type="range"]::-moz-range-thumb {
        width: 1.1rem;
        height: 1.1rem;
        background: var(--primary);
        border: 1px solid var(--border);
        border-radius: 50%;
        transition:
            background var(--transition-time),
            transform var(--transition-time);
    }

    input[type="range"]:hover::-webkit-slider-thumb,
    input[type="range"]:focus-visible::-webkit-slider-thumb {
        background: var(--primary-hover);
        transform: scale(1.08);
    }

    input[type="range"]:hover::-moz-range-thumb,
    input[type="range"]:focus-visible::-moz-range-thumb {
        background: var(--primary-hover);
        transform: scale(1.08);
    }

    input[type="range"]:focus-visible {
        outline: none;
    }

    input[type="range"]:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-hover) 40%, transparent);
    }

    input[type="range"]:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-hover) 40%, transparent);
    }
</style>
