'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { deleteWeightJournal, getWeightJournal, getWeightJournals} from '../http/weightJournalAPI'; 
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { MdDeleteForever, MdInfoOutline } from 'react-icons/md';
import Header from '../components/Header';


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
    async function fetchWeightJournals() {
      try {
        const userId = user?.uid || '';
        const result = await getWeightJournals(userId);    
        const weightJournalId = weight?.weightJournalId; 
        console.log('All Weight journals entry retrieved:', result);
        setweight(result.data);
      } catch (error) {
        console.error('Error retrieving weight journal entry:', error);
      }
    }
    fetchWeightJournals();
  }, [user]);


    async function deleteWeightJournals(userId: string,weightJournalId: string){
      const deleteresult = await deleteWeightJournal(userId,weightJournalId);   
      location.reload();

    }
  return (    
      <div className="bg-eggshell min-h-screen flex flex-col">
              <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="Weight Journals "></Header>
              </button>
              </span>
              <p className="font-sans  text-darkgrey ml-5 font-bold  text-[14px]">Managing your weight helps you stay healthy.</p>
              <br></br>
              <p className="font-sans  text-darkgrey ml-5 font-bold  text-[14px]">Your BMI can tell you if you’re at risk for
              certain health conditions like heart disease.</p>

              {weight && (
  <div className="rounded-3xl bg-white flex flex-col mt-4 mb-6 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
    <div className="flex justify-between items-center">
      <div>
        <Button type="button" text="Add an Entry" style={{ width: '120px', fontSize: '14px' }} onClick={() => router.push(`/createWeightJournal`)} />
      </div>
      {weight.length > 0 && weight[0].height && (
        <p className="font-sans  text-darkgrey mr-10 font-bold  text-[14px]"> Your height: {weight[weight.length - 1].height}</p>
      )}
    </div>
    <br></br>
    {weight.length === 0 ? (
      <p className="font-sans  text-darkgrey mr-10 font-bold  text-[14px]">No height available</p>
    ) : (
      <>
        {weight.map((item: any, index: number) => (
          <div
            key={item.weightJournalId}
            className={`flex justify-between items-center mt-3`}
            style={{
              backgroundColor: index % 2 === 0 ? 'white' : '#DBE2EA',
            }}
          >
            {index === 0 && (
              <>
                <div className="font-sans font-medium text-darkgrey text-[18px]">
                  Date/Time
                </div>
                <div className="font-sans font-medium text-darkgrey text-[18px] ml-16">
                  BMI
                </div>
                <div className="font-sans font-medium text-darkgrey text-[18px]">
                  Weight
                </div>
              </>
            )}

            {index !== 0 ? (
              <>
                <div className="flex-2">
                  <p className="font-sans font-medium text-darkgrey text-[14px]">
                    {`${new Date(item.date).toISOString().split('T')[0]} ${new Date(
                      `1970-01-01T${item.time}`
                    ).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
                <div className="flex-2">
                  <p className="ml-4 font-sans font-medium text-darkgrey text-[14px]">
                    {((item.weight / (item.height * item.height)) * 703).toFixed(2)}
                  </p>
                </div>
                <div className="flex-2">
                  <p className="ml-4 font-sans font-medium text-darkgrey text-[14px]">
                    {item.weight}
                  </p>
                </div>
              </>
            ) : null}

            <div className="flex icons" style={{ marginLeft: '5px', marginRight: '5px' }}>
              {index !== 0 && (
                <>
                  <div className="icon">
                    <MdInfoOutline
                      style={{ color: 'var(--Black, #000000)', width: '25px', height: '30px' }}
                      onClick={() => router.push(`/getWeightJournals/${item.id}`)}
                    />
                  </div>
                  <div className="icon">
                    <MdDeleteForever
                      style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
                      onClick={() => deleteWeightJournals(item.uid, item.id)}
                    />
                  </div>
                </>
              )}
            </div>
            <br></br>
          </div>
        ))}
      </>
    )}
  </div>
)}

          </div>
  );
}