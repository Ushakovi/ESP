import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('token')?.value ?? '';

    if (!jwt.length) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    try {
        await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

export const config = {
    matcher: ['/', '/homeworks', '/settings'],
};
