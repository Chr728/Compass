"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button"
import Header from "../components/Header";

export type Location = {
    latitude: number;
    longitude: number;
} | null;

const clinicTypes = [{
    name: "Pharmacy",
    icon: "/pharmacy-icon.png",
    slug: "drugstore"
}, {
    name: "Hospital",
    icon: "/hospital-icon.png",
    slug: "hospital"
}, {
    name: "Doctor",
    icon: "/doctor-icon.png",
    slug: "doctor"
}, {
    name: "Dentist",
    icon: "/dentist-icon.png",
    slug: "dentist"
}, {
    name: "Physiotherapist",
    icon: "/physio-icon.png",
    slug: "physiotherapist"
}]

const EXPIRATION_PERIOD = 1000 * 60 * 60; // 1 hour

export default function LocateClinic() {

    const [location, setLocation]
        = useState<Location>(null);
    const [locationError, setLocationError]
        = useState("");
    // const { user } = useAuth();
    const router = useRouter();



    useEffect(() => {
            const storedLocation = localStorage.getItem('location');
            console.log('STORED LOCATION IS:  ', storedLocation);
            if (storedLocation) {
                const { latitude, longitude, timestamp } = JSON.parse(storedLocation);
                const now = new Date().getTime();
                if (now - timestamp < EXPIRATION_PERIOD) {
                    setLocation({ latitude, longitude });
                } else {
                    localStorage.removeItem('location');
                }
            }
    }, []);

    const onClick = () => {
        if(!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your device!")
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const locationData = { latitude, longitude, timestamp: new Date().getTime()};
            localStorage.setItem('location', JSON.stringify(locationData));
            setLocation({ latitude, longitude });
            setLocationError("");
        }, () => {
            setLocationError("Unable to retrieve your location");
            setLocation(null);
        }
        )}

    return (
        <div>
            <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                        <button onClick={() => router.push('/health')}>
                        <Header headerText="Locate Clinic"></Header>
                        </button>
                    </span>
            {location ? (
                <div className="">
                    <p className="font-sans text-darkgrey ml-5 p-5  text-[14px]">
                        Choose a type of clinic to locate
                    </p>
                    <div className="grid grid-cols-2 gap-5 place-items-center p-5">
                        {clinicTypes.map((clinic) => (
                            <button
                                key={clinic.name}
                                className="flex flex-col items-center justify-center rounded-lg drop-shadow-lg p-5 w-40 h-40"
                                style={{ backgroundColor: "#F2F2F2" }}
                                onClick={() => router.push(`/clinicLocator/${clinic.slug}`)}
                                aria-label={`Locate ${clinic.name}`}
                            >
                                <img
                                    src={clinic.icon}
                                    alt={clinic.name}
                                    className="w-full h-4/5 object-contain"
                                />
                                <span className="text-bl mt-2" style={{ color: "black"}}>{clinic.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-eggshell min-h-screen flex flex-col">
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
