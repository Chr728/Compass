'use client';
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
import { formatDate, formatMilitaryTime, formatDateYearMonthDate } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";


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
    const [data, setData] = useState<any>();
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [highlightedDays, setHighlightedDays] = useState<string[]>([]);


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
  
    const handleCalendarClick = () => {
        setShowCalendar(true);
      }

    const handleDailyClick = () => {
    setShowCalendar(false);
    }

    useEffect(() => { 
        let tempDates: string[] = [];
        if (data) { 
            data.forEach((item: any) => { 
            tempDates.push(formatDateYearMonthDate(item.date))
          })
          console.log('tempDates', tempDates)
          setHighlightedDays(tempDates)
        }
       
      }, [data])

    const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },

    }));
    
    const ServerDay = (props : any) => {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    
        const getAppointmentForDay = () => {
          const formattedDate = day.format("YYYY-MM-DD");
          const appointmentEntry = data.find((entry: any) => formatDateYearMonthDate(entry.date) === formattedDate);
        };
        const appointment = getAppointmentForDay();
        const isSelected =
          !props.outsideCurrentMonth &&
          highlightedDays.includes(day.format("YYYY-MM-DD"));
        
        
        
      const handleClick = () => {
        const formattedDate = day.format('YYYY-MM-DD');
        const appointmentEntry = data.find((entry: any) => formatDateYearMonthDate(entry.date) === formattedDate);
        
        if (appointmentEntry) {
          router.push(`/viewappointments/${appointmentEntry.id}`);
        }
      };
      
        return (
          <HighlightedDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            style={{
              backgroundColor: isSelected ? "#14a38b" : "#ffffff"
            }}
            selected={isSelected}
            onClick={handleClick} 
          />
        );
      };

  
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
            <div className="flex space-x-2" style={{padding: '24px 16px 0 16px'}}>
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
                <Button
                    type="button"
                    text="Daily"
                    onClick={() => handleDailyClick()}
                    style={{
                    width: '100px',
                    height: '34px',
                    padding: '2px',
                    borderRadius: '3px',
                    fontSize: '14px'
                }} />
                <Button
                    type="button"
                    text="Monthly"
                    onClick={() => handleCalendarClick()}
                    style={{
                    width: '100px',
                    height: '34px',
                    padding: '2px',
                    borderRadius: '3px',
                    fontSize: '14px'
                }} />
        </div>
        
        {!showCalendar &&
            <div className='appointment h-[400px]'>
                <TableContainer sx={{ maxHeight: 440,  }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            <TableCell>
                                <div>
                                    Date/Time
                                    <MdKeyboardArrowDown className="inline-block text-[24px] text-darkgrey" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                Appointment
                                <MdKeyboardArrowDown className="inline-block text-[24px] text-darkgrey" />
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
        }
        {
          showCalendar &&
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar slotProps={{
                        day: {
                          highlightedDays,
                        },
                }}
                slots={{
                  day: ServerDay,
                }}
                style={{ background: 'white', color: 'black', marginLeft: '12px' }}
              />
            </LocalizationProvider>
        }

      </div>
    </div>
  )
}


