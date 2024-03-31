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
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import SpanHeader from "../components/SpanHeader";


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
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);


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

    const deleteSelectedRows = async () => {
      Swal.fire({
        text: "Are you sure you want to delete this appointment?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then(async (result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          for (const id of selectedRows) {
            const deleteresult = await deleteAppointment(id);
          }
  
          const newData = data.filter(
            (item: { id: string }) => !selectedRows.includes(item.id)
          );
          setData(newData);
          setSelectedRows([]);
  
          router.push("/viewappointments");
          Swal.fire({
            title: "Deleted!",
            text: "Your appointments have been deleted.",
            icon: "success",
          });
        }
      });
    };

    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedRows([]);
      } else {
        const allIds = data.map((item: { id: string }) => item.id);
        setSelectedRows(allIds);
      }
      setSelectAll(!selectAll);
    };

    const handleCheckboxChange = (id: string) => {
      if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else {
        setSelectedRows([...selectedRows, id]);
      }
    };

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
        <div className="bg-eggshell min-h-screen flex flex-col w-full overflow-y-auto"  style={{ marginBottom: '90.5px' }}>
              <SpanHeader
                onClick={() => router.push("/health")}
                headerText="Appointments">
			        </SpanHeader>
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
                <div className='flex flex-col alternatingRowColor h-[400px]'>
                    <TableContainer sx={{ maxHeight: 440,  }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '40%' }}>
                                    <div>
                                        Date/Time
                                        <button onClick={handleOrderDate} aria-label="orderDate">
									{orderdate ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
								</button>
                                    </div>
                                </TableCell>
                                <TableCell style={{ width: '40%' }}>
                                    <div>
                                    Appointment
                                    <button onClick={handleOrderName} aria-label="orderName">
									{ordername ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
							</button>
                                    </div>
                                </TableCell>
                                <TableCell style={{ width: '15%' }}></TableCell>
                                <TableCell style={{ width: '15%' }}>
                                <div
                                  className="flex-2 mt-2"
                                  style={{ marginRight: "2%" }}>
                                  <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                </div>
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {data && Array.isArray(data) && data.map((row, index) => (
                                        <TableRow 
                                            onClick={() => handleClick(row.id)} 
                                            style={rowStyles}
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            data-testid="appointment"
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
                                            <TableCell>
                                              <div className="flex-1 mt-1">
                                                <input
                                                  type="checkbox"
                                                  checked={selectedRows.includes(row.id)}
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleCheckboxChange(row.id);
                                                  }}
                                                />
                                              </div>
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
          {selectedRows.length > 0 && (
                      <div className="mt-2 pb-4 self-center">
                        <Button
                          type="button"
                          text="Delete Selected Rows"
                          style={{
                            width: "120px",
                            fontSize: "14px",
                            padding: "1px 10px",
                          }}
                          onClick={deleteSelectedRows}
                        />
                      </div>
                    )}
        </div>
      )
    }


