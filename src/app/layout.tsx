import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const montserrat = localFont({
    src: [
        {
            path: './assets/Montserrat-Regular.ttf',
            weight: '400',
        },
        {
            path: './assets/Montserrat-Bold.ttf',
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
            <body className={montserrat.className}>{children}</body>
        </html>
    );
}
