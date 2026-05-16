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

    return {
        get phase() { return phase },

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