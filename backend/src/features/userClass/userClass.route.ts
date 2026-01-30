import { Router } from 'express';
import { userClassController } from './userClass.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/:userClassId', userClassController.getUserClass);
// router.get('/:userClassId/attendance', userClassController.getAttendance);
router.post('/', userClassController.createUserClass);
router.put('/:userClassId', userClassController.updateUserClass);
router.delete('/:userClassId', userClassController.deleteUserClass);

export default router;