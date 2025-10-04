<script lang="ts">
    // Moon component with realistic arc movement across the sky
</script>

<div class="moon-container">
    <div class="moon">
        <div class="moon-surface"></div>
        <div class="moon-glow"></div>
    </div>
</div>

<style>
    .moon-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3; /* Above stars but below horizon and content */
    }

    .moon {
        position: absolute;
        width: 60px;
        height: 60px;
        animation: moonArc 240s infinite linear;
        transform-origin: center;
    }

    .moon-surface {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(
            135deg,
            #f5f5dc 0%,
            #e6e6fa 30%,
            #d3d3d3 70%,
            #c0c0c0 100%
        );
        box-shadow:
            inset -8px -8px 12px rgba(0, 0, 0, 0.3),
            inset 2px 2px 8px rgba(255, 255, 255, 0.4);
        overflow: hidden;
    }

    /* Moon crater details */
    .moon-surface::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        top: 15px;
        left: 20px;
        box-shadow:
            12px 8px 0 -2px rgba(0, 0, 0, 0.15),
            -5px 25px 0 -3px rgba(0, 0, 0, 0.1),
            25px 20px 0 -4px rgba(0, 0, 0, 0.12);
    }

    .moon-glow {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 40%,
            transparent 70%
        );
        animation: moonGlow 8s ease-in-out infinite alternate;
    }

    @keyframes moonArc {
        0% {
            /* Moon starts behind horizon in the east */
            left: 95%;
            top: 95%;
            transform: scale(0.7);
        }
        8% {
            /* Moon begins to rise above horizon */
            left: 90%;
            top: 75%;
            transform: scale(0.8);
        }
        15% {
            /* Fully visible above horizon */
            left: 85%;
            top: 60%;
            transform: scale(0.9);
        }
        25% {
            /* Quarter way across sky */
            left: 75%;
            top: 35%;
            transform: scale(1);
        }
        50% {
            /* Moon at zenith (highest point) */
            left: 50%;
            top: 10%;
            transform: scale(1.1);
        }
        75% {
            /* Three quarters across */
            left: 25%;
            top: 35%;
            transform: scale(1);
        }
        85% {
            /* Starting to approach horizon */
            left: 15%;
            top: 60%;
            transform: scale(0.9);
        }
        92% {
            /* Moon setting behind horizon */
            left: 10%;
            top: 75%;
            transform: scale(0.8);
        }
        100% {
            /* Moon completely behind horizon in the west */
            left: 5%;
            top: 95%;
            transform: scale(0.7);
        }
    }

    @keyframes moonGlow {
        0% {
            opacity: 0.3;
            transform: scale(1);
        }
        100% {
            opacity: 0.6;
            transform: scale(1.1);
        }
    }

    /* Responsive sizing */
    @media (max-width: 768px) {
        .moon {
            width: 45px;
            height: 45px;
        }

        .moon-glow {
            top: -8px;
            left: -8px;
            width: 61px;
            height: 61px;
        }
    }

    @media (min-width: 1200px) {
        .moon {
            width: 80px;
            height: 80px;
        }

        .moon-glow {
            top: -12px;
            left: -12px;
            width: 104px;
            height: 104px;
        }
    }
</style>
