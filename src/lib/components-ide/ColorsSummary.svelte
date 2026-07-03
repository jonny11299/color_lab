<!-- Uses chroma.contrastAPCA to calculate contrast ratio -->

<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import chroma from "chroma-js";

    let tailored = $derived(colorStore.tailored);
    let tailoredIndex = $derived(colorStore.curTailoredIndex);

    const flawlessThreshold = 75; // 4.5 for WCAG

    const greatThreshold = 45;

    const acceptableThreshold = 30;

    const borderContrastThreshold = 2; // the threshold to switch from default border color to opposite-colored border

    let leftPressed = $state(false);
    let rightPressed = $state(false);

    let cachedTextColor = null;

    function handleKeydown(event) {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            colorStore.iterateReverse();
            leftPressed = true;
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            colorStore.iterate();
            rightPressed = true;
        }
    }

    function handleKeyup(event) {
        if (event.key === "ArrowLeft") {
            leftPressed = false;
        } else if (event.key === "ArrowRight") {
            rightPressed = false;
        }
    }

    let contrastMessage = $derived.by(() => {
        const ts = tailored;

        let failed = false;
        let nearBad = false;
        let decent = false;

        ts.forEach((item, i) => {
            if (calculateContrast(i, "bg").cl === "contrastSpanBad") {
                failed = true;
            }
            if (calculateContrast(i, "surface").cl === "contrastSpanBad") {
                failed = true;
            }
            if (calculateContrast(i, "bg").cl === "contrastSpanNearBad") {
                nearBad = true;
            }
            if (calculateContrast(i, "surface").cl === "contrastSpanNearBad") {
                nearBad = true;
            }
            if (calculateContrast(i, "bg").cl === "contrastSpanDecent") {
                decent = true;
            }
            if (calculateContrast(i, "surface").cl === "contrastSpanDecent") {
                decent = true;
            }
        });

        if (failed) {
            return "contrast: failed";
        }
        if (nearBad) {
            return "contrast: acceptable";
        }
        if (decent) {
            return "contrast: good";
        }
        return "contrast: flawless";
    });

    function selectIndex(i) {
        // console.log(i);
        colorStore.setTailoredIndex(i);
    }

    function getRenderColor(t, j) {
        return colorStore.hoveredPreview && colorStore.curTailoredIndex === j ? colorStore.hoveredPreview : t.color;
    }

    function getTextColor() {
        if (cachedTextColor) return cachedTextColor;
        if (typeof document === "undefined") return "#000"; // SSR guard
        cachedTextColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
        return cachedTextColor;
    }

    // picks a border color that stays visible against the swatch's own background
    function getBorderColor(hex) {
        try {
            if (!hex || hex.includes("var(--")) return "var(--text)";

            const textColor = getTextColor();
            const contrast = chroma.contrast(hex, textColor);

            if (contrast < borderContrastThreshold) {
                // too close — fall back to whichever of black/white contrasts better
                const whiteContrast = chroma.contrast(hex, "white");
                const blackContrast = chroma.contrast(hex, "black");
                return whiteContrast > blackContrast ? "white" : "black";
            }

            return textColor;
        } catch (e) {
            return "var(--text)";
        }
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
                    value: Math.abs(chroma.contrastAPCA(c1, c2)).toFixed(0),
                };
            }

            const contrast = Math.abs(chroma.contrastAPCA(c1, c2)).toFixed(0);

            const cl =
                contrast > flawlessThreshold
                    ? "contrastSpanGood"
                    : contrast > greatThreshold
                      ? "contrastSpanDecent"
                      : contrast > acceptableThreshold
                        ? "contrastSpanNearBad"
                        : "contrastSpanBad";

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

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div class="container">
    <!--
    <div class="header">
        <div class="dummySwatch"></div>
        <div class="title">Colors:</div>
        <div class="title">Contrast - bg:</div>
        <div class="title">Contrast - surface:</div>
    </div>
    -->

    <div class="item">
        <div class="swatches">
            <div class="swatchColumnHeader">
                {#each tailored as t, j}
                    {#if tailoredIndex === j}
                        <div class="contrastSwatchContainer">
                            <div class="contrastSwatchLeftSide">
                                <div
                                    class="contrastSwatch"
                                    style="background: {getRenderColor(t, j)}; 
                border-color: {tailoredIndex === j ? `var(--text)` : `var(--bg)`};
                 border-width: {tailoredIndex === j ? `0px` : `0`}"
                                ></div>
                            </div>
                            <div class="contrastSwatchRightSide">
                                <div class="bgswatchrender" style="background: {colorStore.tailored[0]?.color}"></div>
                                <div class="bgswatchrender" style="background: {colorStore.tailored[1]?.color}"></div>
                            </div>
                        </div>
                    {/if}
                {/each}
                <!--
                <div class="dummySwatch"></div>
                -->
                <div class="header">Contrast:</div>

                <div class="contrastSpanHolder">bg:</div>
                <div class="contrastSpanHolder">surface:</div>

                <!--
                <div class="contrastSpanHolder">
                    <div class="twoColSplit">
                        <div class="contrastText">Contrast:</div>
                        <div class="contrastText">bg:</div>
                    </div>
                </div>
                <div class="contrastSpanHolder">
                    <div class="twoColSplit">
                        <div class="contrastText">Contrast:</div>
                        <div class="contrastText">surface:</div>
                    </div>
                </div>
                -->
            </div>
        </div>
    </div>

    <div class="item">
        <div class="prevNextButtons"></div>
        <div class="swatches">
            <button class="btn" class:isActive={leftPressed} onclick={colorStore.iterateReverse}>←</button>

            {#each tailored as t, j}
                <div class="swatchColumn">
                    <div class="swatchAndName">
                        <div
                            class="swatch"
                            class:selected={tailoredIndex === j}
                            style="background: {getRenderColor(t, j)}; --border-color: {getBorderColor(getRenderColor(t, j))}"
                            onclick={() => selectIndex(j)}
                        ></div>

                        <div class="swatchName" class:nameSelected={tailoredIndex === j} onclick={() => selectIndex(j)}>
                            {t.name}
                        </div>
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
            <button class="btn" class:isActive={rightPressed} onclick={colorStore.iterate}>→</button>
        </div>
    </div>
    <div
        class="title"
        class:contrastFailed={contrastMessage.includes("failed")}
        style="margin-left: 1rem;"
        onclick={() => window.open("https://git.apcacontrast.com/documentation/APCAeasyIntro.html", "_blank")}
    >
        {contrastMessage}
    </div>
</div>

<style>
    .container {
        border: 1px solid var(--border);

        background-color: var(--surface);
        border-radius: var(--bradius);

        width: 100%;

        display: grid;
        grid-template-columns: repeat(1, 1fr 3fr 1fr);
        justify-content: space-evenly;
        align-items: center;
        justify-items: center;

        padding-top: 0.5rem;
        padding-bottom: 0.5rem;

        overflow-x: scroll;
    }

    .title:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .item {
        border: none;
    }

    .contrastFailed {
        color: red;
    }

    .swatchColumn {
        display: flex;
        flex-direction: column;

        align-items: center;
    }

    .swatchColumnHeader {
        display: flex;
        flex-direction: column;

        align-items: flex-end;
    }

    .swatchAndName {
        display: flex;
        flex-direction: column;

        align-items: center;
    }
    .swatchAndName:hover .swatchName {
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
        border: 2px solid transparent;
        color: var(--text);

        width: 4rem;
        height: 2rem;
        margin: 0.2rem;
        border-radius: 4px;
    }
    .swatch:hover {
        cursor: pointer;
        border-style: dotted;
        border-color: var(--border-color, var(--text));
    }
    .swatch.selected {
        border-style: solid;
        border-color: var(--border-color, var(--text));
    }

    /* these spacial dimensions should match .swatch's */
    .contrastSwatchContainer {
        display: grid;
        grid-template-columns: repeat(1, 2fr 1fr);
        align-items: center;
        justify-content: center;
        border: none;
        color: var(--text);

        width: 4rem;
        height: 2rem;
        margin: 0.2rem;
        border-radius: 4px;
        overflow: hidden;
    }
    .contrastSwatch {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0px dashed var(--text);
        color: var(--text);
        border-radius: 0px;

        width: 100%;
        height: 100%;
    }

    .contrastSwatchLeftSide {
        width: 100%;
        height: 100%;
    }
    .contrastSwatchRightSide {
        width: 100%;
        height: 100%;
    }
    .bgswatchrender {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: var(--text);
        border-radius: 0px;

        width: 100%;
        height: 50%;
    }

    .header {
        display: flex;
        justify-self: center;
        margin-top: 0.5rem;
        margin-bottom: 1rem;

        text-decoration: underline;
    }
    .dummySwatch {
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
    .twoColSplit {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: space-between;
        align-items: center;
        justify-items: end;
        text-align: right;
    }

    .prevNextButtons {
        border: none;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        color: var(--text);

        align-items: center;
        justify-items: center;
        justify-content: center;
        align-content: center;
    }
    .btn {
        border: none;
        width: 100%;
        min-width: 3rem;
        transition: transform 0.5s ease 0.5s;
    }
    .btn:active {
        transform: scale(0.9);
    }

    /* if you also want the hover look to show while held */
    .btn:hover,
    .btn.isActive {
        /* whatever your hover styles are, e.g. background/opacity */
        background: color-mix(in srgb, var(--text) 10%, transparent);
        border-color: color-mix(in srgb, var(--primary-hover) 30%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));

        /* going active: instant, no delay */
        transform: scale(0.9);
        transition: transform 0.05s ease;
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
    .contrastSpanDecent {
        color: var(--text-warn);
    }
    .contrastSpanNearBad {
        text-decoration: underline;
        color: var(--text-warn);
    }
</style>
