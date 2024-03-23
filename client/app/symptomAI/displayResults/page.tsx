"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function DisplayResults() {
    const logger = require("../../../logger");
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            logger.warn("User not found.");
            alert("User not found.");
        }
    }, [user, router]);

    const lineStyle: React.CSSProperties = {
        width: '300px',
        borderTop: '1px solid #756F85',
        borderLeft: '1px solid #756F85',
        borderBottom: '1px solid #756F85',
        top: '249px',
        left: '38px',
        position: 'absolute',
        color: '#756F85'
      };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col relative">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
            <button onClick={() => router.push("/health")}>
                <Header headerText="Your Results"></Header>
            </button>
        </span>

        <div className="flex flex-col mx-4 mb-4">
            <p 
            className="px-4 text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ">
                Your Symptoms:
            </p>
            <ul className="mx-8 mb-4" style={{ listStyleType: 'disc' }}>
                {/* replace the following with real data */}
                <li className="font-sans font-medium text-darkgrey text-[18px]">chest pain</li> 
                <li className="font-sans font-medium text-darkgrey text-[18px]">fast heart rate</li>
                <li className="font-sans font-medium text-darkgrey text-[18px]">palpitations</li>
            </ul>
            <div style={{width: '300px', border: '1px', color: '#756F85', borderBottom: '1px solid #756F85' }}></div>
            <p 
            className="m-4 text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ">
                Your Prediction:
            </p>
            {/* replace with actual data */}
            <p className="mx-auto mb-4 font-bold text-3xl leading-10 text-[color:var(--Dark-Grey,#2C2738)] underline">Fungal Infection</p>
            <div style={{ width: '300px', border: '1px', color: '#756F85', borderBottom: '1px solid #756F85' }}></div>
        </div>

        <div className="flex flex-col items-center justify-center mx-14 absolute bottom-28">
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
