import { dbConnect } from '@/shared/DB';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const { rows: lessons } = await dbConnect.query(
            `SELECT ls.id, ls.name, ls.description, ls.materials, ls.lecture, ls.discipline_id, ds.name as discipline_name, ls.creator_id, us.fullname as creator_name, us.email as creator_email FROM lessons ls join users us on ls.creator_id = us.id join disciplines ds on ls.discipline_id = ds.id where ls.id = '${params.id}'`
        );

        return new Response(JSON.stringify({ data: lessons[0] }), {
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const verification: any = verify(authCookie, process.env.JWT_SECRET as string);
        const { rows: disciplines } = await dbConnect.query(
            `SELECT * FROM lessons WHERE id = '${params.id}' and creator_id = '${verification.id}'`
        );

        if (disciplines.length > 0) {
            await dbConnect.query(`DELETE FROM lessons WHERE id = '${params.id}'`);
            const { rows: disciplinesAfterDelete } = await dbConnect.query(
                `SELECT * FROM lessons WHERE id = '${params.id}'`
            );

            if (disciplinesAfterDelete.length === 0) {
                return new Response(null, {
                    status: 200,
                    statusText: 'Delete success',
                });
            }

            return new Response(null, {
                status: 400,
                statusText: 'Something was wrong',
            });
        }

        return new Response(null, {
            status: 400,
            statusText: 'You are not creator of this lesson',
        });
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
