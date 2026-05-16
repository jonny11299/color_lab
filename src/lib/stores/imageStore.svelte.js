function createImageStore() {
    let status = $state('idle');      // 'idle' | 'processing' | 'done' | 'error'
    let progress = $state(0);         // 0-100 (float)
    let swatches = $state([]);        // the color swatches, an array of { r: 255, g: 120, b: 80, hex: '#ff7850' }
    let dimensions = $state(null);    // { width, height }
    let error = $state(null);

    let maxColorsToExtract = 250; // this is the max number of colors loaded into the palette. No need to $state for now, unless we want to adjust in-program
    let binWidth = $state(30); // The length of a color cube for sorting. Will be visible once I wire in three.js, or "threlte" as it's ported for Svelte

    return {
        get status() { return status; },
        get progress() { return progress; },
        get swatches() { return swatches; },
        get dimensions() { return dimensions; },
        get error() { return error; },
        get maxColorsToExtract() { return maxColorsToExtract },
        get binWidth() { return binWidth },
        get formatted() {
            return `Status: ${status}\nProgress: ${progress}\nSwatches: ${swatches.length}\nDimensions: ${dimensions}\nError: ${error}`;
        },

        setStatus: (v) => status = v,
        setProgress: (v) => progress = v,
        setSwatches: (v) => swatches = v,
        setDimensions: (v) => dimensions = v,
        setError: (v) => error = v,
        reset: () => {
            status = 'idle';
            progress = 0;
            swatches = [];
            dimensions = null;
            error = null;
        }
    };
}

export const imageStore = createImageStore();