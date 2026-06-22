// Keeps track of non-color website preview parameters

function createParamStore() {
    let params = $state([
        {
            name: "Mute Strength",
            key: "muteStrength",
            min: 0,
            max: 1.5,
            step: 0.01,
            cur: 0.5,
            fixed: 1, // num digits to display for toFixed
        },
        {
            name: "Type Scale",
            key: "typeScale",
            min: 1,
            max: 1.8,
            step: 0.01,
            cur: 1.2,
            fixed: 2,
        },
        {
            name: "Border Width",
            key: "borderWidth",
            min: 0,
            max: 12,
            step: 0.5,
            cur: 3,
            fixed: 1,
            unit: "px"
        },
        {
            name: "Border Radius",
            key: "borderRadius",
            min: 0,
            max: 50,
            step: 0.5,
            cur: 10,
            fixed: 1,
            unit: "px"
        },
    ]);

    return {
        get params() { return params },
        get paramSettings() {
            const s = [];
            params.forEach((p) => {
                s[p.key] = p.cur.toFixed(p.fixed)
            });
            return s;
        },


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