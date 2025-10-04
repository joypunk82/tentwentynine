<script lang="ts">
    import AutumnSky from "$lib/components/AutumnSky.svelte";
    import BirthdayCard from "$lib/components/BirthdayCard.svelte";

    let showCard = false;

    function handleStarClick() {
        showCard = true;
    }
</script>

<AutumnSky onStarClick={handleStarClick}>
    {#if showCard}
        <BirthdayCard />
    {/if}
</AutumnSky>

<style>
    @keyframes glow {
        from {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        to {
            text-shadow: 0 0 30px rgba(255, 204, 153, 0.6);
        }
    }
</style>
