<!-- The window in which you make adjustments to your currently-selected color -->

<!-- Going to try some different scales:

y-axis: luminance 
x-axis: hue adjustment

y-axis light/dark
x-axis: hue

y-axis: luminance
x-axis: saturate / desaturate

-->
<script>
    import chroma from "chroma-js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    // sets which function is used to modulate the colors across the square:
    let colorModOptions = ["h x l", "h x l (alt)", "s x l", "s x h"];
    let { selectedColorMod } = $props(); // pass this in via index, referencing the above array

    // should be odd numbers so our color can sit in the center
    let numRows = 39;
    let numCols = 39; // be sure to adjust .grid 'grid-template-columns' in response to this

    let lumStep = 2;
    let darkStep = 0.1;
    let hueStep = 2;
    let satStep = 0.03;

    let centerColor = $derived(colorStore.cur?.color);
    // $effect(() => console.log("we now have " + centerColor));

    let colors = $derived(buildColors(centerColor));

    let hoveredIndexOnClick = $state(null);
    function selectColor(c, i) {
        colorStore.setCurrentColorTailored(`${c}`);
        hoveredIndexOnClick = i;
        // console.log("Old colors[i]: " + colors[i]);
    }

    function buildColors(col) {
        if (!col) return [];

        // console.log("Changing colors...");
        let c;
        try {
            c = chroma(col);
        } catch (error) {
            // failing typically happens when we are still using CSS vars.
            // console.error("Failed color instantiation, falling back on white");
            // console.error(error);
            c = chroma("grey");
        }

        // push onto matrix row-by-row
        let matrix = [];

        let leftSide = -Math.floor(numCols / 2);
        let topSide = -Math.floor(numRows / 2);
        // console.log(`leftSide, topSide: ${leftSide}, ${topSide}`);

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (selectedColorMod === 0) {
                    matrix.push(colorModLumHue(c, leftSide + j, topSide + i));
                } else if (selectedColorMod === 1) {
                    matrix.push(colorModDarkHue(c, leftSide + j, topSide + i));
                } else if (selectedColorMod === 2) {
                    matrix.push(colorModLumSat(c, leftSide + j, topSide + i));
                } else if (selectedColorMod === 3) {
                    matrix.push(colorModHueSat(c, leftSide + j, topSide + i));
                } else {
                    matrix.push(chroma("purple"));
                }
            }
        }
        // console.log(matrix);
        return matrix;
    }

    // returns a chroma color adjusted in two directions.
    // c: chroma color
    // y-axis: luminance
    // x-axis: hue adjustment
    function colorModLumHue(color, xmod, ymod) {
        // console.log(`${xmod}, ${ymod}`);
        let c = chroma(color);
        try {
            // affect y-axis (luminance)
            // c = c.set("lab.l", `*${1 - ymod * lumStep}`);
            c = c.set("lab.l", c.get("lab.l") - ymod * lumStep);

            // affect x-axis (hue)
            // pass a number, and normalize to 0-360
            const newHue = (((c.get("hsl.h") + xmod * hueStep) % 360) + 360) % 360;
            c = c.set("hsl.h", newHue);

            // if (c.clipped) console.log(`clipping ${c} at ${xmod}, ${ymod}`);

            return c;
        } catch (error) {
            console.error(`Could not colorMod with ${c}, ${xmod}, ${ymod}. Defaulting to pink`);
            return chroma("pink");
        }
    }

    // returns a chroma color adjusted by its position in the square
    // c: chroma color
    // y-axis: darken / brighten
    // x-axis: hue adjustment
    function colorModDarkHue(color, xmod, ymod) {
        let c = chroma(color);
        try {
            // affect y-axis (darkness)
            c = c.darken(ymod * darkStep);

            // affect x-axis (hue)
            // pass a number, and normalize to 0-360
            const newHue = (((c.get("hsl.h") + xmod * hueStep) % 360) + 360) % 360;
            c = c.set("hsl.h", newHue);

            return c;
        } catch (error) {
            console.error(`Could not colorMod with ${c}, ${xmod}, ${ymod}. Defaulting to pink`);
            return chroma("pink");
        }
    }

    // returns a chroma color adjusted in two directions.
    // c: chroma color
    // y-axis: luminance
    // x-axis: saturation adjustment
    function colorModLumSat(color, xmod, ymod) {
        // console.log(`${xmod}, ${ymod}`);
        let c = chroma(color);
        try {
            // affect y-axis (luminance)
            // c = c.set("lab.l", `*${1 - ymod * lumStep}`);
            c = c.set("lab.l", c.get("lab.l") - ymod * lumStep);

            // affect x-axis (saturation)
            c = c.set("hsl.s", `*${1 + xmod * satStep}`);

            // if (c.clipped) console.log(`clipping ${c} at ${xmod}, ${ymod}`);

            return c;
        } catch (error) {
            console.error(`Could not colorMod with ${c}, ${xmod}, ${ymod}. Defaulting to pink`);
            return chroma("pink");
        }
    }

    // returns a chroma color adjusted in two directions.
    // c: chroma color
    // y-axis: saturation adjustment
    // x-axis: hue adjustment
    function colorModHueSat(color, xmod, ymod) {
        // console.log(`${xmod}, ${ymod}`);
        let c = chroma(color);
        try {
            // affect x-axis (hue)
            // pass a number, and normalize to 0-360
            const newHue = (((c.get("hsl.h") + xmod * hueStep) % 360) + 360) % 360;
            c = c.set("hsl.h", newHue);

            // affect y-axis (saturation)
            c = c.set("hsl.s", `*${1 - ymod * satStep}`);

            // if (c.clipped) console.log(`clipping ${c} at ${xmod}, ${ymod}`);

            return c;
        } catch (error) {
            console.error(`Could not colorMod with ${c}, ${xmod}, ${ymod}. Defaulting to pink`);
            return chroma("pink");
        }
    }
</script>

<div class="container">
    <h3 class="title">Adjust</h3>
    <h6 class="subtitle">{colorModOptions[selectedColorMod] ?? "n/a"}</h6>
    <!-- Populate the grid with color adjustments -->
    <div class="grid" style="grid-template-columns: repeat({numCols}, 1fr);">
        {#each colors as c, i}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="square"
                style="background-color: {c}"
                onmouseenter={() => colorStore.setHoveredPreview(`${c}`)}
                onmouseleave={() => colorStore.setHoveredPreview(null)}
                onclick={() => {
                    selectColor(c, i);
                }}
            ></div>
        {/each}
    </div>
</div>

<style>
    .title {
        padding: 0rem;
        margin: 0rem;
        margin-bottom: 0.3rem;
    }

    .subtitle {
        padding: 0rem;
        margin: 0rem;
        margin-bottom: 1rem;
    }

    .container {
        border: 1px solid var(--border);
        border-radius: 0;
        padding: 1rem;
        margin: 0;
        max-width: 20rem;
        min-width: 15rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }

    .grid {
        display: grid;
        border: none;
        grid-template-columns: repeat(10, 1fr); /* overwritten to follow numCols in the html syntax */
        gap: 0px;

        align-items: center;
        justify-items: center;
        cursor: crosshair;
    }

    .square {
        width: 0.35rem;
        aspect-ratio: 1;
        border: none;
    }
    .square:hover {
    }
</style>
