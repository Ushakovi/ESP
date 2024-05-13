import { sql } from '@vercel/postgres';
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
        const { rows: disciplines } =
            await sql`SELECT ds.id, ds.name, ds.description, ds.creator_id, us.fullname as creator_name, us.email as creator_email FROM disciplines ds join users us on ds.creator_id = us.id where ds.id = ${params.id}`;

        return new Response(JSON.stringify({ data: disciplines[0] }), {
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
        const { rows: disciplines } =
            await sql`SELECT * FROM disciplines WHERE id = ${params.id} and creator_id = ${verification.id}`;

        if (disciplines.length > 0) {
            await sql`DELETE FROM disciplines WHERE id = ${params.id}`;
            const { rows: disciplinesAfterDelete } = await sql`SELECT * FROM disciplines WHERE id = ${params.id}`;

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
            statusText: 'You are not creator of this discipline',
        });
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
