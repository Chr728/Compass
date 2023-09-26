'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../http/getUserProfile';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import Button from '../components/Button';
import Menu from '../components/Menu';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    values: {
      email: '',
      firstName: '',
      lastName: '',
      streetAddress: '',
      city: '',
      province: '',
      postalCode: '',
      phoneNumber: '',
      birthDate: '',
      sex: '',
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userData = await getUserProfile(user?.uid || ''); // Pass the user ID to getUserProfile
        // Update the profile state with the fetched user data
        setProfile({
          values: {
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            streetAddress: userData.streetAddress || '',
            city: userData.city || '',
            province: userData.province || '',
            postalCode: userData.postalCode || '',
            phoneNumber: userData.phoneNumber || '',
            birthDate: userData.birthDate || '',
            sex: userData.sex || '',
          },
        });
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    }
    fetchProfile();
  }, [user?.uid]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col justify-center">
      <button onClick={() => router.back()}>
        <Header headerText="View Profile"></Header>
      </button>
      <span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
        <div className="mt-3 relative">
          <div>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              First Name :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.firstName}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Last Name :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.lastName}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Email :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.email}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Street Address :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.streetAddress}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              City:{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.city}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Province:{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.province}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Postal Code :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.postalCode}
            </p>
            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Phone number :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.phoneNumber}
            </p>
            <br></br>

            <p
              className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Birth Date :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.birthDate
                ? new Date(profile.values.birthDate).toISOString().split('T')[0]
                : ''}
            </p>

            <br></br>
            <p
              className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
              style={{ display: 'inline' }}
            >
              Sex :{' '}
            </p>
            <p
              className="text-md ml-2 text-darkgrey"
              style={{ display: 'inline' }}
            >
              {profile.values.sex}
            </p>
            <br></br>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/editprofile" className="mt-6">
            <Button
              type="submit"
              text="Edit Profile"
              style={{ width: '180px', alignContent: 'center' }}
            />
          </Link>
        </div>
      </span>
      <div className="mt-4">
        <div className={`xl:max-w-[1280px] w-full  menu-container`}>
          <Menu />
        </div>
      </div>
    </div>
  );
}
