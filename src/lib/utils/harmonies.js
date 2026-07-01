// harmonies.js
// Generate harmonious color rows from a single seed color, for the "browse"
// side of the color picker. Mirrors the { name, set } row shape that
// Palette.svelte already renders, so the picker tab can reuse the same layout.
//
// All generation happens in LCH (or Lab) so steps are perceptually even. HSL
// ramps look lumpy next to your From-Image rows because HSL "lightness" and
// "saturation" are not perceptually uniform across hues; LCH is.

import chroma from "chroma-js";

export const STEPS_PER_ROW = 13;

// Reference colors for the temperature ramp: a cool blue and a warm amber.
// We mix the seed toward these (in Lab) to cool/warm it, then restore the
// seed's lightness so the row stays at constant perceived brightness — which
// keeps it visually even, like the LCH ramps. Retune these to taste.
const COOL_REF = "#3b6ea5";
const WARM_REF = "#e8913a";
const MAX_TEMP_MIX = 0.35; // how far toward the ref we push at the ramp's ends

const APCA_THRESHOLD = 45; // |APCA Lc| a swatch must exceed on BOTH backgrounds

const norm360 = (h) => ((h % 360) + 360) % 360;

// Largest in-gamut LCH chroma at a given L and H (binary search on .clipped()).
// Used so the saturation ramp ends at the most saturated color that actually
// exists in sRGB, instead of wasting swatches on clipped repeats.
function maxChroma(l, h) {
    let lo = 0, hi = 150; // sRGB max chroma sits well under 150 for every hue
    for (let i = 0; i < 25; i++) {
        const mid = (lo + hi) / 2;
        if (chroma.lch(l, mid, h).clipped()) hi = mid;
        else lo = mid;
    }
    return lo;
}

// A lightness ramp at fixed hue/chroma: L from 100 down to 0. Because chroma is
// held at the seed's value, the extreme swatches go out of gamut and chroma-js
// clips them PER CHANNEL — so for a saturated seed the top cap is a clamped
// light tint (not pure white) and the bottom is a near-black (often faintly
// tinted, not pure #000). Don't rely on these caps being neutral.
function lightnessRamp(h, c, n = STEPS_PER_ROW) {
    const out = [];
    for (let i = 0; i < n; i++) {
        const l = (1 - i / (n - 1)) * 100;
        out.push(chroma.lch(l, c, norm360(h)).hex());
    }
    return out;
}

// A chroma ramp at fixed hue/lightness: from grey (C=0) up to the most
// saturated in-gamut color at that L/H. No swatch is a wasted, clipped repeat.
function saturationRamp(l, h, n = STEPS_PER_ROW) {
    const cMax = maxChroma(l, norm360(h));
    const out = [];
    for (let i = 0; i < n; i++) {
        const c = (i / (n - 1)) * cMax;
        out.push(chroma.lch(l, c, norm360(h)).hex());
    }
    return out;
}

// Cool -> warm at constant lightness. Negative t pushes the seed toward
// COOL_REF, positive toward WARM_REF; we then force L back to the seed's L so
// the row reads as "the same color, warmer/cooler" rather than drifting in
// brightness. Center swatch (t = 0) is exactly the seed.
function temperatureRamp(seedHex, n = STEPS_PER_ROW) {
    const seedL = chroma(seedHex).get("lch.l");
    const out = [];
    for (let i = 0; i < n; i++) {
        const t = (i / (n - 1)) * 2 - 1; // -1 .. +1
        const ref = t < 0 ? COOL_REF : WARM_REF;
        const amt = Math.abs(t) * MAX_TEMP_MIX;
        const mixed = chroma.mix(seedHex, ref, amt, "lab").set("lch.l", seedL);
        out.push(mixed.hex());
    }
    return out;
}

// Worst-case APCA readability of one candidate against both backgrounds: the
// smaller of the two |Lc| values. Using the min means "passes" == readable on
// EITHER background, not just the easier one. APCA is signed (sign = which is
// lighter); we only care about magnitude, so abs both.
function readabilityScore(hex, bg1, bg2) {
    return Math.min(
        Math.abs(chroma.contrastAPCA(hex, bg1)),
        Math.abs(chroma.contrastAPCA(hex, bg2)),
    );
}

// From a row's swatches, the ones clearing `threshold`, ranked most-readable
// first, capped at `limit`. Empty array if none pass — which is the point:
// a row that can't contribute a readable swatch contributes nothing.
function pickReadable(set, bg1, bg2, threshold, limit) {
    return set
        .map((hex) => ({ hex, score: readabilityScore(hex, bg1, bg2) }))
        .filter((s) => s.score > threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.hex);
}

