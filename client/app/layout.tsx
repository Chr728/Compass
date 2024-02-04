import "./globals.css";
import React from 'react';
import './globals.css';
import {Metadata} from 'next';
import AppWrapper from '@/app/components/AppWrapper';
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
    title: "Compass",
    description: "Compass health app",
    manifest: "/manifest.json",
    themeColor: "#fff",
    viewport: {
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    }
};

export default function RootLayout({
     children,
    }: {
    children: React.ReactNode;
}) {


    return (
        <html lang="en">
        <GoogleAnalytics></GoogleAnalytics>
        <head />
        <body>
        <AppWrapper>
            {children}
        </AppWrapper>
        </body>
        </html>
    );
}