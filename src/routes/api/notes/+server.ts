// Return all notes from Vercel Blob storage or local folder

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const token = (globalThis as any).process?.env?.BLOB_READ_WRITE_TOKEN as string | undefined;
    if (token) {
        // Use Vercel Blob API to list and fetch all notes
        const { list } = await import('@vercel/blob');
        const notes: any[] = [];
        // List all blobs under the 'notes/' prefix
        const result = await list({ prefix: 'notes/', token });
        for (const blob of result.blobs) {
            if (blob.pathname.endsWith('.json')) {
                try {
                    const res = await fetch(blob.downloadUrl);
                    if (res.ok) {
                        const text = await res.text();
                        notes.push(JSON.parse(text));
                    }
                } catch { }
            }
        }
        // Sort notes by createdAt descending (most recent first)
        notes.sort((a, b) => (b.createdAt || 0).localeCompare(a.createdAt || 0));
        return json(notes);
    } else {
        // Local dev: fallback to empty array or implement local file reading if needed
        return json([]);
    }
};


type Payload = {
    name?: string;
    message?: string;
    email?: string;
};

export const POST: RequestHandler = async ({ request }) => {
    let data: Payload;
    try {
        data = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = (data.name ?? 'Guest').toString().trim().slice(0, 60) || 'Guest';
    const message = (data.message ?? '').toString().trim();
    const email = (data.email ?? '').toString().trim().slice(0, 120) || undefined;

    if (!message) return json({ error: 'Message is required' }, { status: 400 });
    if (message.length > 500) return json({ error: 'Message too long (max 500)' }, { status: 400 });

    const createdAt = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') ?? undefined;

    const note = { name, message, email, createdAt, userAgent };

    const token = (globalThis as any).process?.env?.BLOB_READ_WRITE_TOKEN as string | undefined;
    if (token) {
        // Lazy import to avoid bundling unless needed
        const { put } = (await import('@vercel/blob')) as any;
        const id = `${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
        const key = `notes/${id}.json`;

        await put(
            key,
            JSON.stringify(note, null, 2),
            {
                access: 'public',
                contentType: 'application/json',
                token
            }
        );

        return json({ ok: true, id }, { status: 201 });
    }

    // No storage configured — accept note (non-persistent)
    console.log('[notes] (non-persistent)', note);
    return json({ ok: true, persisted: false }, { status: 202 });
};

export const DELETE: RequestHandler = async ({ request }) => {
    let data: { createdAt?: string };
    try {
        data = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const createdAt = data.createdAt;
    if (!createdAt) {
        return json({ error: 'createdAt is required' }, { status: 400 });
    }

    const token = (globalThis as any).process?.env?.BLOB_READ_WRITE_TOKEN as string | undefined;
    if (token) {
        try {
            // Use Vercel Blob API to list and find the note to delete
            const { list, del } = await import('@vercel/blob');

            // List all blobs under the 'notes/' prefix
            const result = await list({ prefix: 'notes/', token });
            let noteFound = false;

            for (const blob of result.blobs) {
                if (blob.pathname.endsWith('.json')) {
                    try {
                        // Fetch the note to check if it matches the createdAt
                        const res = await fetch(blob.downloadUrl);
                        if (res.ok) {
                            const noteContent = await res.text();
                            const note = JSON.parse(noteContent);

                            if (note.createdAt === createdAt) {
                                // Delete this blob
                                await del(blob.url, { token });
                                noteFound = true;
                                break;
                            }
                        }
                    } catch {
                        // Skip this blob if there's an error reading it
                        continue;
                    }
                }
            }

            if (noteFound) {
                return json({ ok: true, deleted: true });
            } else {
                return json({ error: 'Note not found' }, { status: 404 });
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            return json({ error: 'Failed to delete note' }, { status: 500 });
        }
    } else {
        // No storage configured — simulate successful deletion for local dev
        console.log('[notes] (non-persistent) Simulated deletion of note with createdAt:', createdAt);
        return json({ ok: true, deleted: true, persisted: false });
    }
};
