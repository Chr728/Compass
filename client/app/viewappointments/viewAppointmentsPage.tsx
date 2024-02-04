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
import { deleteAppointment, getAppointments } from '../http/appointmentAPI';
import { useEffect, useState } from 'react';
import { Appointment } from '../http/appointmentAPI';
import { formatDate, formatMilitaryTime } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Swal from 'sweetalert2';
import Header from '../components/Header';

export default function ViewAppointmentsPage() {
    const logger = require('../../logger');
    const { user } = useAuth();
    useEffect(() =>{
        if (!user) 
            router.push("/login")
        }, [user]);

    const rowStyles = {
        cursor: 'pointer',
      };
    const router = useRouter();
    const [data, setData] = useState<Appointment[] | null>(null);

    useEffect(() => {
        async function fetchAppointment() {
            try {
                const userId = user?.uid || '';
                const appointmentData = await getAppointments(userId);
                logger.info('All appointments retrieved:', appointmentData.data)
                setData(appointmentData.data);
            } catch (error) {
                logger.error('Error fetching appointments', error);
            }
        }
        fetchAppointment();
    }, [user]);
   
    const handleDelete = async (appointmentID: any) => {
        Swal.fire({
            text: "Are you sure you want to delete this appointment?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
          }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    const response = await deleteAppointment(appointmentID);
                    const newData = data && data.filter(item => item.id!=appointmentID);
                    setData(newData);
                    router.push('/viewappointments');
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your appointment has been deleted.",
                        icon: "success"
                      });
                } catch(error){
                    logger.error('Error deleting appointment');
                }       
            }
        });     
    }

    const handleClick = (appointmentID: string) => {
        router.push(`/viewappointments/${appointmentID}`);
    }

    //Order by appoinment doctor name
	const [ordername, setOrderName] = useState(false)

	const handleOrderName = () => {
		setOrderName(!ordername)
		if (!ordername && Array.isArray(data)){
			const increasingappointmentData = [...data].sort((a,b) => (a.appointmentWith).toLowerCase() < (b.appointmentWith).toLowerCase() ? -1 : 1)
			setData(increasingappointmentData)
		}
		else if (Array.isArray(data)){
			const decreasingOrderglucoseData = [...data].sort((a,b) => (a.appointmentWith).toLowerCase() > (b.appointmentWith).toLowerCase() ? -1 : 1)
			setData(decreasingOrderglucoseData)
		}
	}

    //Order by DateTime
	const [orderdate, setOrderdate] = useState(false)

	const handleOrderDate = () => {
		setOrderdate(!orderdate)
		if (!orderdate && Array.isArray(data)){
			const increasingappointmentData = [...data].sort((a,b) => new Date(a.date.substring(0,10)+"T"+a.time).getTime() - new Date(b.date.substring(0,10)+"T"+b.time).getTime())
			setData(increasingappointmentData)
		}
		else if (Array.isArray(data)){
			const decreasingOrderglucoseData = [...data].sort((a,b) => new Date(b.date.substring(0,10)+"T"+b.time).getTime() - new Date(a.date.substring(0,10)+"T"+a.time).getTime())
			setData(decreasingOrderglucoseData)
		}
	}
  
  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full">
          <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-2">
            <button onClick={() => router.push('/health')} >
                <Header headerText="Appointments"></Header>
            </button>
          </span>
        <p 
            className="text-grey font-sans text-[16px] mx-8">
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
                                <button onClick={handleOrderDate} aria-label="orderDate">
									{orderdate ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey"/>}
								</button>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>
                            Appointment
                            <button onClick={handleOrderName} aria-label="orderName">
									{ordername ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
							</button>
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
                                            onClick={(event) => {event.stopPropagation();handleDelete(row.id)}}
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


