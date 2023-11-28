'use client';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';
import { deleteMoodJournal, getMoodJournal, getMoodJournals } from '../http/moodJournalAPI';
import { useEffect, useState } from 'react';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Image from 'next/image';

export default function ViewMoodJournalsPage() {
    const logger = require('../../logger');
    const { user } = useAuth();
    const [moodJournal, setMoodJournal] = useState<any>();
    const [moodColor, setMoodColor] = useState<any>();
    const router = useRouter();

    useEffect(() =>{
        if (!user) 
            router.push("/login")
        }, [user]);

    useEffect(() => {
      async function fetchMoodJournals() {
        try {
          const userId = user?.uid || '';
          const result = await getMoodJournals();    
          logger.info('All mood journal entries retrieved:', result);
          setMoodJournal(result.data);
        } catch (error) {
          logger.error('Error retrieving mood journal entry:', error);
        }
      }
      setTimeout(() => {
        fetchMoodJournals();
      }, 1000);
    }, [user]);

    function setColor(mood: String) {
      switch(mood) {
        case 'awesome':
          return '#14a38b'
        case 'good':
          return '#a5d6a7'
        case 'sad':
          return '#756f86'
        case 'bad':
          return '#f2ac57'
        case 'awful': 
        return '#ff7171'
      }
    }

    async function deleteMoodJournals(moodJournalId: string){
      const deleteresult = await deleteMoodJournal(moodJournalId);   
      const newData = moodJournal && moodJournal.filter((item: { id: string; }) => item.id!=moodJournalId);
      setMoodJournal(newData);
      router.push('/moodjournal');
    }

    const handleClick = (moodJournalID: string) => {
        router.push(`/moodjournal/${moodJournalID}`);
    }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full">
    
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
        <button onClick={() => router.push('/journals')}>
            <Header headerText="Mood Journal "></Header>
        </button>
        </span>
        <p className="text-grey font-sans text-[16px] ml-4 mt-2 w-11/12">
            Tracking your mood helps you understand when and what caused your mood to change.
        </p>
          <div 
            className="w-11/12 rounded-3xl flex flex-col space-y-4 mt-2 self-center mb-4"
          >
            <div className="flex space-x-2" style={{padding: '24px 16px 0 16px'}}>
                <Button 
                type="button" 
                text="Add an item" 
                onClick={ () => router.push('/moodjournal/addentry')} 
                style={{ 
                    width: '100px', 
                    height: '34px', 
                    padding: '2px', 
                    borderRadius: '3px', 
                    fontSize: '14px'
                }}/>
                <Button 
                type="button" 
                text="Daily" 
                onClick={ () => router.push('')} //this route will be changed next sprint when this feature is made
                style={{ 
                    width: '100px', 
                    height: '34px', 
                    padding: '2px', 
                    borderRadius: '3px', 
                    fontSize: '14px'
                }}/>
                <Button 
                type="button" 
                text="Monthly" 
                onClick={ () => router.push('')}  //this route will be changed next sprint when this feature is made
                style={{ 
                    width: '100px', 
                    height: '34px', 
                    padding: '2px', 
                    borderRadius: '3px', 
                    fontSize: '14px'
                }}/>
            </div>

      <div className="flex flex-col space-y-2 p-4 text-darkgrey" style={{ overflowY: 'auto', maxHeight: '380px'}}>
        
        {moodJournal && moodJournal.map((data: any, index: number) => (
            <div 
              key={data.id}
              className="flex space-x-2" 
            >
                <div className="self-center border border-grey p-2 rounded-lg w-[75px] h-[75px] text-center font-bold text-darkgrey text-[20px]">
                  <p>{formatDate(data.date).substring(0,3).toUpperCase()}</p>
                  <p>{formatDate(data.date).substring(4,6).replace(',', '')}</p>
                </div>
            
                <div className="flex items-center">
                  <div className="h-[20px] w-[10px] flex items-center">
                    <div className="border-b-[25px] border-r-[37.5px] border-t-[25px] border-b-transparent border-t-transparent"
                        style={{ borderColor: 'transparent', borderRightColor: setColor(data.howAreYou)}}>
                    </div>
                  </div>
              <div className="relative rounded-md p-2 w-[240px] h-[100px] text-white" style={{ background: setColor(data.howAreYou) }}>
                <div className="flex space-x-2 items-center absolute top-2 right-2">
                    <div onClick={() => handleClick(data.id)}>
                      <Image 
                        src="/icons/info.svg"
                        alt="Info icon"
                        width={10}
                        height={10}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                    <div className="w-[28px] h-[28px]" onClick={() => deleteMoodJournals(data.id)}>
                              <Image 
                                src="/icons/greyTrash.svg"
                                alt="Grey-colored Trash icon"
                                width={10}
                                height={10}
                                style={{ width: 'auto', height: 'auto' }}
                              />
                     </div>
                  </div>
                    <p className="font-medium">Felt {data.howAreYou}!</p>
                    {data.notes && (
                        <p className="opacity-[0.86] pt-1">{data.notes.length > 55 ? `${data.notes.substring(0, 55)}...` : data.notes}</p>
                    )}
                   
                  </div>
                </div>
              </div> 
            ))}

            </div>
            <div className="mb-2">&nbsp;</div>     
         </div>
  
    </div>
  )
}