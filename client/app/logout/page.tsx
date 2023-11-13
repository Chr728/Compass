'use client';
import Link from 'next/link';
import Button from '../components/Button';
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from 'react';


// Logging out the user
export default function Logout() {
  const logger = require('pino')()
  const { logout, user } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
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
            Successfully logged out
          </p>
        </div>
        {/* Adding the link to go back to the main home page after logging out */}
        <div className="flex justify-center items-center mt-4 mb-8">
          
          <Link href="/">
            <Button type="submit" text="Back to Home" style={{ width: '180px' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
