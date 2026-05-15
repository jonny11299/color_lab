
function createColorStore() {

    let curIndex = $state(0); // iterator for the colorstore
    let curTailoredIndex = $state(0);

    let selections = $state([
        {
            name: "bg",
            color: "var(--bg)",
        },
        {
            name: "bg-2",
            color: "var(--bg)",
        },
        {
            name: "text",
            color: "var(--bg)",
        },
        {
            name: "1",
            color: "var(--bg)",
        },
        {
            name: "2",
            color: "var(--bg)",
        },
        {
            name: "accent",
            color: "var(--bg)",
        }
    ]);


    let tailored = $state([
        {
            name: "bg",
            color: "var(--bg)",
        },
        {
            name: "bg-2",
            color: "var(--bg)",
        },
        {
            name: "text",
            color: "var(--text)",
        },
        {
            name: "1",
            color: "var(--text-muted)",
        },
        {
            name: "2",
            color: "var(--text-muted)",
        },
        {
            name: "accent",
            color: "var(--text-muted)",
        }
    ]);


    return {
        get selections() { return selections; },
        get tailored() { return tailored; },
        get curIndex() { return curIndex; },
        get curTailoredIndex() { return curTailoredIndex },


        setColor: (i, c) => {
            selections[i % selections.length].color = c;
            tailored[i % selections.length].color = c; // eventually will set this differently
        },

        // iterates both selected and tailored colors
        iterate: () => {
            curIndex = (curIndex + 1) % selections.length;
            curTailoredIndex = (curIndex) % tailored.length;
            // console.log("Cur index: " + curIndex);
        },

        setSelectedIndex: (i) => {
            // console.log("Setting selected index to " + i);
            curIndex = i % selections.length; // the % guards against positive numbered, out-of-bounds selections
        },

        // Also sets the 'selected' index for better workflow
        setTailoredIndex: (i) => {
            curTailoredIndex = i % tailored.length;
            curIndex = curTailoredIndex;
        },


        reset: () => {
            selections = [
                {
                    name: "bg",
                    color: "var(--bg)",
                },
                {
                    name: "bg-2",
                    color: "var(--bg)",
                },
                {
                    name: "text",
                    color: "var(--bg)",
                },
                {
                    name: "1",
                    color: "var(--bg)",
                },
                {
                    name: "2",
                    color: "var(--bg)",
                },
                {
                    name: "accent",
                    color: "var(--bg)",
                }
            ];

            tailored = [
                {
                    name: "bg",
                    color: "var(--bg)",
                },
                {
                    name: "bg-2",
                    color: "var(--bg)",
                },
                {
                    name: "text",
                    color: "var(--text)",
                },
                {
                    name: "1",
                    color: "var(--text-muted)",
                },
                {
                    name: "2",
                    color: "var(--text-muted)",
                },
                {
                    name: "accent",
                    color: "var(--text-muted)",
                }
            ];
        }

    }
}


export const colorStore = createColorStore();