// This code all sorts various hues and shades into neat little bins.

import chroma from "chroma-js";

// If a color's hue is more than this distance away (out of 360) from a bin's
// existing range, it gets placed in a new bin instead.
export const HUE_CUTOFF_DISTANCE = 20; // distance between hues that will make a cut
export const MAX_BIN_SIZE = 40; // hue range can't exceed MAX_BIN_SIZE degrees
export const GREY_THRESHOLD = 4 / 100; // if a color has less than GREY_THRESHOLD saturation, it's considered grey.

export const MAX_SMALLEST_BIN = 3; // any hueBin less than this size gets crammed into miscellaneous


const CSS_COLORS = {
    alice_blue: '#f0f8ff', antique_white: '#faebd7', aqua: '#00ffff', aquamarine: '#7fffd4',
    azure: '#f0ffff', beige: '#f5f5dc', bisque: '#ffe4c4',
    blanched_almond: '#ffebcd', blue: '#0000ff', blue_violet: '#8a2be2',
    brown: '#a52a2a', burlywood: '#deb887', cadet_blue: '#5f9ea0',
    chartreuse: '#7fff00', chocolate: '#d2691e', coral: '#ff7f50',
    corn_silk: '#fff8dc', cornflower_blue: '#6495ed', crimson: '#dc143c',
    cyan: '#00ffff', dark_blue: '#00008b', dark_cyan: '#008b8b',
    dark_goldenrod: '#b8860b', dark_green: '#006400', dark_khaki: '#bdb76b',
    dark_magenta: '#8b008b', dark_olive_green: '#556b2f', dark_orange: '#ff8c00',
    dark_orchid: '#9932cc', dark_red: '#8b0000', dark_salmon: '#e9967a',
    dark_sea_green: '#8fbc8f', dark_slate: '#2f4f4f', dark_slate_blue: '#483d8b',
    dark_turquoise: '#00ced1', dark_violet: '#9400d3', deep_pink: '#ff1493',
    deep_sky_blue: '#00bfff', dodger_blue: '#1e90ff', firebrick: '#b22222',
    forest_green: '#228b22', fuchsia: '#ff00ff', gold: '#ffd700',
    goldenrod: '#daa520', green: '#008000', green_yellow: '#adff2f',
    honeydew: '#f0fff0', hot_pink: '#ff69b4', indian_red: '#cd5c5c',
    indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
    lavender: '#e6e6fa', lavender_blush: '#fff0f5', lawn_green: '#7cfc00',
    lemon_chiffon: '#fffacd', light_blue: '#add8e6', light_coral: '#f08080',
    light_cyan: '#e0ffff', light_goldenrod_yellow: '#fafad2', light_green: '#90ee90',
    light_pink: '#ffb6c1', light_salmon: '#ffa07a', light_sea_green: '#20b2aa',
    light_sky_blue: '#87cefa', light_slate: '#778899', light_steel_blue: '#b0c4de',
    light_yellow: '#ffffe0', lime: '#00ff00', lime_green: '#32cd32',
    linen: '#faf0e6', magenta: '#ff00ff', maroon: '#800000',
    medium_aquamarine: '#66cdaa', medium_blue: '#0000cd', medium_orchid: '#ba55d3',
    medium_purple: '#9370db', medium_sea_green: '#3cb371', medium_slate_blue: '#7b68ee',
    medium_spring_green: '#00fa9a', medium_turquoise: '#48d1cc', medium_violet_red: '#c71585',
    midnight_blue: '#191970', mint_cream: '#f5fffa', misty_rose: '#ffe4e1',
    moccasin: '#ffe4b5', navajo_white: '#ffdead', navy: '#000080',
    old_lace: '#fdf5e6', olive: '#808000', olive_drab: '#6b8e23',
    orange: '#ffa500', orange_red: '#ff4500', orchid: '#da70d6',
    pale_goldenrod: '#eee8aa', pale_green: '#98fb98', pale_turquoise: '#afeeee',
    pale_violet_red: '#db7093', papaya_whip: '#ffefd5', peach_puff: '#ffdab9',
    peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd',
    powder_blue: '#b0e0e6', purple: '#800080', rebecca_purple: '#663399',
    red: '#ff0000', rosy_brown: '#bc8f8f', royal_blue: '#4169e1',
    saddle_brown: '#8b4513', salmon: '#fa8072', sandy_brown: '#f4a460',
    sea_green: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d',
    sky_blue: '#87ceeb', slate: '#708090', slate_blue: '#6a5acd',
    snow: '#fffafa', spring_green: '#00ff7f', steel_blue: '#4682b4',
    tan: '#d2b48c', teal: '#008080', thistle: '#d8bfd8',
    tomato: '#ff6347', turquoise: '#40e0d0', violet: '#ee82ee',
    wheat: '#f5deb3', yellow: '#ffff00', yellow_green: '#9acd32'
};



