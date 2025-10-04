<script lang="ts">
    // Stars component for generating twinkling stars across the night sky
    import { onMount } from "svelte";

    export let count: number = 100; // Number of stars to generate
    export let skyArea: number = 70; // Percentage of sky height to populate with stars

    let stars: Array<{ x: number; y: number; size: number; delay: number }> =
        [];

    onMount(() => {
        // Generate random stars
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * 100,
            y: Math.random() * skyArea, // Keep stars in upper portion of screen
            size: Math.random() * 3 + 1,
            delay: Math.random() * 3,
        }));
    });
</script>

<div class="stars">
    {#each stars as star}
        <div
            class="star"
            style="
                left: {star.x}%;
                top: {star.y}%;
                width: {star.size}px;
                height: {star.size}px;
                animation-delay: {star.delay}s;
            "
        ></div>
    {/each}
</div>

<style>
    .stars {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1; /* Behind moon but above background */
    }

    .star {
        position: absolute;
        background: #ffffff;
        border-radius: 50%;
        opacity: 0.8;
        animation: twinkle 2s infinite ease-in-out;
        box-shadow: 0 0 6px #ffffff;
    }

    @keyframes twinkle {
        0%,
        100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    /* Add some variety to star colors and brightness */
    .star:nth-child(3n) {
        background: #fffacd; /* Light yellow tint */
        box-shadow: 0 0 6px #fffacd;
    }

    .star:nth-child(5n) {
        background: #f0f8ff; /* Light blue tint */
        box-shadow: 0 0 4px #f0f8ff;
        animation-duration: 2.5s;
    }

    .star:nth-child(7n) {
        background: #fff5ee; /* Warm white */
        box-shadow: 0 0 8px #fff5ee;
        animation-duration: 1.8s;
    }
</style>
