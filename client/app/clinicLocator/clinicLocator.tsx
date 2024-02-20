"use client";
import React, { useState } from "react";
import Button from "../components/Button"
import fetchLocations from "@/app/http/fetchLocations";

type Location = {
    latitude: number;
    longitude: number;
} | null;

export default function LocateClinic() {
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
