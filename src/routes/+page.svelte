<script>
    import "../app.css";
    import { themeStore } from "$lib/stores/theme.svelte.js";
    // import Body from "$lib/components/Body.svelte"; // pre-redesign
    // import Nav from "$lib/components/Nav.svelte"; // pre-redesign
    import Nav from "$lib/components-ide/Nav.svelte";
    import SplitPanes from "$lib/components-ide/SplitPanes.svelte";
    import CssEditor from "$lib/components-ide/CssEditor.svelte";
    import TwoPanes from "$lib/components-ide/TwoPanes.svelte";
</script>

<!-- /components -->
<!-- Old, pre-redesign.
<Nav />
<Body />
-->

<!-- /components-ide -->
<Nav />
<!--
<SplitPanes />
-->
<TwoPanes />
