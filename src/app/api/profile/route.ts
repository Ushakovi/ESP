import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    try {
        const verification = verify(authCookie, process.env.JWT_SECRET as string);

        return new Response(JSON.stringify(verification), {
            status: 200,
            statusText: 'Authorized',
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: error.message,
            }),
            {
                status: 401,
                statusText: 'Unauthorized',
            }
        );
    }
}
