import {Router} from "express";
import enforceAuthorization from '../middlewares/enforceAuthorization';
import { getHealthTip } from "../controllers/healthTipsController";

const router = Router();

//Route to fetch health tip entry
router.route('/:uid').get(enforceAuthorization, getHealthTip)

export default router