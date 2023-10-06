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
        console.log("weightJournalId", weightJournalId);

        console.log('All Weight journals entry retrieved:', result);
        setweight(result.data);
        console.log("hey", result.data);
      } catch (error) {
        console.error('Error retrieving weight journal entry:', error);
      }
    }

    fetchWeightJournals();
  }, [user]);

    async function deleteWeightJournals(userId: string,weightJournalId: string){
      const fff = await deleteWeightJournal(userId,weightJournalId);   
      location.reload();

    }
  return (
    

    // <><p>
    //       {weight.map((weight: Result.data) => (
    //           <p key={weight.weightJournalId}>
    //               {weight.date}
    //           </p>
    //       ))}
    //   </p>

    
      <div className="bg-eggshell min-h-screen flex flex-col">
              <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                  <Link href="">
                      <Image
                          src="/icons/LeftArrow.svg"
                          alt="LeftArrow icon"
                          width={10}
                          height={10}
                          className="mr-4 md:hidden"
                          style={{ width: 'auto', height: 'auto' }} />
                  </Link>
                  Weight Journals
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
                <p className="font-sans font-medium text-grey " >
                    
                {weight.map((item: any) => (
                <p key={item.weightJournalId}>
                  {item.id}
                 {new Date(item.date).toISOString().split('T')[0]}
                  {item.weight}
                  {item.time}
                  {/* <Button type="button" text="INFO"style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }} onClick={() => router.push(`/getWeightJournal/${user?.uid}/${weight.item.weightJournalId}`)} /> */}
                  <Button type="button" text="INFO"style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }} onClick={() => router.push(`/getWeightJournals/${item.id}`)} />
                  <Button type="button" text="delete"style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }} onClick={() =>deleteWeightJournals(item.uid,item.id)} />

                </p>
                ))}
                <br></br>
                    </p>

                  </span>
              )}
          </div>
  );
}