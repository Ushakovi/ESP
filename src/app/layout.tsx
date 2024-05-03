import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Container from '@mui/material/Container';
import ThemeProvider from '@/utils/client/themeProvider';
import './globals.css';

const montserrat = localFont({
    src: [
        {
            path: '../public/assets/fonts/Montserrat-Regular.ttf',
            weight: '400',
        },
        {
            path: '../public/assets/fonts/Montserrat-Bold.ttf',
            weight: 'bold',
        },
    ],
});

export const metadata: Metadata = {
    title: 'ESP',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ru'>
            <body className={montserrat.className}>
                <ThemeProvider>
                    <Container maxWidth='lg'>
                        <main>{children}</main>
                    </Container>
                </ThemeProvider>
            </body>
        </html>
    );
}
