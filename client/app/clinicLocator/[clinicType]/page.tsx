"use client";
import React, {FC, useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import fetchLocations from "@/app/http/fetchLocations";
import PlaceResult = google.maps.places.PlaceResult
// TODO: make helper for this and array of clinics
import LocationComponent from "@/app/components/Location";

interface pageProps {
    params: {
        clinicType: string
    }
}

const testLocation = {
    "business_status": "OPERATIONAL",
    "geometry": {
        "location": {
            "lat": 45.48654320000001,
            "lng": -73.5871231
        },
        "viewport": {
            "northeast": {
                "lat": 45.48795363029151,
                "lng": -73.5859166197085
            },
            "southwest": {
                "lat": 45.48525566970851,
                "lng": -73.5886145802915
            }
        }
    },
    "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
    "icon_background_color": "#7B9EB0",
    "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
    "name": "Action Sport Physio Centre-ville",
    "opening_hours": {
        "open_now": false
    },
    "photos": [
        {
            "height": 3648,
            "html_attributions": [
                "<a href=\"https://maps.google.com/maps/contrib/100373467170596316207\">We Are Virtuo</a>"
            ],
            "photo_reference": "ATplDJaSXM7AUlV1upWHK5_zHF22wVMagaAYGp1RtLTNeWqxOt6UeB-BaF6YG7Vnte4KkrO6kmFVjpzV3dtGWz8tsgl1zRXv4sWIA1zlmHg12zW95DQgUyW83VOVCwFr7A8K_U_KctXMCwZrGW61GsKKkl6UECljVIpoVVTa8I_Jb3UTxzre",
            "width": 5472
        }
    ],
    "place_id": "ChIJX-2sJnMayUwRkbbCMmRSMLU",
    "plus_code": {
        "compound_code": "FCP7+J5 Westmount, QC, Canada",
        "global_code": "87Q8FCP7+J5"
    },
    "rating": 4.8,
    "reference": "ChIJX-2sJnMayUwRkbbCMmRSMLU",
    "scope": "GOOGLE",
    "types": [
        "physiotherapist",
        "doctor",
        "point_of_interest",
        "health",
        "establishment"
    ],
    "user_ratings_total": 4,
    "vicinity": "1000 Rue Sherbrooke O, Westmount"
}


const ClinicLocations: FC<pageProps> = ({ params }) => {
    const router = useRouter();
    const [places, setPlaces] = useState<PlaceResult[]>([]);

    const location: any = localStorage.getItem('location');
    const { name, vicinity, rating, icon , user_ratings_total} = testLocation;

    useEffect(() => {

        if (!location) {
            router.push('/clinicLocator');
        } else {
            const {latitude, longitude} = JSON.parse(location);
            console.log("LATITUDE: ", latitude, "LONGITUDE: ",longitude, "CLINIC: ",params.clinicType);
        }
    },[])

    return <div>
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                        <button onClick={() => router.push('/clinicLocator')}>
                        <Header
                            headerText={`Locate ${params.clinicType.charAt(0).toUpperCase() + params.clinicType.slice(1)}`}></Header>
                        </button>
                    </span>
        <p className="font-sans text-darkgrey ml-5 p-5  text-[14px]">
            {`Here are the nearest clinics to you`}
        </p>
        <LocationComponent name={name} address={vicinity} rating={rating} userRatingsTotal={user_ratings_total}
                           icon={icon}/>

        <div className="">

        </div>

    </div>
}

export default ClinicLocations;
