<script lang="ts">
    // Autumn night sky composition with celestial elements
    import Moon from "./Moon.svelte";
    import Stars from "./Stars.svelte";
    import ShootingStars from "./ShootingStars.svelte";
    import Horizon from "./Horizon.svelte";

    export let onStarClick: (() => void) | undefined = undefined;
</script>

<div class="autumn-sky">
    <!-- Stars layer -->
    <Stars count={120} skyArea={70} {onStarClick} />

    <!-- Shooting stars layer -->
    <ShootingStars frequency={12500} variance={7500} />

    <!-- Moon layer -->
    <Moon />

    <!-- Horizon silhouette -->
    <Horizon profile="hills" height="30vh" />

    <!-- Content slot -->
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .autumn-sky {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(
            to bottom,
            #0a0a1a 0%,
            #1a1a3a 30%,
            #2d1810 70%,
            #1a0f0a 100%
        );
    }

    .content {
        position: relative;
        z-index: 5; /* Lower than stars */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 2rem;
        text-align: center;
        color: #ffffff;
        pointer-events: none; /* Don't block clicks to stars */
    }

    .content > :global(*) {
        pointer-events: auto; /* Re-enable clicks for content children */
    }

    /* Add some subtle animated shooting stars */
    .autumn-sky::before {
        content: "";
        position: absolute;
        top: 20%;
        left: -100px;
        width: 2px;
        height: 2px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 10px #ffffff;
        animation: shooting-star 8s infinite linear;
        opacity: 0;
    }

    .autumn-sky::after {
        content: "";
        position: absolute;
        top: 40%;
        right: -100px;
        width: 1px;
        height: 1px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 8px #ffffff;
        animation: shooting-star-reverse 12s infinite linear;
        opacity: 0;
        animation-delay: 4s;
    }

    @keyframes shooting-star {
        0% {
            opacity: 0;
            transform: translateX(0) translateY(0);
        }
        5% {
            opacity: 1;
        }
        10% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(calc(100vw + 200px)) translateY(200px);
        }
    }

    @keyframes shooting-star-reverse {
        0% {
            opacity: 0;
            transform: translateX(0) translateY(0);
        }
        5% {
            opacity: 1;
        }
        10% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(calc(-100vw - 200px)) translateY(150px);
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .content {
            padding: 1rem;
        }
    }
</style>
