<script>
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { onMount } from "svelte";

    let phase = $derived(phaseStore.phase);

    onMount(() => {
        console.log("Phase: " + phase);
    });
</script>

{#if phase === 0}
    <div>
        <h3>Waiting for Image upload</h3>
        <p>Please upload an image to get started.</p>
    </div>
{:else if phase === 1}
    <div>
        <h3>Waiting for color selection</h3>
        <p>Select a color to view site preview.</p>
    </div>
{:else}
    <div>
        <h3>Waiting for complete color selection</h3>
        <p>Select a full palette to get tailored edits.</p>
    </div>
{/if}
