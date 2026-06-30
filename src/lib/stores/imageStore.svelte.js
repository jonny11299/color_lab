import chroma from "chroma-js";

// if a color is distance 40 away (out of 360), it's automatically placed in a different hue bin.
const hueCutoffDistance = 40;

function createImageStore() {
    let status = $state('idle');      // 'idle' | 'processing' | 'done' | 'error'
    let progress = $state(0);         // 0-100 (float)
    let swatches = $state([]);        // the color swatches, an array of { r: 255, g: 120, b: 80, hex: '#ff7850' }
    let dimensions = $state(null);    // { width, height }
    let error = $state(null);

    let maxColorsToExtract = 250; // this is the max number of colors loaded into the palette. No need to $state for now, unless we want to adjust in-program
    let binWidth = $state(30); // The length of a color cube for sorting. Will be visible once I wire in three.js, or "threlte" as it's ported for Svelte

    let greyScaleBin = $state([]); // for placing colors with no hue
    let hueBins = $state([]);  // for placing bins of hues
    let hueBinExample = {
        min: 40, // the lowest hue recorded in this bin
        max: 55, // the highest hue recorded in this bin
        set: []
    }

    // updates hue bins with the current swatches
    // O(n) algorithm to sort a set of colors into related hues (using parameter hueCutoffDistance)
    let setHueBins = () => {
        // print the hues:
        // swatches.forEach((s) => console.log(`${chroma(s).hex()}: ${chroma(s).hsl()}`));
        hueBins = [];
        greyScaleBin = [];
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

                    // seamless return statement: 
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


    }

    return {
        get status() { return status; },
        get progress() { return progress; },
        get swatches() { return swatches; },
        get hueBins() { return hueBins; },
        get greyScales() { return greyScaleBin; },
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
            console.log(JSON.stringify(v));
            v = v.sort((a, b) => {
                return chroma(a.hex).luminance() < chroma(b.hex).luminance();
            });
            console.log(JSON.stringify(v));
            swatches = v;
            setHueBins();
        },
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