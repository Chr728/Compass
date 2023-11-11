'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { deleteFoodIntakeJournal, getFoodIntakeJournal, getFoodIntakeJournals} from '../http/foodJournalAPI'; 
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { MdDeleteForever, MdInfoOutline, MdKeyboardArrowDown } from 'react-icons/md';
import Header from '../components/Header';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';


export default function GetFoodJournalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [food, setfood] = useState<any>(null);
  
  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchFoodJournals() {
      try {
        const userId = user?.uid || '';
        const result = await getFoodIntakeJournals();    
        console.log('All Food journals entry retrieved:', result);
        setfood(result.data);
      } catch (error) {
        console.error('Error retrieving food journal entry:', error);
      }
    }
      fetchFoodJournals();
  }, [user]);


    async function deleteFoodJournals(foodJournalId: string){
      const deleteresult = await deleteFoodIntakeJournal(foodJournalId);   
      location.reload();
    }


    return (
      <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
          <button onClick={() => router.push('/journals')}>
            <Header headerText="Food Journals "></Header>
          </button>
        </span>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">Keep track of what you eat each day.</p>
        <br></br>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">Remember, eating healthy is all about eating
          the right foods in the right amounts.</p>
    
        {food && (
  <div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
    <div className="flex justify-between items-center">
      <div>
        <Button type="button" text="Add an Entry" style={{ width: '120px', fontSize: '14px', padding: '1px 10px' }} onClick={() => router.push(`/createFoodJournal`)} />
      </div>
    </div>
    <br></br>
<div className="flex" style={{ justifyContent: 'space-between' }}>
    <div className="flex-2" style={{ marginRight: '14%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
        Date/Time
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
    <div className="flex-2" style={{ marginRight: '20%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
       Food Item
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
  </div>
  {food.map((item: any, index: number) => (
    <div
      key={item.foodJournalId}
      className={`flex justify-between items-center mt-3`}
      style={{
        backgroundColor: index % 2 === 0 ? 'white' : '#DBE2EA',
      }}
      onClick={() => router.push(`/getFoodJournals/${item.id}`)}
    >
      <div className="flex-2">
        <p className="font-sans font-medium text-darkgrey text-[14px] text-center">
        {`${formatDate(item.date)} ${formatMilitaryTime(item.time)}`}
        </p>
      </div>
      <div className="flex-2">
        <p className="ml-4 font-sans font-medium text-darkgrey text-[14px] text-center">
        {item.foodName}
        </p>
      </div>

      
      <div className="flex icons" style={{ marginLeft: '5px', marginRight: '5px' }}>
        <div className="icon">
          <MdDeleteForever
            style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
            onClick={() => deleteFoodJournals(item.id)}
          />
        </div>
      </div>
    </div>
  ))}
  </div>
)}
      </div>
    );
    
}
