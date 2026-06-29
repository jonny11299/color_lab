<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { themeStore } from "$lib/stores/theme.svelte.js";

    // pickerValue reads from the input, but does not write to it.
    let pickerValue = $state("var(--bg)");
    let hexVal = $derived.by(() => resolveToHex(pickerValue));

    let launchedPreviewYet = $state(false);
    let selectedAllColors = $state(false);

    // converts 'var(--[value])' to the hex value, falls back on returning just the value
    function resolveToHex(value) {
        if (typeof document === "undefined") return "#000000";

        const raw = value.startsWith("var(") ? getComputedStyle(document.documentElement).getPropertyValue(value.slice(4, -1).trim()).trim() : value;

        const ctx = document.createElement("canvas").getContext("2d");
        ctx.fillStyle = raw;
        return ctx.fillStyle;
    }

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
        colorInputElement.value = resolveToHex(colorStore.cur.color);
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
            {hexVal}
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
        align-items: center;

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

        padding-left: 1rem;
        padding-right: 1rem;
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
</style>
