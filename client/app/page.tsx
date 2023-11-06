"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import Welcome from "./welcome/page";


export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  console.log('user',user)

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return <Welcome />;
}
