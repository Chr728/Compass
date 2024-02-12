import AppWrapper from "@/app/components/AppWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata, Viewport } from "next";
import React from "react";
import { useAuth } from "./contexts/AuthContext";
import "./globals.css";
import Custom403 from "./pages/403";

export const useUser = () => {
	const { user } = useAuth();
	return user;
};

export const metadata: Metadata = {
	title: "Compass",
	description: "Compass health app",
	manifest: "/manifest.json",
	themeColor: "#fff",
	viewport: {
		initialScale: 1,
		maximumScale: 1,
		userScalable: false,
	},
};

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width",
	height: "device-height",
	minimumScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!useUser) {
		return (
			<html lang="en">
				<GoogleAnalytics />
				<head />
				<body>
					<AppWrapper>
						<Custom403 />
					</AppWrapper>
				</body>
			</html>
		);
	}
	return (
		<html lang="en">
			<GoogleAnalytics></GoogleAnalytics>
			<head />
			<body>
				<AppWrapper>
					{/* {!useUser && <Custom403 />} */}
					{children}
					{/* <Analytics />
					<SpeedInsights /> */}
				</AppWrapper>
			</body>
		</html>
	);
}
