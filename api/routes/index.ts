import * as express from "express";

// import sub-routers
import { frmAppRouter } from './frmAppRouter';
import { gbiAppRouter } from './gbiAppRouter';
import { backupRouter } from './backupRouter';
import { legacyRouter } from './legacyRouter';
import { sfdcAppRouter } from './sfdcAppRouter';
import { eventsRouter } from './eventsRouter';

const router = express.Router();

// mount express paths, any addition middleware can be added as well.
// ex. router.use('/pathway', middleware_function, sub-router);

router.use('/frmApp', frmAppRouter);
router.use('/graApp', gbiAppRouter);
router.use('/', backupRouter);
router.use('/sfdc', sfdcAppRouter);
router.use('/legacy', legacyRouter);
router.use('/events', eventsRouter);

// Export the router
export default router;
