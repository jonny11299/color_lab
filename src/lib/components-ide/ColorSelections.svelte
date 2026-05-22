<!-- Shows the colors the user has selected, also provides info about contrast, and options to swap colors. -->
<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import chroma from "chroma-js";

    let tailored = $derived(colorStore.tailored);
    let tailoredIndex = $derived(colorStore.curTailoredIndex);

    function selectIndex(i) {
        // console.log(i);
        colorStore.setTailoredIndex(i);
    }

    // calculates the contrast between the two colors
    // first color is given by index, second by name.
    // returns the class name (.cl) and numerical value, formatted as a string (.value) of the contrast
    function calculateContrast(colorIndex1, colorName) {
        try {
            let c1 = tailored[colorIndex1]?.color ?? null;
            let c2 = tailored.find((c) => c.name === colorName)?.color ?? null;

            // guards against incorrectly-selected colors, or the event where we still have
            // the CSS variable inputted here
            if (
                c1 === null ||
                c2 === null ||
                c1.includes("var(--") ||
                c2.includes("var(--")
            ) {
                console.error(`Couldn't find color for (${colorIndex1}, ${colorName}); got 
            (${c1}, ${c2}). `);
                return {
                    cl: "none",
                    value: "",
                };
            }

            // Muted for background-on-background:
            if (
                tailored[colorIndex1]?.name == "bg" ||
                tailored[colorIndex1]?.name == "bg-2"
            ) {
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
    <div class="title">
        <h3 class="title">Selections & Contrast:</h3>
    </div>
    <div class="grid">
        <div class="name"><h4>name:</h4></div>
        <div class="name"><h4>color:</h4></div>
        <div class="name"><h4>bg:</h4></div>
        <div class="name"><h4>bg-2:</h4></div>
        {#each tailored as t, j}
            <div class="name">{t.name}</div>
            <!-- The color square itself-->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="swatch"
                style="background: {t.color}; 
                border-color: {tailoredIndex === j
                    ? `var(--text)`
                    : `var(--bg)`};
                 border-width: {tailoredIndex === j ? `3px` : `0`}"
                onclick={() => selectIndex(j)}
            ></div>

            <!-- Formatting contrast ratios -->
            <div class={calculateContrast(j, "bg").cl}>
                {calculateContrast(j, "bg").value}
            </div>
            <div class={calculateContrast(j, "bg-2").cl}>
                {calculateContrast(j, "bg-2").value}
            </div>
        {/each}
    </div>
</div>

<style>
    .title {
        color: var(--text);
        padding: 0px;
        margin: 0px;
    }
    .container {
        border: 1px solid var(--border);
        border-radius: 0;
        padding: 1rem;
        max-width: 20rem;
        min-width: 12rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .grid {
        display: grid;
        border: none;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        column-gap: 1.5rem;
        row-gap: 0.5rem;

        align-items: center;
        justify-items: center;
    }

    .swatch {
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
    .swatch:hover {
        cursor: pointer;
    }

    .grid-item {
        min-width: 0;
    }

    .name {
        min-width: 0;
    }
    .swatch {
        min-width: 0;
    }
    .contrast {
        min-width: 0;
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
