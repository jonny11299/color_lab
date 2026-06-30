<!-- Used to facilitate the eyedropper upon hovering over the image -->

<script>
    import chroma from "chroma-js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    let { onColorPicked, onReplace } = $props();

    let canvasElement = $state(null);
    let hoveredColor = $state(null);
    let cursorPos = $state({ x: 0, y: 0 });
    let isHovering = $state(false);

    let maxHeightVH = $state(20);
    function getMaxHeight() {
        return `${maxHeightVH}vh`;
    }

    export async function loadImage(file) {
        const bitmap = await createImageBitmap(file);
        canvasElement.width = bitmap.width;
        canvasElement.height = bitmap.height;
        canvasElement.getContext("2d").drawImage(bitmap, 0, 0);
    }

    function handleMouseMove(e) {
        if (!canvasElement) return;
        const rect = canvasElement.getBoundingClientRect();
        const scaleX = canvasElement.width / rect.width;
        const scaleY = canvasElement.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const [r, g, b] = canvasElement.getContext("2d").getImageData(x, y, 1, 1).data;
        hoveredColor = chroma(r, g, b).hex();
        cursorPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        colorStore.setHoveredPreview(hoveredColor);
    }

    function handleClick() {
        if (hoveredColor) onColorPicked(hoveredColor);
    }
</script>

<div class="previewContainer">
    <div class="icons">
        <button
            class="smallIcon"
            onclick={(e) => {
                e.stopPropagation();
                maxHeightVH += 2;
            }}>+</button
        >
        <button
            class="smallIcon"
            onclick={(e) => {
                e.stopPropagation();
                maxHeightVH -= 2;
            }}
            style="border-left: 2px solid var(--text);">-</button
        >
        <div class="dropzoneSmall" onclick={onReplace} role="button" tabindex="0">replace</div>
    </div>

    <div
        class="canvasWrapper"
        onmousemove={handleMouseMove}
        onmouseleave={() => {
            isHovering = false;
            hoveredColor = null;
            colorStore.setHoveredPreview(null);
        }}
        onmouseenter={() => (isHovering = true)}
        onclick={handleClick}
    >
        <canvas bind:this={canvasElement} style="max-height: {getMaxHeight()}; height: {getMaxHeight()};" class="preview" />

        {#if isHovering && hoveredColor}
            <div class="colorCursor" style="left: {cursorPos.x}px; top: {cursorPos.y}px; background: {hoveredColor};"></div>
            <div class="colorLabel" style="left: {cursorPos.x}px; top: {cursorPos.y}px;">
                {hoveredColor}
            </div>
        {/if}
    </div>
</div>

<style>
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
        margin: 0;
        border-radius: 0;
    }

    .canvasWrapper {
        position: relative;
        cursor: crosshair;
        display: inline-block;
    }

    .preview {
        display: block;
        max-width: 100%;
        object-fit: contain;
    }

    .colorCursor {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--text);
        pointer-events: none;
        transform: translate(-50%, -50%);
    }

    .colorLabel {
        position: absolute;
        font-family: monospace;
        font-size: 12px;
        background: var(--surface);
        border: 1px solid var(--text);
        padding: 2px 6px;
        border-radius: 4px;
        pointer-events: none;
        transform: translate(12px, -50%);
        white-space: nowrap;
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

    .dropzoneSmall.active {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
    }
</style>
