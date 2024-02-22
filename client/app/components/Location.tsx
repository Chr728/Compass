import React from 'react';

interface LocationProps {
    name: string | undefined;
    address: string | undefined;
    rating: number | undefined;
    userRatingsTotal: number | undefined;
    icon: string | undefined;
}

const LocationComponent: React.FC<LocationProps> = ({ name, address, rating, userRatingsTotal, icon }) => {
    return (
        <div className="max-w-md rounded overflow-hidden shadow-lg p-4 m-4 bg-white flex items-start"
        style={{ backgroundColor: '#F2F2F2'}}>
            <div className="flex-grow" style={{ color: "black"}}>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-2" style={{color: "black"}}>{name}</h2>
                    <img className="w-12 h-12 object-cover ml-4" src={icon} alt="Business Icon" />
                </div>
                <p className="text-sm" style={{ color: "black" }}>
                    <strong>Address:</strong> {address}
                </p>
                <p className="text-sm" style={{ color: "black" }}>
                    <strong>Rating:</strong> {rating} ({userRatingsTotal} ratings)
                </p>
            </div>
        </div>
    );
};

export default LocationComponent;
