<script lang="ts">
    interface Props {
        /* Surfaces */
        background?: string /* page base */;
        backgroundSubtle?: string /* cards, section fills, sidebars */;
        /* Text */
        text?: string /* headings, body — muted levels are derived */;
        /* Brand */
        primary?: string /* main CTA, links, active states */;
        secondary?: string /* supporting actions, ghost buttons, and border tones */;
        accent?: string /* badges, highlights, decorative pops */;
        /* Scale controls */
        muteStrength?: number /* 0 = no muting, 1 = full muting */;
        typeScale?: number /* modular scale ratio, e.g. 1.0 flat, 1.25, 1.333, 1.5 */;
        borderWidth?: number /* border thickness in px, 0–8 */;
        borderRadius?: number /* corner radius in px, 0–50 */;
    }

    // Color definitions.

    let {
        background = "#fafafa",
        backgroundSubtle = "#f0f0f5",
        text = "#1a1a2e",
        primary = "#5c6ac4",
        secondary = "#8892d4",
        accent = "#f49342",
        muteStrength = 1,
        typeScale = 1.333,
        borderWidth = 1,
        borderRadius = 10,
    }: Props = $props();

    /*    
    Calculates the colors for muted text. Two levels. textHint is subtler than textMuted.

     * Derived text levels, scaled by muteStrength.
     * muteStrength = 0 → both equal full text color (no muting)
     * muteStrength = 1 → text-muted at 55%, text-hint at 35%
     * Computed in script to avoid relying on calc() inside color-mix().
     */
    let textMuted = $derived(
        `color-mix(in srgb, ${text} ${Math.round(100 - muteStrength * 45)}%, transparent)`,
    );
    let textHint = $derived(
        `color-mix(in srgb, ${text} ${Math.round(100 - muteStrength * 65)}%, transparent)`,
    );

    /*
     * Border and radius passed as px strings so CSS variables carry units.
     * --sv-radius-sm is computed here at 60% of the full radius so buttons,
     * badges, and smaller elements scale in proportion.
     */
    let borderWidthPx = $derived(`${borderWidth}px`);
    let borderRadiusPx = $derived(`${borderRadius}px`);
    let borderRadiusSmPx = $derived(`${Math.round(borderRadius * 0.6)}px`);

    const features = [
        {
            icon: "⚡",
            title: "Real-time sync",
            desc: "Data flows instantly across your entire stack. No refresh needed, no lag tolerated.",
        },
        {
            icon: "🔍",
            title: "Smart search",
            desc: "Find any metric, report, or insight in seconds. Your entire data universe, searchable.",
        },
        {
            icon: "📊",
            title: "Visual reports",
            desc: "Turn complex datasets into charts your whole team can actually understand and act on.",
        },
    ];

    const stats = [
        { num: "50ms", label: "Avg. response time" },
        { num: "99.9%", label: "Uptime SLA" },
        { num: "12K+", label: "Teams on board" },
        { num: "4.9★", label: "Average rating" },
    ];

    const posts = [
        {
            tag: "Product",
            title: "How we rebuilt our query engine from scratch",
            date: "Apr 28",
        },
        {
            tag: "Guide",
            title: "The 5-minute setup that 10× your dashboards",
            date: "Apr 12",
        },
    ];
</script>

<div
    class="sv"
    style:--sv-bg={background}
    style:--sv-bg-subtle={backgroundSubtle}
    style:--sv-text={text}
    style:--sv-text-muted={textMuted}
    style:--sv-text-hint={textHint}
    style:--sv-primary={primary}
    style:--sv-secondary={secondary}
    style:--sv-accent={accent}
    style:--sv-border-width={borderWidthPx}
    style:--sv-radius={borderRadiusPx}
    style:--sv-radius-sm={borderRadiusSmPx}
    style:--sv-type-scale={typeScale}
