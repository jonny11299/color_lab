<script>
    import { themeStore } from "$lib/stores/theme.svelte.js";

    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";

    // stands for 'export', which is a reserved keyword in js.
    function exp() {
        phaseStore.setExportState(true);
    }
</script>

<nav>
    <!--
    <div class="title"><h3>Color Lab</h3></div>
    -->

    <div class="menu">
        <div class="menuTitle">Menu:</div>
        <div class="menuOptions">
            <button onclick={() => colorStore.undo()}>Undo</button>
            <button onclick={() => colorStore.redo()}>Redo</button>
            <button onclick={() => exp()}>Export</button>
        </div>
    </div>

    <div class="theme">
        <div class="themeTitle">Theme:</div>
        <div class="theme-buttons">
            <button onclick={() => themeStore.setTheme("light")} class:selectedTheme={themeStore.theme === "light"}>Light</button>
            <button onclick={() => themeStore.setTheme("dark")} class:selectedTheme={themeStore.theme === "dark"}>Dark</button>
            <button onclick={() => themeStore.setTheme("grey")} class:selectedTheme={themeStore.theme === "grey"}>Grey</button>
            <!--<button onclick={() => themeStore.setTheme("system")}>System</button>-->
        </div>
    </div>
</nav>

<style>
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0rem 1rem;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        border-radius: 0px;

        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;

        max-height: 3rem;
    }

    .title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary);
    }

    .theme-buttons {
        display: flex;
        gap: 0.5rem;

        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .theme {
        display: flex;
        flex-direction: row;

        align-items: center;
        gap: 0.5rem;
    }

    .menu {
        display: flex;
        flex-direction: row;

        align-items: center;
        gap: 0.5rem;
    }
    .menuTitle {
    }

    .menuOptions {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .selectedTheme {
        text-decoration: underline;
    }

    button {
        border: 0px solid var(--border);
        background: transparent;
        color: var(--text);
        cursor: pointer;

        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.08em;

        padding-bottom: 6px;
    }

    button:hover {
        /*
        border-color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
        color: color-mix(in srgb, var(--primary-hover) 50%, var(--text-muted));
        */
        text-decoration: underline;
    }
    button:active {
        /*
        border-color: var(--primary-hover);
        color: var(--primary-hover);
        */
        text-decoration: underline;
    }
</style>
