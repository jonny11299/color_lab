import chroma from "chroma-js";
import { sortIntoHueBins } from "../utils/hueBins.js";

function createImageStore() {
    let status = $state('idle');      // 'idle' | 'processing' | 'done' | 'error'
    let progress = $state(0);         // 0-100 (float)
    let swatches = $state([]);        // the color swatches, an array of { r: 255, g: 120, b: 80, hex: '#ff7850' }
    let dimensions = $state(null);    // { width, height }
    let error = $state(null);

    let maxColorsToExtract = 250; // max number of colors loaded into the palette. No need to $state for now, unless we want to adjust in-program
    let binWidth = $state(30); // The length of a color cube for sorting. Will be visible once I wire in three.js, or "threlte" as it's ported for Svelte

    let greyScaleBin = $state([]); // for placing colors with very small hue
    let greyScaleFlattened = $state([]); // for placing colors with no hue
    let hueBins = $state([]);      // for placing bins of hues

    // recomputes hueBins / greyScaleBin from the current swatches
    let updateHueBins = () => {
        const result = sortIntoHueBins(swatches);
        console.log("RESULT!");
        console.log(result);
        hueBins = result.hueBins;
        greyScaleBin = result.greyScaleBin;
        greyScaleFlattened = result.greyScaleFlattened;
    };

    return {
        get status() { return status; },
        get progress() { return progress; },
        get swatches() { return swatches; },
        get hueBins() { return hueBins; },
        get greyScale() { return greyScaleBin; },
        get greyScaleFlattened() { return greyScaleFlattened; },
        get dimensions() { return dimensions; },
        get error() { return error; },
        get maxColorsToExtract() { return maxColorsToExtract },
        get binWidth() { return binWidth },
        get formatted() {
            return `Status: ${status}\nProgress: ${progress}\nSwatches: ${swatches.length}\nDimensions: ${dimensions}\nError: ${error}`;
        },

        setStatus: (v) => status = v,
        setProgress: (v) => progress = v,
        setSwatches: (v) => {
            v = v.sort((a, b) => {
                return chroma(b.hex).luminance() - chroma(a.hex).luminance();
            });
            swatches = v;
            updateHueBins();
        },
        setDimensions: (v) => dimensions = v,
        setError: (v) => error = v,
        reset: () => {
            status = 'idle';
            progress = 0;
            swatches = [];
            dimensions = null;
            error = null;
            hueBins = [];
            greyScaleBin = [];
        }
    };
}

export const imageStore = createImageStore();