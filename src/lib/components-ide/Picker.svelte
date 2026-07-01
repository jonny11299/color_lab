<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { themeStore } from "$lib/stores/theme.svelte.js";
    import ReadoutGrid from "./ReadoutGrid.svelte";
    import Harmonies from "./Harmonies.svelte";
    import chroma from "chroma-js";

    // pickerValue reads from the input, but does not write to it.
    let pickerValue = $state("var(--bg)");
    let hexVal = $derived.by(() => colorStore.resolveToHex(pickerValue));

    let launchedPreviewYet = $state(false);
    let selectedAllColors = $state(false);

    function inputtedColor(event) {
        const c = event.target.value;
        // console.log(c);
        pickerValue = c;
        colorStore.setCurrentColorIgnoreQueue(c);
    }

    function closedPicker(event) {
        const c = event.target.value;
        pickerValue = c;
        colorStore.setCurrentColorTailored(c);
        if (!selectedAllColors) {
            colorStore.iterate();
            // we should launch the preview once the user selects a background color.
            if (!launchedPreviewYet) {
                launchedPreviewYet = true;
                phaseStore.advance(2);
            }
        }
    }

    function copyHex() {
        navigator.clipboard.writeText(hexVal);
        copiedHexText = `(Copied)`;
        setTimeout(() => (copiedHexText = ""), 2000);
    }

    // colorStore index changes --> compute phaseStore, reset pickerValue
    $effect(() => {
        const i = colorStore.curIndex;

        // update my phaseStore state to simulate the app's stages
        if (!selectedAllColors) {
            if (!colorStore.tailored.some((t) => t.color.includes("var"))) {
                selectedAllColors = true;
                console.log("Setting selectAllColors to True");
                // phaseStore.advance(3);
            }
        }

        // set the picker's color
        pickerValue = colorStore.cur.color;
        colorInputElement.value = colorStore.resolveToHex(colorStore.cur.color);
    });

    // set the height (and therefore size) of the color picker
    let maxHeightVH = $state(14);
    function getMaxHeight() {
        return `${maxHeightVH}vh`;
    }

    let colorInputElement;
    function handleClickedOnPick() {
        colorInputElement.click();
    }
</script>

<div class="pickerContainer">
    <div class="previewAndOptions">
        <div>
            <div class="previewContainer">
                <div class="icons">
                    <button
                        class="smallIcon"
                        onclick={(e) => {
                            e.stopPropagation();
                            maxHeightVH = maxHeightVH + 2;
                        }}>+</button
                    >
                    <button
                        class="smallIcon"
                        onclick={(e) => {
                            e.stopPropagation();
                            maxHeightVH = maxHeightVH - 2;
                        }}
                        style="border-left: 2px solid var(--text);">-</button
                    >
                    <div class="dropzoneSmall" onclick={handleClickedOnPick} role="button" tabindex="0">pick</div>
                </div>

                <input
                    class="preview"
                    type="color"
                    id="colorInput"
                    bind:this={colorInputElement}
                    oninput={inputtedColor}
                    // updates on dragging around on the picker
                    onchange={closedPicker}
                    // updates on closing the picker
                    style="height: {getMaxHeight()}; width: {getMaxHeight()};"
                />
            </div>
        </div>
        <div class="otherSpace">
            <!--
            <ReadoutGrid {hexVal} />
            -->
            <!-- <p>I need a 'next color, prev color' here... it feels like a bug when it auto-iterates</p> -->
            <Harmonies {hexVal} />
        </div>
    </div>
</div>

<style>
    .pickerContainer {
        display: flex;
        flex-direction: column;
        border: none;
        border-radius: 4px;
        overflow: hidden;

        margin: 1rem;
        margin-top: 2rem;
    }

    .previewAndOptions {
        display: flex;
        flex-direction: row;
        align-items: start;

        gap: 1rem;
        width: 100%;
    }

    .preview {
        display: block;
        object-fit: contain;

        background-color: var(--surface);
        border: none;

        padding: 1rem;
        margin: 0;

        align-self: center;
    }
    .preview:hover {
        cursor: pointer;
    }

    .previewContainer {
        display: inline-flex;
        flex-direction: column;
        border: 2px solid var(--text);
        border-radius: 4px;

        overflow: hidden;
    }

    .icons {
        display: flex;
        flex-direction: row;

        border-bottom: 2px solid var(--text);
    }

    .smallIcon {
        border: none;

        padding-left: 0.6rem;
        padding-right: 0.6rem;
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        margin: 0rem;

        border-radius: 0px;
    }

    .otherSpace {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border: 2px solid var(--text);
        border-radius: 4px;
        flex: 1;
        align-self: stretch;

        overflow: scroll;

        padding: 1rem;
    }

    .colorTitle {
        margin: 0rem;
        padding: 0rem;
        margin-bottom: 1rem;

        text-transform: uppercase;
    }

    .dropzoneSmall {
        margin: 0rem;
        padding: 0.3rem;
        border-radius: 0;
        border-left: 2px solid var(--border);
        background: transparent;
        color: var(--text);
        cursor: pointer;
        text-align: center;

        width: 100%;
    }

    .dropzoneSmall:hover {
        background: color-mix(in srgb, var(--text) 10%, transparent);
        border-color: color-mix(in srgb, var(--primary-hover) 30%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
    }

    .readoutGrid {
        display: grid;
        grid-template-columns: auto 1fr;
        border: 2px solid var(--text);
        border-radius: 4px;
        overflow: scroll;
        font-family: monospace;
        font-size: 14px;
        width: fit-content;

        align-self: flex-start;
        justify-self: center;
    }

    .readoutGrid .label {
        padding: 0.3rem 0.8rem;
        color: var(--text-muted);
        border-right: 2px solid var(--text);
        border-bottom: 2px solid var(--text);
    }

    .readoutGrid .value {
        padding: 0.3rem 0.8rem;
        border-bottom: 2px solid var(--text);
    }

    .readoutGrid span:nth-last-child(1),
    .readoutGrid span:nth-last-child(2) {
        border-bottom: none;
    }

    .labelUnderlinable {
        padding: 0.3rem 0.8rem;
        color: var(--text-muted);
        border-right: 2px solid var(--text);
        border-bottom: 2px solid var(--text);
    }
    .labelUnderlinable:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .valueUnderlinable {
        padding: 0.3rem 0.8rem;
        border-bottom: 2px solid var(--text);
    }
    .valueUnderlinable:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .copiedHex {
        margin-left: 0.5rem;
        font-weight: normal;
        text-transform: none;
    }
</style>
