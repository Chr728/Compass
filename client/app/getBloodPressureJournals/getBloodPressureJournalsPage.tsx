"use client";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDeleteForever, MdKeyboardArrowDown } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
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

export default function GetBloodPressureJournalsPage() {
    const logger = require("../../logger");
    const router = useRouter();
    const { user } = useAuth();
    const { userInfo } = useUser();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

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
                                        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold">
                                        BP
                                        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold">
                                        Pulse
                                        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  
                                    </div>
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* to be added */}
                            </TableBody>
                        </Table>
            </TableContainer>
                    </div>
    </div>
    )
}
