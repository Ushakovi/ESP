import { cookies } from 'next/headers';
import { dbConnect } from '@/shared/DB';

export async function GET() {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const { rows: disciplines } = await dbConnect.query(
            `SELECT ds.id, ds.name, ds.description, ds.creator_id, us.fullname as creator_name, us.email as creator_email FROM disciplines ds join users us on ds.creator_id = us.id`
        );

        return new Response(JSON.stringify({ data: disciplines }), {
            status: 200,
            statusText: 'Success',
        });
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
