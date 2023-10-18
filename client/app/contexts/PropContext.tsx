import {ReactNode, useContext, useState, createContext} from 'react';

type PropContextType = {
    error: string | null,
    loading: boolean,
}

const useProp = () => {
    const context = useContext(PropContext);
    if (context === undefined) {
        throw new Error('useProp must be used within a PropProvider');
    }
    return context;
}

interface PropProviderProps {
    children?: ReactNode;
}

const PropContext = createContext<PropContextType>({} as PropContextType);

export const PropProvider = ({children}: PropProviderProps) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    const handleError = (error: string) => {
        setError(error);
    }

    const handleLoading = (loading: boolean) => {
        setLoading(loading);
    }

    const values: PropContextType = {
        error,
        loading,
    }

    return (
        <PropContext.Provider value={values}>
            {children}
        </PropContext.Provider>
    )
}