"use client";
import LoadingScreen from "@/app/components/AppWrapper/LoadingScreen";
import PopUp from "@/app/components/AppWrapper/PopUp";
import Menu from "@/app/components/Menu";
import {AuthProvider, useAuth} from "@/app/contexts/AuthContext";
import { PropProvider } from "@/app/contexts/PropContext";
import { UserProvider } from "@/app/contexts/UserContext";
import { usePathname } from "next/navigation";
import React, { ReactNode, useMemo } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import Custom403 from "../../pages/403";
const MemoizedMenu = React.memo(Menu);
// const Memoized403 = React.memo(Custom403);
import Renders from "@/app/components/AppWrapper/Renders";

const AppWrapper = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const { user } = useAuth();
	const isLoggedIn = useMemo(() => {
		return !(
			pathname === "/login" ||
			pathname === "/register" ||
			pathname === "/logout" ||
			pathname === "/forgotpassword" ||
			pathname === "/"
		);
	}, [pathname]);

	return (
		<PropProvider>
			<AuthProvider>
				<UserProvider>
					<Renders>
						{children}
						<div className={`xl:max-w-[1280px] w-full  menu-container`}>
							{isLoggedIn && <MemoizedMenu/>}
						</div>
					</Renders>
					<PopUp/>
					<LoadingScreen/>
				</UserProvider>
			</AuthProvider>
		</PropProvider>
	);
};

export default AppWrapper;
