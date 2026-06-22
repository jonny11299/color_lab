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
</script>

<div class="container">
    <h3>Scale:</h3>
    <div class="field-group">
        {#each paramStore.params as f}
            <label class="field field-range">
                <span class="field-label">
                    {f.name}
                    <span class="field-value">
                        {f.cur}{f.unit ?? ""}
                    </span>
                </span>
                <input type="range" min={f.min} max={f.max} step={f.step} bind:value={f.cur} />
            </label>
        {/each}
    </div>
</div>

<style>
    .container {
        min-width: 5rem;
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
</style>
