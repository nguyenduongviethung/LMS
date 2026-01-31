import { Router } from 'express';
import { sessionController } from './session.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', sessionController.getSessions);
router.get('/:sessionId', sessionController.getSessions);
router.post('/', sessionController.createSession);
router.put('/:sessionId', sessionController.updateSession);
router.delete('/:sessionId', sessionController.deleteSession);
router.get('/:sessionId/attendance', sessionController.getAttendance);
router.post("/:sessionId/attendance/ensure", sessionController.ensureAttendance);
router.put("/:sessionId/users/:userId/attendance", sessionController.updateAttendance);
router.get('/:sessionId/contents', sessionController.getContents);
// router.get('/:sessionId/contents/:contentId/task-result', sessionController.getTaskResult);
// router.post('/:sessionId/contents/:contentId/task-result/ensure', sessionController.ensureTaskResult);

export default router;