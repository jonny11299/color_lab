<script>
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { onMount } from "svelte";

    // -------- QUICK TUTORIAL --------
    import img1 from "$lib/images/small/upload.png";
    import img2 from "$lib/images/small/pick.png";
    import img3 from "$lib/images/small/contrast.png";
    import img4 from "$lib/images/small/settings.png";
    import img5 from "$lib/images/small/autogen.png";
    import img6 from "$lib/images/small/preview.png";

    import overviewImage from "$lib/images/small/overview.png";
    import realUseImage from "$lib/images/small/realUse.png";

    const quickTutorialSteps = [
        {
            img: img3,
            title: "The Contrast Window",
            text: "stages the 6 CSS color variables that will drive the website's design. Contrast against the --background and --surface variables is shown beneath each color, and to the right, a final contrast rating is given. Contrast rating is given based on the APCA contrast method.",
        },
        { img: img1, title: "The Image Uploader", text: "allows you to extract colors from an image on your desktop." },
        {
            img: img2,
            title: "The Picker Window",
            text: "allows you to select any color. Click the 'pick' button or the big square to open your OS-native color picker, or click on any of the related colors on the right.",
        },
        {
            img: img6,
            title: "The Preview Window",
            text: "renders a sample website using the colors you've selected.",
        },
        {
            img: img4,
            title: "The Site Settings Window",
            text: "allows you to modify final CSS properties unrelated to color.",
        },
        {
            img: img5,
            title: "The Stylesheet",
            text: "stays up-to-date with your color selections and site settings. It can be downloaded or copied from directly.",
        },
    ];

    const overviewSteps = [
        {
            img: overviewImage,
            title: "Image → CSS",
            text: "This app allows you to take any input image and generate pre-formatted CSS definitions in minutes.",
        },
        {
            img: realUseImage,
            title: "Live Website Render",
            text: "A preview site is rendered while you select colors. This allows you to dial-in with precision.",
        },
    ];

    // -------- FULL TUTORIAL, 'FULL WALKTHROUGH' --------
    import w1 from "$lib/images/big/walkthru 1.png";
    import w2 from "$lib/images/big/walkthru 2.png";
    import w3 from "$lib/images/big/walkthru 3.png";
    import w4 from "$lib/images/big/walkthru 4.png";
    import w5 from "$lib/images/big/walkthru 5.png";
    import w6 from "$lib/images/big/walkthru 6.png";
    import w7 from "$lib/images/big/walkthru 7.png";
    import w8 from "$lib/images/big/walkthru 8.png";
    const walkthruImages = [w1, w2, w3, w4, w5, w6, w7, w8];
    let walkIndex = $state(0);

    function nextWalk() {
        if (walkIndex < walkthruImages.length - 1) walkIndex++;
    }

    function prevWalk() {
        if (walkIndex > 0) walkIndex--;
    }

    // -------- OVERALL RENDERING --------

    let showLaunchScreen = phaseStore.launchScreen;

    const states = ["openingWindow", "quickTutorial", "fullTutorial"];
    let state = $state(states[1]);

    function handleClose() {
        phaseStore.closeHelpWindow();
    }
    function handleCloseDontShow() {
        localStorage.setItem("dontShowColorLabHelpAgain", true);
        phaseStore.closeHelpWindow();
    }
    function handleCloseDoShow() {
        localStorage.removeItem("dontShowColorLabHelpAgain");
        phaseStore.closeHelpWindow();
    }

    function quickTutorial() {
        state = states[1];
    }

    function fullTutorial() {
        walkIndex = 0;
        state = states[2];
    }

    /* vestigal code, I just decided to use the 'overview' page as the landing instead of state[0] */
    onMount(() => {
        if (showLaunchScreen) {
            state = states[1];
        } else {
            state = states[1];
        }
    });

    function handleKey(e) {
        if (phaseStore.help) {
            if (state !== states[2]) return;
            if (e.key === "ArrowRight") nextWalk();
            if (e.key === "ArrowLeft") prevWalk();
        }
    }
</script>

<svelte:window onkeydown={handleKey} />

