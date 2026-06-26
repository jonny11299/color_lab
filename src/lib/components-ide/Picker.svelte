<script>
    let selectedMode = $state("RGB");
    const modes = ["RGB", "HSL", "LAB"];
</script>

<div class="pickerContainer">
    <div class="modes">
        {#each modes as mode}
            <button
                class="modeButton"
                class:inverse={selectedMode === mode}
                onclick={(e) => {
                    e.stopPropagation();
                    selectedMode = mode;
                }}
            >
                {mode}
            </button>
        {/each}
    </div>
    <div class="pickerContent">
        <!-- content for {selectedMode} goes here -->
        <p>Color picker stuff will go here...</p>
    </div>
</div>

<style>
    .pickerContainer {
        display: flex;
        flex-direction: column;
        border: 2px solid var(--text);
        border-radius: 4px;
        overflow: hidden;

        margin: 1rem;
    }

    .modes {
        display: flex;
        flex-direction: row;
        border-bottom: 2px solid var(--text);
    }

    .modeButton {
        flex: 1;
        border: none;
        border-radius: 0px;
        padding-left: 0.6rem;
        padding-right: 0.6rem;
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        margin: 0rem;
    }

    .modeButton + .modeButton {
        border-left: 2px solid var(--text);
    }

    .modeButton.active {
        background: color-mix(in srgb, var(--text) 10%, transparent);
        color: var(--primary-hover);
    }

    .pickerContent {
        padding: 0.5rem;
    }
</style>
