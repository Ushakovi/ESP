import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const { rows: roles } = await sql`SELECT * FROM roles`;

        return new Response(JSON.stringify({ data: roles }), {
            status: 200,
            statusText: 'Success',
        });
    } catch (error) {
        return new Response(null, {
            status: 400,
            statusText: 'Error fetching',
        });
    }
}
