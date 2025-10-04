<script lang="ts">
    // Horizon component for landscape silhouette
    export let height: string = "30vh"; // Height of the horizon
    export let profile: "hills" | "mountains" | "forest" | "city" = "hills"; // Horizon profile type

    // Different clip-path profiles for various landscapes
    const profiles = {
        hills: `polygon(
            0% 100%,
            0% 80%,
            5% 75%,
            10% 78%,
            15% 72%,
            20% 75%,
            25% 70%,
            30% 73%,
            35% 68%,
            40% 71%,
            45% 65%,
            50% 68%,
            55% 62%,
            60% 65%,
            65% 60%,
            70% 63%,
            75% 58%,
            80% 61%,
            85% 56%,
            90% 59%,
            95% 54%,
            100% 57%,
            100% 100%
        )`,
        mountains: `polygon(
            0% 100%,
            0% 85%,
            8% 45%,
            15% 50%,
            22% 35%,
            30% 40%,
            38% 25%,
            45% 30%,
            52% 15%,
            60% 20%,
            68% 40%,
            75% 35%,
            82% 50%,
            90% 45%,
            95% 60%,
            100% 55%,
            100% 100%
        )`,
        forest: `polygon(
            0% 100%,
            0% 70%,
            3% 68%,
            6% 72%,
            9% 65%,
            12% 70%,
            15% 62%,
            18% 68%,
            21% 60%,
            24% 66%,
            27% 58%,
            30% 64%,
            33% 56%,
            36% 62%,
            39% 54%,
            42% 60%,
            45% 52%,
            48% 58%,
            51% 50%,
            54% 56%,
            57% 48%,
            60% 54%,
            63% 46%,
            66% 52%,
            69% 44%,
            72% 50%,
            75% 42%,
            78% 48%,
            81% 40%,
            84% 46%,
            87% 38%,
            90% 44%,
            93% 36%,
            96% 42%,
            100% 34%,
            100% 100%
        )`,
        city: `polygon(
            0% 100%,
            0% 75%,
            8% 75%,
            8% 60%,
            15% 60%,
            15% 70%,
            22% 70%,
            22% 45%,
            30% 45%,
            30% 65%,
            38% 65%,
            38% 40%,
            45% 40%,
            45% 55%,
            52% 55%,
            52% 35%,
            60% 35%,
            60% 50%,
            68% 50%,
            68% 30%,
            75% 30%,
            75% 60%,
            82% 60%,
            82% 50%,
            90% 50%,
            90% 70%,
            100% 70%,
            100% 100%
        )`,
    };
</script>

<div
    class="horizon"
    style="height: {height}; clip-path: {profiles[profile]};"
></div>

<style>
    .horizon {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 4; /* Above moon and stars */
        background: linear-gradient(
            to top,
            #000000 0%,
            #1a0f0a 40%,
            rgba(26, 15, 10, 0.8) 70%,
            transparent 100%
        );
    }

    /* Add some subtle texture variation for different profiles */
    .horizon::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 25%,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 75%,
            transparent 100%
        );
        opacity: 0.3;
    }
</style>
