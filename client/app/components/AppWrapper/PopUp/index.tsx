import {Alert, Snackbar} from '@mui/material';
import {useProp} from '@/app/contexts/PropContext';

const PopUp = () => {
    const {popUp} = useProp()
    const {show, text, type} = popUp
    return (
        <Snackbar
                    open={show}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert severity={type} >{text}</Alert>
        </Snackbar>
    );
};

export default PopUp;