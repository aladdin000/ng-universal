import { Request, Response, NextFunction } from 'express';
import * as _ from 'underscore';
import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
import config from '../config/config';

import { client, getAsync } from '../components/redis';

const sfdccomp = new SFDCComponent();
sfdccomp.init();

const CACHE = config.CACHE;
// In use
export let getAggregateEvents = async (req: Request, res: Response, next: NextFunction) => {
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    const cacheKey = 'getAggregateEvents';
    const con = await sfdccomp.getToken();
    const sfdcService = new SFDCService(con);

    const oldValue = await getAsync(cacheKey);

    if (oldValue) {
        return res.json(JSON.parse(oldValue));
    }
    sfdcService.getAggregateEvents()
        .then((data: any) => {
            client.set(cacheKey, JSON.stringify(data));
            return res.json(data);
        })
        .catch((err: any) => {
            return res.json(err);
        });
};

// In use
export let getSFDCEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId;
        const cacheKey = 'getSFDCEvent' + ':' + eventId;
        // const sfdccomp = new SFDCComponent();
        // await sfdccomp.init();
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getEvent(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCRelatedEvents = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCRelatedEvents' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getRelatedEvents(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventRates = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCEventRates' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getEventRates(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventSponsors = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCEventSponsors' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getEventSponsors(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventSessions = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCEventSessions' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getEventSessions(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventSpeakers = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCEventSpeakers' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getEventSpeakers(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventContacts = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const eventId = req.params.eventId;
        const cacheKey = 'getSFDCEventContacts' + ':' + eventId;
        // const sfdccomp = new SFDCComponent();
        // await sfdccomp.init();
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getEventContacts(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventAlumni = async (req: Request, res: Response, next: NextFunction) => {

    // console.log('controller - get conn'););
    const email = req.params.email;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const data = await sfdcService.getSFDCEventAlumni(email);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


// In use
export let getSFDCNonAlumniList = async (req: Request, res: Response, next: NextFunction) => {

    // console.log('controller - get conn'););
    const email = req.params.email;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const data = await sfdcService.getSFDCNonAlumniList(email);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventContent = async (req: Request, res: Response, next: NextFunction) => {

    const folderName = req.params.folderName;
    const cacheKey = 'getSFDCEventContent' + ':' + folderName;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getEventContent(folderName);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let sendContactUsEmail = async (req: Request, res: Response, next: NextFunction) => {

    const contactID = req.body.contactID;
    const name = req.body.name;
    const email = req.body.email;
    const inquiry = req.body.inquiry;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const data = await sfdcService.sendContactUsEmail(contactID, name, email, inquiry);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCEventScheduleItems = async (req: Request, res: Response, next: NextFunction) => {

    const eventId = req.params.eventId;
    const cacheKey = 'getSFDCEventScheduleItems' + ':' + eventId;
    // const sfdccomp = new SFDCComponent();
    // await sfdccomp.init();
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getEventScheduleItems(eventId);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
