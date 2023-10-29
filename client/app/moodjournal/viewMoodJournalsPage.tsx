'use client';

import Button from '../components/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonMUI from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { deleteMoodJournal, getMoodJournal, getMoodJournals } from '../http/moodJournalAPI';
import { useEffect, useState } from 'react';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function ViewMoodJournalsPage() {
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
          console.log('All mood journal entries retrieved:', result);
          setMoodJournal(result.data);
        } catch (error) {
          console.error('Error retrieving mood journal entry:', error);
        }
      }
      fetchMoodJournals();
    }, [user]);

    function setColor(mood: String) {
      switch(mood) {
        case 'awesome':
          return '#a5d6a7'
        case 'good':
          return '#90caf9'
        case 'sad':
          return '#e0e0e0'
        case 'bad':
          return '#fff59d'
        case 'awful': 
        return '#ffcdd2'
      }
    }

    async function deleteMoodJournals(moodJournalId: string){
      const deleteresult = await deleteMoodJournal(moodJournalId);   
      location.reload();
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
            className="w-11/12 rounded-3xl 
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
            <div 
              className="my-4 self-center w-11/12" 
            >
              <Card 
                sx={{backgroundColor: setColor(data.howAreYou) }}
                key={data.id}
              >
                <CardContent>
                  <Typography variant="body2">
                    {formatDate(data.date)}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {data.notes}
                  </Typography>
                </CardContent>
                <CardActions>
                  <ButtonMUI 
                    size="small"
                    onClick={() => handleClick(data.id)}
                  >
                    View Entry
                  </ButtonMUI>
                  <ButtonMUI 
                    size="small"
                    onClick={() => deleteMoodJournals(data.id)}
                  >
                    Delete
                  </ButtonMUI>
                </CardActions>
              </Card>
            </div>

          ))}
            <div className="mb-2">&nbsp;</div>        
        </div>
    </div>
  )
}


