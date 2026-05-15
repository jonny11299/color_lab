<script>
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { paramStore } from "$lib/stores/paramStore.svelte.js";
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import PreviewSite from "$lib/components-ide/PreviewSite.svelte";

    import eyeOpen from "$lib/icons/eye-open.svg?raw";
    import eyeClose from "$lib/icons/eye-close.svg?raw";

    /*
    Layout structure:
    ┌──────────────┬──────────────────────────────┐
    │  .pane 0     │  .pane 1                     │
    │  top-left    │  top-right                   │
    │              │                              │
    ├── divider-v ─┼── divider-v ─────────────────┤ 
    │  .pane 2     │  .pane 3                     │ 
    │  bottom-left │  bottom-right                │ 
    └──────────────┴──────────────────────────────┘
                
*/

    // Handling pane visiblity:
    let paneVisible = $state([true, true, true, true]);

    // Handles pane visibility too, except says "Awaiting ..." whatever it's awaiting.
    // This variable coordinates actions with 'currentActionIndex'
    let awaitingLaunch = $state([false, true, true, true]);

    // which pane to focus on
    let focus = $state(0);

    $effect(() => {
        const i = phaseStore.phase;
        if (i === 1) {
            awaitingLaunch[1] = false;
            awaitingLaunch[2] = false;
            awaitingLaunch[3] = false;
            focus = 1;
        }
        if (i === 2) {
            focus = 2;
        }
    });

    // Passing values into the Preview site:
    let tailoredColors = $derived(colorStore.tailored);

    // Managing Split Pane variables:

    // ─── Split state ─────────────────────────────────────────────────────────
    // leftWidth:    % of shell width  given to the left column
    // bottomHeight: % of column height given to the bottom pane (both cols share)
    let leftWidth = $state(40);
    let bottomHeight = $state(30);

    // ─── Active-highlight state (purely visual) ───────────────────────────────
    let draggingH = $state(false);
    let draggingV = $state(false);

    // hoveringV is shared between both vertical dividers.
    // Either divider entering/leaving sets it, so both highlight together.
    let hoveringV = $state(false);

    function onEnterV() {
        hoveringV = true;
    }
    function onLeaveV() {
        hoveringV = false;
    }

    // ─── Shell element reference — used for dimension-relative delta math ─────
    // We bind this to the shell div so we can read its live pixel dimensions.
    // This makes dragging oblivious to scroll position, Nav height, etc.
    let shellEl = $state(null);

    // ─── Delta-based mouse move ───────────────────────────────────────────────
    // e.movementX / e.movementY = pixels moved since the LAST mousemove event.
    // Dividing by the shell's pixel size converts to a %-of-shell delta,
    // which is exactly what our state variables expect.
    function onMouseMove(e) {
        if (draggingH) {
            const delta = (e.movementX / shellEl.offsetWidth) * 100;
            leftWidth = Math.min(Math.max(leftWidth + delta, 10), 60);
        }
        if (draggingV) {
            // movementY > 0 = mouse moved down = divider moves down
            // = top pane grows = bottom pane shrinks → subtract from bottomHeight
            const delta = (e.movementY / shellEl.offsetHeight) * 100;
            bottomHeight = Math.min(Math.max(bottomHeight - delta, 10), 70);
        }
    }

    // ─── Listeners go on window, not the shell ────────────────────────────────
    // This keeps the drag alive even if the cursor briefly leaves the component
    // (e.g. moves over a Nav bar or beyond the shell edge).
    function stopDrag() {
        draggingH = false;
        draggingV = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", stopDrag);
    }

    function startDragH(e) {
        draggingH = true;
        e.preventDefault(); // prevents text selection during drag
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopDrag);
    }

    function startDragV(e) {
        draggingV = true;
        e.preventDefault();
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopDrag);
    }
</script>

<!--
  Layout structure (column-first):

    ┌──────────────┬──────────────────────────────┐
    │  .pane 1     │  .pane 2                     │
    │  top-left    │  top-right                   │
    │              │                              │
    ├── divider-v ─┼── divider-v ─────────────────┤  ← both share draggingV
    │  .pane 3     │  .pane 4                     │    and hoveringV; hover or
    │  bottom-left │  bottom-right                │    drag either to affect both
    └──────────────┴──────────────────────────────┘
                   ↑
            single full-height divider-h

  The shell is flex-direction: row.
  Each .col is flex-direction: column.
  divider-h spans the full shell height because it lives
  at the top level — not inside a row.
