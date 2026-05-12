<script>
    import { readPixels, uploadImage } from "$lib/utils/images.js";
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { tick } from "svelte";

    let isDraggingOver = $state(false);
    let previewUrl = $state(null);
    let metadata = $state(null);

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
    <h3>Image</h3>
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
        drop an image or click to upload
    </div>
    {#if previewUrl}
        <img class="preview" src={previewUrl} alt="uploaded image preview" />
    {/if}

    <!-- Display metadata: -->
    <div class="metadata">
        {#if metadata}
            <p>Name: {metadata?.name}</p>
            <p>Type: {metadata?.type}</p>
            <p>File Size: {formatSize(metadata.size)}</p>
            <p>Size: {`${metadata?.width} x ${metadata?.height} px`}</p>
        {/if}
    </div>

    <!-- Display image store -->
    <p>Image store:</p>
    <pre>{imageStore.formatted}</pre>
</div>

<style>
    .container {
        border: 2px solid var(--color-border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 100%;
        min-width: 20rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .dropzone {
        margin: 2rem;
        padding: 2rem;
        border-radius: 1.5rem;
        border: 2px dashed var(--color-text-muted);
    }

    .dropzone:hover {
        cursor: pointer;
    }

    .dropzone:hover,
    .dropzone.active {
        border: 2px dashed var(--color-primary-hover);
        color: var(--color-primary-hover);
        background: var(--color-surface);
    }

    .preview {
        min-width: 25%;
        max-height: 40vh;
        object-fit: contain;
    }
    .metadata {
    }
</style>
