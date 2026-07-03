<!-- Export panel styled as a simple text editor (TextEdit-ish). -->
<!-- Renders CSS from generateCss(settings); copy / download. -->

<script>
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { generateCss } from "$lib/utils/cssGenerator.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { paramStore } from "$lib/stores/paramStore.svelte.js";

    // stores are the source of truth
    let settings = $derived({
        ...colorStore.colorSettings,
        ...paramStore.paramSettings,
    });

    let css = $derived(generateCss(settings));

    // one entry per logical line, for the gutter
    let lines = $derived(css.split("\n"));

    // escape for safe HTML rendering, then wrap /* ... */ comments in a span so they can be colored
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    let highlightedCss = $derived.by(() => {
        const escaped = escapeHtml(css);
        return escaped.replace(/\/\*[\s\S]*?\*\//g, (match) => `<span class="comment">${match}</span>`);
    });

    let copied = $state(false);
    let copyTimer;

    async function copyCss() {
        try {
            await navigator.clipboard.writeText(css);
            copied = true;
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => (copied = false), 1600);
        } catch {
            copied = false;
        }
    }

    function downloadCss() {
        const blob = new Blob([css], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "styles.css";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function close() {
        phaseStore.setExportState(false);
    }
</script>

<div class="toolbar">
    <button class="actionBtn" onclick={copyCss} aria-label="Copy all CSS" type="button">
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>{copied ? "Copied" : "Copy All"}</span>
    </button>
    <button class="actionBtn" onclick={downloadCss} aria-label="Download CSS file" type="button">
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 3v12" />
            <polyline points="7 10 12 15 17 10" />
            <path d="M4 19h16" />
        </svg>
        <span>Download</span>
    </button>
</div>

<div class="editor">
    <div class="titlebar">
        <div class="filename">styles.css</div>
    </div>

    <div class="body">
        <div class="gutter" aria-hidden="true">
            {#each lines as _, i}
                <div class="lineNo">{i + 1}</div>
            {/each}
        </div>
        <pre class="code">{@html highlightedCss}</pre>
    </div>
</div>

<style>
    /* --- toolbar (copy / download) --- */
    .toolbar {
        display: flex;
        gap: 0.75rem;
        margin: 2rem 2rem 0.75rem;
        max-width: 50rem;
        align-self: center;
    }

    .actionBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.4rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--bradius);
        color: var(--text-muted);
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition:
            color var(--transition-time),
            border-color var(--transition-time);
    }

    .actionBtn:hover {
        color: var(--primary-hover);
        border-color: var(--primary-hover);
    }

    .actionBtn:active {
        transform: scale(0.95);
    }

    /* --- editor window --- */
    .editor {
        width: auto;
        border: 1px solid var(--border);
        background-color: var(--surface);
        border-radius: var(--bradius);
        overflow: hidden; /* clip the code pane to the rounded corners */
        display: flex;
        flex-direction: column;

        margin: 2rem;
        max-width: 50rem;
        align-self: center;
    }

    /* --- title bar / window chrome --- */
    .titlebar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--border);
        background-color: var(--surface);
    }

    .filename {
        flex: 1;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.85rem;
        letter-spacing: 0.02em;
    }

    /* --- code pane --- */
    .body {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        overflow: scroll;
        background-color: var(--bg);
        min-height: 60vh;
        max-height: 70vh;

        --line-h: 1.5rem;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        font-size: 0.8rem;
    }

    .gutter {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        padding: 0.75rem 0.6rem 0.75rem 0.75rem;
        text-align: right;
        color: var(--text-muted);
        background-color: var(--bg);
        border-right: 1px solid var(--border);
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
    }
    .lineNo {
        height: var(--line-h);
        line-height: var(--line-h);
    }

    .code {
        flex: 1 1 auto;
        margin: 0;
        padding: 0.75rem 1rem;
        line-height: var(--line-h);
        color: var(--text);
        white-space: pre; /* no wrapping -> gutter stays aligned */
        tab-size: 2;
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
    }

    /* comments injected via {@html} aren't scoped, so :global is required here */
    .code :global(.comment) {
        color: var(--primary-hover);
    }
</style>
