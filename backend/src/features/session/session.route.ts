import { Router } from 'express';
import { sessionController } from './session.controller';
import { authenticate } from '../../common/middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', sessionController.getSessions);
router.get('/:sessionId/contents', sessionController.getContentsBySessionId);
router.post('/', sessionController.createSession);
router.put('/:sessionId', sessionController.updateSession);
router.delete('/:sessionId', sessionController.deleteSession);

export default router;