<script>
    import { themeStore } from "$lib/stores/theme.svelte.js";
</script>

<nav>
    <span class="title"><h1>Color Lab</h1></span>

    <div class="theme-buttons">
        <button onclick={() => themeStore.setTheme("light")}>Light</button>
        <button onclick={() => themeStore.setTheme("dark")}>Dark</button>
        <button onclick={() => themeStore.setTheme("system")}>System</button>
    </div>

    <p>Current: {themeStore.theme}</p>
</nav>

<style>
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0rem 2rem;
        background: var(--bg);
        border-bottom: 2px solid var(--border);
        border-radius: 0px;
    }

    .title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary);
    }

    .theme-buttons {
        display: flex;
        gap: 0.5rem;
    }

    button {
        padding: 0.25rem 0.75rem;
        border: 2px solid var(--border);
        border-radius: 4px;
        background: transparent;
        color: var(--text);
        cursor: pointer;
    }

    button:hover {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
    }
</style>
