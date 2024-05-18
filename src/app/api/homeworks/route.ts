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
        const lessonId = searchParams.get('lesson_id');
        const userId = searchParams.get('user_id');

        if (userId) {
            const { rows: lessons } = await dbConnect.query(
                `SELECT hs.id, hs.comment, hs.materials, hs.estimation_status, hs.estimation_comment, hs.user_id, us.fullname as user_name, us.email as user_email, hs.lesson_id, ls.creator_id as lesson_creator_id, hs.created_at FROM homeworks hs join users us on hs.user_id = us.id join lessons ls on hs.lesson_id = ls.id where lesson_id = ${lessonId} and user_id = ${userId}`
            );

            return new Response(JSON.stringify({ data: lessons[0] }), {
                status: 200,
                statusText: 'Success',
            });
        } else {
            const { rows: lessons } = await dbConnect.query(
                `SELECT hs.id, hs.comment, hs.materials, hs.estimation_status, hs.estimation_comment, hs.user_id, us.fullname as user_name, us.email as user_email, hs.lesson_id, ls.creator_id as lesson_creator_id, hs.created_at FROM homeworks hs join users us on hs.user_id = us.id join lessons ls on hs.lesson_id = ls.id where lesson_id = ${lessonId}`
            );

            return new Response(JSON.stringify({ data: lessons }), {
                status: 200,
                statusText: 'Success',
            });
        }
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
