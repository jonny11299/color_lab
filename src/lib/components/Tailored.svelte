<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { paramStore } from "$lib/stores/paramStore.svelte.js";
    import chroma, { colors } from "chroma-js";

    let tailored = $derived(colorStore.tailored);
    let tailoredIndex = $derived(colorStore.curTailoredIndex);

    /*
        muteStrength={0.5}
        typeScale={1.2}
        borderWidth={3}
        borderRadius={10}
        */

    function selectIndex(i) {
        // console.log(i);
        colorStore.setTailoredIndex(i);
    }

    // calculates the contrast between the two colors
    // first color is given by index, second by name.
    // this is because we always calculate against bg-1 and bg-2,
    // for each color, so the selection makes sense here.
    // cl: [class to assign styling], value: [value of contrast]
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
    <div class="colorRow">
        <h3>Contrast:</h3>
        <h4>bg:</h4>
        <h4>bg-2:</h4>
    </div>
    {#each tailored as t, j}
        <div class="colorRow">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="selections"
                style="background: {t.color}; 
                border-color: {tailoredIndex === j
                    ? `var(--text)`
                    : `var(--bg)`};
                 border-width: {tailoredIndex === j ? `3px` : `0`}"
                onclick={() => selectIndex(j)}
            >
                {t.name}
            </div>
            <!-- Formatting contrast ratios -->
            <span class={calculateContrast(j, "bg").cl}
                >{calculateContrast(j, "bg").value}</span
            >
            <span class={calculateContrast(j, "bg-2").cl}
                >{calculateContrast(j, "bg-2").value}</span
            >
        </div>
    {:else}{/each}

    <!-- Sliders -->
        <!-- Going to have to make this typeable, with an input: -->
    {#each paramStore.params as p, i}
        <div class="paramRow">
            <div class="paramItem">{p.name}: {p.cur.toFixed(paramStore.getFixed(i))}</div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="futureButton" onclick={() => {paramStore.upByIndex(i)}}>up</span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="futureButton" onclick={() => paramStore.downByIndex(i)}>down</span>
        </div>
    {/each}

    <!-- 
        muteStrength={0.5}
        typeScale={1.2}
        borderWidth={3}
        borderRadius={10}
        -->
</div>

<style>
    .container {
        border: 2px solid var(--border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 20rem;
        min-width: 20rem;

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

    .colorRow {
        display: grid;
        align-items: first baseline;
        align-content: first baseline;
        justify-items: center;
        justify-self: center;
        grid-template-columns: repeat(3, 1fr);
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

    .paramRow {
        display: grid;
        align-items: first baseline;
        align-content: first baseline;
        justify-items: center;
        justify-self: center;
        grid-template-columns: repeat(1, 4fr 1fr 1fr);
    }

    .paramItem {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        color: var(--text);

        width: 10rem;
        height: 2rem;
        border-radius: 1rem;

        margin-top: 1rem;
    }

    .futureButton {
        border: 1px solid var(--border);
        color: var(--text);
        padding: 3px;
        border-radius: 1rem;
        user-select: none;
    }
    .futureButton:hover {
        cursor: pointer;
        background-color: var(--surface);
    }
</style>
