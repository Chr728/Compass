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
import { useEffect, useRef, useState } from 'react';
import {useRouter} from 'next/navigation';
import { MdKeyboardArrowDown } from 'react-icons/md';
import NextImage from "next/image";
import RedButton from '../components/RedButton';


export default function RecordAudioPage() {
    const logger = require('../../logger');
    const { user } = useAuth();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [itemRecorded, setItemRecorded] = useState(false);
    const [timer, setTimer] = useState(0);
    const [currentRecordingDate, setCurrentRecordingDate] = useState<string>('');
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);


    useEffect(() =>{
        if (!user) 
            router.push("/login")
        }, [user]);
    
    useEffect(() => {
        let interval:any;

        if (recording) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setTimer(0);
        }

        return () => clearInterval(interval);
    }, [recording]); 

    const formatTimer = (seconds:any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const router = useRouter();

    const handleRecordClick = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          setCurrentRecordingDate(formatDateYearMonthDate(new Date()));
    
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              const audioBlob = new Blob([event.data], { type: 'audio/wav' });
              setRecordedAudioBlob(audioBlob);
              
            }
          };
    
          mediaRecorder.start();
          setRecording(true);

        } catch (error) {
          console.error('Error accessing microphone:', error);
        }
      };

      const handleStopClick = () => {

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = () => {
            };
    
            mediaRecorderRef.current.stop();
            setRecording(false);
            setItemRecorded(true);
    
            if (timerInterval !== null) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }

            mediaRecorderRef.current = null;
        }
    };

    const handleCancelClick = () => {
        setItemRecorded(false);
        setRecordedAudioBlob(null);
        setRecording(false);
    }

    const handleReplayClick = () => {
        if (recordedAudioBlob) {
          const audioUrl = URL.createObjectURL(recordedAudioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        }
    };

    const checkExistingAudio = () => {
        const existingAudioData = JSON.parse(localStorage.getItem("savedAudio") || "[]");
        if(existingAudioData && existingAudioData.length){
            const audio = new Audio(existingAudioData[0]);
            audio.play();
        }
    }
      
    const handleSubmit = async() => {
       
        const existingAudioData = JSON.parse(localStorage.getItem("savedAudio") || "[]");

        if (recordedAudioBlob) {
            const blobURL = URL.createObjectURL(recordedAudioBlob);
            existingAudioData.push(blobURL);
            localStorage.setItem("savedAudio", JSON.stringify(existingAudioData));
            // const app = await client("pillIdentifierAI/snoringAI");

            // const formData:any = new FormData();
            // formData.append("audio", recordedAudioBlob);

            // const result:any = await app.predict("/predict", formData);

            // console.log(result.data);
        }
        console.log('clicked submit')
    }
   
  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full overflow-y-auto">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-2">
            <button onClick={() => router.push('/health')} >
                <Header headerText="Snoring AI"></Header>
            </button>
        </span>

        <div
            className="flex flex-col items-center justify-center p-4"
        >
        
            { (recording  || itemRecorded) &&
                (
                    <>
                    {currentRecordingDate && (
                        <p className="text-sm text-darkgrey mt-1">
                        Recording Date: {currentRecordingDate}
                        </p>
                    )}
                    <div className="flex flex-col p-4">
                        <NextImage
                                src="/icons/microphone.svg"
                                alt="Microphone Icon"
                                width={100}
                                height={100}
                                className={!itemRecorded ? "animate-pulse": " "}
                                style={{ width: "100%", height: "auto" }}
                        />
                        <div className="mt-2 text-center text-red mb-4">
                            {formatTimer(timer)}
                        </div>

                        <div className="flex flex-col space-y-2 mt-auto mb-24" >
                            {
                                !itemRecorded && (
                                    <RedButton
                                        type="button"
                                        text="Stop"
                                        onClick={handleStopClick}
                                    />
                                )
                            }
                            {
                                    itemRecorded && (
                                        <>
                                        {/* Submit button should save and submit the audio both */}
                                            <RedButton
                                                type="button"
                                                text="Submit"
                                                onClick={handleSubmit}
                                            /> 
                                            <RedButton
                                                type="button"
                                                text="Replay"
                                                onClick={handleReplayClick}
                                            /> 
                                             <RedButton
                                                type="button"
                                                text="Check Audio"
                                                onClick={checkExistingAudio}
                                            /> 
                                    </>
                                    )
                                }

                             <RedButton
                                type="button"
                                text="Cancel"
                                onClick={handleCancelClick}
                            /> 

                        </div>
                    </div>
                    </>
                ) 
                } 

                { !recording && !itemRecorded && (
                    <>
                <div className="relative" onClick={handleRecordClick}>
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
            </>
         )}              
        </div>
    </div>
  )
}
