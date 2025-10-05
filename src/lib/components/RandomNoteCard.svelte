<script lang="ts">
    export let note: { name: string; message: string } | null = null;
</script>

{#if note}
    <div class="random-note-card">
        <blockquote>{note.message}</blockquote>
        <div class="note-author">— {note.name}</div>
    </div>
{/if}

<style>
    .random-note-card {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 24, 36, 0.92);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        padding: 2rem 2.5rem;
        color: #fffbe7;
        z-index: 30;
        min-width: 320px;
        max-width: 90vw;
        text-align: center;
    }
    .random-note-card h3 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
        color: #ffe0a3;
    }
    .random-note-card blockquote {
        font-size: 1.1rem;
        margin: 0 0 1.2rem 0;
        color: #fff;
        font-style: italic;
    }
    .random-note-card .note-author {
        color: #ffe0a3;
        font-size: 1rem;
        margin-top: 0.5rem;
    }
</style>