// Build one flat, readable-on-both selection by pulling from the ALREADY-BUILT
// harmony rows (no regeneration): up to 3 from Shades, the best cool and best
// warm end of the temperature ramp, then the best single swatch from each
// remaining row — each only if it actually clears APCA on both backgrounds.
// Nothing readable anywhere -> empty set, so the absence of swatches is the
// signal to the user that no readable near-color exists.
function readableSet(rows, bg1, bg2, threshold = APCA_THRESHOLD) {
    const byName = (name) => rows.find((r) => r.name === name)?.set ?? [];
    const picks = [];

    // Up to 3 most-readable shades of the seed's own lightness ramp.
    picks.push(...pickReadable(byName("Shades"), bg1, bg2, threshold, 3));

    // Best cool end + best warm end of the temperature ramp. The center swatch
    // (t = 0, the seed itself) is neither, so it's excluded from both halves.
    const temp = byName("Cool → Warm");
    const mid = Math.floor(temp.length / 2);
    picks.push(...pickReadable(temp.slice(0, mid), bg1, bg2, threshold, 1)); // cool
    picks.push(...pickReadable(temp.slice(mid + 1), bg1, bg2, threshold, 1)); // warm

    // Best single passer from each remaining row, in row order.
    for (const name of [
        "Saturation",
        "Analogous −30°",
        "Analogous +30°",
        "Complementary",
        "Split-Comp +150°",
        "Split-Comp −150°",
        "Triadic +120°",
        "Triadic −120°",
    ]) {
        picks.push(...pickReadable(byName(name), bg1, bg2, threshold, 1));
    }

    // Dedup exact repeats (rows can share a near-identical dark cap) while
    // preserving order and the possibility of an empty result.
    return { name: "Readable on both", set: [...new Set(picks)] };
}

/**
 * Build the full set of harmony rows from one seed color.
 *
 * @param {string} seedHex  e.g. "#4682b4"
 * @param {{ bg1?: string, bg2?: string }} [opts]
 *        bg1/bg2: background hexes for the "Readable" row. If either is missing,
 *        that row is omitted.
 * @returns {Array<{ name: string, set: string[] }>}
 *          Same shape Palette.svelte renders. Names are display-ready (spaces,
 *          &, °), so render `b.name` directly — skip the "_"->" " + plural "s"
 *          hack used for the image bins.
 */
export function generateHarmonies(seedHex, { bg1, bg2 } = {}) {
    const seed = chroma(seedHex);
    const L = seed.get("lch.l");
    const C = seed.get("lch.c");
    let H = seed.get("lch.h");
    if (Number.isNaN(H)) H = 0; // grey seed: hue-based rows degenerate, but L ramps still work

    const rows = [
        // Main: the seed itself, along its lightness, saturation, and temperature axes.
        { name: "Shades", set: lightnessRamp(H, C) },
        { name: "Saturation", set: saturationRamp(L, H) },
        { name: "Cool → Warm", set: temperatureRamp(seedHex) },

        // Near-hue: analogous flanks ±30° from the seed. (The base-hue row is
        // omitted — it's identical to Tints & Shades by construction.)
        { name: "Analogous −30°", set: lightnessRamp(H - 30, C) },
        { name: "Analogous +30°", set: lightnessRamp(H + 30, C) },

        // Complementary: the opposite hue.
        { name: "Complementary", set: lightnessRamp(H + 180, C) },

        // Split-complementary: the two hues flanking the complement, ±150°.
        { name: "Split-Comp +150°", set: lightnessRamp(H + 150, C) },
        { name: "Split-Comp −150°", set: lightnessRamp(H - 150, C) },

        // Triadic: the two hues evenly spaced from the seed, ±120°.
        { name: "Triadic +120°", set: lightnessRamp(H + 120, C) },
        { name: "Triadic −120°", set: lightnessRamp(H - 120, C) },
    ];

    // Readability: the best readable-on-both swatches drawn from the rows above.
    if (bg1 && bg2) {
        rows.push(readableSet(rows, bg1, bg2));
    }

    return rows;
}

// ---------------------------------------------------------------------------
// On the table for later (carried over from the design discussion):
//   - Tetradic / square harmony (H+90 / +180 / +270)
//   - Double-complementary
//   - Monochromatic with slight hue drift (warming/cooling as L changes)
//   - Temperature *pairs* (warm vs. cool of the same hue, side by side)
//   - A full WCAG AA/AAA contrast matrix (not just a pass/fail row)
//   - Optional: import getClosestName from hueBins.js to suffix row names with
//     a color name, e.g. "Complementary (orange)" via getClosestName([hex]).
// ---------------------------------------------------------------------------