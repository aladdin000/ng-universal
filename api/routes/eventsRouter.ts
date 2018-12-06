// Articles routes use articles controller
import { Router } from 'express';
import * as eventsController from "../controllers/eventsController";

// Assign router to the express.Router() instance
const router: Router = Router();

// Events
router.get('/', eventsController.getAggregateEvents);
router.get('/:eventId', eventsController.getSFDCEvent);
router.get('/:eventId/related-events', eventsController.getSFDCRelatedEvents);
router.get('/:eventId/rates', eventsController.getSFDCEventRates);
router.get('/:eventId/sponsors', eventsController.getSFDCEventSponsors);
router.get('/:eventId/sessions', eventsController.getSFDCEventSessions);
router.get('/:eventId/speakers', eventsController.getSFDCEventSpeakers);
router.get('/:eventId/contacts', eventsController.getSFDCEventContacts);
router.get('/iseventalumni/:email', eventsController.getSFDCEventAlumni);
router.get('/nonalumnilist/:email', eventsController.getSFDCNonAlumniList);

router.get('/content/:folderName', eventsController.getSFDCEventContent);
router.post('/contactus', eventsController.sendContactUsEmail);
router.get('/:eventId/schedule-items', eventsController.getSFDCEventScheduleItems);

export const eventsRouter: Router = router;
