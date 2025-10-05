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
