<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import chroma from "chroma-js";

    let tailored = $derived(colorStore.tailored);
    let tailoredIndex = $derived(colorStore.curTailoredIndex);

    let contrastMessage = $derived.by(() => {
        const ts = tailored;

        let failed = false;

        ts.forEach((item, i) => {
            if (calculateContrast(i, "bg").cl === "contrastSpanBad") {
                failed = true;
            }
            if (calculateContrast(i, "surface").cl === "contrastSpanBad") {
                failed = true;
            }
        });

        if (failed) {
            return "contrast: failed";
        } else {
            return "contrast: passed";
        }
    });

    function selectIndex(i) {
        // console.log(i);
        colorStore.setTailoredIndex(i);
    }

    function getRenderColor(t, j) {
        return colorStore.hoveredPreview && colorStore.curTailoredIndex === j ? colorStore.hoveredPreview : t.color;
    }

    // calculates the contrast between the two colors
    // first color is given by index, second by name.
    // returns the class name (.cl) and numerical value, formatted as a string (.value) of the contrast
    // if you change this, also be sure to modify the function in "ColorSelections.svelte"
    function calculateContrast(colorIndex1, colorName) {
        try {
            let c1 = tailored[colorIndex1]?.color ?? null;
            let c2 = tailored.find((c) => c.name === colorName)?.color ?? null;

            // Ensures contrast values are updated for hovered previews
            if (colorStore.hoveredPreview) {
                // ensures the 'c1' contrast value is updated based on hovering over "Adjust.svelte"
                if (colorStore.curTailoredIndex === colorIndex1) c1 = colorStore.hoveredPreview;

                // ensures the bg and surface contrast value is updated based on hovering over "Adjust.svelte"
                if (colorStore.curTailoredIndex === 0) {
                    // re-selection bg
                    if (colorName === "bg") {
                        c2 = colorStore.hoveredPreview;
                    }
                } else if (colorStore.curTailoredIndex === 1) {
                    // re-selecting surface
                    if (colorName === "surface") {
                        c2 = colorStore.hoveredPreview;
                    }
                }
            }

            // guards against incorrectly-selected colors, or the event where we still have
            // the CSS variable inputted here
            if (c1 === null || c2 === null || c1.includes("var(--") || c2.includes("var(--")) {
                // console.error(`Couldn't find color for (${colorIndex1}, ${colorName}); got (${c1}, ${c2}). `);
                return {
                    cl: "none",
                    value: "n/a",
                };
            }

            // Muted for background-on-background:
            if (tailored[colorIndex1]?.name == "bg" || tailored[colorIndex1]?.name == "surface") {
                return {
                    cl: "contrastSpanMuted",
                    value: chroma.contrast(c1, c2).toFixed(1),
                };
            }

            const contrast = chroma.contrast(c1, c2).toFixed(1);

            const cl = contrast > 4.5 ? "contrastSpanGood" : "contrastSpanBad";

            return {
                cl,
                value: `${contrast}`,
            };
        } catch (error) {
            console.error(error);
            console.log(colorStore.selections);
            console.log(colorStore.tailored);
            console.log(colorStore.curIndex);
            console.log(colorStore.curTailoredIndex);
        }
    }
</script>

<div class="container">
    <div class="titles">
        <div class="title">Colors:</div>
        <div class="title">Contrast - bg:</div>
        <div class="title">Contrast - surface:</div>
    </div>

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

                    <!-- Formatting contrast ratios 
                    -->

                    <div class="contrastSpanHolder">
                        <div class={calculateContrast(j, "bg").cl}>
                            {calculateContrast(j, "bg").value}
                        </div>
                    </div>
                    <div class="contrastSpanHolder">
                        <div class={calculateContrast(j, "surface").cl}>
                            {calculateContrast(j, "surface").value}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="title" class:contrastFailed={contrastMessage.includes("failed")}>{contrastMessage}</div>
</div>

<style>
    .container {
        border: 1px solid var(--border);

        background-color: var(--surface);
        border-radius: var(--bradius);

        width: 100%;

        display: grid;
        grid-template-columns: repeat(1, 1fr 3fr 1fr);
        justify-content: space-between;
        align-items: center;
        justify-items: center;

        padding-top: 0.5rem;
        padding-bottom: 0.5rem;

        overflow-x: hidden;
    }

    .item {
        border: none;
    }

    .contrastFailed {
        color: red;
    }

    .colorAndName {
        display: flex;
        flex-direction: column;

        align-items: center;
    }
    .colorAndName:hover {
        text-decoration: underline;
    }
    .swatchName {
        display: flex;
        justify-self: center;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
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

    .contrastSpanHolder {
        margin: 0.2rem;
    }

    .contrastSpanMuted {
        color: var(--text-muted);
    }
    .contrastSpanGood {
    }
    .contrastSpanBad {
        text-decoration: line-through;
        color: red;
    }
</style>
