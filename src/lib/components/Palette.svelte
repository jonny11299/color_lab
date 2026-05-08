<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    let selections = $derived(colorStore.selections);
    let i = $derived(colorStore.curIndex);

    /*

    background
    text
    primary
    secondary
    accent (focal point) 

    
    pick:
    - brighter
    - muted

    */
</script>

<div class="container">
    <h3>Palette</h3>
    {#each selections as s, j}
        <div
            class="selections"
            style="background: {s.color}; 
                border-color: {i === j
                ? `var(--color-text)`
                : `var(--color-bg)`};
                 border-width: {i === j ? `3px` : `0`}"
        >
            {s.name}
        </div>
    {:else}{/each}
</div>

<style>
    .container {
        border: 2px solid var(--color-border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 21rem;
        min-width: 20rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .selections {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border);
        color: var(--color-text);

        width: 5rem;
        height: 2rem;
        border-radius: 1rem;

        margin-top: 1rem;
    }
</style>
