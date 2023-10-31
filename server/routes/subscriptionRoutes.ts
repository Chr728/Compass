import { Router } from "express";
import {
    createSubscription,
    getSubscription,
    updateSubscription,
    deleteSubscription
} from "../controllers/subscriptionController";

const router = Router();

router.route('/:uid')
    .get(getSubscription)
    .post(createSubscription)
    .put(updateSubscription)
    .delete(deleteSubscription)


export default router;