<div class="overlay">
    <div class="overlay-content">
        <nav class="overlay-nav">
            <button class="close-btn" onclick={handleClose} aria-label="Close"> ✕ </button>
        </nav>

        {#if state === states[0]}
            <!-- Opening state: -->
            <div class="overlay-body center-body">
                <h1 class="header">Welcome to Color Lab</h1>
                <button class="action-btn" onclick={quickTutorial}>See How It Works</button>
                <button class="action-btn" style="margin-top: 8rem;" onclick={handleClose}>Close</button>
            </div>
        {:else if state === states[1]}
            <!-- Quick tutorial: -->
            <div class="overlay-body scroll-body">
                <h1 class="header">Overview:</h1>
                <div class="quickTutorialGrid">
                    {#each overviewSteps as step, i}
                        <div class="tutorialRow">
                            <div class="stepBadge">{i + 1}</div>
                            <img class="tutorialImg" src={step.img} alt={step.title} />
                            <div class="tutorialText">
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </div>
                    {/each}
                </div>

                <h1 class="header" style="margin-top: 5rem;">Components:</h1>
                <div class="quickTutorialGrid">
                    {#each quickTutorialSteps as step, i}
                        <div class="tutorialRow">
                            <div class="stepBadge">{i + 1}</div>
                            <img class="tutorialImg" src={step.img} alt={step.title} />
                            <div class="tutorialText">
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </div>
                    {/each}
                </div>
                <button class="action-btn" style="margin-top: 4rem;" onclick={fullTutorial}>Full Walkthrough</button>
                <button class="action-btn" style="margin-top: 3rem;" onclick={handleClose}>Close</button>
                <button class="action-btn" onclick={handleCloseDontShow}>Close, and don't show on launch.</button>
            </div>
        {:else if state === states[2]}
            <!-- Full tutorial: big image + prev/next arrows -->
            <div class="overlay-body walk-body">
                <div class="walkStage">
                    <button class="walkArrow" onclick={prevWalk} disabled={walkIndex === 0} aria-label="Previous">‹</button>

                    <img class="walkImg" src={walkthruImages[walkIndex]} alt={`Walkthrough ${walkIndex + 1}`} />

                    <button class="walkArrow" onclick={nextWalk} disabled={walkIndex === walkthruImages.length - 1} aria-label="Next">›</button>
                </div>

                <div class="walkFooter">
                    <span class="walkCounter">{walkIndex + 1} / {walkthruImages.length}</span>
                    <button class="action-btn" onclick={quickTutorial}>Back to Overview</button>
                    <button class="action-btn" onclick={handleClose}>Close</button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .overlay-content {
        width: 90%;
        height: 95%;
        background: rgb(8, 8, 18);
        border-radius: 8px;
        /* content itself no longer scrolls; the body does */
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .overlay-nav {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0.75rem 1rem;
        flex-shrink: 0;
    }

    .header {
        color: rgb(221, 221, 221);
        margin: 0 0 1.5rem 0;
        text-align: center;
    }

    .close-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.25rem;
        line-height: 1;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        transition:
            background 0.15s ease,
            color 0.15s ease;
    }

    .close-btn:hover {
        color: rgba(255, 255, 255, 1);
    }

    /* Shared body: a scrollable flex column.
       min-height: 0 is what actually lets it scroll inside the flex parent. */
    .overlay-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 1rem 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Opening screen: safe to center because content is short. */
    .center-body {
        justify-content: center;
        gap: 1rem;
    }

    /* Tutorial: top-aligned so the first rows are never clipped above the scroll. */
    .scroll-body {
        justify-content: flex-start;
    }

    .action-btn {
        background: #0072ab;
        border: 3px solid #0072ab;
        color: white;
        font-size: 1.1rem;
        padding: 0.6rem 1.5rem;
        margin: 0.5rem;
        cursor: pointer;
        width: auto;
    }

    .action-btn:hover {
        background: #0090dd;
        border: 3px solid white;
    }

    .quickTutorialGrid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;

        margin-bottom: 4rem;
    }

    .tutorialRow {
        display: flex;
        flex-direction: row;
        align-items: center; /* image + text share a vertical center → no diagonal look */
        gap: 1.25rem;
        padding: 1rem 1.25rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
    }

    .stepBadge {
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: #0072ab;
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tutorialImg {
        flex-shrink: 0;
        width: 640px;
        height: 480px;
        object-fit: contain;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.35);
        margin-right: 1rem;
    }

    .tutorialText {
        flex: 1;
        color: rgb(240, 240, 240);
    }

    .tutorialText h3 {
        margin: 0 0 0.25rem 0;
        color: rgb(250, 250, 250);
    }

    .tutorialText p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
        color: rgb(235, 235, 235);
    }

    /* Full tutorial: no scroll, image fills the space. */
    .walk-body {
        justify-content: center;
        gap: 1.5rem;
        overflow: hidden; /* the stage sizes to fit, so nothing scrolls */
    }

    .walkStage {
        flex: 1;
        min-height: 0; /* lets the image shrink to fit inside the flex column */
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
    }

    .walkImg {
        flex: 1;
        min-width: 0;
        max-height: 100%;
        max-width: 100%;
        object-fit: contain; /* whole image visible, never cropped */
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.35);
    }

    .walkArrow {
        flex-shrink: 0;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        border: 3px solid #0072ab;
        background: #0072ab;
        color: white;
        font-size: 2rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            background 0.15s ease,
            border-color 0.15s ease,
            opacity 0.15s ease;
    }

    .walkArrow:hover:not(:disabled) {
        background: #0090dd;
        border-color: white;
    }

    .walkArrow:disabled {
        opacity: 0.3;
        cursor: default;
    }

    .walkFooter {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .walkCounter {
        color: rgb(220, 220, 220);
        font-size: 1rem;
        min-width: 3.5rem;
        text-align: center;
    }
</style>
