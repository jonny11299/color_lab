// Overall flow:
// 1. Do operations
// 2. Write progress to stores/imageStore.svelte.js
// 3. ImageLoader reads progress from store.

import { imageStore } from "$lib/stores/imageStore.svelte.js";

const maxColors = imageStore.maxColorsToExtract;

let uploadStartTime = Date.now();
let img = null; // the Image() object saved to this file, being operated upon.

const firstLogMessage = 'Begin Cube Processing Log:'
let logMessage = firstLogMessage;
function initNewLogMessage() {
    logMessage = firstLogMessage;
}
function addToLog(m) {
    logMessage += '\n'
    logMessage += m;
}

// returns metadata once loaded
export async function uploadImage(file) {
    if (!file) {
        console.error("Called uploadImage with a null file.");
        return;
    }
    if (!file.type.startsWith('image/')) {
        console.error("Called uploadImage with a non-image file.");
        return;
    }

    uploadStartTime = Date.now();
    console.log("Uploading ", file.name);
    imageStore.setStatus('Uploading Image');


    initNewLogMessage();

    // Convert it into a format for datamoshing (base64 string)
    const base64image = await toBase64(file);

    const metadata = await new Promise((resolve, reject) => {
        img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                name: file.name,
                type: file.type,
                size: file.size // in bytes
            });
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = base64image
    });

    addToLog(`Upload for ${file.name} completed in ${Date.now() - uploadStartTime} ms`);
    return metadata;
}

export async function toBase64(imageFile) {
    addToLog("Converting to base 64...");
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            addToLog("Converted to base 64.");
            resolve(e.target.result);
        }
        reader.onerror = () => reject(new Error('Failed to convert to Base 64'));
        reader.readAsDataURL(imageFile);
    });
}


export function readPixels() {
    if (img) {
        let width = img.width;
        let height = img.height;

        imageStore.setStatus('Reading pixels...');
        addToLog("Reading pixels...");


        const canvas = new OffscreenCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // getImageData returns a flat Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]
        const { data } = ctx.getImageData(0, 0, width, height);
        const pixels = [];

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            pixels.push({ r, g, b, a });
        }

        addToLog(`Total pixels: ${pixels.length}`);
        addToLog('First 10 pixels:\n' + JSON.stringify(pixels.slice(0, 10)));
        // addToLog('All pixels:', pixels);

        const binWidth = imageStore.binWidth

        extractColors(pixels, binWidth, maxColors);
    }
}



// creates a quantized color-cube which counts the "hits" of a color within each section of the cube

