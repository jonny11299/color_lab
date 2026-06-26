<script>
    import { readPixels, uploadImage } from "$lib/utils/images.js";
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { tick } from "svelte";

    let isDraggingOver = $state(false);
    let previewUrl = $state(null);
    let metadata = $state(null);

    let maxHeightVH = $state(20);
    function getMaxHeight() {
        return `${maxHeightVH}vh`;
    }

    function getDropZoneText() {
        if (previewUrl) {
            return "replace";
        } else {
            return "drop an image or click to upload";
        }
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
        await tick();
        const met = await uploadImage(file); // met = metadata
        if (met) {
            console.log("Getting metadata in imageLoader");
            metadata = met; // updates state
            await tick();
            readPixels();
            phaseStore.advance(1);
        }
    }

    function formatSize(bytes) {
        if (!bytes) return `n/a`;

        if (bytes > 1024 * 1024) {
            return `${(bytes / 1024 / 1024).toFixed(1)} mb`;
        } else if (bytes > 1024) {
            return `${(bytes / 1024).toFixed(1)} kb`;
        }
    }
</script>

<div class="container">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!--<h3>Image</h3>-->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
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
                        <div
                            class="dropzoneSmall"
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
                    </div>
                    <img
                        class="preview"
                        src={previewUrl}
                        alt="uploaded image preview"
                        style="max-height: {getMaxHeight()}; height: {getMaxHeight()};"
                    />
                </div>
            </div>
            <div class="otherSpace">
                <p>Palettes will go here...</p>
            </div>
        </div>
    {/if}

    <!-- Display image store 
    <p>Image store:</p>
    <pre>{imageStore.formatted}</pre>
    -->
</div>

<style>
    .container {
        border: 0px solid var(--border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 100%;
        min-width: 15rem;

        display: flex;
        flex-direction: column;
        align-items: center;
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
        max-height: 20vh;
        max-width: 100%;
        object-fit: contain;
    }

    .metadata {
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
