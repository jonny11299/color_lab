<script>
	import "../app.css";
	import { themeStore } from "$lib/stores/theme.svelte.js";
	import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
	// import Body from "$lib/components/Body.svelte"; // pre-redesign
	// import Nav from "$lib/components/Nav.svelte"; // pre-redesign
	import Nav from "$lib/components-ide/Nav.svelte";
	import SplitPanes from "$lib/components-ide/SplitPanes.svelte";
	import CssEditor from "$lib/components-ide/CssEditor.svelte";
	import TwoPanes from "$lib/components-ide/TwoPanes.svelte";
	import ExportWindow from "$lib/components-ide/ExportWindow.svelte";
	import HelpWindow from "$lib/components-ide/HelpWindow.svelte";

	import { onMount } from "svelte";

	let showLaunch = $state(false);
	onMount(() => {
		// true if it doesn't exist, false if somebody set this to true.
		const dontShowLaunchSplash = localStorage.getItem("dontShowColorLabHelpAgain");
		if (!dontShowLaunchSplash) {
			phaseStore.openHelpWindowLaunch();
		}

		themeStore.setTheme("grey");
	});
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

{#if phaseStore.exporting}
	<ExportWindow />
{/if}

<div style={phaseStore.exporting ? "display: hidden" : "display: block"}>
	<TwoPanes />
</div>

{#if phaseStore.help}
	<HelpWindow />
{/if}

<style>
</style>
