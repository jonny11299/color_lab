<script>
    import chroma from "chroma-js";

    let { hexVal } = $props();

    let rgbVal = $derived.by(() => {
        return `${chroma(hexVal).rgb()}`;
    });
    let hslVal = $derived.by(() => {
        const [h, s, l] = chroma(hexVal).hsl();
        return `${Math.round(h || 0)}°, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%`;
    });
    let labVal = $derived.by(() => {
        const [l, a, b] = chroma(hexVal).lab();
        return `${l.toFixed(1)}, ${a.toFixed(1)}, ${b.toFixed(1)}`;
    });

    let copiedHexText = $state("");

    function copyHex() {
        navigator.clipboard.writeText(hexVal);
        copiedHexText = `(Copied)`;
        setTimeout(() => (copiedHexText = ""), 2000);
    }
</script>

<div class="readoutGrid">
    <span class="labelUnderlinable" onclick={() => copyHex()}>Hex</span><span class="valueUnderlinable" onclick={() => copyHex()}
        >{hexVal}{` ${copiedHexText}`}</span
    >
    <span class="label">RGB</span><span class="value">{rgbVal}</span>
    <span class="label">HSL</span><span class="value">{hslVal}</span>
    <span class="label">LAB</span><span class="value">{labVal}</span>
</div>

<style>
    .readoutGrid {
        display: grid;
        grid-template-columns: auto 1fr;
        border: 2px solid var(--text);
        border-radius: 4px;
        overflow: scroll;
        font-family: monospace;
        font-size: 14px;
        width: fit-content;

        align-self: flex-start;
        justify-self: center;
    }

    .readoutGrid .label {
        padding: 0.3rem 0.8rem;
        color: var(--text-muted);
        border-right: 2px solid var(--text);
        border-bottom: 2px solid var(--text);
    }

    .readoutGrid .value {
        padding: 0.3rem 0.8rem;
        border-bottom: 2px solid var(--text);
    }

    .readoutGrid span:nth-last-child(1),
    .readoutGrid span:nth-last-child(2) {
        border-bottom: none;
    }

    .labelUnderlinable {
        padding: 0.3rem 0.8rem;
        color: var(--text-muted);
        border-right: 2px solid var(--text);
        border-bottom: 2px solid var(--text);
    }
    .labelUnderlinable:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .valueUnderlinable {
        padding: 0.3rem 0.8rem;
        border-bottom: 2px solid var(--text);
    }
    .valueUnderlinable:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .copiedHex {
        margin-left: 0.5rem;
        font-weight: normal;
        text-transform: none;
    }
</style>
