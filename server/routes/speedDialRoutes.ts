import {createSpeedDial,getSpeedDial,getSpeedDials,updateSpeedDial,deleteSpeedDial} from '../controllers/speedDialController';
import {Router} from 'express';
const router = Router();

router.route('/')
    .post(createSpeedDial);

router.route('/:uid')
    .get(getSpeedDials);

router.route('/:uid/:id')
    .get(getSpeedDial)
    .put(updateSpeedDial)



export default router;