// Manages what phase of design the user is in.
/*
    0: upload image
    1: select a color for the site
    2: select more colors for the site
    3: have selected all colors for the site (no more 'var(--...)' colors in colorStore.tailored)
    ...

    (maybe):
    3: tweak the colors and site settings 
    4: publish or something

*/


function createPhaseStore() {
    let phase = $state(0);
    let exporting = $state(false);
    let helpWindowOpen = $state(false);
    let launchScreen = $state(false);


    return {
        get phase() { return phase },
        get exporting() { return exporting },
        get help() { return helpWindowOpen },
        get launchScreen() { return launchScreen },

        setExportState: (bool) => {
            exporting = bool;
        },

        openHelpWindow: () => {
            helpWindowOpen = true;
        },
        openHelpWindowLaunch: () => {
            launchScreen = true;
            helpWindowOpen = true;
        },

        closeHelpWindow: () => {
            launchScreen = false;
            helpWindowOpen = false;
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
        },

        reset: () => phase = 0,

    }

}

export const phaseStore = createPhaseStore();