import fs from 'fs';
import path from 'path';
// Return all notes (for demo: read from local folder if no blob storage)
export const GET: RequestHandler = async () => {
    const token = (globalThis as any).process?.env?.BLOB_READ_WRITE_TOKEN as string | undefined;
    if (token) {
        // TODO: Implement blob storage listing and reading for production
        // For now, return empty array
        return json([]);
    } else {
        // Local dev: read notes from a local folder (if exists)
        const notesDir = path.resolve('notes');
        let notes: any[] = [];
        if (fs.existsSync(notesDir)) {
            const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(notesDir, file), 'utf-8');
                    notes.push(JSON.parse(content));
                } catch { }
            }
        }
        return json(notes);
    }
};
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

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
