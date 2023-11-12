'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { deleteGlucoseJournal, getGlucoseJournal, getGlucoseJournals} from '../../http/diabeticJournalAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import { MdDeleteForever, MdInfoOutline, MdKeyboardArrowDown } from 'react-icons/md';
import Header from '../../components/Header';
import { formatDate, formatMilitaryTime } from '../../helpers/utils/datetimeformat';


export default function GetGlucoseJournalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [glucose, setglucose] = useState<any>(null);
  
  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchGlucoseJournals() {
      try {
        const userId = user?.uid || '';
        const result = await getGlucoseJournals();    
        console.log('All Glucose journals entry retrieved:', result);
        setglucose(result.data);
      } catch (error) {
        console.error('Error retrieving glucose journal entry:', error);
      }
    }
      fetchGlucoseJournals();
  }, [user]);


    async function deleteGlucoseJournals(glucoseJournalId: string){
      const deleteresult = await deleteGlucoseJournal(glucoseJournalId);   
      const newData = glucose && glucose.filter((item: { id: string; }) => item.id!=glucoseJournalId);
      setglucose(newData);
      router.push('/getDiabeticJournals');
  
    }


    return (
      <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
          <button onClick={() => router.push('/journals')}>
            <Header headerText="Diabetes Journal "></Header>
          </button>
        </span>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">Keep track of your insulin doses and glucose measurements to ensure a healthy lifestyle.</p>
        <br></br>    
        {glucose && (
  <div className="rounded-3xl bg-white flex flex-col mt-4 mb-6 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
     <label className='text-darkgrey font-bold text-[22px] mb-3'>Glucose Measurement</label>
            <div className="flex justify-between items-center">
      <div>
        <Button type="button" text="Add an Entry" style={{ width: '120px', fontSize: '14px', padding: '1px 10px' }} onClick={() => router.push(`/createGlucoseJournal`)} />
      </div>
    </div>
    <br></br>
<div className="flex" style={{ justifyContent: 'space-between' }}>
    <div className="flex-2" style={{ marginRight: '5%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
        Date
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
    <div className="flex-2" style={{ marginRight: '1%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
        Meal Time
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
    <div className="flex-2" style={{ marginRight: '11%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
        Glucose
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
  </div>
  {glucose.map((item: any, index: number) => (
    <div
      key={item.glucoseJournalId}
      className={`flex justify-between items-center mt-3`}
      style={{
        backgroundColor: index % 2 === 0 ? 'white' : '#DBE2EA',
      }}
      onClick={() => router.push(`/getDiabeticJournals/getGlucoseJournals/${item.id}`)}
    >
      <div className="flex-2">
        <p className="font-sans font-medium text-darkgrey text-[14px] text-center">
        {`${formatDate(item.date)}`}
        </p>
      </div>
      <div className="flex-1">
        <p className="ml-3 font-sans font-medium text-darkgrey text-[14px] text-center">
          {item.mealTime}
        </p>
      </div>
      <div className="flex-1">
        <p className="ml-4 font-sans font-medium text-darkgrey text-[14px] text-center">
          {item.bloodGlucose}
        </p>
      </div>
      
      <div className="flex icons" style={{ marginLeft: '5px', marginRight: '5px' }}>
        <div className="icon" id= "Trash Icon">
          <MdDeleteForever
            style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
            onClick={() => deleteGlucoseJournals(item.id)}
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
