import { dbConnect } from '@/shared/DB';

export async function GET() {
    try {
        const { rows: roles } = await dbConnect.query(`SELECT * FROM roles`);

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
