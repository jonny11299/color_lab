<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import chroma from "chroma-js";

    let tailored = $derived(colorStore.tailored);
    let tailoredIndex = $derived(colorStore.curTailoredIndex);

    function selectIndex(i) {
        // console.log(i);
        colorStore.setTailoredIndex(i);
    }

    function getRenderColor(t, j) {
        return colorStore.hoveredPreview && colorStore.curTailoredIndex === j ? colorStore.hoveredPreview : t.color;
    }
</script>

<div class="container">
    <div class="item"><h3>Working Palette:</h3></div>
    <div class="item">
        <div class="swatches">
            {#each tailored as t, j}
                <div class="colorAndName">
                    <div
                        class="swatch"
                        style="background: {getRenderColor(t, j)}; 
                border-color: {tailoredIndex === j ? `var(--text)` : `var(--bg)`};
                 border-width: {tailoredIndex === j ? `0px` : `0`}"
                        onclick={() => selectIndex(j)}
                    ></div>

                    <div class="swatchName" class:nameSelected={tailoredIndex === j} onclick={() => selectIndex(j)}>
                        {t.name}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="item">part 2</div>
</div>

<style>
    .container {
        border: 0px solid var(--border);

        background-color: var(--surface);
        border-radius: var(--bradius);

        width: 100%;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        align-items: center;
        justify-items: center;

        padding-top: 0.5rem;
        padding-bottom: 0.5rem;

        overflow: hidden;
    }

    .item {
        border: none;
    }

    .colorAndName {
        display: flex;
        flex-direction: column;

        align-items: center;
    }
    .swatchName {
        display: flex;
        justify-self: center;
        margin-top: 0.5rem;
    }
    .swatchName:hover {
        cursor: pointer;
    }
    .nameSelected {
        text-decoration: underline;
    }

    .swatches {
        display: flex;
        flex-direction: row;

        align-items: center;
        justify-items: center;
    }

    .swatch {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0px dotted var(--border);
        color: var(--text);

        width: 4rem;
        height: 2rem;
        margin: 0.2rem;
        border-radius: 4px;
    }
    .swatch:hover {
        cursor: pointer;
    }
</style>
