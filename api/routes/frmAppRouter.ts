// Articles routes use articles controller
import { Router } from 'express';
import * as frmAppController from "../controllers/frmAppController";

// Assign router to the express.Router() instance
const router: Router = Router();

router.get('/questions/:exam/:year', frmAppController.getFRMAppQuestion);

router.get('/readings/:exam/:year', frmAppController.getFRMAppReadings);

router.get('/questionsReadings/:exam/:year', frmAppController.getFRMAppQuestionsReadings);

router.get('/user/:id/exam', frmAppController.getFRMAppUserExam);

router.get('/user/:id/settings', frmAppController.getSettings);

router.put('/user/:id/settings', frmAppController.setSettings);

router.get('/user/:id/metaData', frmAppController.getMeta);

router.put('/user/:id/metaData', frmAppController.setMeta);

router.put('/user/:id/metaDataItem', frmAppController.setMetaItem);

router.post('/user/metadata', frmAppController.postMetadata);

router.delete('/customer/:email/password', frmAppController.resetUserPassword);

router.post('/alerts', frmAppController.sendAlerts);

router.post('/user/:id/registerMsg', frmAppController.registerMsg);

// Export the express.Router() instance to be used by server.ts
export const frmAppRouter: Router = router;
