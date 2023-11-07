import React from 'react';
import NextImage from 'next/image';
import compassImage from '@/public/compass-removebg.png';
import {useProp} from '@/app/contexts/PropContext';

const LoadingScreen = () => {
    const {loading} = useProp();
    return (
        <>
            {loading && <div className="bg-eggshell min-h-screen h-screen w-screen z-10 flex justify-center items-center absolute top-0">
                <div className={'motion-safe:animate-pulse'}>
                    <NextImage src={compassImage} alt="Compass Logo" />
                </div>
            </div>}
        </>

    );
};

export default LoadingScreen;