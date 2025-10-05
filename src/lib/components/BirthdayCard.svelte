<script lang="ts">
    // Birthday card for Taylor, from Mike, turning 35
    // Animation: grows from star to full size
    import { onMount } from "svelte";
    let show = false;
    onMount(() => {
        setTimeout(() => {
            show = true;
        }, 50);
    });
</script>

<div class="birthday-card grow-from-star {show ? 'show' : ''}">
    <div class="card-content">
        <div class="greeting">
            <h1 class="happy-birthday">Happy Birthday</h1>
            <h2 class="recipient-name">Taylor</h2>
            <div class="age-celebration">
                <span class="age-number">35</span>
                <span class="age-label">years of awesome!</span>
            </div>
        </div>
        <div class="message">
            <p class="message-text">
                Wishing you a magical year filled with love, laughter, and
                adventure. You light up the sky, my love!
            </p>
        </div>
        <div class="signature">
            <p class="from-text">Yours always,</p>
            <p class="from-name">Mike</p>
        </div>
        <div class="decorative-stars">
            <span class="deco-star">✨</span>
            <span class="deco-star">⭐</span>
            <span class="deco-star">🌟</span>
        </div>
    </div>
</div>

<style>
    .birthday-card {
        position: fixed;
        left: 2rem;
        top: 50%;
        transform: translateY(-50%);
        width: 350px;
        max-width: calc(100vw - 4rem);
        z-index: 15;
        pointer-events: auto;
        opacity: 0;
        /* Start tiny for animation */
        transform-origin: 40px 50%; /* left middle, approx where a star might be */
        scale: 0.1;
        transition: none;
    }

    .birthday-card.show {
        opacity: 1 !important;
        scale: 1;
        transition:
            opacity 0.5s cubic-bezier(0.4, 2, 0.6, 1),
            scale 0.8s cubic-bezier(0.4, 2, 0.6, 1);
    }

    /* Optionally, you can tweak the transform-origin to match the star's position more closely if needed */

    .card-content {
        background: linear-gradient(145deg, #fff 0%, #fff 50%, #f8f8ff 100%);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 2rem;
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 10px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        animation: cardEntrance 1s ease-out;
    }

    .greeting {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .happy-birthday {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(
            45deg,
            #ff6b6b 0%,
            #ffd93d 25%,
            #6bcf7f 50%,
            #4d96ff 75%,
            #9c88ff 100%
        );
        background-size: 300% 300%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbowShift 3s ease-in-out infinite;
        margin: 0 0 0.5rem 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .recipient-name {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .age-celebration {
        margin-top: 1rem;
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.5rem;
    }

    .age-number {
        font-size: 3rem;
        font-weight: 800;
        color: #ff6b6b;
        text-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
        animation: ageGlow 2s ease-in-out infinite alternate;
    }

    .age-label {
        font-size: 1rem;
        color: #4a5568;
        font-weight: 500;
    }

    .message {
        text-align: center;
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .message-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #2d3748;
        margin: 0;
        font-style: italic;
    }

    .signature {
        text-align: right;
        margin-top: 1.5rem;
    }

    .from-text {
        font-size: 0.9rem;
        color: #718096;
        margin: 0 0 0.25rem 0;
    }

    .from-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
    }

    .decorative-stars {
        position: absolute;
        top: -10px;
        right: -10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .deco-star {
        font-size: 1.5rem;
        animation: starTwinkle 2s ease-in-out infinite;
        filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));
    }

    .deco-star:nth-child(2) {
        animation-delay: 0.7s;
    }

    .deco-star:nth-child(3) {
        animation-delay: 1.4s;
    }

    /* Remove old cardEntrance animation, replaced by grow-from-star transition */

    @keyframes rainbowShift {
        0%,
        100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    @keyframes ageGlow {
        0% {
            text-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
            transform: scale(1);
        }
        100% {
            text-shadow: 0 2px 12px rgba(255, 107, 107, 0.6);
            transform: scale(1.05);
        }
    }

    @keyframes starTwinkle {
        0%,
        100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
        }
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .birthday-card {
            left: 1rem;
            right: 1rem;
            width: auto;
            max-width: none;
            top: 2rem;
            transform: none;
            position: absolute;
        }

        .card-content {
            padding: 1.5rem;
        }

        .happy-birthday {
            font-size: 1.5rem;
        }

        .recipient-name {
            font-size: 1.2rem;
        }

        .age-number {
            font-size: 2.5rem;
        }

        .message-text {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .birthday-card {
            left: 0.5rem;
            right: 0.5rem;
        }

        .card-content {
            padding: 1rem;
        }

        .happy-birthday {
            font-size: 1.3rem;
        }

        .age-number {
            font-size: 2rem;
        }
    }
</style>
