<script>
	import { generateCss, defaultSettings } from "$lib/utils/cssGenerator.js";

	/* Settings live here as the single source of truth. */
	let settings = $state({ ...defaultSettings });

	/* The output is just derived state — when settings change, this re-runs. */
	let css = $derived(generateCss(settings));

	/* The six color controls and the four numeric controls, described as data
	 * so the markup stays a simple loop rather than ten near-identical blocks. */
	const colorFields = [
		{ key: "background", label: "Background" },
		{ key: "surface", label: "Surface" },
		{ key: "text", label: "Text" },
		{ key: "primary", label: "Primary" },
		{ key: "secondary", label: "Secondary" },
		{ key: "accent", label: "Accent" },
	];

	const rangeFields = [
		{ key: "muteStrength", label: "Mute strength", min: 0, max: 1, step: 0.05 },
		{ key: "typeScale", label: "Type scale", min: 1, max: 1.6, step: 0.001 },
		{ key: "borderWidth", label: "Border width", min: 0, max: 8, step: 1, unit: "px" },
		{ key: "borderRadius", label: "Border radius", min: 0, max: 50, step: 1, unit: "px" },
	];

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

	function reset() {
		settings = { ...defaultSettings };
	}
</script>

<div class="editor">
	<aside class="controls">
		<div class="controls-head">
			<h2>Settings</h2>
			<button class="link-btn" onclick={reset}>Reset</button>
		</div>

		<div class="field-group">
			{#each colorFields as f}
				<label class="field field-color">
					<span class="field-label">{f.label}</span>
					<span class="color-wrap">
						<input type="color" bind:value={settings[f.key]} />
						<input class="hex-input" type="text" bind:value={settings[f.key]} spellcheck="false" />
					</span>
				</label>
			{/each}
		</div>

		<div class="field-group">
			{#each rangeFields as f}
				<label class="field field-range">
					<span class="field-label">
						{f.label}
						<span class="field-value">
							{settings[f.key]}{f.unit ?? ""}
						</span>
					</span>
					<input type="range" min={f.min} max={f.max} step={f.step} bind:value={settings[f.key]} />
				</label>
			{/each}
		</div>
	</aside>

	<section class="output">
		<div class="output-head">
			<h2>Generated CSS</h2>
			<div class="output-actions">
				<button class="btn" onclick={copyCss}>
					{copied ? "Copied" : "Copy"}
				</button>
				<button class="btn btn-solid" onclick={downloadCss}>Download .css</button>
			</div>
		</div>
		<pre class="code"><code>{css}</code></pre>
	</section>
</div>

<style>
	.editor {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 1px;
		background: #d8d8de;
		border: 1px solid #d8d8de;
		border-radius: 8px;
		overflow: hidden;
		font-family:
			system-ui,
			-apple-system,
			"Segoe UI",
			sans-serif;
		color: #1a1a2e;
		min-height: 540px;
	}

	h2 {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #5a5a6e;
	}

	.controls,
	.output {
		background: #fbfbfd;
	}

	/* ── Controls panel ─────────────────────────────────── */
	.controls {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.controls-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.link-btn {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-size: 0.78rem;
		color: #5c6ac4;
		cursor: pointer;
	}
	.link-btn:hover {
		text-decoration: underline;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.field-value {
		font-variant-numeric: tabular-nums;
		color: #8a8a9a;
		font-weight: 500;
	}

	/* Color row: swatch + hex text input */
	.color-wrap {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	input[type="color"] {
		inline-size: 38px;
		block-size: 32px;
		padding: 0;
		border: 1px solid #d8d8de;
		border-radius: 6px;
		background: none;
		cursor: pointer;
		flex-shrink: 0;
	}

	.hex-input {
		flex: 1;
		min-inline-size: 0;
		font-family: ui-monospace, "SF Mono", Menlo, monospace;
		font-size: 0.82rem;
		padding: 0.4rem 0.55rem;
		border: 1px solid #d8d8de;
		border-radius: 6px;
		background: #fff;
		color: #1a1a2e;
	}
	.hex-input:focus {
		outline: 2px solid #5c6ac4;
		outline-offset: -1px;
	}

	input[type="range"] {
		inline-size: 100%;
		accent-color: #5c6ac4;
		cursor: pointer;
	}

	/* ── Output panel ───────────────────────────────────── */
	.output {
		display: flex;
		flex-direction: column;
		min-inline-size: 0;
	}

	.output-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #ececf0;
	}

	.output-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.45rem 0.9rem;
		border: 1px solid #d8d8de;
		border-radius: 6px;
		background: #fff;
		color: #1a1a2e;
		cursor: pointer;
	}
	.btn:hover {
		border-color: #b8b8c2;
	}

	.btn-solid {
		background: #5c6ac4;
		border-color: #5c6ac4;
		color: #fff;
	}
	.btn-solid:hover {
		background: #4d5ab0;
		border-color: #4d5ab0;
	}

	.code {
		margin: 0;
		padding: 1.25rem;
		flex: 1;
		overflow: auto;
		background: #1a1a2e;
		color: #e4e4ec;
		font-family: ui-monospace, "SF Mono", Menlo, monospace;
		font-size: 0.8rem;
		line-height: 1.55;
		white-space: pre;
		tab-size: 2;
	}

	@media (max-width: 640px) {
		.editor {
			grid-template-columns: 1fr;
		}
	}
</style>
