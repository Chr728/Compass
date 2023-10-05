import {createSpeedDial,getSpeedDial,getSpeedDials,updateSpeedDial,deleteSpeedDial} from '../controllers/speedDialController';
import {Router} from 'express';
const router = Router();


router.route('/:uid')
    .get(getSpeedDials).post(createSpeedDial)

router.route('/:uid/:id')
    .get(getSpeedDial)
    .put(updateSpeedDial)
    .delete(deleteSpeedDial);



export default router;