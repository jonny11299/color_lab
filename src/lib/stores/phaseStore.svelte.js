// Manages what phase of design the user is in.
/*
    0: upload image
    1: select colors for the site
    2: tweak the colors and site settings 
    3: publish or something

*/


function createPhaseStore() {
    let phase = $state(0);

    return {
        get phase() { return phase },

        advance: () => {
            phase++;
        }
    }

}

export const phaseStore = createPhaseStore();