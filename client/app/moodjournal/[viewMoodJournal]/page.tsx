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


export default function GetMoodJournal( {params: { viewMoodJournal } } : { params: { viewMoodJournal: string }} ) {
  const logger = require('../../../logger');
  const { user } = useAuth();
  const router = useRouter();
  const { userInfo } = useUser();
  const [mood, setMood] = useState<any>(null);
  
  async function fetchMoodJournal() {
    try {
      const result = await getMoodJournal(viewMoodJournal);
      logger.info('Mood journal entry retrieved:', result);
      const updatedStressSignals = JSON.parse(result.data.stressSignals);
      const updatedMoodData = {
       ...result.data,
       stressSignals: updatedStressSignals, 
      }
      logger.info('Updated mood data:', updatedMoodData);
      setMood(updatedMoodData);
    } catch (error) {
      logger.error('Error retrieving mood journal entry:', error);
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

  // if (!user) {
  //   return <div><Custom403/></div>
  // }

  return (
    mood && <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/moodjournal')}>
              <Header headerText="View Journal Entry"></Header>
              </button>
        </span>
     
            <div 
              className="w-11/12 rounded-3xl 
              bg-white flex flex-col space-y-4 mt-2 self-center	text-black
              shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
              style={{ overflowY: 'auto', maxHeight: '480px'}}
            >
              <Typography variant="body1" ml={2} mt={2} color="black">
                <b>Date:</b> {formatDate(mood.date)}
              </Typography>
              <Typography variant="body1" ml={2} color="black">
                <b>How Were You:</b> {mood.howAreYou}
              </Typography>
              <Typography variant="body1" ml={2} color="black">
                <b>Stress Signals:</b>
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I feel tired:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I'm not sleeping well:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I'm not hungry:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I ate too much:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I feel sad or depressed:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I feel like things are just too much:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I have trouble paying attention:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I feel nervous or anxious:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I feel angry or irritated:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>I get headaches and/or colds:</b> {mood.stressSignals.tired}
              </Typography>
              <Typography variant="body1" ml={4} color="black">
                <b>Notes:</b> {mood.notes}
              </Typography>

              <div className='mt-10 pb-4 self-center'>
                <Button type="button" text="Edit" 
                style={{ width: '140px' }} 
                onClick={() => router.push(`/moodjournal/${viewMoodJournal}/${viewMoodJournal}`)} />
                <Button type="button" text="Cancel"
                style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'12px' }}
                onClick={() => router.push(`/moodjournal`)}
                />
              </div>
            </div>
        </div>
  );
}