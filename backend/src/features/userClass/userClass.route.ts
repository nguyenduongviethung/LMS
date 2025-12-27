import { Router } from 'express';
import { userClassController } from './userClass.controller';
import { authenticate } from '../../common/middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.post('/', userClassController.createUserClass);
router.put('/:userClassId', userClassController.updateUserClass);
router.delete('/:userClassId', userClassController.deleteUserClass);

export default router;