import {ReactNode, useContext, useState, createContext} from 'react';
import LoadingScreen from '@/app/components/AppWrapper/LoadingScreen';

type PropContextType = {
    isError: boolean,
    errorText: string,
    handleError: (text: string) => void,
    loading: boolean,
    handleLoading: (loading: boolean,timeout?:number) => void,
}
const PropContext = createContext<PropContextType>({} as PropContextType);
export const useProp = () => {
    const context = useContext(PropContext);
    if (context === undefined) {
        throw new Error('useProp must be used within a PropProvider');
    }
    return context;
}

interface PropProviderProps {
    children?: ReactNode;
}
export const PropProvider = ({children}: PropProviderProps) => {
    const [isError, setIsError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [loading, setLoading] = useState(false)
    const handleError = (text: string) => {
        setIsError(true);
       setErrorText(text);
       setTimeout(() => {
              setIsError(false);
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
        isError ,
        errorText,
        handleError,
        loading,
        handleLoading,
    }
    return (
        <PropContext.Provider value={values}>
            {children}
        </PropContext.Provider>
    )
}