import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useUser } from "@/app/contexts/UserContext";
import { useProp } from "@/app/contexts/PropContext";
import Custom403 from "@/app/pages/403";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Renders = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = () => {
    return (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/logout" ||
      pathname === "/forgotpassword" ||
      pathname === "/" ||
      pathname === "/installinstructions"
    );
  };

  const { user } = useAuth();
  const { loading } = useProp();
  const { userInfo } = useUser();
  useEffect(() => {
    if (user && userInfo && isPublicRoute()) {
      router.push("/tpage");
    }
  }, [pathname]);

  if (!user && !userInfo && !loading && !isPublicRoute()) {
    return <Custom403 />;
  } else {
    return <>{children}</>;
  }
};

export default Renders;
