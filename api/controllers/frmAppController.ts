import * as gcm from 'node-gcm';
import * as apn from 'apn';
import * as util from 'util';
import { Request, Response, NextFunction } from 'express';

import { UserFRMAppSettings } from '../models/UserFrmAppSetting';
import { Message } from '../models/Message';
import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
import * as apncomp from '../components/apn';
import * as utils from '../util/utils';
import * as _ from 'underscore';

// Init SFDC service
const sfdccomp = new SFDCComponent();
sfdccomp.init();
/**
 * Get User and Settings
 */
export let getFRMAppUserExam = async (req: Request, res: Response) => {

    // Load User
    const exam: any = {
        name: "FRM Part 1",
        address: "2130 Fulton Street",
        city: "San Francisco",
        state: "CA",
        zip: "94117-1080",
        country: "USA",
        day: "November 11th, 2013",
        time: "7:00 am",
        duration: "2"
    };
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        console.log('controller - get conn');

        const data = await sfdcService.getExams(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        // exam.name = Exam_Site__r.Site__r.Name;
        // exam.address = Exam_Site__r.Site__r.Display_Address__c;
        // exam.day = Exam_Site__r.Exam__r.Exam_Date__c;
        exam.registrations = data;
        return res.json(exam);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


export let getFRMAppQuestionsReadings = async (req: Request, res: Response) => {

    console.log('getFRMAppQuestionsReadings');
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        // const body = req.body;
        const data = await sfdcService.getQuestionsReadings(req.params.exam, req.params.year);

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

export let getFRMAppReadings = async (req: Request, res: Response) => {

    console.log('getFRMAppReadings');
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        // var body = req.body;
        const data = await sfdcService.getReadings(req.params.exam, req.params.year);
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

export let getFRMAppQuestion = async (req: Request, res: Response) => {

    console.log('getFRMAppQuestion');
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        // var body = req.body;
        const data = await sfdcService.getQuestion(req.params.exam, req.params.year);
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


export let getExamSites = async (req: Request, res: Response) => {

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const settings = await sfdcService.getExamSites();
        if (!settings) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        return res.json(settings);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

export let registerMsg = async (req: Request, res: Response) => {

    const body = req.body;
    UserFRMAppSettings.findOneAndUpdate(
        {userId: req.params.id},
        {settings:
            {gcmId: body.gcmId}
        },
        {new: true, upsert: true}, (err: any, settings: any) => {

        if (err) {
            return res.status(500).json({
               error: err
            });
        } else {
            return res.json(settings);
        }
    });
};

/**
 * Get Meta
 */
export let getMeta = async (req: Request, res: Response) => {

    console.log('controller getMeta - get conn');
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        // UserFRMAppSettings.load(req.params.id, function(err, settings) {
        const data = await sfdcService.getMeta(req.params.id);
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

/**
 * Upsert Meta
 */
export let setMetaItem = async (req: Request, res: Response) => {

    try {
        const inMeta = req.body;
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        console.log('setMetaItem: ' + util.inspect(inMeta, {showHidden: false, depth: null}));
        const data = await sfdcService.getMeta(req.params.id);
        if (data !== null && typeof data !== 'undefined') {
            console.log('setMetaItem - get:' + util.inspect(data, {showHidden: false, depth: null}));
        } else {
            console.log('setMetaItem - get: EMPTY');
        }

        // console.log('Now Loop:' + inMeta.length);
        // for (let i=0; i < inMeta.length; i++) {
        const inMetaData = inMeta;
        console.log('inMetaData:' + inMetaData);

        let meta = null;
        if (utils.defined(data, "metaData.length") && data.metaData.length > 0) {
            meta = _.findWhere(data.metaData, {readingId: inMetaData.readingId});
        }
        console.log('Find meta:' + util.inspect(meta, {showHidden: false, depth: null}));

        // If not found create!!
        if (meta === null || typeof meta === 'undefined') {
            console.log('Create');
            const ret = await sfdcService.createMeta(req.params.id, inMetaData);
            inMetaData.Id = ret.id;
        } else {

            inMetaData.Id = meta.Id;
            console.log('setMetaItem - update' + util.inspect(inMeta, {showHidden: false, depth: null}));
            console.log('Set');

            const ret = await sfdcService.setMeta(req.params.id, inMetaData);
        }
    // }
        console.log('setMetaItem - final!' + util.inspect(inMeta, {showHidden: false, depth: null}));
        return res.json(inMeta);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/**
 * Upsert Meta
 */
export let setMeta = async (req: Request, res: Response) => {

    try {
        const inMeta = req.body;
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        console.log('setMeta: ' + util.inspect(inMeta, {showHidden: false, depth: null}));

        const data = await sfdcService.getMeta(req.params.id);
        if (data !== null && typeof data !== 'undefined') {
            console.log('setMeta - get:' + util.inspect(data, {showHidden: false, depth: null}));
        } else {
            console.log('setMeta - get: EMPTY');
        }
        console.log('Now Loop:' + inMeta.length);
        for (let i = 0; i < inMeta.length; i++) {
            const inMetaData = inMeta[i];
            console.log('Loop meta:' + inMetaData);
            let meta = null;

            if (utils.defined(data, "metaData.length") && data.metaData.length > 0) {
                meta = _.findWhere(data.metaData, {readingId: inMetaData.readingId});
            }

            console.log('Find meta:' + util.inspect(meta, {showHidden: false, depth: null}));
            // If not found create!!
            if (meta === null || typeof meta === 'undefined') {
                console.log('Create');
                const ret = await sfdcService.createMeta(req.params.id, inMetaData);
                inMetaData.Id = ret.id;
            } else {
                inMetaData.Id = meta.Id;
                console.log('setMeta - update' + util.inspect(inMeta, {showHidden: false, depth: null}));
                console.log('Set');
                const ret = await sfdcService.setMeta(req.params.id, inMetaData);
            }
        }
        console.log('setMeta - final!' + util.inspect(inMeta, {showHidden: false, depth: null}));
        return res.json(inMeta);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/**
 * Get Settings
 */
export let getSettings = async (req: Request, res: Response) => {

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const data = await sfdcService.getSettings(req.params.id);
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

/**
 * Upsert Settings
 */
export let setSettings = async (req: Request, res: Response) => {

    try {
        const inSettings = req.body;
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        console.log('setSettings: ' + util.inspect(inSettings, {showHidden: false, depth: null}));
        console.log('setSettings - get');
        const data = await sfdcService.getSettings(req.params.id);
        console.dir('setSettings - get:' + data);

        // If empty Id create!!
        if (data.settings.Id === '') {
            console.log('Create');
            const ret = await sfdcService.createSettings(req.params.id, inSettings);
            return res.json(ret);

        } else {
            console.log('Set');
            const ret = await sfdcService.setSettings(req.params.id, inSettings);
            return res.json(ret);
        }
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/**
 * Get Meta Data
 */
// export let getMeta = (req: Request, res: Response) => {
//     UserFRMAppMeta.load(req.params.id, function(err, meta) {
//         if (err) {
    // return res
//         .status(500)
//         .send({error: err});
// }
//         if (!meta) {
    // return res
    //         .status(404)
    //         .send({error: 'Not Found'});
// }
 //         res.json(meta);
//     });
// };

/**
 * Upsert Meta Data
 */
// export let setMeta = (req: Request, res: Response) => {

//     UserFRMAppMeta.findOneAndUpdate({userId: req.params.id}, {metaData: req.body}, {new: true, upsert: true}, function(err, settings) {

//         if (err) {
//            res
    // .status(500)
    // .send({error: err});
//         } else {
 //             res.json(settings);
//         }

//     });
// };
export let sendAlerts = (req: Request, res: Response) => {

    const msg = req.body.msg;
    const title = req.body.title;
    const sound = req.body.sound;
    const apnRegistrationIds = req.body.apns;
    const gcmRegistrationIds = req.body.gcms;

    console.log('title:' + title);
    console.log('msg:' + msg);
    console.log('sound:' + sound);
    console.log('gcmRegistrationIds:' + gcmRegistrationIds);
    console.log('apnRegistrationIds:' + apnRegistrationIds);

    // Google GCN
    if (gcmRegistrationIds.length > 0) {

        const sender = new gcm.Sender('AIzaSyCNK_2q6MtvaRpbhl-2taOp492nsL7TrFs');
        const message = new gcm.Message();
        message.addData('message', msg);
        message.addData('title', title );
        message.addData('msgcnt', '1'); // Shows up in the notification in the status bar
        if (req.body.sound === true) {
            message.addData('soundname', 'beep.wav'); // Sound to play upon notification receipt - put in the www folder in app
        }
        message.timeToLive = 3000; // Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
        sender.send(message, gcmRegistrationIds, 4, (result) => {
            console.log('Send Result:' + result);
            if (result != null) {
               res
                .status(500)
                .send({error: result});
            } else {
                console.log('Send Result Good!');
            }
        });
    }

    // Apple APN
    if (apnRegistrationIds.length > 0) {
        const apnConnection = apncomp.get();
        console.dir('APN Con: ' + apnConnection);

        const note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = title + ":" + msg;
        note.payload = {'messageFrom': 'GARP'};

        // var myDevice = new apn.Device(registrationIds[0]);
        apnConnection.pushNotification(note, apnRegistrationIds);
    }
    res.send(200);
};

export let sendMessage = (req: Request, res: Response) => {

    // API Server Key
    const gcmRegistrationIds: any = [];
    const apnRegistrationIds: any = [];
    const msg = req.body.msg;
    const title = req.body.title;
    const sites = req.body.sites;

    console.log('sendMessage:' + title + ":" + msg + ":" + sites);

    // Save Message to Mongo
    const mMessage: any = new Message();
    mMessage.title = title;
    mMessage.body = msg;
    mMessage.sites = sites;
    mMessage.save((err: any) => {
        console.log('mMessage.save:' + mMessage);
    });

    UserFRMAppSettings
        .where('settings.examId').in(sites)
        .exec((err: any, settings: any) => {

            if (err) {
                res
                    .status(500)
                    .send({error: err});
            } else {
                console.log('Found Users:' + util.inspect(settings, {showHidden: false, depth: null}));
                for (let i = 0; i < settings.length; i++) {

                    if (settings[i].settings.gcmId !== null && typeof settings[i].settings.gcmId !== 'undefined') {
                        gcmRegistrationIds.push(settings[i].settings.gcmId);
                    }
                    if (settings[i].settings.apnId !== null && typeof settings[i].settings.apnId !== 'undefined') {
                        apnRegistrationIds.push(settings[i].settings.apnId);
                    }
                }
                console.log('gcmRegistrationIds:' + gcmRegistrationIds);
                console.log('apnRegistrationIds:' + apnRegistrationIds);

                // Google GCN
                if (gcmRegistrationIds.length > 0) {

                    const sender = new gcm.Sender('AIzaSyCNK_2q6MtvaRpbhl-2taOp492nsL7TrFs');
                    const message = new gcm.Message();
                    message.addData('message', msg);
                    message.addData('title', title );
                    message.addData('msgcnt', '1'); // Shows up in the notification in the status bar
                    if (req.body.sound === true) {
                        message.addData('soundname', 'beep.wav'); // Sound to play upon notification receipt - put in the www folder in app
                    }
                    message.timeToLive = 3000; // Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

                    sender.send(message, gcmRegistrationIds, 4, function (result) {
                        console.log('Send Result:' + result);

                        if (result != null) {
                            res
                                .status(500)
                                .send({error: result});
                        } else {
                            console.log('Send Result Good!');
                        }
                    });
                }

                // Apple APN
                if (apnRegistrationIds.length > 0) {
                    const apnConnection = apncomp.get();
                    console.dir('APN Con: ' + apnConnection);
                    const note = new apn.Notification();
                    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                    note.badge = 1;
                    note.sound = "ping.aiff";
                    note.alert = title + ":" + msg;
                    note.payload = {'messageFrom': 'GARP'};

                    // var myDevice = new apn.Device(registrationIds[0]);
                    apnConnection.pushNotification(note, apnRegistrationIds);
                }
            }
    });

    res.send(200);
};

export let resetUserPassword = async (req: any, res: any) => {

    try {
        const email = req.params.email;
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const response = await sfdcService.resetUserPassword(email);
        return res.json(response);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

export let postMetadata = async (req: Request, res: Response) => {

    const wrapper: any = {};
    const requestBody = req.body;
    const con = await sfdccomp.getToken();
    const sfdcService = new SFDCService(con);

    sfdcService.postMetadata(requestBody)
    .then((kwargs) => {
        wrapper.success     = true;
        wrapper.response    = kwargs;
        return res.json(wrapper);
    })
    .catch((error) => {
        wrapper.success     = false;
        wrapper.message     = error;
        return res.json(wrapper);
    });
};
