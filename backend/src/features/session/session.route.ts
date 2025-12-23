import { Router } from 'express';
import { sessionController } from './session.controller';
import { authenticate } from '../../common/middlewares/authenticate';

const router = Router();
router.get('/', authenticate, sessionController.getSessions);
// router.post('/', authenticate, sessionController.createSession);
// router.put('/:sessionId', authenticate, sessionController.updateSession);
// router.delete('/:sessionId', authenticate, sessionController.deleteSession);

export default router;