-->
<div class="shell" bind:this={shellEl}>
    <!-- ── Left column ──────────────────────────────────────────────── -->
    <div class="col" style="width: {leftWidth}%;">
        <div class="pane" style="height: {100 - bottomHeight}%;">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="pane-header"
                onclick={() => (paneVisible[0] = !paneVisible[0])}
            >
                Image Uploader
                <button class="eye-btn">
                    {@html paneVisible[0] ? eyeOpen : eyeClose}
                </button>
            </div>

            {#if paneVisible[0]}
                <div class="pane-body">
                    <span class="label">Navigation</span>
                    <p>Width: <strong>{leftWidth.toFixed(1)}%</strong></p>
                    <ul>
                        <li>Item Alpha</li>
                        <li>Item Beta</li>
                        <li>Item Gamma</li>
                        <li>Item Delta</li>
                    </ul>
                </div>
            {/if}
        </div>

        <!-- Vertical divider — draggable, governs bottomHeight for BOTH columns -->
        <div
            class="divider divider-v {draggingV || hoveringV ? 'active' : ''}"
            onmousedown={startDragV}
            onmouseenter={onEnterV}
            onmouseleave={onLeaveV}
            role="separator"
            aria-label="Resize top / bottom"
        ></div>

        <div class="pane" style="height: {bottomHeight}%;">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="pane-header"
                onclick={() => (paneVisible[1] = !paneVisible[1])}
            >
                Palette

                <button class="eye-btn">
                    {@html paneVisible[1] ? eyeOpen : eyeClose}
                </button>
            </div>

            {#if paneVisible[1]}
                <div class="pane-body">
                    {#if awaitingLaunch[1]}
                        <h3>Waiting for Image upload</h3>
                        <p>Please upload an image to get started.</p>
                    {:else}
                        <span class="label">Palette goes here</span>
                        <p>
                            Height: <strong>{bottomHeight.toFixed(1)}%</strong>
                        </p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <!-- /col left -->

    <!-- ── Horizontal divider — single element, full shell height ───── -->
    <!--
    Because this lives at the top level of the shell (not inside a row),
    it naturally spans the full height including through the bottom panes.
  -->
    <div
        class="divider divider-h {draggingH ? 'active' : ''}"
        onmousedown={startDragH}
        role="separator"
        aria-label="Resize left / right"
    ></div>

    <!-- ── Right column ─────────────────────────────────────────────── -->
    <div class="col" style="width: {100 - leftWidth}%;">
        <div class="pane" style="height: {100 - bottomHeight}%;">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="pane-header"
                onclick={() => (paneVisible[2] = !paneVisible[2])}
            >
                Preview Site
                <button class="eye-btn">
                    {@html paneVisible[2] ? eyeOpen : eyeClose}
                </button>
            </div>
            {#if paneVisible[2]}
                <div class="pane-body">
                    {#if awaitingLaunch[2]}
                        <h3>Waiting for Image upload</h3>
                        <p>Please upload an image to get started.</p>
                    {:else}
                        <PreviewSite
                            background={tailoredColors[0].color}
                            backgroundSubtle={tailoredColors[1].color}
                            text={tailoredColors[2].color}
                            primary={tailoredColors[3].color}
                            secondary={tailoredColors[4].color}
                            accent={tailoredColors[5].color}
                            muteStrength={paramStore.params[0].cur ?? 0.5}
                            typeScale={paramStore.params[1].cur ?? 1.2}
                            borderWidth={paramStore.params[2].cur ?? 3}
                            borderRadius={paramStore.params[3].cur ?? 10}
                        />
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Vertical divider — also draggable; shares bottomHeight and hoveringV
         with the left column divider, so both move and highlight as one. -->
        <div
            class="divider divider-v {draggingV || hoveringV ? 'active' : ''}"
            onmousedown={startDragV}
            onmouseenter={onEnterV}
            onmouseleave={onLeaveV}
            role="separator"
            aria-label="Resize top / bottom"
        ></div>

        <div class="pane" style="height: {bottomHeight}%;">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="pane-header"
                onclick={() => (paneVisible[3] = !paneVisible[3])}
            >
                Site Settings

                <button class="eye-btn">
                    {@html paneVisible[3] ? eyeOpen : eyeClose}
                </button>
            </div>

            {#if paneVisible[3]}
                <div class="pane-body">
                    {#if awaitingLaunch[2]}
                        <h3>Waiting for Image upload</h3>
                        <p>Please upload an image to get started.</p>
                    {:else}
                        <span class="label">Logs / Output</span>
                        <code class="log-line"
                            >[info] App started at 09:41:00</code
                        >
                        <code class="log-line"
                            >[debug] Fetching data from /api/items</code
                        >
                        <code class="log-line"
                            >[info] 200 OK — 42 items returned</code
                        >
                        <code class="log-line"
                            >[warn] Cache miss on key "user:99"</code
                        >
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <!-- /col right -->
</div>

<!-- /shell -->

<style>
    /* ── Shell ───────────────────────────────────────────────────────────────
     flex-direction: row so the two columns + divider sit side-by-side.
     The component fills whatever space its parent gives it.
     If you want it to fill the viewport below a Nav, do one of:
       a) In your layout:  <main style="height: calc(100vh - {navHeight})"><SplitPanes /></main>
       b) Here:            height: calc(100vh - var(--nav-height))
  ──────────────────────────────────────────────────────────────────────── */
    .shell {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 98vh; /* adjust to fit your layout — see comment above */
        overflow: hidden;
        background: var(--bg);
        color: var(--text);
        user-select: none; /* prevents text selection during drag */
    }

    /* ── Columns ─────────────────────────────────────────────────────────────
     Each column is a flex column (stacks top pane / divider / bottom pane).
     flex-shrink: 0 prevents the column from collapsing when content overflows.
  ──────────────────────────────────────────────────────────────────────── */
    .col {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        overflow: hidden;
    }

    /* ── Panes ───────────────────────────────────────────────────────────── */
    .pane {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        overflow: hidden;
        background: var(--bg);
    }

    .pane-header {
        padding: 0.375rem 0.75rem;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background: var(--surface);
        color: var(--text);
        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .pane-body {
        flex: 1;
        min-height: 0; /* ← this is the fix */
        overflow-y: scroll;
        padding: 0.625rem 0.875rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }
    /* 
    This enables the pane-body to be scrollable within. Otherwise, flex rules cascade,
    causing it to shrink the content outside of the pane, thus giving it nothing to scroll.
    */
    .pane-body > :global(*) {
        flex-shrink: 0;
    }

    /* ── Eye button ──────────────────────────────────────────────────────────── */

    .eye-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: var(--primary);
        display: flex;
        align-items: center;
        transition: color 0.15s;
        width: 1.2rem;
        height: 1.2rem;
        stroke-width: 2;
    }

    .eye-btn:hover,
    .pane-header:hover .eye-btn {
        color: var(--primary-hover);
    }

    .pane-header:hover {
        cursor: pointer;
        /* outline: 2px solid var(--primary-hover);
        outline-offset: -2px;*/
    }

    /* ── Dividers ────────────────────────────────────────────────────────────
     .divider-h : vertical bar  between left and right columns (full height)
     .divider-v : horizontal bar between top and bottom panes  (full col width)
                  Both .divider-v elements share draggingV and hoveringV state,
                  so they highlight and move together as a single logical handle.
  ──────────────────────────────────────────────────────────────────────── */
    .divider {
        flex-shrink: 0;
        background-color: var(--surface);
        transition: background-color var(--transition-time);
    }

    .divider:not(.divider-static):hover,
    .divider.active {
        background-color: var(--primary-hover);
    }

    .divider-h {
        width: var(--divider-size);
        height: 100%; /* spans the full shell height — both rows */
        cursor: col-resize;
    }

    .divider-v {
        width: 100%;
        height: var(--divider-size);
        cursor: row-resize;
    }

    /* ── Sample content ────────────────────────────────────────────────────── */
    .label {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted);
    }

    p {
        margin: 0;
        font-size: 0.8125rem;
    }

    ul {
        margin: 0;
        padding-left: 1rem;
    }

    li {
        padding: 0.1875rem 0;
        font-size: 0.8125rem;
        border-bottom: 1px solid var(--surface);
    }

    .card-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.25rem;
    }

    .card {
        flex: 1 1 6.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.625rem 0.75rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 0;
        font-weight: 600;
        font-size: 0.8125rem;
    }

    .card span {
        font-size: 0.6875rem;
        font-weight: 400;
        color: var(--text-muted);
    }

    .log-line {
        display: block;
        font-size: 0.6875rem;
        color: var(--text-muted);
        padding: 0.125rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: var(--font-mono);
    }
</style>
