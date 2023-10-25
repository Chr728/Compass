'use client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../components/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Input from "@/app/components/Input";
import { useRouter } from 'next/navigation';
import { deleteMoodJournal, getMoodJournal, getMoodJournals } from '../http/moodJournalAPI';
import { useEffect, useState } from 'react';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';

export default function ViewMoodJournalsPage() {
    const { user } = useAuth();
    const [moodJournal, setMoodJournal] = useState<any>(null);

    useEffect(() =>{
        if (!user) 
            router.push("/login")
        }, [user]);

    const rowStyles = {
        cursor: 'pointer',
      };
    const router = useRouter();

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
        <span 
        className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4"
        >
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
      {/* the text color for the text below has to be black but that is not working for some reason, so I've put grey for now. */}
        <p 
            className="text-grey font-sans text-[16px] ml-4 mt-2">
            Tracking your mood helps you understand when and what caused your mood to change.
        </p>
        <div 
            className="max-h-[500px] w-full rounded-3xl 
            bg-white flex flex-col space-y-4 mt-8 
            shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
            <div style={{padding: '24px 16px 0 16px'}}>
                <Button 
                type="button" 
                text="Add an item" 
                onClick={ () => router.push('/viewappointments/addappointment')} 
                style={{ 
                    width: '100px', 
                    height: '34px', 
                    padding: '2px', 
                    borderRadius: '3px', 
                    fontSize: '14px'
                }}/>
        </div>
        
        <div className='appointment h-[400px]'>
          <div className="m-2 w-1/2">
                  <Input 
                  name="date" 
                  id="date" 
                  type="date" 
                  value={Date()} 
                  style={{width: '100%'}} 
                  />
              </div>

            <TableContainer sx={{ maxHeight: 440,  }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                            <div>
                                Date/Time
                                <Image
                                    src="/icons/downArrow.svg"
                                    alt="Down Arrow icon"
                                    width={10}
                                    height={10}
                                    className="ml-2 text-grey inline-block"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>
                            Appointment
                            <Image
                                src="/icons/downArrow.svg"
                                alt="Down Arrow icon"
                                width={10}
                                height={10}
                                className="ml-2 text-grey inline-block"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                            </div>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data && Array.isArray(data) && data.map((row, index) => (
                                <TableRow 
                                    onClick={() => handleClick(row.id)} 
                                    style={rowStyles}
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                         {formatDate(row.date)},
                                            <span className="font-bold"> {formatMilitaryTime(row.time)}</span>
                                    </TableCell>
                                    <TableCell >{row.appointmentWith}</TableCell>
                                    <TableCell>
                                        <Image 
                                            src="/icons/trash.svg"
                                            alt="Trash icon"
                                            width={10}
                                            height={10}
                                            className="mr-4 md:hidden"
                                            style={{ width: 'auto', height: 'auto' }}
                                            onClick={() => handleDelete(row.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
      </div>
    </div>
  )
}


