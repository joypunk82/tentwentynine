<script lang="ts">
    // Stars component for generating twinkling stars across the night sky
    import { onMount } from "svelte";

    export let count: number = 100; // Number of stars to generate
    export let skyArea: number = 70; // Percentage of sky height to populate with stars
    export let onStarClick: (() => void) | undefined = undefined;

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
        {#if onStarClick}
            <button
                class="star-btn"
                style="
                    left: {star.x}%;
                    top: {star.y}%;
                    width: 24px;
                    height: 24px;
                "
                on:click={() => {
                    onStarClick?.();
                }}
                aria-label="Click to reveal birthday card"
            >
                <span
                    class="star clickable"
                    style="
                        width: {star.size}px;
                        height: {star.size}px;
                        animation-delay: {star.delay}s;
                    "
                ></span>
            </button>
        {:else}
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
        {/if}
    {/each}
</div>

<style>
    .stars {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto; /* Always allow pointer events */
        z-index: 8; /* Above content but below birthday card */
    }

    .star {
        position: absolute;
        background: #ffffff;
        border-radius: 50%;
        opacity: 0.8;
        animation: twinkle 2s infinite ease-in-out;
        box-shadow: 0 0 6px #ffffff;
        border: none;
        padding: 0;
        cursor: default;
        pointer-events: none; /* Non-clickable stars don't interfere */
        display: block;
        margin: auto;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        position: absolute;
    }

    .star-btn {
        position: absolute;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1;
        transition: box-shadow 0.2s;
    }

    .star-btn:focus {
        outline: 2px solid rgba(255, 255, 255, 0.6);
        outline-offset: 2px;
    }

    .star.clickable {
        pointer-events: none;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #ffffff;
        box-shadow: 0 0 8px #ffffff;
        z-index: 2;
        animation: twinkleClickable 1.5s infinite ease-in-out;
    }

    .star-btn:hover .star.clickable {
        transform: scale(1.5);
        opacity: 1;
        box-shadow:
            0 0 12px #ffffff,
            0 0 24px rgba(255, 255, 255, 0.5);
        animation: none; /* Pause twinkling on hover */
    }

    @keyframes twinkleClickable {
        0%,
        100% {
            opacity: 0.7;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.15);
        }
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
