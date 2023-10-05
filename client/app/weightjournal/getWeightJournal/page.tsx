'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getWeightJournal} from '../../http/weightJournalAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';


export default function GetWeightJournal() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [weight, setweight] = useState<any>(null);
  
  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchWeightJournal() {
      try {
        const userId = user?.uid || '';
        // const weightJournalId = weight?.weightJournalId; 
        const weightJournalId = '1'; // Replace '1' with the correct weight journal entry ID

        const result = await getWeightJournal(userId, weightJournalId);
        console.log('Weight journal entry retrieved:', result);
        setweight(result.data);
      } catch (error) {
        console.error('Error retrieving weight journal entry:', error);
      }
    }

    fetchWeightJournal();
  }, [user]);


  return (

    // <p>Date: {weight.date}</p>
    // <p>Time: {weight.time}</p>
    // <p>Weight: {weight.weight}</p>
    // <p>Height: {weight.height}</p>
    // <p>Unit: {weight.unit}</p>
    // <p>Notes: {weight.notes}</p>
    
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <Link href="">
          <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4 md:hidden"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        Weight Journal
      </span>
        {weight && (
      <span
        className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
        <div className="mt-3 mb-3">
          <label
            htmlFor="date" // Correct the "for" attribute value
            className="font-sans font-medium text-grey text-[16px]"
          >
            Date
          </label>
          <br />
        </div>
        <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {weight.date}
            </p>
            <br></br>



<div className="mt-3">
              <label
                htmlFor="time"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Time
              </label>
              <br />
              
            </div>

            <div className="mt-3">
              <label
                htmlFor="weight"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Weight
              </label>
              <br />
              
            </div>

            <div className="mt-3">
              <label
                htmlFor="height"
                className="font-sans font-medium text-grey text-[16px]"
              >
               Height
              </label>
              <br />
             
            </div>

            <div className="mt-3">
              <label
                htmlFor="Unit"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Unit
              </label>
              <br />
              
            </div>

            <div className="mt-3">
                <label
                  htmlFor="notes"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Notes
                </label>
                <br />
               
              </div>

          

      </span>
)}
    </div>
  );
}