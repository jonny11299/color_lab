// Manages what phase of design the user is in.
/*
    0: upload image
    1: select a color for the site
    2: select more colors for the site
    ...

    (maybe):
    3: tweak the colors and site settings 
    4: publish or something

*/


function createPhaseStore() {
    let phase = $state(0);
    let placeholder = $derived(() => {
        if (phase === 0) {
            return `<div><h3>Waiting for Image upload</h3>
                <p>Please upload an image to get started.</p></div>`;
        } else if (phase === 1) {
            return `<div><h3>Waiting for color selection</h3>
                <p>Select a color to view site preview.</p></div>`;
        } else {
            return `<div><h3>Waiting for complete color selection</h3>
                <p>Select a full palette to get tailored edits.</p></div>`;
        }
    });

    return {
        get phase() { return phase },

        get placeholder() {
            return placeholder
        },

        // 'i' is the max state we can advance to.
        // prevents repeat calls of the same function advancing past where it should.
        // for example, uploading an image only puts us to state 1. 
        // if we upload a second photo, we should not advance to state 2,
        // so in the function that handles photo uploads, we simply say
        // advance(1), or, 'advance by one, no further than phase 1'
        advance: (i = 1000) => {
            if (phase < i) {
                phase++;
            }
        }
    }

}

export const phaseStore = createPhaseStore();