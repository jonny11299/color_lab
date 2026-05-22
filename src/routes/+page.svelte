<script>
    import "../app.css";
    import { themeStore } from "$lib/stores/theme.svelte.js";
    // import Body from "$lib/components/Body.svelte"; // pre-redesign
    // import Nav from "$lib/components/Nav.svelte"; // pre-redesign
    import Nav from "$lib/components-ide/Nav.svelte";
    import SplitPanes from "$lib/components-ide/SplitPanes.svelte";
</script>

<!-- /components -->
<!-- Old, pre-redesign.
<Nav />
<Body />
-->

<!-- /components-ide -->
<Nav />
<SplitPanes />
