import "./globals.css";
import React from 'react';
import './globals.css';
import {Metadata} from 'next';
import AppWrapper from '@/app/components/AppWrapper';
import {Viewport} from "next";

export const metadata: Metadata = {
    title: "Compass",
    description: "Compass health app",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
    height: "device-height",
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
}


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
        <body>
        <AppWrapper>
            {children}
        </AppWrapper>
        </body>
        </html>
    );
}