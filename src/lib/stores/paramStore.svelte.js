// Keeps track of non-color website preview parameters

function createParamStore() {
    let params = $state([
        {
            name: "muteStrength",
            min: 0,
            max: 1.5,
            step: 0.1,
            cur: 0.5,
            fixed: 1, // num digits to display for toFixed
        },
        {
            name: "typeScale",
            min: 1,
            max: 1.8,
            step: 0.02,
            cur: 1.2,
            fixed: 2,
        },
        {
            name: "borderWidth",
            min: 0,
            max: 12,
            step: 1,
            cur: 3,
            fixed: 0,
        },
        {
            name: "borderRadius",
            min: 0,
            max: 50,
            step: 1,
            cur: 10,
            fixed: 0,
        },
    ]);

    return {
        get params() { return params },


        setByIndex: (i, val) => {
            if (i < 0 || i >= params.length) return;
            params[i].cur = val;
        },

        upByIndex(i) {
            if (i < 0 || i >= params.length) return;
            params[i].cur += params[i].step;
            if (params[i].cur > params[i].max) params[i].cur = params[i].max;
        },

        downByIndex(i) {
            if (i < 0 || i >= params.length) return;
            params[i].cur -= params[i].step;
            if (params[i].cur < params[i].min) params[i].cur = params[i].min;
        },

        getFixed: (i) => {
            return params[i].fixed;
        },

        // will certainly need to be changed if we update the 'params = $state([...])'
        setToDefaults: () => {
            params[0] = 0.5;
            params[1] = 1.2;
            params[2] = 3;
            params[3] = 10;
        }
    }


}

export const paramStore = createParamStore()