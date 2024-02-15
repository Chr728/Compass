import React, {ReactNode} from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {useUser} from "@/app/contexts/UserContext";
import {useProp} from "@/app/contexts/PropContext";
import Custom403 from "@/app/pages/403";
import { usePathname } from "next/navigation";


const Renders = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const isPublicRoute = () => {
        return (
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/logout" ||
            pathname === "/forgotpassword" ||
            pathname === "/"
        );
    }
    const { user } = useAuth();
    const {loading, handleLoading} = useProp();
    const { userInfo } = useUser();

    //set handle loading to true  when page is refreshing
    // React.useEffect(() => {
    //     window.onbeforeunload = () => {
    //         handleLoading(true);
    //
    //     }
    //     window.onload = () => {
    //         handleLoading(false);
    //     }
    //
    //
    // }, [pathname]);


    if (!user && !userInfo && !loading && !isPublicRoute()) {
        return <Custom403 />;
    }else{
        return (
            <>
                {children}
            </>
        );
    }
};

export default Renders;