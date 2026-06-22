<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";

    // stands for 'export', which is a reserved keyword in js.
    function exp() {
        phaseStore.setExportState(true);
    }
</script>

<div class="container">
    <!-- Populate the grid with color adjustments -->
    <button onclick={() => colorStore.undo()}>Undo</button>
    <button onclick={() => colorStore.redo()}>Redo</button>
    <button onclick={() => exp()}>Export</button>
</div>

<style>
    .container {
        border: none;
        border-radius: 0;
        margin: 0;
        min-width: 5rem;
        width: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: scroll;
    }
    .title {
        padding: 0rem;
        margin: 0rem;
        margin-bottom: 0.3rem;
    }

    button {
        border: 0px solid var(--border);
        border-radius: 4px;
        background: transparent;
        color: var(--text);
        cursor: pointer;
    }

    button:hover {
        border-color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
    }
    button:active {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
    }
</style>
