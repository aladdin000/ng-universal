// Articles routes use articles controller
import { Router } from 'express';
import * as backupController from "../controllers/backupController";

// Assign router to the express.Router() instance
const router: Router = Router();

router.post('/createcreditcardregistration', backupController.createcreditcardregistration);
router.post('/createwirecheckregistration', backupController.createwirecheckregistration);
router.get('/fetchregistration/:email', backupController.fetchregistration);

// Export the express.Router() instance to be used by server.ts
export const backupRouter: Router = router;
