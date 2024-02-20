"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Button from "../components/Button"
import Header from "../components/Header";

type Location = {
    latitude: number;
    longitude: number;
} | null;

export default function LocateClinic() {
    const [location, setLocation]
        = useState<Location>(null);
    const [locationError, setLocationError]
        = useState("");
    const router = useRouter();

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
                <div>
                    Location is lat: {location.latitude}, lon: {location.longitude}
                </div>
            ): (
                <div className="bg-eggshell min-h-screen flex flex-col">
                    <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                        {/*TODO: make sure this router works*/}
                        <button onClick={() => router.push('/health')}>
                        <Header headerText="Locate Clinic"></Header>
                        </button>
                    </span>
                    <div className="flex flex-col items-center">

                        <div>
                            <img
                                src="/location-disabled.png"
                                alt="Location Disabled"
                                className="w-85 mt-5 drop-shadow-lg"
                            />
                        </div>

                        <p className="font-sans text-darkgrey ml-5 text-[20px] font-bold mt-10 text-center px-5">
                            Enable location services to use this feature
                        </p>

                        <Button
                            type="button"
                            text="Enable Location"
                            onClick={onClick}
                            style={{
                                width: '150px',
                                height: '50px',
                                padding: '2px',
                                borderRadius: '5px',
                                fontSize: '14px',
                                marginTop: '30px'
                            }}
                        />
                    </div>
                </div>


            )}
            {locationError && <p className="error">{locationError}</p>}
        </div>
    );
}
