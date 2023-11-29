import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

router.route('/').get(getUsers).post(createUser);

router
  .route('/:uid')
  .get(enforceAuthorization, getUser)
  .put(enforceAuthorization, updateUser)
  .delete(enforceAuthorization, deleteUser);

export default router;
