import { Request, Response, NextFunction } from 'express';

import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
import { client, getAsync } from '../components/redis';

const CACHE = process.env.CACHE;
// Init SFDC service
const sfdccomp = new SFDCComponent();
sfdccomp.init();

export let getGBIResearchUpdates = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = 'getGBIResearchUpdates';
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getGBIResearchUpdates();
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

export let getGBIResearchUpdate = async (req: Request, res: Response, next: NextFunction) => {

    let cacheKey: string;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const id = req.params.id;

        cacheKey = "getGBIResearchUpdate" + ':' + id;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getGBIResearchUpdate(id);
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