// Names a bin by the most common ("mode") nearest-CSS-name among its members.
// Every swatch votes for its closest CSS color by perceptual distance; the
// name with the most votes wins. Ties break toward the more chromatic swatch's
// vote, so a vivid member outweighs a pale near-miss.
export function getClosestName(set) {
    if (!set || set.length === 0) return null;

    const nearestName = (hex) => {
        let name = null, best = Infinity;
        for (const [colorName, ref] of Object.entries(CSS_COLORS)) {
            const d = chroma.deltaE(hex, ref);
            if (d < best) { best = d; name = colorName; }
        }
        return name;
    };

    // Tally votes; track each name's best chroma for tie-breaking.
    const votes = new Map(); // name -> { count, topChroma }
    for (const hex of set) {
        const name = nearestName(hex);
        const c = chroma(hex).get('lch.c');
        const v = votes.get(name);
        if (v) { v.count++; v.topChroma = Math.max(v.topChroma, c); }
        else votes.set(name, { count: 1, topChroma: c });
    }

    let winner = null, bestCount = -1, bestChroma = -1;
    for (const [name, { count, topChroma }] of votes) {
        if (count > bestCount || (count === bestCount && topChroma > bestChroma)) {
            winner = name; bestCount = count; bestChroma = topChroma;
        }
    }
    return winner;
}





// Names a bin after its most chromatic, not-too-extreme member.
function getClosestName_mostChromatic(set) {
    if (!set || set.length === 0) return null;

    // Pick the representative: highest chroma, lightly penalizing very
    // light/dark swatches so a vivid mid-tone wins over a pale or near-black one.
    let rep = set[0], bestScore = -Infinity;
    for (const hex of set) {
        const [, , l] = chroma(hex).hsl();
        const c = chroma(hex).get('lch.c');          // perceptual chroma
        const score = c - 40 * Math.abs(l - 0.5);     // penalty for extreme lightness
        if (score > bestScore) { bestScore = score; rep = hex; }
    }

    // Nearest CSS name to the representative, by perceptual distance.
    let name = null, best = Infinity;
    for (const [colorName, hex] of Object.entries(CSS_COLORS)) {
        const d = chroma.deltaE(rep, hex);
        if (d < best) { best = d; name = colorName; }
    }
    return name;
}





/**
 * Sorts color swatches into hue bins, grouping perceptually related hues.
 * Greys/near-greys (saturation < GREY_THRESHOLD, or undefined hue) are routed
 * out into greyScaleBin and never participate in hue binning.
 *
 * Chromatic colors are placed on a ring, cut wherever neighbors are more than
 * `hueCutoffDistance` apart, and any bin wider than `maxBinSize` is recursively
 * split at its largest interior gap. The 359->0 seam is handled implicitly by
 * unwrapping the ring at its emptiest point (the largest gap), so a cluster
 * straddling red stays intact.
 *
 * I was in a time crunch, so I had Claude rebuild my own hue sorter.
 * 
 * @returns {{ hueBins: string[][], greyScaleBin: string[] }}
 *          hueBins: each bin is an array of hex strings, ordered by hue;
 *          bins themselves are ordered around the wheel.
 */
