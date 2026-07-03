<!-- Export panel styled as a simple text editor (TextEdit-ish). -->
<!-- Renders CSS from generateCss(settings); copy / download; close via the red light. -->

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

<div class="editor">
    <div class="titlebar">
        <div class="lights">
            <button class="light close" aria-label="Close export" title="Close" onclick={close}></button>
            <span class="light amber"></span>
            <span class="light green"></span>
        </div>

        <div class="filename">styles.css</div>

        <div class="actions">
            <button class="action" onclick={copyCss}>{copied ? "copied" : "copy"}</button>
            <button class="action" onclick={downloadCss}>download</button>
        </div>
    </div>

    <div class="body">
        <div class="gutter" aria-hidden="true">
            {#each lines as _, i}
                <div class="lineNo">{i + 1}</div>
            {/each}
        </div>
        <pre class="code">{css}</pre>
    </div>
</div>

<style>
    .editor {
        width: 100%;
        border: 1px solid var(--border);
        background-color: var(--surface);
        border-radius: var(--bradius);
        overflow: hidden; /* clip the code pane to the rounded corners */
        display: flex;
        flex-direction: column;

        margin: 1rem;
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

    .lights {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
    .light {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        border: none;
        padding: 0;
    }
    .light.close {
        background: #ff5f57;
        cursor: pointer;
    }
    .light.close:hover {
        filter: brightness(0.9);
    }
    .light.amber {
        background: #febc2e;
    }
    .light.green {
        background: #28c840;
    }

    .filename {
        flex: 1;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.85rem;
        letter-spacing: 0.02em;
    }

    .actions {
        display: flex;
        gap: 0.9rem;
    }
    .action {
        background: none;
        border: none;
        padding: 0;
        color: var(--text);
        font-size: 0.85rem;
        cursor: pointer;
    }
    .action:hover {
        text-decoration: underline;
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

    /* gutter stays pinned while long lines scroll horizontally */
    .gutter {
        position: sticky;
        left: 0;
        z-index: 1;
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
</style>
