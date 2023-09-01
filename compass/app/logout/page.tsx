'use client';
import Link from 'next/link';
import Image from 'next/image';
 
// Logging out the user
export default function Logout() {
  
 
  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        
        <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8 ">
                <div className="md:mt-auto mt-2 w-full">
                  
                <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image className ="smallImage"
            src="/compass-removebg.png" 
            alt="Logo"
            width={350}
            height={200}
            style={{
            width: 'auto',
            height: 'auto',
            }}
    />

        </div>
                <div className="mb-6">
                    <p className="text-[24px] text-darkgrey font-IBM Plex Sans font-bold text-center">Successfully logged out</p>
                </div>
                {/* Adding the link to go back to main home page after logging out */}
                    <Link href='/'> 
                       <button  className=" bg-blue text-[16px] text-white font-sans font-medium rounded-md h-[56px]  
                       shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]"style={{ width: '100%'  }}>Back to Home</button>
                    </Link>
                </div>    
        </div>
    </div>
  )
}