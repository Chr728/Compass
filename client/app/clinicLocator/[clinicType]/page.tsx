"use client";
import React, {FC, useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import PlaceResult = google.maps.places.PlaceResult
// TODO: make helper for this and array of clinics
import LocationComponent from "@/app/components/Location";
import fetchLocations from "@/app/http/fetchLocations";

interface pageProps {
    params: {
        clinicType: string
    }
}

const ClinicLocations: FC<pageProps> = ({ params }) => {
    const router = useRouter();
    const [places, setPlaces] = useState<PlaceResult[]>([]);

    const location: any = localStorage.getItem('location');
    useEffect(() => {

        if (!location) {
            router.push('/clinicLocator');
        } else {
            const {latitude, longitude} = JSON.parse(location);
            fetchLocations(latitude, longitude, params.clinicType).then((places: any) => {
                setPlaces(places.data)
            });
        }
    },[])

    return <div>
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                        <button onClick={() => router.push('/clinicLocator')}>
                        <Header
                            headerText={`Locate ${params.clinicType.charAt(0).toUpperCase() + params.clinicType.slice(1)}`}></Header>
                        </button>
                    </span>
        <p className="font-sans text-darkgrey ml-5 p-5  text-[17px]">
            {`Select a location to get directions`}
        </p>

        {places ? places.map((place: PlaceResult) => {
            const { name, vicinity, rating, icon, user_ratings_total } = place;
            return <LocationComponent key={name} onClick={() => window.open(`http://maps.google.com/?q=${vicinity}`, '_blank')}
                                      name={name} address={vicinity} rating={rating} userRatingsTotal={user_ratings_total}
                                      icon={icon}/>})
            :
            <div>Loading...</div>
        }
    </div>
}

export default ClinicLocations;
