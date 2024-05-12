import { sql } from '@vercel/postgres';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
        const { rows: disciplines } = await sql`SELECT * FROM disciplines WHERE creator_id = ${verification.id}`;

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
