<script lang="ts">
    import AutumnSky from "$lib/components/AutumnSky.svelte";
    import BirthdayCard from "$lib/components/BirthdayCard.svelte";
    import GuestNoteCard from "$lib/components/GuestNoteCard.svelte";

    import RandomNoteCard from "$lib/components/RandomNoteCard.svelte";
    import { onMount } from "svelte";

    let showCard = false;
    let showRandomNote = false;
    let showGuestNote = false;
    let notes: Array<{ name: string; message: string }> = [];
    let shownNoteIndexes: number[] = [];
    let currentNote: { name: string; message: string } | null = null;
    let clickCount = 0;

    async function fetchNotes() {
        try {
            const res = await fetch("/api/notes");
            if (res.ok) {
                notes = await res.json();
            }
        } catch {}
    }

    function getExclusiveRandomIndex() {
        if (notes.length === 0) return -1;
        if (shownNoteIndexes.length === notes.length) {
            shownNoteIndexes = [];
        }
        let idx;
        do {
            idx = Math.floor(Math.random() * notes.length);
        } while (
            shownNoteIndexes.includes(idx) &&
            shownNoteIndexes.length < notes.length
        );
        shownNoteIndexes.push(idx);
        return idx;
    }

    async function handleStarClick() {
        if (!showCard) {
            showCard = true;
            return;
        }
        // After card is shown, show a new random note on every click
        if (notes.length === 0) {
            await fetchNotes();
        }
        if (notes.length === 0) {
            // No notes to show
            showRandomNote = false;
            currentNote = null;
            return;
        }
        const idx = getExclusiveRandomIndex();
        if (idx !== -1) {
            currentNote = notes[idx];
            showRandomNote = true;
        }
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
    {#if showRandomNote && currentNote}
        <RandomNoteCard note={currentNote} />
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
