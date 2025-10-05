<script lang="ts">
    import { onMount } from "svelte";

    interface Note {
        name: string;
        message: string;
        email?: string;
        createdAt: string;
        userAgent?: string;
        id?: string;
    }

    let notes: Note[] = [];
    let loading = true;
    let error = "";
    let isAuthenticated = false;
    let password = "";
    let isLoggingIn = false;
    let sessionToken = "";

    async function login() {
        if (!password.trim()) {
            error = "Please enter a password";
            return;
        }

        try {
            isLoggingIn = true;
            error = "";

            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                sessionToken = data.sessionToken;
                isAuthenticated = true;
                // Store session in sessionStorage for this browser session
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("adminToken", sessionToken);
                }
                password = ""; // Clear password field
                fetchNotes(); // Load notes after successful login
            } else {
                error = data.error || "Authentication failed";
            }
        } catch (e) {
            error =
                "Login error: " +
                (e instanceof Error ? e.message : "Unknown error");
        } finally {
            isLoggingIn = false;
        }
    }

    function logout() {
        isAuthenticated = false;
        sessionToken = "";
        notes = [];
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("adminToken");
        }
    }

    async function fetchNotes() {
        if (!isAuthenticated) return;

        try {
            loading = true;
            const res = await fetch("/api/notes");
            if (res.ok) {
                notes = await res.json();
            } else {
                error = "Failed to fetch notes";
            }
        } catch (e) {
            error =
                "Error fetching notes: " +
                (e instanceof Error ? e.message : "Unknown error");
        } finally {
            loading = false;
        }
    }

    async function deleteNote(createdAt: string) {
        if (!confirm("Are you sure you want to delete this note?")) {
            return;
        }

        try {
            const res = await fetch("/api/notes", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ createdAt }),
            });

            if (res.ok) {
                // Remove the note from the local array
                notes = notes.filter((note) => note.createdAt !== createdAt);
            } else {
                const errorData = await res.json();
                error = errorData.error || "Failed to delete note";
            }
        } catch (e) {
            error =
                "Error deleting note: " +
                (e instanceof Error ? e.message : "Unknown error");
        }
    }

    function formatDate(isoString: string): string {
        try {
            return new Date(isoString).toLocaleString();
        } catch {
            return isoString;
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            login();
        }
    }

    onMount(() => {
        // Check for existing session
        if (typeof window !== "undefined") {
            const storedToken = sessionStorage.getItem("adminToken");
            if (storedToken) {
                // Verify token is still valid
                fetch("/api/auth", {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })
                    .then((res) => {
                        if (res.ok) {
                            sessionToken = storedToken;
                            isAuthenticated = true;
                            fetchNotes();
                        } else {
                            sessionStorage.removeItem("adminToken");
                        }
                    })
                    .catch(() => {
                        sessionStorage.removeItem("adminToken");
                    });
            }
        }
    });
</script>

