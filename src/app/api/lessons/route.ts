import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { dbConnect } from '@/shared/DB';

export async function GET(req: NextRequest) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const { searchParams } = new URL(req.url);
        const disciplineId = searchParams.get('discipline_id');

        const { rows: lessons } = await dbConnect.query(
            `SELECT ls.id, ls.name, ls.description, ls.materials, ls.lecture, ls.discipline_id, ds.name as discipline_name, ls.creator_id, us.fullname as creator_name, us.email as creator_email FROM lessons ls join users us on ls.creator_id = us.id join disciplines ds on ls.discipline_id = ds.id where ls.discipline_id = '${disciplineId}'`
        );

        return new Response(JSON.stringify({ data: lessons }), {
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
