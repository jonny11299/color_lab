<script>
  // ─── Split state ─────────────────────────────────────────────────────────
  // leftWidth:    % of shell width  given to the left column
  // bottomHeight: % of column height given to the bottom pane (both cols share)
  let leftWidth    = $state(20);
  let bottomHeight = $state(20);

  // ─── Active-highlight state (purely visual) ───────────────────────────────
  let draggingH = $state(false);
  let draggingV = $state(false);

  // hoveringV is shared between both vertical dividers.
  // Either divider entering/leaving sets it, so both highlight together.
  let hoveringV = $state(false);

  function onEnterV() { hoveringV = true;  }
  function onLeaveV() { hoveringV = false; }

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
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stopDrag);
  }

  function startDragH(e) {
    draggingH = true;
    e.preventDefault(); // prevents text selection during drag
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
  }

  function startDragV(e) {
    draggingV = true;
    e.preventDefault();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
  }
</script>

<!--
  Layout structure (column-first):

    ┌──────────────┬──────────────────────────────┐
    │  .pane       │  .pane                       │
    │  top-left    │  top-right                   │
    │              │                              │
    ├── divider-v ─┼── divider-v ─────────────────┤  ← both share draggingV
    │  .pane       │  .pane                       │    and hoveringV; hover or
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
      <div class="pane-header">Left Pane</div>
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
      <div class="pane-header">Bottom Left</div>
      <div class="pane-body">
        <span class="label">Status</span>
        <p>Height: <strong>{bottomHeight.toFixed(1)}%</strong></p>
        <code class="log-line">● Connected</code>
        <code class="log-line">v1.0.0</code>
      </div>
    </div>

  </div><!-- /col left -->

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
      <div class="pane-header">Main Content</div>
      <div class="pane-body">
        <span class="label">Primary workspace</span>
        <p>Height: <strong>{(100 - bottomHeight).toFixed(1)}%</strong> of shell</p>
        <div class="card-row">
          <div class="card">Card A<span>Flex child</span></div>
          <div class="card">Card B<span>Flex child</span></div>
          <div class="card">Card C<span>Flex child</span></div>
        </div>
      </div>
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
      <div class="pane-header">Bottom Right</div>
      <div class="pane-body">
        <span class="label">Logs / Output</span>
        <code class="log-line">[info]  App started at 09:41:00</code>
        <code class="log-line">[debug] Fetching data from /api/items</code>
        <code class="log-line">[info]  200 OK — 42 items returned</code>
        <code class="log-line">[warn]  Cache miss on key "user:99"</code>
      </div>
    </div>

  </div><!-- /col right -->

</div><!-- /shell -->


<style>
  /* ── Shell ───────────────────────────────────────────────────────────────
     flex-direction: row so the two columns + divider sit side-by-side.
     The component fills whatever space its parent gives it.
     If you want it to fill the viewport below a Nav, do one of:
       a) In your layout:  <main style="height: calc(100vh - {navHeight})"><SplitPanes /></main>
       b) Here:            height: calc(100vh - var(--nav-height))
  ──────────────────────────────────────────────────────────────────────── */
  .shell {
    display:        flex;
    flex-direction: row;
    width:          100%;
    height:         98vh; /* adjust to fit your layout — see comment above */
    overflow:       hidden;
    background:     var(--bg);
    color:          var(--text);
    user-select:    none; /* prevents text selection during drag */
  }

  /* ── Columns ─────────────────────────────────────────────────────────────
     Each column is a flex column (stacks top pane / divider / bottom pane).
     flex-shrink: 0 prevents the column from collapsing when content overflows.
  ──────────────────────────────────────────────────────────────────────── */
  .col {
    display:        flex;
    flex-direction: column;
    flex-shrink:    0;
    overflow:       hidden;
  }

  /* ── Panes ───────────────────────────────────────────────────────────── */
  .pane {
    display:        flex;
    flex-direction: column;
    flex-shrink:    0;
    overflow:       hidden;
    background:     var(--bg);
  }

  .pane-header {
    padding:        0.375rem 0.75rem;
    font-size:      0.6875rem;
    font-weight:    600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background:     var(--primary);
    color:          var(--bg);
    flex-shrink:    0;
  }

  .pane-body {
    flex:           1;
    overflow-y:     auto;
    padding:        0.625rem 0.875rem;
    display:        flex;
    flex-direction: column;
    gap:            0.375rem;
  }

  /* ── Dividers ────────────────────────────────────────────────────────────
     .divider-h : vertical bar  between left and right columns (full height)
     .divider-v : horizontal bar between top and bottom panes  (full col width)
                  Both .divider-v elements share draggingV and hoveringV state,
                  so they highlight and move together as a single logical handle.
  ──────────────────────────────────────────────────────────────────────── */
  .divider {
    flex-shrink: 0;
    background:  var(--surface);
    transition:  background 0.15s;
  }

  .divider:not(.divider-static):hover,
  .divider.active {
    background: var(--primary-hover);
  }

  .divider-h {
    width: var(--divider-size);
    height: 100%;    /* spans the full shell height — both rows */
    cursor: col-resize;
  }

  .divider-v {
    width:  100%;
    height: var(--divider-size);
    cursor: row-resize;
  }

  /* ── Sample content ────────────────────────────────────────────────────── */
  .label {
    font-size:      0.625rem;
    font-weight:    600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color:          var(--text-muted);
  }

  p { margin: 0; font-size: 0.8125rem; }

  ul {
    margin:       0;
    padding-left: 1rem;
  }

  li {
    padding:       0.1875rem 0;
    font-size:     0.8125rem;
    border-bottom: 1px solid var(--surface);
  }

  .card-row {
    display:    flex;
    flex-wrap:  wrap;
    gap:        0.5rem;
    margin-top: 0.25rem;
  }

  .card {
    flex:           1 1 6.25rem;
    display:        flex;
    flex-direction: column;
    gap:            0.25rem;
    padding:        0.625rem 0.75rem;
    background:     var(--surface);
    border:         1px solid var(--border);
    border-radius:  0;
    font-weight:    600;
    font-size:      0.8125rem;
  }

  .card span {
    font-size:   0.6875rem;
    font-weight: 400;
    color:       var(--text-muted);
  }

  .log-line {
    display:       block;
    font-size:     0.6875rem;
    color:         var(--text-muted);
    padding:       0.125rem 0;
    white-space:   nowrap;
    overflow:      hidden;
    text-overflow: ellipsis;
    font-family: var(--font-mono)
  }
</style>