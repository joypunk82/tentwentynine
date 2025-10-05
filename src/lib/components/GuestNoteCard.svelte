<script lang="ts">
  import { onMount } from 'svelte';

  // lightweight local state
  let name = '';
  let message = '';
  // email removed per request
  let submitting = false;
  let submitted = false;
  let error = '';

  const MAX_LEN = 500;
  const STORAGE_KEY = 'guest_note_draft_v2';

  onMount(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { name: n, message: m } = JSON.parse(raw);
        name = n ?? '';
        message = m ?? '';
      }
    } catch {}
  });

  function persistDraft(n: string, m: string) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: n, message: m }));
    } catch {}
  }

  // Persist draft whenever fields change
  $: persistDraft(name, message);

  function reset() {
    name = '';
    message = '';
    error = '';
    submitted = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function submitNote(ev: SubmitEvent) {
    ev.preventDefault();
    error = '';

    const body = message.trim();
    if (!body) {
      error = 'Please write a note before sending.';
      return;
    }
    if (body.length > MAX_LEN) {
      error = `Please keep your note under ${MAX_LEN} characters.`;
      return;
    }

    submitting = true;
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'Guest', message: body })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to send note (${res.status})`);
      }
      submitted = true;
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    } catch (e: any) {
      error = e?.message || 'Something went wrong sending your note. You can still copy it below.';
    } finally {
      submitting = false;
    }
  }

  // extra actions removed per request
</script>

<div class="note-card" role="region" aria-label="Leave a note for Taylor">
  <h3 class="title">Leave a note for Taylor</h3>
  <p class="subtitle">You came as a guest — leave a little starlit birthday message.</p>

  {#if submitted}
    <div class="success">
      <span>✅ Thanks! Your note has been sent.</span>
      <button class="btn secondary" on:click={reset}>Write another</button>
    </div>
  {:else}
    <form class="form" on:submit={submitNote}>
      <label class="field">
        <span>Name (optional)</span>
        <input type="text" bind:value={name} placeholder="Your name" maxlength="60" />
      </label>

      <!-- email field removed per request -->

      <label class="field">
        <span>Your message</span>
        <textarea bind:value={message} rows={5} placeholder="Write something kind…" maxlength={MAX_LEN}></textarea>
        <div class="counter">{message.length}/{MAX_LEN}</div>
      </label>

      {#if error}
        <div class="error" role="alert">{error}</div>
      {/if}

      <div class="actions">
        <button class="btn primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
      </div>
    </form>
  {/if}
</div>

<style>
  .note-card {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    width: min(440px, calc(100vw - 2rem));
    z-index: 20;
    background:
      radial-gradient(1200px 600px at 100% 0%, rgba(255, 200, 120, 0.08), transparent 60%),
      radial-gradient(800px 400px at 0% 100%, rgba(90, 160, 255, 0.10), transparent 60%),
      rgba(10, 14, 26, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    padding: 1rem 1rem 1.1rem;
    backdrop-filter: blur(10px) saturate(110%);
    color: #e6edf7;
    overflow: hidden;
  }

  /* subtle twinkling particles */
  .note-card::before, .note-card::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .note-card::before {
    background-image:
      radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.7), transparent 60%),
      radial-gradient(1.5px 1.5px at 75% 60%, rgba(255,255,255,0.6), transparent 60%),
      radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%);
    opacity: .35;
  }
  .note-card::after {
    background: radial-gradient(600px 300px at 90% 10%, rgba(255, 170, 80, 0.10), transparent 60%);
    mix-blend-mode: screen;
  }

  .title { margin: 0 0 .25rem; font-size: 1.1rem; letter-spacing: .2px; }
  .subtitle { margin: 0 0 .9rem; color: #aab4c8; font-size: .92rem; }
  .form { display: flex; flex-direction: column; gap: .8rem; }
  .field { display: flex; flex-direction: column; gap: .4rem; }
  .field > span { color: #c9d3e6; font-size: .9rem; }
  input, textarea {
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    padding: .7rem .85rem;
    font: inherit;
    outline: none;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04));
    color: #e6edf7;
    box-shadow: 0 0 0 2px transparent;
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  input::placeholder, textarea::placeholder { color: #9aa6bf; }
  input:focus, textarea:focus {
    border-color: rgba(255, 214, 120, 0.45);
    box-shadow: 0 0 0 3px rgba(255, 214, 120, 0.18);
  }
  textarea { resize: vertical; min-height: 120px; }
  .counter { text-align: right; color: #8fa0bd; font-size: .8rem; }
  .actions { display: flex; gap: .6rem; align-items: center; justify-content: flex-end; }
  .btn { appearance: none; border: 1px solid rgba(255,255,255,0.16); background: rgba(20,24,36,0.8); color: #f5f7fb; padding: .55rem .9rem; border-radius: 12px; cursor: pointer; text-decoration: none; }
  .btn.primary { background: linear-gradient(180deg, #2a334a, #222a3f); border-color: rgba(255,255,255,0.18); }
  .btn.primary:hover { filter: brightness(1.08); }
  .btn.primary:disabled { opacity: .7; cursor: default; }
  .btn.secondary { background: #303a55; }
  .error { color: #ffb4b4; background: rgba(255, 77, 77, 0.08); border: 1px solid rgba(255, 77, 77, 0.28); padding: .6rem .75rem; border-radius: 10px; }
  .success { display: flex; justify-content: space-between; align-items: center; gap: .75rem; background: rgba(56, 161, 105, 0.12); color: #c6f6d5; border: 1px solid rgba(72, 187, 120, 0.3); padding: .75rem; border-radius: 12px; }

  @media (max-width: 640px) {
    .note-card { left: .5rem; right: .5rem; width: auto; }
  }
</style>
