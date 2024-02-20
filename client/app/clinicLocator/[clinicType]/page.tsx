"use client";
import React, {FC} from "react";
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";

interface pageProps {
    params: {
        clinicType: string
    }
}

const ClinicLocations: FC<pageProps> = ({ params }) => {
    const router = useRouter();
    return <div>
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                        <button onClick={() => router.push('/clinicLocator')}>
                        <Header headerText={`Locate ${params.clinicType.charAt(0).toUpperCase() + params.clinicType.slice(1)}`}></Header>
                        </button>
                    </span>


    </div>
}

export default ClinicLocations;
