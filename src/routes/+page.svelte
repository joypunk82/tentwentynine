<script lang="ts">
    import AutumnSky from "$lib/components/AutumnSky.svelte";
    import BirthdayCard from "$lib/components/BirthdayCard.svelte";
    import GuestNoteCard from "$lib/components/GuestNoteCard.svelte";
    import { onMount } from "svelte";

    let showCard = false;
    let showGuestNote = false;

    function handleStarClick() {
        showCard = true;
    }

    onMount(() => {
        try {
            const url = new URL(window.location.href);
            showGuestNote = url.searchParams.has("guest");
        } catch {}
    });
</script>

<AutumnSky onStarClick={handleStarClick}>
    {#if showCard}
        <BirthdayCard />
    {/if}
</AutumnSky>

{#if showGuestNote}
    <GuestNoteCard />
{/if}

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
