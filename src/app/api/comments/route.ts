import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
        const homeworkId = searchParams.get('homework_id');

        const { rows: comments } =
            await sql`SELECT cfh.id, cfh.comment, cfh.homework_id, cfh.user_id, us.fullname as user_name, cfh.created_at FROM comments_for_homeworks cfh join users us on cfh.user_id = us.id where homework_id = ${homeworkId} order by cfh.created_at`;

        return new Response(JSON.stringify({ data: comments }), {
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
