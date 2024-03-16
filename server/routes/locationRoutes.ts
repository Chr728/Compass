import { Router } from 'express';
import getLocations from "../controllers/locationController";

const router = Router();

router.route('/').get(getLocations);

export default router;
