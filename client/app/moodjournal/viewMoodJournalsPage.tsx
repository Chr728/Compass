'use client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../components/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Input from "@/app/components/Input";
import ButtonMUI from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { deleteMoodJournal, getMoodJournal, getMoodJournals } from '../http/moodJournalAPI';
import { useEffect, useState } from 'react';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import { parse } from 'path';
import { data } from 'cypress/types/jquery';

export default function ViewMoodJournalsPage() {
    const { user } = useAuth();
    const [moodJournal, setMoodJournal] = useState<any>();
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
          console.log('All mood journal entries retrieved:', result);
          setMoodJournal(result.data);
        } catch (error) {
          console.error('Error retrieving mood journal entry:', error);
        }
      }
      fetchMoodJournals();
    }, [user]);
  
      async function deleteMoodJournals(moodJournalId: string){
        const deleteresult = await deleteMoodJournal(moodJournalId);   
        location.reload();
      }

    const handleClick = (moodJournalID: string) => {
        router.push(`/viewMoodJournal/${moodJournalID}`);
    }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
            <Link href="">
            <Image
                src="/icons/LeftArrow.svg"
                alt="LeftArrow icon"
                width={10}
                height={10}
                className="mr-4 md:hidden"
                style={{ width: 'auto', height: 'auto' }}
                onClick={() => router.back()}
            />
            </Link>
            Mood Journal
        </span>
        <p className="text-grey font-sans text-[16px] ml-4 mt-2 w-11/12">
            Tracking your mood helps you understand when and what caused your mood to change.
        </p>
        <div 
            className="max-h-[500px] w-11/12 rounded-3xl 
            bg-white flex flex-col space-y-4 mt-8 self-center	
            shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
            <div style={{padding: '24px 16px 0 16px'}}>
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
        </div>

        {moodJournal && moodJournal.map((data: any, index: number) => (
              <Card sx={{ maxWidth: 9/10 }} key={data.moodJournalId}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {data.date}
                  </Typography>
                  <Typography variant="body2">
                    {data.comment}
                  </Typography>
                </CardContent>
                <CardActions>
                  <ButtonMUI 
                    size="small"
                    onClick={() => handleClick(data.moodJournalId)}
                  >
                    View Entry
                  </ButtonMUI>
                </CardActions>
              </Card>
          ))}
        

        </div>
    </div>
  )
}


