'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { deleteActivityJournal, getActivityJournal, getActivityJournals} from '../http/activityJournalAPI'; 
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { MdDeleteForever, MdInfoOutline, MdKeyboardArrowDown } from 'react-icons/md';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { formatDate } from '../helpers/utils/datetimeformat';

export default function GetActivityJournalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [activity, setactivity] = useState<any>(null);
  
  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchActivityJournals() {
      try {
        const userId = user?.uid || '';
        const result = await getActivityJournals();    
        console.log('All Activity journals entry retrieved:', result);
        setactivity(result.data);
      } catch (error) {
        console.error('Error retrieving activity journal entry:', error);
      }
    }
    fetchActivityJournals();
  }, [user]);


    async function deleteActivityJournals(activityJournalId: string){
      const deleteresult = await deleteActivityJournal(activityJournalId);   
      location.reload();
    }


  return (    
      <div className="bg-eggshell min-h-screen flex flex-col">
              <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="Activity Journals "></Header>
              </button>
              </span>
              <p className="font-sans  text-darkgrey ml-5 p-5  text-[14px]">Manage your daily activities to help you stay fit. People with active lifestyles are often happier and healthier. </p>
              <br></br>
              
              {activity && (
            <div className="rounded-3xl bg-white flex flex-col mt-1 mb-6  w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
              <div className="flex justify-between items-center">
                <div>
                  <Button type="button" text="Add an Entry" style={{ width: '120px', fontSize: '14px' }} onClick={() => router.push(`/createActivityJournal`)} />
                </div>
              </div>
              <br></br>

          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <div className="flex-2" style={{ marginRight: '-3%'}}>
              <div className="font-sans  font-bold text-darkgrey text-[18px] text-center ">
                Date
                <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
              </div>
            </div>
            <div className="flex-2" style={{ marginRight: '2%' }} >
              <div className="font-sans  font-bold  text-darkgrey text-[18px] ml-14 text-center">
               Activity
               <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
              </div>
            </div>
            <div className="flex-2" style={{ marginRight: '10%' }}>
              <div className="font-sans font-bold text-darkgrey text-[18px] ml-4 text-center">
              Duration
              <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
              </div>
            </div>
          </div>

          {activity.map((item: any, index: number) => (
  <div
    key={item.activityJournalId}
    className={`flex justify-between items-left mt-3`}
    style={{
      backgroundColor: index % 2 === 0 ? 'white' : '#DBE2EA',
    }}
  >
    <div className="flex-2">
      <p className="font-sans font-medium text-darkgrey text-[14px]">
        {formatDate(item.date)}
      </p>
    </div>
    <div className="flex-2">
      <p className="font-sans ml-4 font-medium text-darkgrey text-[14px]">
        {item.activity}
      </p>
    </div>
    <div className="flex-2">
      <p className="font-sans ml-4 font-medium text-darkgrey text-[14px]">
        {item.duration}
      </p>
    </div>

    <div className="flex icons" style={{ marginLeft: '5px', marginRight: '5px',  marginTop: '-2%'}}>
        <div className="icon">
          <MdInfoOutline
            style={{ color: 'var(--Black, #000000)', width: '25px', height: '30px' }}
            onClick={() => router.push(`/getActivityJournals/${item.id}`)}
          />
        </div>
        <div className="icon">
          <MdDeleteForever
            style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
            onClick={() => deleteActivityJournals(item.id)}
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