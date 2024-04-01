"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../../components/Button";
import SpanHeader from "../../../components/SpanHeader";

export default function DisplayResult({params: { displayResult } } : { params: { displayResult: string } }) {
    const logger = require("../../../../logger");
    const router = useRouter();
    const { user } = useAuth();
    const results = JSON.parse(decodeURIComponent(displayResult));
    const selectedWordsDecoded = results[0].map((word: any) => decodeURIComponent(word));
    const resultDecoded = decodeURIComponent(results[1]);

    useEffect(() => {
        if (!user) {
            logger.warn("User not found.");
            alert("User not found.");
        }
    }, [user, router]);


  return (
    <div className="bg-eggshell min-h-screen flex flex-col relative overflow-y-scroll"  style={{ paddingBottom: '100px' }}>
         <SpanHeader
            onClick={() => router.push("/health")}
            headerText="Your Result">
        </SpanHeader>
        
        <div className="flex flex-col mx-4 mb-4">
            <p 
            className="px-4 text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ">
                Your Symptoms:
            </p>
            <ul className="mx-8 mb-4" style={{ listStyleType: 'disc' }}>
                {
                    selectedWordsDecoded.map((item: string, index: any) => (
                        <li key={index} className="font-sans font-medium text-darkgrey text-[18px]">
                        {item} 
                        </li>
                    ))
                }
            </ul>
            <div style={{width: '300px', border: '1px', color: '#756F85', borderBottom: '1px solid #756F85' }}></div>
            <p 
            className="m-4 text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ">
                Your Prediction:
            </p>
            <p className="mx-auto mb-4 font-bold text-2xl leading-10 text-[color:var(--Dark-Grey,#2C2738)] underline">{resultDecoded}</p>
            <div style={{ width: '300px', border: '1px', color: '#756F85', borderBottom: '1px solid #756F85' }}></div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center mx-14 bottom-28" >
            <p className="text-grey text-[13px] mb-4" style={{ lineHeight: '16.9px' }}>
                This result is not a medical diagnosis. It does not replace qualified medical opinion.
            </p>
            <p className="text-grey text-[13px] mb-4" style={{ lineHeight: '16.9px' }}>
                If you need immediate medical attention, please contact emergency medical services right away.
            </p>
            <Button
                type="button"
                text="Return"
                onClick = {() => router.push('/health')}
                style={{ width: '140px'}}
            />
        </div>
      
    </div>
  )
}