>
    <!-- NAV -->
    <nav class="sv-nav">
        <div class="sv-wrap sv-nav-inner">
            <span class="sv-logo">◆ Lumina</span>
            <div class="sv-nav-links">
                <a href="#features" class="sv-nav-link">Features</a>
                <a href="#pricing" class="sv-nav-link">Pricing</a>
                <a href="#blog" class="sv-nav-link">Blog</a>
            </div>
            <button class="sv-btn-primary">Get started</button>
        </div>
    </nav>

    <!-- HERO -->
    <section class="sv-hero">
        <div class="sv-badge">✦ Now with AI-powered insights</div>
        <h1 class="sv-h1">
            Analytics that <em class="sv-em">actually</em> make sense
        </h1>
        <p class="sv-lead">
            Turn raw data into clear decisions. Built for teams who want
            answers, not more dashboards.
        </p>
        <div class="sv-hero-actions">
            <button class="sv-btn-primary sv-btn-lg">Start free trial</button>
            <button class="sv-btn-ghost sv-btn-lg">See how it works →</button>
        </div>
        <p class="sv-hero-note">No credit card required · Free for 14 days</p>
    </section>

    <!-- FEATURES -->
    <section class="sv-features" id="features">
        <div class="sv-wrap">
            <div class="sv-section-header">
                <h2 class="sv-h2">Everything you need to move fast</h2>
                <p class="sv-section-sub">
                    Simple, powerful, and designed to get out of your way.
                </p>
            </div>
            <div class="sv-cards">
                {#each features as f}
                    <div class="sv-card">
                        <div class="sv-card-icon">{f.icon}</div>
                        <h3 class="sv-h3">{f.title}</h3>
                        <p class="sv-card-text">{f.desc}</p>
                        <a href="#" class="sv-card-link">Learn more →</a>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- STATS -->
    <section class="sv-stats">
        <div class="sv-wrap sv-stats-grid">
            {#each stats as s}
                <div class="sv-stat">
                    <span class="sv-stat-num">{s.num}</span>
                    <span class="sv-stat-label">{s.label}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- BLOG POSTS -->
    <section class="sv-posts">
        <div class="sv-wrap">
            <div class="sv-section-header">
                <h2 class="sv-h2">From the blog</h2>
            </div>
            <div class="sv-posts-grid">
                {#each posts as p}
                    <a href="#" class="sv-post">
                        <span class="sv-post-tag">{p.tag}</span>
                        <h3 class="sv-post-title">{p.title}</h3>
                        <span class="sv-post-date">{p.date}</span>
                    </a>
                {/each}
                <div class="sv-post sv-post-cta">
                    <span class="sv-post-cta-text">Explore all articles</span>
                    <span class="sv-post-cta-arrow">→</span>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA BANNER -->
    <section class="sv-cta-banner">
        <h2 class="sv-cta-h2">Ready to see the difference?</h2>
        <p class="sv-cta-p">
            Join thousands of teams already using Lumina.
        </p>
        <button class="sv-btn-inverse"
            >Start for free — no credit card needed</button
        >
    </section>

    <!-- FOOTER -->
    <footer class="sv-footer">
        <div class="sv-wrap sv-footer-inner">
            <span class="sv-logo">◆ Lumina</span>
            <div class="sv-footer-links">
                <a href="#" class="sv-footer-link">Privacy</a>
                <a href="#" class="sv-footer-link">Terms</a>
                <a href="#" class="sv-footer-link">Contact</a>
                <a href="#" class="sv-footer-link">Status</a>
            </div>
            <span class="sv-footer-copy">© 2026 Lumina Inc.</span>
        </div>
    </footer>
</div>

<style>
    /* ─── RESET & ROOT ────────────────────────────────────────────────────────
     * All design tokens are resolved here from props set on the root element.
     *
     * Type scale: each heading level multiplies the one below by --sv-type-scale.
     *   h3 = 1rem × scale¹  |  h2 = 1rem × scale²  |  h1 = 1rem × scale³
     * At 1.0 all headings equal body size; at 1.5 h1 is ~3.4× body.
     *
     * Border: --sv-secondary drives all border tones, keeping structural colour
     * in the same family as the supporting brand colour.
     *   --sv-border        = secondary at 45% alpha  → card outlines, dividers
     *   --sv-border-subtle = secondary at 20% alpha  → lighter separators
     * On hover, borders step up to full --sv-secondary for clear feedback.
     *
     * Radius: --sv-radius is the full corner size (cards, sections).
     *         --sv-radius-sm is 60% of that, for buttons, badges, tags.
     *         Both are passed as px strings from script so CSS gets units.
     * ──────────────────────────────────────────────────────────────────────── */
    .sv {
        /* Derived type sizes */
        --sv-h3-size: calc(1rem * var(--sv-type-scale));
        --sv-h2-size: calc(var(--sv-h3-size) * var(--sv-type-scale));
        --sv-h1-size: calc(var(--sv-h2-size) * var(--sv-type-scale));

        /* Derived border tones from --secondary */
        --sv-border: color-mix(in srgb, var(--sv-secondary) 45%, transparent);
        --sv-border-subtle: color-mix(
            in srgb,
            var(--sv-secondary) 20%,
            transparent
        );

        background: var(--sv-bg);
        color: var(--sv-text);
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        overflow: hidden;
        min-width: 70%;
    }

    .sv *,
    .sv *::before,
    .sv *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .sv-wrap {
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* ─── TYPOGRAPHY ──────────────────────────────────────────────────────── */
    .sv-h1 {
        font-size: var(--sv-h1-size);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--sv-text);
    }

    .sv-h2 {
        font-size: var(--sv-h2-size);
        font-weight: 700;
        letter-spacing: -0.025em;
        color: var(--sv-text);
    }

    .sv-h3 {
        font-size: var(--sv-h3-size);
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--sv-text);
        margin-bottom: 0.5rem;
    }

    .sv-em {
        /* Italicised word in hero headline — primary pulls focus */
        color: var(--sv-primary);
        font-style: italic;
    }

    /* ─── BUTTONS ─────────────────────────────────────────────────────────── */

    /* Primary: filled --primary, text inverted to --background */
    .sv-btn-primary {
        background: var(--sv-primary);
        color: var(--sv-bg);
        border: var(--sv-border-width) solid transparent;
        padding: 0.55rem 1.1rem;
        border-radius: var(--sv-radius-sm);
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
        font-family: inherit;
        white-space: nowrap;
    }

    .sv-btn-primary:hover {
        opacity: 0.85;
    }

    /* Ghost: --secondary border signals a supporting (non-primary) action */
    .sv-btn-ghost {
        background: transparent;
        color: var(--sv-text);
        border: var(--sv-border-width) solid var(--sv-secondary);
        padding: 0.55rem 1.1rem;
        border-radius: var(--sv-radius-sm);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        white-space: nowrap;
        transition: border-color 0.15s;
    }

    /* Hover: ghost border upgrades to --primary — signals increased intent */
    .sv-btn-ghost:hover {
        border-color: var(--sv-primary);
    }

    /* Inverse: for --primary-background sections; flips to --background fill */
    .sv-btn-inverse {
        background: var(--sv-bg);
        color: var(--sv-primary);
        border: var(--sv-border-width) solid transparent;
        padding: 0.75rem 1.75rem;
        border-radius: var(--sv-radius-sm);
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.15s;
    }

    .sv-btn-inverse:hover {
        opacity: 0.9;
    }

    .sv-btn-lg {
        padding: 0.7rem 1.5rem;
        font-size: 1rem;
    }

    /* ─── NAV ─────────────────────────────────────────────────────────────── */
    .sv-nav {
        background: color-mix(in srgb, var(--sv-bg) 92%, transparent);
        backdrop-filter: blur(10px);
        border-bottom: var(--sv-border-width) solid var(--sv-border-subtle);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .sv-nav-inner {
        height: 60px;
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .sv-logo {
        font-weight: 800;
        font-size: 1rem;
        color: var(--sv-primary);
        letter-spacing: -0.01em;
        flex-shrink: 0;
    }

    .sv-nav-links {
        display: flex;
        gap: 1.75rem;
        flex: 1;
        justify-content: center;
    }

    .sv-nav-link {
        color: var(--sv-text-muted);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.15s;
    }

    .sv-nav-link:hover {
        color: var(--sv-text);
    }

    /* ─── HERO ────────────────────────────────────────────────────────────── */
    .sv-hero {
        max-width: 680px;
        margin: 0 auto;
        padding: 5.5rem 2rem 5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
    }

    /* Accent badge: light tint of --accent for bg, solid --accent for text */
    .sv-badge {
        display: inline-block;
        background: color-mix(in srgb, var(--sv-accent) 12%, transparent);
        color: var(--sv-accent);
        padding: 0.3rem 0.9rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        border: var(--sv-border-width) solid
            color-mix(in srgb, var(--sv-accent) 35%, transparent);
    }

    .sv-lead {
        font-size: 1.1rem;
        color: var(--sv-text-muted);
        max-width: 480px;
        line-height: 1.65;
    }

    .sv-hero-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .sv-hero-note {
        font-size: 0.78rem;
        color: var(--sv-text-hint);
    }

    /* ─── FEATURES ────────────────────────────────────────────────────────── */

    /* Section fill: --background-subtle lifts this section off the page base */
    .sv-features {
        background: var(--sv-bg-subtle);
        padding: 5rem 0;
    }

    .sv-section-header {
        text-align: center;
        margin-bottom: 3rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .sv-section-sub {
        font-size: 1rem;
        color: var(--sv-text-muted);
    }

    .sv-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.25rem;
    }

    /* Cards sit on --background to pop off the --background-subtle section */
    .sv-card {
        background: var(--sv-bg);
        border-radius: var(--sv-radius);
        padding: 1.75rem;
        border: var(--sv-border-width) solid var(--sv-border-subtle);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .sv-card-icon {
        font-size: 1.4rem;
        margin-bottom: 0.35rem;
    }

    .sv-card-text {
        font-size: 0.875rem;
        color: var(--sv-text-muted);
        line-height: 1.65;
        flex: 1;
    }

    /* Card links use --primary — same role as nav links and CTA buttons */
    .sv-card-link {
        margin-top: 0.75rem;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--sv-primary);
        text-decoration: none;
        transition: opacity 0.15s;
    }

    .sv-card-link:hover {
        opacity: 0.75;
    }

    /* ─── STATS ───────────────────────────────────────────────────────────── */
    .sv-stats {
        padding: 4rem 0;
    }

    .sv-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
    }

    /* Stat tiles: low-opacity --primary tint ties them to the brand colour */
    .sv-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        padding: 1.5rem 1rem;
        border-radius: var(--sv-radius);
        background: color-mix(in srgb, var(--sv-primary) 7%, transparent);
        border: var(--sv-border-width) solid
            color-mix(in srgb, var(--sv-primary) 18%, transparent);
    }

    .sv-stat-num {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--sv-primary);
        letter-spacing: -0.03em;
        line-height: 1;
    }

    .sv-stat-label {
        font-size: 0.75rem;
        color: var(--sv-text-muted);
        text-align: center;
        line-height: 1.3;
    }

    /* ─── BLOG POSTS ──────────────────────────────────────────────────────── */
    .sv-posts {
        padding: 4rem 0;
        background: var(--sv-bg-subtle);
    }

    .sv-posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.25rem;
    }

    .sv-post {
        background: var(--sv-bg);
        border-radius: var(--sv-radius);
        padding: 1.5rem;
        border: var(--sv-border-width) solid var(--sv-border-subtle);
        text-decoration: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: border-color 0.15s;
        color: var(--sv-text);
    }

    /* Hover: border steps up from subtle to full --sv-border */
    .sv-post:hover {
        border-color: var(--sv-border);
    }

    /* Post tags use --accent — same role as the hero badge */
    .sv-post-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--sv-accent);
    }

    .sv-post-title {
        font-size: 0.925rem;
        font-weight: 600;
        line-height: 1.4;
        color: var(--sv-text);
        flex: 1;
    }

    .sv-post-date {
        font-size: 0.75rem;
        color: var(--sv-text-hint);
    }

    /* CTA tile: tinted --primary, acts as a soft navigational prompt */
    .sv-post-cta {
        background: color-mix(in srgb, var(--sv-primary) 8%, transparent);
        border-color: color-mix(
            in srgb,
            var(--sv-primary) 20%,
            transparent
        ) !important;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        flex-direction: row;
        cursor: pointer;
    }

    .sv-post-cta-text {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--sv-primary);
    }

    .sv-post-cta-arrow {
        font-size: 1.1rem;
        color: var(--sv-primary);
    }

    /* ─── CTA BANNER ──────────────────────────────────────────────────────── */

    /* Full --primary background; all text inverts to --background */
    .sv-cta-banner {
        background: var(--sv-primary);
        padding: 5.5rem 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .sv-cta-h2 {
        font-size: var(--sv-h2-size);
        font-weight: 800;
        color: var(--sv-bg);
        letter-spacing: -0.025em;
    }

    /* Muted copy on coloured bg: mix --bg toward transparent rather than --text */
    .sv-cta-p {
        color: color-mix(in srgb, var(--sv-bg) 75%, transparent);
        font-size: 1rem;
    }

    /* ─── FOOTER ──────────────────────────────────────────────────────────── */
    .sv-footer {
        /* Blend of --bg-subtle and --bg: slightly recessed without a hard edge */
        background: color-mix(in srgb, var(--sv-bg-subtle) 60%, var(--sv-bg));
        border-top: var(--sv-border-width) solid var(--sv-border-subtle);
        padding: 2rem 0;
    }

    .sv-footer-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .sv-footer-links {
        display: flex;
        gap: 1.5rem;
    }

    .sv-footer-link {
        color: var(--sv-text-muted);
        text-decoration: none;
        font-size: 0.825rem;
        transition: color 0.15s;
    }

    .sv-footer-link:hover {
        color: var(--sv-text);
    }

    .sv-footer-copy {
        font-size: 0.78rem;
        color: var(--sv-text-hint);
    }
</style>
