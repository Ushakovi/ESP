import { cookies } from 'next/headers';

export async function GET() {
    const authCookie = cookies().get('token')?.value;

    if (!authCookie) {
        return new Response(null, {
            status: 400,
            statusText: 'Token is not exist',
        });
    }

    try {
        cookies().delete('token');

        return new Response(null, {
            status: 200,
            statusText: 'Logout success',
        });
    } catch (error: any) {
        return new Response(null, {
            status: 400,
            statusText: error,
        });
    }
}