export function sortIntoHueBins(
    swatchesIncoming,
    hueCutoffDistance = HUE_CUTOFF_DISTANCE,
    maxBinSize = MAX_BIN_SIZE
) {
    const greyScaleBin = [];
    const chromatic = []; // { hex, hue }

    // 1. Route greys out by chroma; keep each chromatic color's hue.
    for (const s of swatchesIncoming) {
        const [hue, sat] = chroma(s.hex).hsl();
        if (Number.isNaN(hue) || sat < GREY_THRESHOLD) {
            greyScaleBin.push(s.hex);
        } else {
            chromatic.push({ hex: s.hex, hue });
        }
    }

    if (chromatic.length === 0) return { hueBins: [], greyScaleBin };

    // 2. Sort by hue.
    chromatic.sort((a, b) => a.hue - b.hue);
    const n = chromatic.length;

    // 3. Circular gaps. gap from i to its ring-neighbor; index n-1 is the seam gap.
    const circGap = (from, to) => (to - from + 360) % 360;
    let maxGapIdx = 0, maxGap = -1;
    for (let i = 0; i < n; i++) {
        const g = circGap(chromatic[i].hue, chromatic[(i + 1) % n].hue);
        if (g > maxGap) { maxGap = g; maxGapIdx = i; }
    }

    // 4. Rotate so the sequence starts right after the largest gap. The emptiest
    //    part of the wheel becomes the seam, so no bin straddles it, and we can
    //    unwrap into a monotonically increasing hue list.
    const start = (maxGapIdx + 1) % n;
    const order = [];      // hex, in ring order
    const unwrapped = [];  // increasing hue values
    for (let k = 0; k < n; k++) {
        const idx = (start + k) % n;
        let u = chromatic[idx].hue;
        if (k > 0) while (u < unwrapped[k - 1]) u += 360;
        order.push(chromatic[idx].hex);
        unwrapped.push(u);
    }
    const gapAt = (k) => unwrapped[k + 1] - unwrapped[k]; // k in [0, n-2]

    // 5. Initial cut: split wherever an interior gap exceeds the cutoff.
    //    Bins are inclusive index ranges [lo, hi] into `order` / `unwrapped`.
    const bins = [];
    let runStart = 0;
    for (let k = 0; k < n - 1; k++) {
        if (gapAt(k) > hueCutoffDistance) { bins.push([runStart, k]); runStart = k + 1; }
    }
    bins.push([runStart, n - 1]);

    // 6. Width cap: recursively split any bin wider than maxBinSize at its largest
    //    interior gap. Ties break toward the bin's center, so a uniform spread
    //    bisects evenly instead of peeling one swatch at a time.
    const span = ([lo, hi]) => unwrapped[hi] - unwrapped[lo];
    const finalBins = [];
    const stack = [...bins];
    const EPS = 1e-9;
    while (stack.length) {
        const [lo, hi] = stack.pop();
        if (lo === hi || span([lo, hi]) <= maxBinSize) { finalBins.push([lo, hi]); continue; }
        const mid = (unwrapped[lo] + unwrapped[hi]) / 2;
        let bestK = lo, bestGap = -1, bestDist = Infinity;
        for (let k = lo; k < hi; k++) {
            const g = gapAt(k);
            const dist = Math.abs((unwrapped[k] + unwrapped[k + 1]) / 2 - mid);
            if (g > bestGap + EPS || (Math.abs(g - bestGap) <= EPS && dist < bestDist)) {
                bestGap = g; bestK = k; bestDist = dist;
            }
        }
        stack.push([bestK + 1, hi]);
        stack.push([lo, bestK]);
    }

    // 7. Order bins around the wheel, emit as arrays of hex strings.
    finalBins.sort((a, b) => a[0] - b[0]);
    let hueBins = finalBins.map(([lo, hi]) => ({
        min: ((unwrapped[lo] % 360) + 360) % 360,
        max: ((unwrapped[hi] % 360) + 360) % 360,
        set: order.slice(lo, hi + 1),
    }));



    // ------- AT THIS POINT, hue sorting algorithm is done -- the rest is cleanup. -------



    /*
    // sort each set from lightest to darkest
    hueBins.forEach((bin) => {
        bin.set.sort((a, b) => chroma(b).luminance() - chroma(a).luminance());
        bin.name = getClosestName(bin.set);
    });
    */

    // sort each bin from lightest to darkest, marking outliers in lightness and saturation.
    hueBins.forEach((bin) => {
        bin.set.sort((a, b) => chroma(b).luminance() - chroma(a).luminance());
        bin.name = getClosestName(bin.set);

        // describe the bin's range so the UI can show structure without re-binning
        const ls = bin.set.map(h => chroma(h).get('hsl.l'));   // lightness 0..1
        const ss = bin.set.map(h => chroma(h).get('hsl.s'));   // saturation 0..1
        bin.lightest = bin.set[0];                              // already sorted light->dark
        bin.darkest = bin.set[bin.set.length - 1];
        bin.mostSaturated = bin.set.reduce((a, b) =>
            chroma(b).get('hsl.s') > chroma(a).get('hsl.s') ? b : a);
        bin.lightnessSpread = Math.max(...ls) - Math.min(...ls);
        bin.saturationSpread = Math.max(...ss) - Math.min(...ss);
    });


    // Merge undersized bins into a single 'misc' bin — but only if at least one
    // bin actually cleared the threshold. If every bin is small, there's no
    // "real" bin to contrast against, so we leave them all alone and let them
    // keep their own names rather than collapsing the whole palette into misc.
    const hasLargeBin = hueBins.some((bin) => bin.set.length >= MAX_SMALLEST_BIN);

    if (hasLargeBin) {
        const smallBins = hueBins.filter((bin) => bin.set.length < MAX_SMALLEST_BIN);
        const keptBins = hueBins.filter((bin) => bin.set.length >= MAX_SMALLEST_BIN);

        if (smallBins.length > 1) {
            // Pool colors, tagging each with its own name so labels survive the re-sort.
            const miscColors = smallBins.flatMap((bin) =>
                bin.set.map((hex) => ({ hex, name: getClosestName([hex]) }))
            );
            miscColors.sort((a, b) => chroma(b.hex).luminance() - chroma(a.hex).luminance());

            const miscSet = miscColors.map((c) => c.hex);
            const names = [...new Set(miscColors.map((c) => c.name))]; // dedup, now in luminance order

            keptBins.push({
                min: null,
                max: null,
                set: miscSet,
                colors: miscColors,   // [{hex, name}] — per-swatch names that match positions
                name: `misc (${names.join(', ')})`,
                isMisc: true,
            });
        } else if (smallBins.length === 1) {
            // Exactly one undersized bin — no point calling it "misc"; keep its name.
            keptBins.push(smallBins[0]);
        }

        hueBins = keptBins;
    }
    // else: no bin cleared the threshold, so leave hueBins untouched.



    // remove the hue from the flattened greyscale bin
    const greyScaleFlattened = greyScaleBin.map((g) => {
        const [h, , l] = chroma(g).hsl();
        return chroma.hsl(Number.isNaN(h) ? 0 : h, 0, l).hex();
    });

    return { hueBins, greyScaleBin, greyScaleFlattened };
}




