import React from 'react';
import type { Metadata } from 'next';
import { verify } from 'jsonwebtoken';
import { Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import ThemeProvider from '@/utils/client/themeProvider';
import { UserInfoProvider } from '@/utils/client/userInfoProvider';
import './globals.css';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'ESP',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authCookie = cookies().get('token')?.value;
    const verification: any = authCookie ? verify(authCookie, process.env.JWT_SECRET as string) : null;

    return (
        <html lang='ru'>
            <body className={montserrat.className}>
                <UserInfoProvider userInfo={verification}>
                    <ThemeProvider>{children}</ThemeProvider>
                </UserInfoProvider>
            </body>
        </html>
    );
}
