"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button"
import Custom403 from '../pages/403';
import fetchLocations from "@/app/http/fetchLocations";

type Location = {
    latitude: number;
    longitude: number;
} | null;

export default function LocateClinic() {
    // const router = useRouter();
    // const { user } = useAuth()
    //
    // React.useEffect(() => {
    //     if (!user)
    //         router.push("/login")
    // }, [user])
    //
    // if (!user) {
    //     return <div><Custom403/></div>
    // }

    const [location, setLocation]
        = useState<Location>(null);
    const [locationError, setLocationError]
        = useState("");

    const onClick = () => {

        if(!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your device!")
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude })
        } ,() => {
            setLocationError("Error retrieving your location")
            setLocation(null)
            }
        )}

    return (
        <div>
            {location ? (
                // Display Selection of Clinics
                // If it keeps resetting before getting the chance to fetch the clinics, add local storage.
                <p>Location is lat: {location.latitude}, lon: {location.longitude}</p>
            ): (
                <Button
                    type="button"
                    text="Enable Location"
                    onClick={onClick}
                    style={{
                        width: '150px',
                        height: '50px',
                        padding: '2px',
                        borderRadius: '5px',
                        fontSize: '14px'
                    }}
                />
            )}
            {locationError && <p className="error">{locationError}</p>}
        </div>
    );
}
