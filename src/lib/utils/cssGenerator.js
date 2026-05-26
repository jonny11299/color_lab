/**
 * cssGenerator.js
 *
 * Pure function: settings object -> formatted CSS stylesheet string.
 * No side effects, no stores, no DOM. Call it, get a string back.
 *
 *   import { generateCss, defaultSettings } from './cssGenerator.js';
 *   const css = generateCss(defaultSettings);
 */

/* ── Defaults ──────────────────────────────────────────────────────────────
 * Mirrors the previewSite props. `surface` is previewSite's `backgroundSubtle`,
 * renamed here to match its output variable (--surface).
 */
export const defaultSettings = {
	background: '#fafafa',
	surface: '#f0f0f5',
	text: '#1a1a2e',
	primary: '#5c6ac4',
	secondary: '#8892d4',
	accent: '#f49342',
	muteStrength: 1, // 0 = no muting, 1 = full muting
	typeScale: 1.333, // modular scale ratio
	borderWidth: 1, // px
	borderRadius: 10, // px
};

/* ── Color helpers ───────────────────────────────────────────────────────── */

/**
 * Parse a #rgb or #rrggbb hex string into {r, g, b}.
 * Falls back to black on anything unparseable so output never breaks.
 */
function hexToRgb(hex) {
	let h = String(hex).trim().replace(/^#/, '');
	if (h.length === 3) {
		h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
	}
	if (!/^[0-9a-fA-F]{6}$/.test(h)) {
		return { r: 0, g: 0, b: 0 };
	}
	return {
		r: parseInt(h.slice(0, 2), 16),
		g: parseInt(h.slice(2, 4), 16),
		b: parseInt(h.slice(4, 6), 16),
	};
}

/** Build an `rgba(...)` string from a hex color + alpha (0–1). */
function rgba(hex, alpha) {
	const { r, g, b } = hexToRgb(hex);
	return `rgba(${r}, ${g}, ${b}, ${round(alpha, 2)})`;
}

/* ── Math helpers ────────────────────────────────────────────────────────── */

/** Round to `places` decimals, returned as a Number. */
function round(value, places) {
	const f = 10 ** places;
	return Math.round(value * f) / f;
}

/**
 * Heading sizes from a modular scale.
 * h6 is the 1rem base; each step up multiplies by typeScale.
 * h6 = scale^0 ... h1 = scale^5. Rounded to one decimal, as rem.
 */
function headingSizes(typeScale) {
	const sizes = {};
	for (let level = 1; level <= 6; level++) {
		const exponent = 6 - level;
		sizes['h' + level] = round(typeScale ** exponent, 1).toFixed(1) + 'rem';
	}
	return sizes;
}

/* ── Generator ───────────────────────────────────────────────────────────── */

/**
 * Generate the formatted CSS stylesheet for the given settings.
 * @param {object} settings - partial settings; missing keys fall back to defaults.
 * @returns {string} the stylesheet.
 */
export function generateCss(settings = {}) {
	const s = { ...defaultSettings, ...settings };

	// Derived text levels — alpha scaled by muteStrength.
	// muteStrength 0 -> 1.0 alpha (no muting); 1 -> 0.55 / 0.35.
	const mutedAlpha = (100 - s.muteStrength * 45) / 100;
	const hintAlpha = (100 - s.muteStrength * 65) / 100;

	const textMuted = rgba(s.text, mutedAlpha);
	const textHint = rgba(s.text, hintAlpha);

	// Border tone: secondary at 45% — keeps structural color in the brand family.
	const border = rgba(s.secondary, 0.45);

	const bw = `${s.borderWidth}px`;
	const br = `${s.borderRadius}px`;
	const h = headingSizes(s.typeScale);

	return `/* ── Base variables ──────────────────────────────────── */
:root {
\t/* Surfaces */
\t--bg: ${s.background};
\t--surface: ${s.surface};

\t/* Text */
\t--text: ${s.text};
\t--text-muted: ${textMuted};
\t--text-hint: ${textHint};

\t/* Brand */
\t--primary: ${s.primary};
\t--secondary: ${s.secondary};
\t--accent: ${s.accent};

\t/* Structure */
\t--border: ${border};
\t--borderWidth: ${bw};
\t--borderRadius: ${br};
\t--typeScale: ${s.typeScale};

\t/* Fonts — edit freely */
\t--font-sans: sans-serif;
\t--font-mono: monospace;
}

html {
\tbackground-color: var(--bg);
}

body {
\tbackground-color: var(--bg);
\tcolor: var(--text);
\tfont-family: var(--font-sans);
\tmargin: 0;
}

/* ── Typography ──────────────────────────────────────── */
p {
\tmargin: 0 0 1rem;
}

.muted {
\tcolor: var(--text-muted);
}

a {
\tcolor: var(--primary);
\ttext-decoration: none;
}
a:hover {
\ttext-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
\tmargin: 0 0 0.5rem;
\tfont-weight: 700;
\tline-height: 1.2;
}
h1 { font-size: ${h.h1}; }
h2 { font-size: ${h.h2}; }
h3 { font-size: ${h.h3}; }
h4 { font-size: ${h.h4}; }
h5 { font-size: ${h.h5}; }
h6 { font-size: ${h.h6}; }

/* ── Components ──────────────────────────────────────── */
.container {
\tmax-width: 1080px;
\tmargin: 0 auto;
\tpadding: 0 2rem;
}

.nav {
\tdisplay: flex;
\talign-items: center;
\tgap: 2rem;
\tpadding: 1rem 2rem;
\tbackground-color: var(--bg);
\tborder-bottom: var(--borderWidth) solid var(--border);
}

.card {
\tbackground-color: var(--surface);
\tborder: var(--borderWidth) solid var(--border);
\tborder-radius: var(--borderRadius);
\tpadding: 1.5rem;
}

.btn {
\tdisplay: inline-block;
\tpadding: 0.6rem 1.2rem;
\tborder: var(--borderWidth) solid transparent;
\tborder-radius: var(--borderRadius);
\tfont-family: var(--font-sans);
\tfont-size: 1rem;
\tfont-weight: 600;
\tcursor: pointer;
}
.btn-primary {
\tbackground-color: var(--primary);
\tcolor: var(--bg);
}
.btn-ghost {
\tbackground-color: transparent;
\tcolor: var(--text);
\tborder-color: var(--secondary);
}

input,
textarea {
\tfont-family: var(--font-sans);
\tfont-size: 1rem;
\tcolor: var(--text);
\tbackground-color: var(--bg);
\tborder: var(--borderWidth) solid var(--border);
\tborder-radius: var(--borderRadius);
\tpadding: 0.6rem 0.8rem;
}
input:focus,
textarea:focus {
\toutline: var(--borderWidth) solid var(--primary);
}

.badge {
\tdisplay: inline-block;
\tpadding: 0.2rem 0.7rem;
\tborder-radius: var(--borderRadius);
\tbackground-color: var(--accent);
\tcolor: var(--bg);
\tfont-size: 0.8rem;
\tfont-weight: 600;
}

hr {
\tborder: none;
\tborder-top: var(--borderWidth) solid var(--border);
\tmargin: 1.5rem 0;
}
`;
}
