import React, {useEffect, useState} from 'react';
import {Alert, Snackbar} from '@mui/material';
import {useProp} from '@/app/contexts/PropContext';

const ErrorPopUp = () => {
    const {isError, errorText} = useProp()
    return (
        <Snackbar
                    open={isError}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert severity={'error'} >{errorText}</Alert>
        </Snackbar>
    );
};

export default ErrorPopUp;