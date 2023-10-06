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
import {useRouter} from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { deleteAppointment, getAppointments } from '../http/appointmentAPI';
import { useEffect, useState } from 'react';
import { Appointment } from '../http/appointmentAPI';

export function formatDate(dateString: string) {
    const options:  Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
  
  export function formatMilitaryTime(timeString: string) {
    const [hours, minutes] = timeString.split(':');
    const formattedTime = `${parseInt(hours, 10)}h${minutes}`;
    return formattedTime;
  };

export default function ViewAppointments() {
    const rowStyles = {
        cursor: 'pointer',
      };
    const router = useRouter();
    const { user } = useAuth();
    const [data, setData] = useState<Appointment[] | null>(null);

    useEffect(() => {
        async function fetchAppointment() {
            try {
                const userId = user?.uid || '';
                const appointmentData = await getAppointments(userId);
                setData(appointmentData.data);
            } catch (error) {
                console.log('Error fetching appointments');
            }
        }
        fetchAppointment();
    }, [user]);
   
    const handleDelete = async (appointmentID: any) => {
        try{
            const response = await deleteAppointment(appointmentID);
            const newData = data && data.filter(item => item.id!=appointmentID);
            setData(newData);
            router.push('/viewappointments');
        } catch(error){
            console.log('Error deleting appointment');
        }
    }

    const handleClick = (appointmentID: string) => {
        router.push(`/viewappointments/${appointmentID}`);
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
            />
            </Link>
            Appointments
        </span>
      {/* the text color for the text below has to be black but that is not working for some reason, so I've put grey for now. */}
        <p 
            className="text-grey font-sans text-[16px] ml-4 mt-2">
            Keep track of appointments you've set.
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
                                            // style={{backgroundColor: 'var(--Red, #FF7171)', height:'40px', padding: '4px'}}
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