function extractColors(pixels, t = 30, numColors = 200) {
    const startTime = Date.now();
    imageStore.setStatus('Extracting colors...');


    // t = threshhold for sampling
    // numColors = number of colors to pick out

    // Show a template of what each section of the cube looks like:
    /*
    cube.push({
        pixel: [r, g, b],
        count: 0
    });
    */



    // define the quantized color space:
    // length of cube is Math.pow(Math.ceil(256/t), 3);
    const cube = [];
    const len = Math.ceil(256 / t);
    for (let i = 0; i < len; i++) {
        let r = i * t;

        for (let j = 0; j < len; j++) {
            let g = j * t;

            for (let k = 0; k < len; k++) {
                let b = k * t;

                cube.push({
                    pixel: [r, g, b],
                    err: [0, 0, 0],
                    count: 0
                });
            }
        }
    }


    // addToLog(cube);
    addToLog("Created cube.");
    addToLog(`Time elapsed: ${Date.now() - startTime} ms`);

    // Increment cube's counts for each pixel
    // lock is for testing, so I can see each result
    const printEveryXSamples = 10000;
    const maxSamples = -1; // printEveryXSamples; // -1; // 2 * printEveryXSamples; // set to -1 for doing the entire thing
    let sample = 0;
    for (let p of pixels) {

        // index = (for adjusted color values) r * t^2 + g * t + b
        const radj = p.r / t;
        const gadj = p.g / t;
        const badj = p.b / t;

        const ri = Math.floor(radj);
        const gi = Math.floor(gadj);
        const bi = Math.floor(badj);

        const rbin = ri * t;
        const gbin = gi * t;
        const bbin = bi * t;

        const rerror = p.r - rbin;
        const gerror = p.g - gbin;
        const berror = p.b - bbin;


        // look up the index in the cube
        // use len here, not t
        // addToLog(`len === ${len}`);
        const index = ri * len * len + gi * len + bi;

        // assert that the color here matches radj - rerror
        if (cube[index].pixel[0] !== rbin || cube[index].pixel[1] !== gbin || cube[index].pixel[2] !== bbin) {
            const errstring = `Missing index; expected adj values around ${rbin}, ${gbin}, ${bbin}, got ${cube[index].pixel}`;
            console.error(errstring);
        }


        // 30, 30, 28 belongs with index 172, for 28, 28, 28
        // err would be 2, 2, 0, incremented each step, then divided by cube.length at the end
        try {
            cube[index].count++;
            cube[index].err[0] += rerror;
            cube[index].err[1] += gerror;
            cube[index].err[2] += berror;

        } catch (error) {
            console.error(error);
            console.error(`r, g, b === ${p.r}, ${p.g}, ${p.b}`);
            console.error(`r, g, b (adj) === ${radj}, ${gadj}, ${badj}`);
            console.error(`r, g, b (bin) === ${rbin}, ${gbin}, ${bbin}`);
            console.error(`r, g, b (err) === ${rerror}, ${gerror}, ${berror}`);
            console.error(`index === ${index}, cube.length === ${cube.length}`);
            // return;
        }


        if (sample % printEveryXSamples === 0) {
            // console.error(error);
            addToLog(`Sample === ${sample} / ${pixels.length} total samples.`);
            addToLog(`${100 * (sample / pixels.length)}% done.`);
            addToLog(`r, g, b === ${p.r}, ${p.g}, ${p.b}`);
            addToLog(`r, g, b (adj) === ${radj}, ${gadj}, ${badj}`);
            addToLog(`r, g, b (err) === ${rerror}, ${gerror}, ${berror}`);
            addToLog(`index === ${index}, cube.length === ${cube.length}`);

        }


        // tail of the loop. Increment sample, break if we should exit early.
        sample++;
        if (maxSamples !== -1 && sample > maxSamples) {
            break;
        }
    }


    addToLog("[results printed to console under 'Unsorted Cube:']")
    console.log("Unsorted Cube:");
    console.log(cube);
    addToLog("Finished reading cube. Formatting now.");
    addToLog(`Time elapsed: ${Date.now() - startTime} ms`);

    // correct error (could do this with only the selected colors, but whatever)
    for (let c of cube) {
        if (c.count > 0) {
            c.err[0] = c.err[0] / c.count;
            c.err[1] = c.err[1] / c.count;
            c.err[2] = c.err[2] / c.count;
        } else {
            c.err = [0, 0, 0];
        }
    }

    // sort
    const sortedCube = cube.sort((a, b) => {
        if (a.count > b.count) return -1;
        else if (a.count === b.count) return 0;
        else return 1;
    }).slice(0, numColors);

    // format each selected color:
    for (let c of sortedCube) {
        c.color = c.pixel.map((val, i) => {
            return Math.round((val + c.err[i]));
        });
    }

    addToLog("Finished formatting cube. Results:");
    addToLog("[results printed to console under 'Sorted Cube:']")
    console.log("Sorted cube:");
    console.log(sortedCube);
    addToLog(`Time elapsed: ${Date.now() - startTime} ms`);

    // currentCube = sortedCube;
    // paletteActions.style.display = 'flex';
    // saveJSON(sortedCube);

    addToLog("Trimming colors with no 'hits' from the image");
    const trimmedCube = sortedCube.filter((c) => c.count > 0);

    addToLog("Formatting swatches");
    writeSwatches(trimmedCube);

    imageStore.setStatus("Done.");
    addToLog("Done.");
    console.log(logMessage);
}

function writeSwatches(clusters) {
    imageStore.setStatus("Writing swatches");
    imageStore.setSwatches(
        clusters.map(({ color }) => {
            const [r, g, b] = color.map(Math.round);
            const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
            return { r, g, b, hex };
        })
    );
}