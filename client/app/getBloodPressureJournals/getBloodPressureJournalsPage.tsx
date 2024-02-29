"use client";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
	formatDate,
	formatMilitaryTime,
} from "../helpers/utils/datetimeformat";
import { getBloodPressureJournals, deleteBloodPressureJournalEntry } from '../http/bloodPressureJournalAPI';

export default function GetBloodPressureJournalsPage() {

    const logger = require("../../logger");
    const router = useRouter();
    const { user } = useAuth();
    // const { userInfo } = useUser();
    const [data, setData] = useState<any>();

	useEffect(() => {
		if (!user) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [user, router]);

    useEffect(() => {
        async function fetchBPJournals() {
            try {
                const userId = user?.uid || '';
                const journalData = await getBloodPressureJournals();
                logger.info('All journals retrieved:', journalData.data)
                setData(journalData.data);
            } catch (error) {
                logger.error('Error fetching appointments', error);
            }
        }
        fetchBPJournals();
    }, [user]);

    const handleClick = (journalID: string) => {
        router.push(`/getBloodPressureJournals/${journalID}`);
    }

    async function deleteBloodPressureJournal(bloodPressureJournalID: string) {
		Swal.fire({
			text: "Are you sure you want to delete this blood pressure journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteBloodPressureJournalEntry(
					bloodPressureJournalID
				);
				const newData =
					data &&
					data.filter(
						(item: { id: string }) => item.id != bloodPressureJournalID
					);
                    setData(newData);
				router.push("/getBloodPressureJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your blood pressure journal entry has been deleted.",
					icon: "success",
				});
			} else {
				router.push("/getBloodPressureJournals");
			}
		});
	}

    const [orderdate, setOrderDate] = useState(false);

    const handleOrderDate = () => {
		setOrderDate(!orderdate);
		if (!orderdate) {
			const increasingOrderBloodPressureData = [...data].sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime()
			);
			setData(increasingOrderBloodPressureData);
		} else {
			const decreasingOrderBloodPressureData = [...data].sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			);
			setData(decreasingOrderBloodPressureData);
		}
	};

    const [orderBloodPressure, setOrderBloodPressure] = useState(false);

    const handleOrderBloodPressure = () => {
        setOrderBloodPressure(!orderBloodPressure);
        const sortedData = [...data].sort((a, b) => {

            if (orderBloodPressure) {
                if (a.systolic !== b.systolic) {
                    return b.systolic - a.systolic;
                }
                return b.diastolic - a.diastolic;
            } else {
                if (a.systolic !== b.systolic) {
                    return a.systolic - b.systolic;
                }
                return a.diastolic - b.diastolic;
            }
        });

        setData(sortedData);
    };
    
  
    
    const [orderPulse, setOrderPulse] = useState(false);

	const handleOrderPulse = () => {
		setOrderPulse(!orderPulse);
		if (!orderPulse) {
			const increasingOrderPulseData = [...data].sort(
				(a, b) => a.pulse - b.pulse
			);
			setData(increasingOrderPulseData);
		} else {
			const decreasingOrderPulseData = [...data].sort(
				(a, b) => b.pulse - a.pulse
			);
			setData(decreasingOrderPulseData);
		}
	};

    return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
            <button onClick={() => router.push("/journals")}>
                <Header headerText="Blood Pressure Journal"></Header>
            </button>
        </span>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">
			Maintain your blood pressure at a healthy level at all times and keep track of your results here.
		</p>
        <div 
                className="max-h-[500px] w-full rounded-3xl 
                bg-white flex flex-col space-y-4 mt-8 
                shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
            <div className="ml-4">
                <Button
                    type="button"
                    text="Add an Entry"
                    style={{
                        width: "120px",
                        fontSize: "14px",
                        // padding: "1px 10px",
                    }}
                    onClick={() =>
                        router.push(`/createBloodPressureJournal`)
                    }
                />
            </div>
        </div>

        <div className='h-[400px]'>
            <TableContainer sx={{ maxHeight: 440,  }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                            <TableRow>
                                <TableCell>
                                    <div className="font-bold">
                                        Date/Time
                                        {/* <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />   */}
                                        <button
                                            onClick={handleOrderDate}
                                            aria-label="orderDate">
                                            {orderdate ? (
                                                <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                                            ) : (
                                                <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                                            )}
								        </button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold">
                                        BP
                                        <button
                                            onClick={handleOrderBloodPressure}
                                            aria-label="orderBloodPressure">
                                            {orderBloodPressure ? (
                                                <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                                            ) : (
                                                <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                                            )}
								        </button> 
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold">
                                        Pulse
                                        <button
                                            onClick={handleOrderPulse}
                                            aria-label="orderPulse">
                                            {orderPulse ? (
                                                <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                                            ) : (
                                                <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                                            )}
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
                                        style={ { backgroundColor: index % 2 === 0 ? '#DBE2EA':'white',  cursor: 'pointer'  }}
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                     <TableCell component="th" scope="row">
                                         {formatDate(row.date)},
                                             <span className="font-bold"> {formatMilitaryTime(row.time)}</span>
                                     </TableCell>
                                     <TableCell >{row.systolic}/{row.diastolic}</TableCell>
                                     <TableCell >{row.pulse}</TableCell>
                                     <TableCell>
                                         <Image 
                                             src="/icons/trash.svg"
                                             alt="Trash icon"
                                             width={10}
                                             height={10}
                                             className="mr-4 md:hidden"
                                             style={{ width: 'auto', height: 'auto' }}
                                             onClick={(event) => {
                                                event.stopPropagation();
                                                deleteBloodPressureJournal(row.id);
                                            }}
                                         />  
                                                                   
                                     </TableCell>
                                 </TableRow>

                                ))}
                            </TableBody>
                        </Table>
            </TableContainer>
                    </div>
    </div>
    )
}
