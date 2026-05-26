<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
</script>

<div class="container">
    <h3 class="title">Edits</h3>
    <!-- Populate the grid with color adjustments -->
    <button onclick={() => colorStore.undo()}>Undo</button>
    <button onclick={() => colorStore.redo()}>Redo</button>
</div>

<style>
    .container {
        border: 1px solid var(--border);
        border-radius: 0;
        padding: 1rem;
        margin: 0;
        min-width: 5rem;
        max-width: 10rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }
    .title {
        padding: 0rem;
        margin: 0rem;
        margin-bottom: 0.3rem;
    }

    button {
        padding: 0.25rem 0.75rem;
        border: 2px solid var(--border);
        border-radius: 4px;
        background: transparent;
        color: var(--text);
        cursor: pointer;
        margin: 0.25rem;
    }

    button:hover {
        border-color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
    }
    button:active {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
    }

    .subtitle {
        padding: 0rem;
        margin: 0rem;
        margin-bottom: 1rem;
    }

    .square {
        width: 0.2rem;
        aspect-ratio: 1;
        border: none;
    }
    .square:hover {
    }
</style>
