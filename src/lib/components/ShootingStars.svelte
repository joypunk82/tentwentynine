<script lang="ts">
    // Shooting star component that creates periodic meteor streaks
    import { onMount } from "svelte";

    export let frequency: number = 12500; // Average time between shooting stars in ms (12.5 seconds)
    export let variance: number = 7500; // Random variance (+/- 7.5 seconds, giving 5-20 second range)

    let shootingStars: Array<{
        id: number;
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        angle: number;
        duration: number;
        delay: number;
    }> = [];

    let nextId = 0;

    function createShootingStar() {
        // Random starting position (usually from upper edges)
        const side = Math.random();
        let startX, startY, endX, endY, angle;

        if (side < 0.3) {
            // From top edge
            startX = Math.random() * 100;
            startY = -5;
            endX =
                startX +
                (Math.random() * 40 + 20) * (Math.random() > 0.5 ? 1 : -1);
            endY = Math.random() * 60 + 20;
        } else if (side < 0.6) {
            // From right edge
            startX = 105;
            startY = Math.random() * 40;
            endX = Math.random() * 60;
            endY = startY + (Math.random() * 40 + 20);
        } else {
            // From left edge
            startX = -5;
            startY = Math.random() * 40;
            endX = Math.random() * 60 + 40;
            endY = startY + (Math.random() * 40 + 20);
        }

        // Calculate angle for the tail
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        const newStar = {
            id: nextId++,
            startX,
            startY,
            endX,
            endY,
            angle,
            duration: Math.random() * 1000 + 1500, // 1.5-2.5 seconds
            delay: 0,
        };

        shootingStars = [...shootingStars, newStar];

        // Remove shooting star after animation completes
        setTimeout(() => {
            shootingStars = shootingStars.filter(
                (star) => star.id !== newStar.id,
            );
        }, newStar.duration + 500);
    }

    function scheduleNextShootingStar() {
        const randomDelay = frequency + (Math.random() - 0.5) * 2 * variance;
        setTimeout(() => {
            createShootingStar();
            scheduleNextShootingStar();
        }, randomDelay);
    }

    onMount(() => {
        // Start the shooting star cycle
        scheduleNextShootingStar();
    });
</script>

<div class="shooting-stars">
    {#each shootingStars as star (star.id)}
        <div
            class="shooting-star"
            style="
                --start-x: {star.startX}%;
                --start-y: {star.startY}%;
                --end-x: {star.endX}%;
                --end-y: {star.endY}%;
                --angle: {star.angle}deg;
                --duration: {star.duration}ms;
                animation-delay: {star.delay}ms;
            "
        >
            <div class="star-head"></div>
            <div class="star-tail"></div>
        </div>
    {/each}
</div>

<style>
    .shooting-stars {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2; /* Above stars, below moon */
        overflow: hidden;
    }

    .shooting-star {
        position: absolute;
        left: var(--start-x);
        top: var(--start-y);
        transform: rotate(var(--angle));
        animation: shootAcrossSky var(--duration) ease-out forwards;
    }

    .star-head {
        position: absolute;
        width: 3px;
        height: 3px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow:
            0 0 6px #ffffff,
            0 0 12px #ffffff,
            0 0 18px rgba(255, 255, 255, 0.8);
        z-index: 2;
    }

    .star-tail {
        position: absolute;
        top: 50%;
        right: 3px;
        width: 0;
        height: 1px;
        background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 20%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.1) 80%,
            transparent 100%
        );
        transform: translateY(-50%);
        animation: growTail var(--duration) ease-out forwards;
        z-index: 1;
    }

    @keyframes shootAcrossSky {
        0% {
            opacity: 0;
            left: var(--start-x);
            top: var(--start-y);
        }
        5% {
            opacity: 1;
        }
        95% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            left: var(--end-x);
            top: var(--end-y);
        }
    }

    @keyframes growTail {
        0% {
            width: 0;
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        20% {
            width: 20px;
        }
        50% {
            width: 60px;
        }
        80% {
            width: 80px;
            opacity: 0.8;
        }
        100% {
            width: 100px;
            opacity: 0;
        }
    }

    /* Add some color variation for different shooting stars */
    .shooting-star:nth-child(3n) .star-head {
        background: #fffacd;
        box-shadow:
            0 0 6px #fffacd,
            0 0 12px #fffacd,
            0 0 18px rgba(255, 250, 205, 0.8);
    }

    .shooting-star:nth-child(3n) .star-tail {
        background: linear-gradient(
            to left,
            rgba(255, 250, 205, 0.9) 0%,
            rgba(255, 250, 205, 0.7) 20%,
            rgba(255, 250, 205, 0.4) 50%,
            rgba(255, 250, 205, 0.1) 80%,
            transparent 100%
        );
    }

    .shooting-star:nth-child(5n) .star-head {
        background: #e6f3ff;
        box-shadow:
            0 0 6px #e6f3ff,
            0 0 12px #e6f3ff,
            0 0 18px rgba(230, 243, 255, 0.8);
    }

    .shooting-star:nth-child(5n) .star-tail {
        background: linear-gradient(
            to left,
            rgba(230, 243, 255, 0.9) 0%,
            rgba(230, 243, 255, 0.7) 20%,
            rgba(230, 243, 255, 0.4) 50%,
            rgba(230, 243, 255, 0.1) 80%,
            transparent 100%
        );
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .star-head {
            width: 2px;
            height: 2px;
        }

        @keyframes growTail {
            0% {
                width: 0;
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            20% {
                width: 15px;
            }
            50% {
                width: 40px;
            }
            80% {
                width: 60px;
                opacity: 0.8;
            }
            100% {
                width: 80px;
                opacity: 0;
            }
        }
    }
</style>
