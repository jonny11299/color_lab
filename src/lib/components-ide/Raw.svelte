<!-- Used to be "Palette", but we refactored the old Swatches -> Palette, and the old Palette -> Raw 
 -->
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
    <h3>raw</h3>
    <div class="grid">
        {#each selections as s, j}
            <span class="name">
                {s.name}
            </span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
                class="selections"
                style="background: {s.color}; 
                border-color: {selectedIndex === j
                    ? `var(--text)`
                    : `var(--bg)`};
                 border-width: {selectedIndex === j ? `3px` : `0`}"
                onclick={() => selectIndex(j)}
            ></span>
        {:else}{/each}
    </div>
</div>

<style>
    .container {
        border: 1px solid var(--border);
        padding: 0;
        margin: 0rem;
        max-width: 7rem;
        min-width: 7rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr; /* two equal columns */
        align-items: center; /* center items vertically in each row */
        justify-items: start; /* left-justify within each cell */
        gap: 0.2rem 0.4rem;
    }

    .together {
        display: flex;
        flex-direction: row;
        align-items: center; /* centers name and square vertically */
        gap: 0.4rem;
    }

    .name {
    }

    .selections {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        color: var(--text);

        width: 1.8rem;
        height: 1.8rem;
        margin-bottom: 0.2rem;
        border-radius: 0;
    }
    .selections:hover {
        cursor: pointer;
    }
</style>
