import { Router } from 'express';
import { sessionContentController } from './sessionContent.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.post('/', sessionContentController.createSessionContent);
router.delete('/:sessionId/:contentId', sessionContentController.deleteSessionContent);

export default router;