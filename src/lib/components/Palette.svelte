<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    let selections = $derived(colorStore.selections);
    let selectedIndex = $derived(colorStore.curIndex);

    function selectIndex(i) {
        // console.log(i);
        colorStore.setSelectedIndex(i);
    }
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
    <p>(Quick Selections)</p>
    {#each selections as s, j}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="selections"
            style="background: {s.color}; 
                border-color: {selectedIndex === j
                ? `var(--text)`
                : `var(--bg)`};
                 border-width: {selectedIndex === j ? `3px` : `0`}"
            onclick={() => selectIndex(j)}
        >
            {s.name}
        </div>
    {:else}{/each}
</div>

<style>
    .container {
        border: 2px solid var(--border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 11rem;
        min-width: 9rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .selections {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        color: var(--text);

        width: 5rem;
        height: 2rem;
        border-radius: 1rem;

        margin-top: 1rem;
    }
    .selections:hover {
        cursor: pointer;
    }
</style>
