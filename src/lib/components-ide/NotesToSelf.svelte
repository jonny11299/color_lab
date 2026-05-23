<script>
</script>

<div class="container">
    <h3 class="title">Notes:</h3>
    <p>It actually makes a lot more sense to have the workflow on the left and the preview on the right, just one split pane left-right.</p>
    <p>Collapsable stuff still rocks though.</p>
    <p>Also, we need to be sure to add in the other website properties.</p>
    <p>We don't have to go too hard, because this is a color picker, not a margin / padding picker... but still.</p>
    <p>
        I also think I need some more stuff in Palette, some more chroma-inspired selections. Could just do more rows of colors. Here's a good idea on
        that: Sort the palette out by darkness, from lightest to darkest. Then list some hue bands at 3-5 levels of darkness, as per the photo. If
        folks want more hues. Or just... a full on hue-saturation rectangle relative to a particular lightness could be cool.
    </p>
    <p>For example... https://colorbrewer2.org/#type=sequential&scheme=PuRd&n=3</p>
    <p>
        Palette currently sorts by lightness. Could do "sort by frequency in image, sort by lightness, sort by chroma, sort by hue". Or sort by
        contrast from the darkest element?
    </p>
</div>

<style>
    .title {
        color: var(--text);
        padding: 0px;
        margin: 0px;
    }
    .container {
        border: 1px solid var(--border);
        border-radius: 0;
        padding: 1rem;
        max-width: 20rem;
        min-width: 12rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
