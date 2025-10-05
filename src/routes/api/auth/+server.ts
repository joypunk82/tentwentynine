import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    let data: { password?: string };
    try {
        data = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const password = data.password;
    if (!password) {
        return json({ error: 'Password is required' }, { status: 400 });
    }

    // Get admin password from environment variable
    const adminPassword = (globalThis as any).process?.env?.ADMIN_PASSWORD as string | undefined;

    // For local development, use a default password if no env var is set
    const expectedPassword = adminPassword || 'admin123';

    if (password === expectedPassword) {
        // Generate a simple session token (in production, use something more secure)
        const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

        return json({
            success: true,
            sessionToken,
            message: 'Authentication successful'
        });
    } else {
        // Add a small delay to prevent brute force attacks
        await new Promise(resolve => setTimeout(resolve, 1000));

        return json({
            error: 'Invalid password'
        }, { status: 401 });
    }
};

// Optional: Add a GET endpoint to verify session tokens
export const GET: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return json({ error: 'No token provided' }, { status: 401 });
    }

    // Simple token validation - in production you'd want something more sophisticated
    // For now, we'll just check if it looks like our format and isn't too old
    const parts = token.split('.');
    if (parts.length >= 2) {
        try {
            const timestamp = parseInt(parts[parts.length - 1], 36);
            const now = Date.now();
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (now - timestamp < maxAge) {
                return json({ valid: true });
            }
        } catch {
            // Token parsing failed
        }
    }

    return json({ error: 'Invalid or expired token' }, { status: 401 });
};