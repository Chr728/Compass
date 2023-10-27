'use client';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import { getMoodJournal, getMoodJournals} from '../../http/moodJournalAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Typography from '@mui/material/Typography';
import Menu from '@/app/components/Menu';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';


export default function GetMoodJournal( {params: { moodJournalId } } : { params: { moodJournalId: string }} ) {
  
  const { user } = useAuth();
  const router = useRouter();
  const { userInfo } = useUser();
  const [mood, setMood] = useState<any>(null);
  
  async function fetchMoodJournal() {
    try {
      console.log('mood journal id: ', moodJournalId)
      const userId = user?.uid || '';
      const result = await getMoodJournal(moodJournalId);
      console.log('Mood journal entry retrieved:', result);
      setMood(result.data);
    } catch (error) {
      console.error('Error retrieving mood journal entry:', error);
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      alert('User not found.');
    } 
    if (user) {
      fetchMoodJournal();
    }
  }, []);

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="View Journal Entry"></Header>
              </button>
        </span>
     
        <div 
        className="w-11/12 rounded-3xl 
        bg-white flex flex-col space-y-4 mt-8 self-center	
        shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
          {mood && mood.map((data: any, index: number) => (
            <>
            <Typography>
              Date: {formatDate(data.date)}
            </Typography>
            <Typography>
              How Were You: {data.howAreYou}
            </Typography>
            <Typography>
              Stress Signals:
            </Typography>
            <Typography>
              I feel tired: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I'm not sleeping well.': {data.stressSignals.tired}
            </Typography>
            <Typography>
              I'm not hungry': {data.stressSignals.tired}
            </Typography>
            <Typography>
              I ate too much: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I feel sad or depressed: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I feel like things are just too much: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I have trouble paying attention: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I feel nervous or anxious: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I feel angry or irritated: {data.stressSignals.tired}
            </Typography>
            <Typography>
              I get headaches and&sol;or colds: {data.stressSignals.tired}
            </Typography>
            <Typography>
              Notes: {data.notes}
            </Typography>
            </>

        ))}
        </div>
    </div>
  );
// }
}