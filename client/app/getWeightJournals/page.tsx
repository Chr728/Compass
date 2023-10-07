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

              {/* {weight && (
                  <span
                      className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
                      <div className="mt-3 mb-3">
                          <label
                              htmlFor="date" 
                              className="font-sans font-medium text-darkgrey text-[16px]"
                          >
                              Date/Time
                          </label>
                          <br />

                          <label
                              htmlFor="bmi" 
                              className="font-sans font-medium text-darkgrey text-[16px]"
                          >
                             BMI
                          </label>

                          <label
                              htmlFor="weight" 
                              className="font-sans font-medium text-darkgrey text-[16px]"
                          >
                             Weight
                          </label>
                      </div>
                <p className="font-sans font-medium text-darkgrey " >
                    
                {weight.map((item: any) => (
                <p key={item.weightJournalId}>
                 {new Date(item.date).toISOString().split('T')[0]}
                  {item.weight}
                  {new Date(`1970-01-01T${item.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}

      


                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdInfoOutline style={{ color: 'var(--Red, #FF7171)' , width: '30px',height: '50px'}} onClick={() => router.push(`/getWeightJournals/${item.id}`)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdDeleteForever style={{ color: 'var(--Red, #FF7171)' , width: '30px',height: '50px'}} onClick={() =>deleteWeightJournals(item.uid,item.id)} />
                </div>
                </p>
                ))}
                <br></br>
                    </p>

                  </span>
              )} */}

{weight && (
  <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
    {weight.map((item: any, index: number) => (
      <div key={item.weightJournalId} className="flex justify-between items-center mt-3">
        <div className="flex-1">
          {index === 0 && (
            <div className="font-sans font-medium text-darkgrey text-[18px]">
              Date/Time
            </div>
          )}
          <p className="font-sans font-medium text-darkgrey text-[14px]">
            {`${new Date(item.date).toISOString().split('T')[0]} ${new Date(`1970-01-01T${item.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <div className="flex-2">
          {index === 0 && (
            <div className="font-sans font-medium text-darkgrey text-[18px]">
              BMI
            </div>
          )}
          <p className="font-sans font-medium text-darkgrey text-[14px]">
            {/* Calculate BMI here based on item.weight and item.height */}
            {((item.weight / (item.height * item.height)) * 703).toFixed(2)}
          </p>
        </div>
        <div className="flex-3" style={{ marginLeft: '10px', marginRight: '5px' }}>
          {index === 0 && (
            <div className="font-sans font-medium text-darkgrey text-[18px]">
              Weight
            </div>
          )}
          <p className="font-sans font-medium text-darkgrey text-[14px]">
            {item.weight}
          </p>
        </div>
        {index !== 0 && (
          <div>
            <MdInfoOutline
              style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
              onClick={() => router.push(`/getWeightJournals/${item.id}`)}
            />
          </div>
        )}
        {index !== 0 && (
          <div>
            <MdDeleteForever
              style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
              onClick={() => deleteWeightJournals(item.uid, item.id)}
            />
          </div>
        )}
      </div>
    ))}
  </div>
)}















          </div>
  );
}