<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
</script>

<div class="dots">
    {#each colorStore.tailored as s, i}
        <div class="dot" style="color: {s.color}">●</div>
    {/each}
</div>

<style>
    .dots {
        display: flex;
        flex-direction: row;
        align-self: center;
        align-items: center;
        justify-self: center;
        justify-items: center;
    }
    .dot {
        color: white;
    }
    p {
        color: red;
    }
</style>
