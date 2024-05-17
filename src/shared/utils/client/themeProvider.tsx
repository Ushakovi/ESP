'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'inherit',
    },
    palette: {
        primary: {
            light: '#B7B7A4',
            main: '#A5A58D',
            dark: '#6B705C',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#FFE8D6',
            main: '#DDBEA9',
            dark: '#CB997E',
            contrastText: '#000000',
        },
    },
});

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
