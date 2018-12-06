import { Router } from 'express';

import * as legacyController from '../controllers/legacyController';

const router: Router = Router();

router.post('/auth/user', legacyController.authLegacyUser);

export const legacyRouter: Router = router;
