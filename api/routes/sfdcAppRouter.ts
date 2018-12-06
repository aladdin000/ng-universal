// Articles routes use articles controller
import { Router } from 'express';
import * as sfdcController from "../controllers/sfdcController";
import * as sfdcUsersController from '../controllers/sfdcUsersController';

// Assign router to the express.Router() instance
const router: Router = Router();

// Users Route
router.get('/users', sfdcUsersController.getSFDCUsers);
router.get('/user/:userid', sfdcUsersController.getSFDCUserById);
router.post('/auth/user', sfdcUsersController.authSFDCUser);

// Accounts
router.get('/accounts', sfdcUsersController.getAccounts);

// Clear LocalStorage Cache
router.get('/content/clearCache', sfdcController.getSFDCContentClearCache);
router.get('/content/clearCacheItem/:key', sfdcController.getSFDCContentClearCacheItem);

router.post('/emailsubscriptionmanagement', sfdcController.getSFDCEmailSubscription);
router.get('/autoQA/:email', sfdcController.getSFDCautoQA);

// Generate Sitemap
router.post('/content/sitemap', sfdcController.getSFDCContentSiteMap);

router.post('/web/request',   sfdcController.webToRequest);
router.post('/account/companies', sfdcController.getCompanies);

router.post('/mobius/relay', sfdcController.mobiusRelay);

// ICBRR
router.post('/icbrr/ead', sfdcController.getSFDCICBRRead);
router.post('/icbrr/cdd', sfdcController.getSFDCICBRRcdd);
router.post('/icbrr/status/:garpId/:procType/:status/:examDate/:result/:score', sfdcController.setSFDCICBRRstatus);

// Candidates
router.get('/candidates/certified/:startDate/:endDate', sfdcController.getCertifiedCandidates);
router.get('/candidates/certified/:exam/:startDate/:endDate', sfdcController.getCertifiedCandidatesByExam);
router.get('/candidates/passed/:exam/:examDate', sfdcController.getPassedCandidatesByExam);

// Membership
router.get('/membership/offers', sfdcController.getMembershipOfferByOfferId);

// Chapters
router.get('/chapters', sfdcController.getSFDCChapters);
router.get('/chapter/:id', sfdcController.getSFDCChapter);
router.get('/chapters/meetings', sfdcController.getSFDCChapterMeetings);
router.get('/chapters/meetings/:id', sfdcController.getSFDCChapterMeeting);
router.get('/chapters/presentations', sfdcController.getSFDCChapterPresentations);

// Study Topics
router.get('/studyTopics/:exam/:year', sfdcController.getSFDCStudyTopics);

// Products
router.get('/content/studyproducts/:mode', sfdcController.getSFDCStudyProducts);
router.get('/content/study-materials/:id', sfdcController.getStudyMaterialsFolderById);

// Board
router.get('/boardOfTrustees', sfdcController.getSFDCBoardofTrustees);


// Content
router.get('/content/riskpagearticlesbycolumn/:column/:offset/:numberofarticles', sfdcController.getSFDCRiskArticlesByColumn);
router.get('/content/columns/:offset/:numberofarticles', sfdcController.getSFDCColumns);

router.get('/content/featuredcontent/:type', sfdcController.getSFDCFeaturedContent);
router.get('/content/ads', sfdcController.getSFDCContentAds);
router.get('/content/riskpagearticles', sfdcController.getSFDCRiskFeaturedArticles);
router.get('/content/riskmanagers', sfdcController.getSFDCRiskManagerOfTheYear);


router.get('/content/riskpagearticlesbycategory/:category/:offset/:numberofarticles', sfdcController.getSFDCRiskArticlesByCategory);

router.get('/content/quantcorner/:offset/:numberofarticles', sfdcController.getSFDCQuantCorner);
router.get('/content/frmcorner/:offset/:numberofarticles', sfdcController.getSFDCFRMCorner);

router.get('/content/risktrendingarticles/:category', sfdcController.getSFDCRiskTrendingArticles);
router.get('/content/riskarticlesbyviews/:category', sfdcController.getSFDCRiskArticlesByViewCount);
router.get('/content/riskarticlesbyshare/:category', sfdcController.getSFDCRiskArticlesByShareCount);

router.get('/content/videos', sfdcController.getSFDCVideos);
// router.get('/content/video/:id', sfdcController.getSFDCVideo);
router.get('/content/videos/:id', sfdcController.getSFDCVideoCat);

// router.get('/content/doc/:id/:userId', sfdcController.getSFDCContentDoc);
router.get('/content/doc/:id', sfdcController.getSFDCContentDoc);
router.get('/content/relatedcontent/:id', sfdcController.getSFDCRelatedContent);

router.get('/content/recordTypes', sfdcController.getSFDCRecordTypes);
router.post('/content', sfdcController.getSFDCContent);
router.get('/content/folders/:folder', sfdcController.getContentFolder);
router.get('/content/folder/:id', sfdcController.getContentFolderById);

router.get('/cms/slider/:sliderfoldername', sfdcController.getSliderData);
router.get('/cms/slideshow/:slideshowid', sfdcController.getSlideShowData);

router.post('/content/category', sfdcController.getSFDCContentByCategory);
router.post('/content/subcategory', sfdcController.getSFDCContentBySubcategory);

router.get('/content/webcasts', sfdcController.getSFDCWebcasts);
router.get('/content/upcomingwebcasts', sfdcController.getUpcomingWebcasts);
router.get('/content/ondemandwebcasts', sfdcController.getOndemandWebcasts);
// router.get('/content/webcast/:id/webcal', sfdcController.getSFDCWebcastWebCal); ///// TO DO ////////////
// router.get('/content/webcast/:id/ical', sfdcController.getSFDCWebcastICal); ///// TO DO /////////////
router.get('/webcastregistration/:userId/:webcastId', sfdcController.createWebcastRegistration);


// Other Content
router.get('/academicPartners', sfdcController.getSFDCAcademicPartners);
router.get('/epp', sfdcController.getSFDCExamPrepProviders);
router.get('/fellowships', sfdcController.getAcademicFellowships);

// CPD
router.get('/cpd/providers', sfdcController.getSFDCCPDProviders);
router.get('/cpd/activities', sfdcController.getSFDCCPDActivities);
router.get('/testimonial/:examType', sfdcController.getSFDCTestimonial);

// Exam Info
router.get('/exam/sites', sfdcController.getActiveExamSites);
router.get('/exam/fees', sfdcController.getSFDCExamFees);
router.get('/exam/info', sfdcController.getSFDCExamInfo);
router.get('/examVenues/:examDate', sfdcController.getExamVenues);

// Integrations
router.get('/smartPros/:type/:req', sfdcController.getSmartProsResponse);
router.get('/jobTarget/jobs', sfdcController.getjobTargetJobs);

// FAQ
router.get('/faq/:category', sfdcController.getSFDCfaq);
router.get('/faqs/:id', sfdcController.getSFDCfaqById);

// Career Center
router.get('/careercenter/allinternships', sfdcController.getCCInternships);
router.get('/careercenter/jobs/highlighted', sfdcController.getHighlightedJobs);
router.get('/careercenter/content/highlighted', sfdcController.getHighlightedContent);
router.post('/onewire/jobs', sfdcController.getOneWireJobs);
router.post('/onewire/location/search', sfdcController.oneWireLocationSearch);
export const sfdcAppRouter: Router = router;
