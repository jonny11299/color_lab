<script>
    import "../app.css";
    import { themeStore } from "$lib/stores/theme.svelte.js";
    import Nav from "$lib/components-ide/Nav.svelte";
    import Body from "$lib/components/Body.svelte";
    import SplitPanes from "$lib/components-ide/SplitPanes.svelte";
</script>

<!-- Old, pre-redesign. This version is located in 'components' 
<Nav />
<Body />
-->

<!-- /components-ide -->
<Nav />
<SplitPanes />