<div class="admin-panel">
    {#if !isAuthenticated}
        <div class="login-container">
            <div class="login-form">
                <h1>Admin Login</h1>
                <div class="form-group">
                    <input
                        type="password"
                        bind:value={password}
                        on:keypress={handleKeyPress}
                        placeholder="Enter admin password"
                        disabled={isLoggingIn}
                        class="password-input"
                    />
                </div>
                <button
                    on:click={login}
                    disabled={isLoggingIn || !password.trim()}
                    class="login-btn"
                >
                    {isLoggingIn ? "Logging in..." : "Login"}
                </button>

                {#if error}
                    <div class="error-message">
                        {error}
                        <button
                            on:click={() => (error = "")}
                            class="close-error">×</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <div class="admin-header">
            <h1>Admin Panel</h1>
            <div class="header-actions">
                <button
                    on:click={fetchNotes}
                    class="refresh-btn"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
                <button on:click={logout} class="logout-btn"> Logout </button>
            </div>
        </div>

        {#if error}
            <div class="error-message">
                {error}
                <button on:click={() => (error = "")} class="close-error"
                    >×</button
                >
            </div>
        {/if}

        {#if loading}
            <div class="loading">Loading notes...</div>
        {:else if notes.length === 0}
            <div class="no-notes">No notes found</div>
        {:else}
            <div class="notes-count">
                {notes.length} note{notes.length === 1 ? "" : "s"} found
            </div>

            <div class="notes-grid">
                {#each notes as note}
                    <div class="note-card">
                        <div class="note-header">
                            <h3>{note.name}</h3>
                            <button
                                on:click={() => deleteNote(note.createdAt)}
                                class="delete-btn"
                                title="Delete note"
                            >
                                Delete
                            </button>
                        </div>

                        <div class="note-message">
                            {note.message}
                        </div>

                        {#if note.email}
                            <div class="note-email">
                                Email: {note.email}
                            </div>
                        {/if}

                        <div class="note-meta">
                            <div class="note-date">
                                {formatDate(note.createdAt)}
                            </div>
                            {#if note.userAgent}
                                <div
                                    class="note-user-agent"
                                    title={note.userAgent}
                                >
                                    {note.userAgent.substring(0, 50)}{note
                                        .userAgent.length > 50
                                        ? "..."
                                        : ""}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .admin-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(10px);
        z-index: 1000;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
    }

    .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
    }

    .login-form {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 40px;
        max-width: 400px;
        width: 100%;
        text-align: center;
        backdrop-filter: blur(20px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .login-form h1 {
        margin: 0 0 30px 0;
        font-size: 2.2rem;
        background: linear-gradient(45deg, #ffd700, #ffcc99);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .password-input {
        width: 100%;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        color: white;
        font-size: 16px;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }

    .password-input:focus {
        outline: none;
        border-color: #ffd700;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
    }

    .password-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .login-btn {
        width: 100%;
        padding: 15px 20px;
        background: linear-gradient(45deg, #ffd700, #ffcc99);
        border: none;
        border-radius: 10px;
        color: #1a1a2e;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
    }

    .login-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
    }

    .login-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .logout-btn {
        padding: 10px 20px;
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid rgba(255, 0, 0, 0.4);
        border-radius: 8px;
        color: #ff6b6b;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .logout-btn:hover {
        background: rgba(255, 0, 0, 0.3);
        transform: translateY(-2px);
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .admin-header h1 {
        margin: 0;
        font-size: 2.5rem;
        background: linear-gradient(45deg, #ffd700, #ffcc99);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .refresh-btn {
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .refresh-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }

    .refresh-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-message {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ff6b6b;
    }

    .close-error {
        background: none;
        border: none;
        color: #ff6b6b;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        margin-left: 10px;
    }

    .loading,
    .no-notes {
        text-align: center;
        padding: 40px;
        font-size: 1.2rem;
        opacity: 0.7;
    }

    .notes-count {
        margin-bottom: 20px;
        font-size: 1.1rem;
        opacity: 0.8;
        text-align: center;
    }

    .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .note-card {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    .note-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .note-header h3 {
        margin: 0;
        font-size: 1.3rem;
        color: #ffd700;
    }

    .delete-btn {
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid rgba(255, 0, 0, 0.4);
        border-radius: 6px;
        color: #ff6b6b;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }

    .delete-btn:hover {
        background: rgba(255, 0, 0, 0.3);
        transform: scale(1.05);
    }

    .note-message {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        line-height: 1.5;
        font-size: 14px;
        word-wrap: break-word;
    }

    .note-email {
        color: #87ceeb;
        font-size: 13px;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(135, 206, 235, 0.1);
        border-radius: 6px;
    }

    .note-meta {
        font-size: 12px;
        opacity: 0.6;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 10px;
    }

    .note-date {
        font-weight: bold;
        margin-bottom: 5px;
        color: #ffd700;
    }

    .note-user-agent {
        font-style: italic;
        word-break: break-all;
    }

    @media (max-width: 768px) {
        .admin-panel {
            padding: 15px;
        }

        .notes-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .admin-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }

        .admin-header h1 {
            font-size: 2rem;
        }
    }
</style>
