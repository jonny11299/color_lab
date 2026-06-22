
function createColorStore() {

    let curIndex = $state(0); // iterator for the colorstore
    let curTailoredIndex = $state(0);
    let cur = $derived(tailored[curTailoredIndex]);

    let hoveredPreview = $state(null); // Stores a temporary preview color. "Adjust.svelte" changes this value, "ColorSelections.svelte" reads it.

    let maxQueueSize = 100;
    let undoQueue = $state([]);
    let redoQueue = $state([]);

    let selections = $state([
        {
            name: "bg",
            color: "var(--bg)",
        },
        {
            name: "surface",
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
            name: "surface",
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

        get cur() { return cur },
        get hoveredPreview() { return hoveredPreview },

        get colorSettings() {
            return {
                background: tailored[0].color,
                surface: tailored[1].color,
                text: tailored[2].color,
                primary: tailored[3].color,
                secondary: tailored[4].color,
                accent: tailored[5].color,
            };
        },


        setColor: (i, c) => {
            undoQueue.push(tailored.map(t => ({ ...t }))); // pushing deep copy
            redoQueue = [];
            if (undoQueue.length > maxQueueSize) undoQueue.shift();

            selections[i % selections.length].color = c;
            tailored[i % selections.length].color = c; // eventually will set this differently
        },

        setCurrentColorTailored: (c) => {
            undoQueue.push(tailored.map(t => ({ ...t }))); // pushing deep copy
            redoQueue = [];
            if (undoQueue.length > maxQueueSize) undoQueue.shift();

            tailored[curTailoredIndex].color = c;
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

        // c should be a hex string here.
        setHoveredPreview: (c) => {
            hoveredPreview = c;
        },

        // go back one, return to 'redo'
        undo: () => {
            if (undoQueue.length > 0) {
                // console.log("UNdoing");
                redoQueue.push(tailored.map(t => ({ ...t })));
                tailored = undoQueue.pop();
            }
        },

        redo: () => {
            if (redoQueue.length > 0) {
                // console.log("Redoing");
                undoQueue.push(tailored.map(t => ({ ...t })));
                tailored = redoQueue.pop();
            }
        },



        reset: () => {
            selections = [
                {
                    name: "bg",
                    color: "var(--bg)",
                },
                {
                    name: "surface",
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
                    name: "surface",
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