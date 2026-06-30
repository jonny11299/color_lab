<script>
    import { readPixels, uploadImage } from "$lib/utils/images.js";
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { tick } from "svelte";
    import ImageCanvas from "./ImageCanvas.svelte";
    import Palette from "./Palette.svelte";
    import ReadoutGrid from "./ReadoutGrid.svelte";

    let isDraggingOver = $state(false);
    let previewUrl = $state(null);
    let metadata = $state(null);
    let canvasComponent = $state(null);
    let pendingFile = $state(null);

    let hexVal = $derived.by(() => colorStore.resolveToHex(colorStore.hoveredPreview ? colorStore.hoveredPreview : colorStore.cur.color));

    let launchedPreviewYet = $state(false);
    let selectedAllColors = $state(false);

    function getDropZoneText() {
        return previewUrl ? "replace" : "drop an image or click to upload";
    }

    function handleClick() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => handleFile(e.target.files[0]);
        input.click();
    }

    function handleDragOver(e) {
        e.preventDefault();
        isDraggingOver = true;
    }

    function handleDragLeave() {
        isDraggingOver = false;
    }

    function handleDrop(e) {
        e.preventDefault();
        isDraggingOver = false;
        handleFile(e.dataTransfer.files[0]);
    }

    async function handleFile(file) {
        if (!file) return;
        previewUrl = URL.createObjectURL(file);
        pendingFile = file;
        await tick();
        // load into canvas now that it's mounted
        await canvasComponent.loadImage(file);

        const met = await uploadImage(file);
        // once we have the image, we call readPixels() in images.js, which averages all the pixels of the image
        // into distinct color bins, and then sets imageStore.svelte.js to have these swatches.
        // imageStore.svelte.js then sorts the colors
        if (met) {
            metadata = met;
            await tick();
            readPixels();
            phaseStore.advance(1);
        }
    }

    function handleColorPicked(hex) {
        colorStore.setCurrentColorTailored(hex);
        if (!selectedAllColors) {
            colorStore.iterate();
            // we should launch the preview once the user selects a background color.
            if (!launchedPreviewYet) {
                launchedPreviewYet = true;
                phaseStore.advance(2);
            }
        }
    }

    function formatSize(bytes) {
        if (!bytes) return "n/a";
        if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} mb`;
        if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} kb`;
    }
</script>

<div class="container">
    {#if !previewUrl}
        <div
            class="dropzone"
            class:active={isDraggingOver}
            onclick={handleClick}
            ondragover={handleDragOver}
            ondragleave={handleDragLeave}
            ondrop={handleDrop}
            role="button"
            tabindex="0"
        >
            {getDropZoneText()}
        </div>
    {:else}
        <div class="previewAndOptions">
            <div>
                <ImageCanvas bind:this={canvasComponent} onColorPicked={handleColorPicked} onReplace={handleClick} />
                <!--
                <ReadoutGrid {hexVal} />
                -->
            </div>
            <div class="otherSpace">
                <Palette />
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        border: 0px solid var(--border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 100%;
        min-width: 15rem;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .previewAndOptions {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
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

    .dropzone {
        margin: 2rem;
        padding: 2rem;
        border-radius: 1.5rem;
        border: 2px dashed var(--border);
        background: transparent;
        color: var(--text);
        cursor: pointer;
    }

    .dropzone:hover {
        background: color-mix(in srgb, var(--text) 10%, transparent);
        border-color: color-mix(in srgb, var(--primary-hover) 30%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
    }

    .dropzone.active {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
    }
</style>
