"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUser } from "../http/getUser";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Link from "next/link";
import Button from '../components/Button';
import Menu from "../components/Menu";


export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    values: {
      email: "",
      firstName: "",
      lastName: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      phoneNumber: "",
      birthDate: "",
      sex: "",
    },
  });

  useEffect(() => {
    // HTTP Request to get user info
    async function fetchProfile() {
      await fetch(`http://localhost:8000/api/users/${user?.uid}`, {

        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          // Update the profile state with the fetched user data
          const userData = await response.json();
          setProfile({
            values: {
              email: userData.data.email || "",
              firstName: userData.data.firstName || "",
              lastName: userData.data.lastName || "",
              streetAddress: userData.data.streetAddress || "",
              city: userData.data.city || "",
              province: userData.data.province || "",
              postalCode: userData.data.postalCode || "",
              phoneNumber: userData.data.phoneNumber || "",
              birthDate: userData.data.birthDate || "",
              sex: userData.data.sex || "",
            },
          });
          console.log(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
    fetchProfile();
  }, []);

  
    return (
      <div className="bg-eggshell min-h-screen flex flex-col justify-center">
          <button onClick={() => router.back()}>
          <Header headerText="View Profile"></Header>
        </button>
        <span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
        <div className="mt-3 relative">
      <div>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>First Name : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.sex}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Last Name : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.lastName}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Email : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.email}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Street Address : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.streetAddress}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>City: </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.city}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]" style={{ display: 'inline' }}>Province: </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.postalCode}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Postal Code : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.postalCode}</p>
          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Phone number : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.phoneNumber}</p>
          <br></br>
          
          <p className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]" style={{ display: 'inline' }}>Birth Date : </p>
          <p className="text-md ml-2 text-darkgrey" style={{ display: 'inline' }}>{profile.values.birthDate ? new Date(profile.values.birthDate).toISOString().split('T')[0] : ''}</p>

          <br></br>
          <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Sex : </p>
          <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>{profile.values.sex}</p>
          <br></br>
     </div>
  
      </div>
  
      <div className="flex justify-center mt-6">
      <Link href="/editprofile"  className="mt-6">
              <Button type="submit" text="Edit Profile" style={{ width: '180px', alignContent:'center' }} />
              </Link>
          </div>
      </span>
      <div className="mt-4" >
      <div className={`xl:max-w-[1280px] w-full  menu-container`}>
        <Menu />
      </div>
      </div>
      </div>
    );
  }
  