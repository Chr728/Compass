import {ReactNode, useContext, useState, createContext} from 'react';

type PropContextType = {
    isError: boolean,
    errorText: string,
    handleError: (text: string) => void,
    loading: boolean,
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
    const handleError = (text: string) => {
        setIsError(true);
       setErrorText(text);
       setTimeout(() => {
              setIsError(false);
       }, 3500);
    }

    const handleLoading = (loading: boolean) => {
        // setLoading(loading);
    }

    const values: PropContextType = {
        isError ,
        errorText,
        handleError,
        loading: false,
    }
    return (
        <PropContext.Provider value={values}>
            {children}
        </PropContext.Provider>
    )
}