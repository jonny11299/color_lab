
function createColorStore() {

    let curIndex = $state(0); // iterator for the colorstore

    let selections = $state([
        {
            name: "bg",
            color: "var(--color-bg)",
        },
        {
            name: "bg-2",
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
            name: "accent",
            color: "var(--color-bg)",
        }
    ]);


    let tailored = $state([
        {
            name: "bg",
            color: "var(--color-bg)",
        },
        {
            name: "bg-2",
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
            name: "accent",
            color: "var(--color-bg)",
        }
    ]);


    return {
        get selections() { return selections; },
        get tailored() { return tailored; },
        get curIndex() { return curIndex; },


        setColor: (i, c) => {
            selections[i % selections.length].color = c;
            tailored[i % selections.length].color = c; // eventually will set this differently
        },

        iterate: () => {
            curIndex = (curIndex + 1) % selections.length;
            // console.log("Cur index: " + curIndex);
        },

        setSelectedIndex: (i) => {
            // console.log("Setting selected index to " + i);
            curIndex = i % selections.length; // the % guards against positive numbered, out-of-bounds selections
        },


        reset: () => {
            selections = [
                {
                    name: "bg",
                    color: "var(--color-bg)",
                },
                {
                    name: "bg-2",
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
                    name: "accent",
                    color: "var(--color-bg)",
                }
            ];

            tailored = [
                {
                    name: "bg",
                    color: "var(--color-bg)",
                },
                {
                    name: "bg-2",
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
                    name: "accent",
                    color: "var(--color-bg)",
                }
            ];
        }

    }
}


export const colorStore = createColorStore();