import { Router } from 'express';
import { userClassController } from './userClass.controller';
import { authenticate } from '../../common/middlewares/authenticate';

const router = Router();
router.post('/', authenticate, userClassController.createUserClass);
router.put('/:userClassId', authenticate, userClassController.updateUserClass);
router.delete('/:userClassId', authenticate, userClassController.deleteUserClass);

export default router;