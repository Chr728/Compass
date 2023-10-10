import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "@/app/contexts/UserContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass",
  description: "Compass health app",
  manifest: "/manifest.json",
  themeColor: "#fff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