// First draft of the algorithm worked fairly well, but not great.
// it was a greedy algorithm that made bins based on who came first. (that's a redundant sentence...)
// the main flaw was that, in trying to fix the 359* to 0* seam, I extended the distance, but didn't group those colors together effectively.
// Sometimes similar colors would be grouped in way different containers,
// and some containers were way too wide. 
export function DEPRECATED_sortIntoHueBins(swatches, hueCutoffDistance = HUE_CUTOFF_DISTANCE) {
    // print the hues:
    // swatches.forEach((s) => console.log(`${chroma(s).hex()}: ${chroma(s).hsl()}`));
    let hueBins = [];
    let greyScaleBin = [];
    swatches.forEach((s) => {
        const c = chroma(s).hsl();
        let h = c[0];
        console.log(h);

        if (Number.isNaN(h)) {
            greyScaleBin.push(s.hex);
        } else {
            let originalHue = h;
            // look for a bin to place this in; one within the bounds [(max - hueCutoffDistance), (min + hueCutoffDistance)]
            const myBin = hueBins.find((bin) => {
                // old return statement that creates a seam from h = 359 to h = 0: 
                // return h >= bin.max - hueCutoffDistance && h <= bin.min + hueCutoffDistance;

                // seamless return block: 
                // (by seamless, I mean it accounts for the hue seam at 359 to 0, where those colors are near-identical but numerically distant.)
                if (h >= bin.max - hueCutoffDistance && h <= bin.min + hueCutoffDistance) {
                    return true;
                } else {
                    h = originalHue + 360;
                    if (h >= bin.max - hueCutoffDistance && h <= bin.min + hueCutoffDistance) {
                        return true;
                    } else {
                        h = originalHue - 360;
                        return h >= bin.max - hueCutoffDistance && h <= bin.min + hueCutoffDistance;
                    }
                }
            });
            if (myBin) {
                // found a corresponding bin, so place this hue in the bin and adjust the min/max values if necessary.
                myBin.set.push(s.hex);
                myBin.min = Math.min(h, myBin.min);
                myBin.max = Math.max(h, myBin.max);
            } else {
                // did not find an existing bin with a range close enough to my hue, so let's make a new bin.
                hueBins.push({
                    min: h,
                    max: h,
                    set: [s.hex]
                });
            }

            h = originalHue;
        }
    });

    // let's sort the bins by hue
    // first, normalize hue to 0 - 360
    hueBins.forEach((bin) => {
        bin.min = (bin.min + 720) % 360;
        bin.max = (bin.max + 720) % 360;
    });
    // sort
    hueBins.sort((a, b) => a.min - b.min);

    console.log("----- Completed sorting hues into bins. Here's our results: -----");
    console.log(hueBins);
    console.log("--- and here's our greyscale bin ---");
    console.log(greyScaleBin);

    return { hueBins, greyScaleBin };
}