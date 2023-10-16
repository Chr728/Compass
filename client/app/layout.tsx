'use client';
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "@/app/contexts/UserContext";
import type { Metadata } from "next";
import "./globals.css";
import {usePathname} from 'next/navigation';
import React, {useMemo} from 'react';
import Menu from '@/app/components/Menu';
import './globals.css';
const MemoizedMenu = React.memo(Menu);

// export const metadata: Metadata = {
//     title: "Compass",
//     description: "Compass health app",
//     manifest: "/manifest.json",
//     themeColor: "#fff",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoggedIn = useMemo(() => {
        return !(pathname === '/login' || pathname === '/register');
    }, [pathname]);

  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
            <UserProvider>
                {children}
                <div className={`xl:max-w-[1280px] w-full  menu-container`}>
                {isLoggedIn && <MemoizedMenu />}
                </div>
            </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
