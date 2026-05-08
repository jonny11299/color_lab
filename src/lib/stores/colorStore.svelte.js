
function createColorStore() {

    let curIndex = $state(0); // iterator for the colorstore

    let selections = $state([
        {
            name: "bg",
            color: "var(--color-bg)",
        },
        {
            name: "text",
            color: "var(--color-bg)",
        },
        {
            name: "1",
            color: "var(--color-bg)",
        },
        {
            name: "2",
            color: "var(--color-bg)",
        },
        {
            name: "❀",
            color: "var(--color-bg)",
        },
    ]);


    return {
        get selections() { return selections; },
        get curIndex() { return curIndex; },


        setColor: (i, c) => {
            selections[i % selections.length].color = c;
        },

        iterate: () => {
            curIndex = (curIndex + 1) % selections.length;
            // console.log("Cur index: " + curIndex);
        },


        reset: () => {
            selections = [
                {
                    name: "bg",
                    color: "var(--color-bg)",
                },
                {
                    name: "text",
                    color: "var(--color-bg)",
                },
                {
                    name: "1",
                    color: "var(--color-bg)",
                },
                {
                    name: "2",
                    color: "var(--color-bg)",
                },
                {
                    name: "❀",
                    color: "var(--color-bg)",
                },
            ];
        }
    }
}


export const colorStore = createColorStore();