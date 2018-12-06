// Articles routes use articles controller
import { Router } from 'express';
import * as gbiAppController from "../controllers/gbiAppController";

// Assign router to the express.Router() instance
const router: Router = Router();

router.get('/research/updates', gbiAppController.getGBIResearchUpdates);

router.get('/research/update/:id', gbiAppController.getGBIResearchUpdate);

export const gbiAppRouter: Router = router;
