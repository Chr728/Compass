"use client";
import { useAuth } from "../contexts/AuthContext";
import Link from 'next/link';
import Button from '../components/Button';


export default function NotFound() {
    const { user } = useAuth();
    return (
        <div className="bg-eggshell min-h-screen flex flex-col text-grey">
            <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-2 ">
                <div className="mt-4 w-full text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    src="/compass-removebg.png"
                    alt="Logo"
                    className="smallImage"
                    width={350}
                    height={250}
                />
                </div>
                <div className="mb-6 mt-1">
                    <p className="text-[24px] text-darkgrey font-IBM Plex Sans font-bold text-center">
                        Error 404 - Page Not Found
                    </p>
                </div>
                { user 
                    ?
                    null 
                    :
                    <div className="flex justify-center items-center mt-4 mb-8">
                        <Link href="/login">
                            <Button type="submit" text="Back to Login" style={{ width: '180px' }} />
                        </Link>
                    </div>
                }
               
            </div>
        </div>
  )
}



