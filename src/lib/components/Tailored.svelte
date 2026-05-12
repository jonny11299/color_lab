<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    let selections = $derived(colorStore.selections);
    let selectedIndex = $derived(colorStore.curIndex);

    function selectIndex(i) {
        // console.log(i);
        colorStore.setSelectedIndex(i);
    }
    /*

    Must check for contrast ratios:

    text: b1, b2
    primary: b1, b2 
    secondary: b1, b2
    accent: b1, b2

    


text on background — the primary reading experience, body copy and headings
text on backgroundSubtle — card text, section copy
background on primary — button labels, the CTA banner heading/text
primary on background — links, card "Learn more →", nav logo, stat numbers

Should check:

secondary on background — ghost button label sits next to a secondary-colored border
accent on background — badge text

    */
</script>

<div class="container">
    <h3>Tailored</h3>
    <p>(Better options)</p>
    {#each selections as s, j}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="selections"
            style="background: {s.color}; 
                border-color: {selectedIndex === j
                ? `var(--color-text)`
                : `var(--color-bg)`};
                 border-width: {selectedIndex === j ? `3px` : `0`}"
            onclick={() => selectIndex(j)}
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
        max-width: 16rem;
        min-width: 15rem;

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
    .selections:hover {
        cursor: pointer;
    }
</style>
