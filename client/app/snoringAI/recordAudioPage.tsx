'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { formatDate, formatMilitaryTime, formatDateYearMonthDate } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import record from '../../public/icons/record.svg';
import NextImage from "next/image";

export default function RecordAudioPage() {
    const logger = require('../../logger');
    const { user } = useAuth();

    useEffect(() =>{
        if (!user) 
            router.push("/login")
        }, [user]);
    
    const router = useRouter();

  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-2">
            <button onClick={() => router.push('/health')} >
                <Header headerText="Snoring AI"></Header>
            </button>
        </span>

        <div
            className="flex items-center justify-center p-4"
        >
            <div className="relative">
                <NextImage
                        src="/icons/record.svg"
                        alt="Record Audio Icon"
                        width={250}
                        height={250}
                        style={{ width: "auto", height: "auto" }}
                />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[24px] text-white font-bold">
                    Record
                </p>
            </div>
        </div>

        <div className='h-[400px]'>
            <TableContainer sx={{ maxHeight: 440,  }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div>
                                    Date
                                    <button aria-label="recordingDate">
                                        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  
                                    </button>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                Result
                                <button aria-label="recordingResult">
                                    <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" /> 
                                </button>
                                </div>
                            </TableCell>
                            <TableCell></TableCell>    {/*Table cell for play recording icon column*/}
                            <TableCell></TableCell>    {/*Table cell for trash icon column*/}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                    </TableBody>
                    </Table>
            </TableContainer>
        </div>

      
    </div>
  )
}
