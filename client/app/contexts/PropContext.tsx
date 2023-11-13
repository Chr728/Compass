import {ReactNode, useContext, useState, createContext} from 'react';
import LoadingScreen from '@/app/components/AppWrapper/LoadingScreen';

const logger = require('../../logger');

type PropContextType = {
    popUp: {
        show: boolean,
        type: 'error' | 'success',
        text: string,
    },
    handlePopUp: (type: 'error' | 'success', text: string) => void,
    loading: boolean,
    handleLoading: (loading: boolean,timeout?:number) => void,
}
const PropContext = createContext<PropContextType>({} as PropContextType);
export const useProp = () => {
    const context = useContext(PropContext);
    if (context === undefined) {
        logger.error('useProp must be used within a PropProvider');
        throw new Error('useProp must be used within a PropProvider');
    }
    return context;
}

interface PropProviderProps {
    children?: ReactNode;
}
type popUpState = {
    show: boolean,
    type: 'error' | 'success',
    text: string,

}
export const PropProvider = ({children}: PropProviderProps) => {
    const [popUp, setPopUp] = useState<popUpState>({show: false,type:'error', text: ''});
    const [loading, setLoading] = useState(false)
   type popUpType = 'error' | 'success';
    const handlePopUp = (type: popUpType, text:string) => {
        setPopUp({show: true, type, text});
        setTimeout(() => {
            setPopUp({show: false, type, text});
        }, 3500);
    }

    const handleLoading = (loading: boolean, timeout?: number) => {
        if (timeout) {
            setTimeout(() => {
                setLoading(loading);
            }, timeout);
        }else{
            setLoading(loading);
        }
    }

    const values: PropContextType = {
        popUp,
        handlePopUp,
        loading,
        handleLoading,
    }
    return (
        <PropContext.Provider value={values}>
            {children}
        </PropContext.Provider>
    )
}