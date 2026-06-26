<script>
    import ImageLoaderSmall from "./ImageLoaderSmall.svelte";
    import Picker from "./Picker.svelte";
    let fromImage = $state(true);
</script>

<div class="container">
    <div class="fromImageOptions">
        <button class:inverse={fromImage} on:click={(fromImage = true)}>From Image</button>
        <button class:inverse={!fromImage} on:click={(fromImage = false)}>Picker</button>
    </div>

    <!-- Maintains context of the components even if hidden,
     whereas an {#if} block would erase stored context upon switching view -->

    <div class:hidden={!fromImage}>
        <ImageLoaderSmall />
    </div>
    <div class:hidden={fromImage}>
        <Picker />
    </div>
</div>

<style>
    .container {
    }

    .fromImageOptions {
        display: grid;
        grid-template-columns: repeat(1, 1fr 1fr);
    }

    .hidden {
        display: none;
    }
</style>
