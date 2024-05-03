import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const { rows: roles } = await sql`SELECT * FROM roles`;

        return new Response(JSON.stringify({ message: 'Success', data: roles }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching' }), {
            status: 400,
        });
    }
}
