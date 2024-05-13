import path from 'path';
import { readFile } from 'fs/promises';
import { cookies } from 'next/headers';

export async function GET(req: any) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const { searchParams } = new URL(req.url);
        const filePath = String(searchParams.get('filePath'));
        const buffer = await readFile(path.join(process.cwd(), filePath));

        return new Response(buffer, {
            status: 200,
        });
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
