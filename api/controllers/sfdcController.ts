import * as https from 'https';
import * as fs from 'fs';
import * as util from 'util';
import { Request, Response, NextFunction } from 'express';
import * as request from 'request';
import * as moment from 'moment';
import * as _ from 'underscore';
import * as requestPromise from 'request-promise';
import * as cheerio from 'cheerio';
import * as crypto from 'crypto';

import * as utils from '../util/utils';
import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
import config from '../config/config';
// import redis client
import { client, getAsync } from '../components/redis';
// init sfdc service
const sfdccomp = new SFDCComponent();
sfdccomp.init();

const CACHE = config.CACHE;
const PORTAL_URL = config.SFDC_PORTAL_URL;
const ROOT_URL = config.ROOT_URL;

function isNull(data: any) {
    if (data == null) {
        return '';
    }
    return data;
}

function addressLimit(data: any) {
    if (data != null && data.length > 40) {
        return data.substring(0, 40);
    } else {
        return data;
    }
}

// clear all keys in redis cache
export let getSFDCContentClearCache = async (req: Request, res: Response, next: NextFunction) => {
    client.flushall();
    res.send(200);
};
// clear specific key in redis cache
export let getSFDCContentClearCacheItem = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = req.params.key;
    client.del(cacheKey, (err, reply) => {
        if (err) {
            console.log('SFDC Redis cache error: ', err);
        }
        console.log(reply);
    });
    res.send(200);
};
// In use
export let mobiusRelay = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const apiBody = req.body;
        const key = "fd2f16ee8841e";
        const strDt = moment().format("YYYYMD");
        const data = key + strDt;
        const sec = crypto.createHash('md5').update(data).digest("hex");
        const sendBody = apiBody;
        sendBody['token'] = sec;

        request({
            url: "https://garp.learnpearson.com/gateway.php",
            method: 'POST',
            json: sendBody
        }, (err, resp, body) => {
            res.json(body);
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getjobTargetJobs = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let agentOptions: any;
        let agent;

        agentOptions = {
            host: 'www.example.com',
            port: '80',
            path: '/',
            rejectUnauthorized: false
        };
        agent = new https.Agent(agentOptions);

        request({
            url: "http://careers.garp.com/distrib/jobs/widget.cfm?code=iG9k525rVB3N56pp5FSy0tRypV34PSMN&rand=705"
            , method: 'GET'
        }, (err: any, resp: any, body: any) => {
            // console.log('return :' + err + ':' + body);
            // res.json(body);
            const $ = cheerio.load(body);
            const jobs: any = {
                count: 0,
                jobs: []
            };

            $('.jt_job_position').each((i, elem) => {
                const obj: any = {
                    name: $(this).text(),
                    location: null,
                    company: null,
                    description: null,
                    url: null
                };
                jobs.jobs.push(obj);
            });

            $('.jt_job_location').each((i, elem) => {
                jobs.jobs[i].location = $(this).text();
            });

            $('.jt_job_description').each((i, elem) => {
                jobs.jobs[i].description = $(this).text();
            });

            $('.jt_job_company').each((i, elem) => {
                jobs.jobs[i].company = $(this).text();
            });

            $('.jt_job').each((i, elem) => {
                const ahref = $(this).find('a').attr('href');
                jobs.jobs[i].url = ahref;
            });

            jobs.count = jobs.jobs.length - 1;
            res.json(jobs);
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getSmartProsResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let agentOptions: any;
        let agent;

        agentOptions = {
            host: 'www.example.com',
            port: '443',
            path: '/',
            rejectUnauthorized: false
        };
        agent = new https.Agent(agentOptions);

        request({
            url: "https://fulfillmentservice.stage.smartpros.com/SmartprosFulfillmentService.svc/" + req.params.type + "/" + req.params.req,
            method: 'GET',
            agent: agent
        }, (err, resp, body) => {
            // console.log('return :' + err + ':' + body);
            res.json(body);
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getSFDCExamPrepProviders = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cacheKey = "getSFDCExamPrepProviders";
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const providers = await sfdcService.getExamPrepProviders();
        const data = await sfdcService.getExamPrepProviderContacts();

        if (utils.defined(providers, "records.length") && providers.records.length > 0) {
            for (let i = 0; i < providers.records.length; i++) {
                const prov = providers.records[i];
                const matchItem = _.findWhere(data.records, {AccountId: prov.Id});
                if (utils.defined(matchItem)) {
                    prov.contact = matchItem;
                }
            }

            client.set(cacheKey, JSON.stringify(providers));
            res.json(providers);
        } else {
            return res.status(404).json({
                error: 'Not found providers!'
            });
        }
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getSFDCExamInfo = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cacheKey = "getSFDCExamInfo";
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const examInfo = await sfdcService.getSFDCExamInfo();
        const retObj: any = {
            examInfo: examInfo,
            products: null
        };

        const examProducts = await sfdcService.getExamProducts();
        retObj.products = examProducts;
        client.set(cacheKey, JSON.stringify(retObj));
        res.json(retObj);
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getSFDCExamFees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = "getSFDCExamFees";
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getExamGroupDetails();
        if (utils.defined(data, "records.length") && data.records.length > 0) {
            const examGroupDetails = data.records[0];
            const response = await sfdcService.getProducts();
            let frmEarlyPrice = 0;
            let frmStandardPrice = 0;
            let frmLatePrice = 0;
            let erpEarlyPrice = 0;
            let erpStandardPrice = 0;
            let erpLatePrice = 0;
            let enrollment = 0;
            const mExamDate = moment(examGroupDetails.Exam_Date__c);
            const monthNum = mExamDate.month() + 1;

            for (let i = 0; i < response.records.length; i++) {
                const rec = response.records[i];
                if (rec.Product2.ProductCode === 'FRM1E' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    frmEarlyPrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'FRM1S' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    frmStandardPrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'FRM1L' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    frmLatePrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'ENC1E' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    erpEarlyPrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'ENC1S' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    erpStandardPrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'ENC1L' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
                    erpLatePrice = rec.UnitPrice;
                }
                if (rec.Product2.ProductCode === 'FRM1' && rec.Product2.GL_Code__c === '4010') {
                    enrollment = rec.UnitPrice;
                }
            }
            const retObj = {
                examGroupDetails: examGroupDetails,
                registrationStartDate: utils.getValue(examGroupDetails, "Registration_Start_Date__c"),
                enrollment: enrollment,
                frm: {
                    early: {
                        price: frmEarlyPrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Early_Registration__c")
                    },
                    standard: {
                        price: frmStandardPrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Standard_Registration__c")
                    },
                    late: {
                        price: frmLatePrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Late_Registration__c")
                    },
                    nextEarly: {
                        price: frmEarlyPrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Early_Registration__c")
                    },
                    nextStandard: {
                        price: frmStandardPrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Standard_Registration__c")
                    },
                    nextLate: {
                        price: frmLatePrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Late_Registration__c")
                    }
                },
                erp: {
                    early: {
                        price: erpEarlyPrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Early_Registration__c")
                    },
                    standard: {
                        price: erpStandardPrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Standard_Registration__c")
                    },
                    late: {
                        price: erpLatePrice,
                        lastDate: utils.getValue(examGroupDetails, "Last_Date_For_Late_Registration__c")
                    },
                    nextEarly: {
                        price: erpEarlyPrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Early_Registration__c")
                    },
                    nextStandard: {
                        price: erpStandardPrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Standard_Registration__c")
                    },
                    nextLate: {
                        price: erpLatePrice,
                        lastDate: utils.getValue(examGroupDetails, "Next_Exam_Group__r.Last_Date_For_Late_Registration__c")
                    }
                }
            };

            client.set(cacheKey, JSON.stringify(retObj));
            res.json(retObj);
        } else {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};

// In use
export let setSFDCICBRRstatus = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const garpId = req.params.garpId;
        const procType = req.params.procType;
        const status = req.params.status;
        const examDate = req.params.examDate;
        const result = req.params.result;
        const score = req.params.score;
        const regErrorText = req.body.regErrorText;
        const authErrorText = req.body.authErrorText;
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const data = await sfdcService.setICBRRstatus(garpId, procType, status, examDate, result, score, regErrorText, authErrorText);

        if (!utils.defined(data)) {
            res.status(500).json({
                error: 'Failed to load data'
            });
        }
        res.send({
            message: 'Update Complete',
            data: data
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};
// In use
export let getSFDCICBRRcdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const now = new Date();
        let year: any;
        let month: any = now.getMonth() + 1;
        let day: any;
        let hours: any;
        let min: any;
        let sec: any;
        let lines = 'ClientCandidateId\tFirstName\tLastName\tMiddleName\tSuffix\tSalutation\tEmail\tLastUpdate\tAddress1\tAddress2\tCity\t'
            + 'State\tPostalCode\tCountry\tPhone\tFax\tFaxCountryCode\tPhoneCountryCode\tCompanyName\n';
        // const lines = 'ClientCandidateId\tFirstName\tLastName\tMiddleName\tSuffix\tSalutation\tEmail\tAddress1\tAddress2\tCity\tState\t'
        // + 'PostalCode\tCountry\tPhone\tPhoneCountryCode\tFAX\tFAXCountryCode\tCompanyName\tLastUpdate\n';
        // sfdcService.getICBRRcdd((err: any, data: any) => {
        const data = await sfdcService.getICBRRActiveRegistrations();
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }

        try {
            let updateDate = '';
            if (String(month).length === 1) {
                month = "0" + month;
            }
            day = now.getDate();
            if (String(day).length === 1) {
                day = "0" + day;
            }
            year = now.getFullYear();
            hours = now.getHours();

            if (String(hours).length === 1) {
                hours = "0" + hours;
            }
            min = now.getMinutes();
            if (String(min).length === 1) {
                min = "0" + min;
            }
            sec = now.getSeconds();
            if (String(sec).length === 1) {
                sec = "0" + sec;
            }
            updateDate = now.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;

            for (let i = 0; i < data.records.length; i++) {
                const dataItem: any = data.records[i];
                const firstName = dataItem.Member__r.FirstName;
                const lastName = dataItem.Member__r.LastName;
                const middleName = '';
                const suffix = dataItem.Member__r.Suffix__c;
                const salutation = dataItem.Member__r.Salutation;
                const lastUpdate: any = null;
                let clientCandidateId = dataItem.Garp_Id__c;
                let phone = '2017197210';
                let countryCode = '1';
                let country = 'USA';
                if (utils.defined(dataItem, "Member__r.MailingCountry")) {
                    country = dataItem.Member__r.MailingCountry;
                } else if (utils.defined(dataItem, "Opportunity__r.Account.BillingCountry")) {
                    country = dataItem.Member__r.MailingCountry;
                } else if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Country__c")) {
                    country = dataItem.Member__r.ChargentSFA__Billing_Country__c;
                } else if (utils.defined(dataItem, "Opportunity__r.Shipping_Country__c")) {
                    country = dataItem.Member__r.Shipping_Country__c;
                }

                if (utils.defined(dataItem, "Member__r.Phone")) {
                    phone = dataItem.Member__r.Phone;
                } else if (utils.defined(dataItem, "Member__r.OtherPhone")) {
                    phone = dataItem.Member__r.OtherPhone;
                } else if (utils.defined(dataItem, "Member__r.HomePhone")) {
                    phone = dataItem.Member__r.HomePhone;
                } else if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Phone__c")) {
                    phone = dataItem.Opportunity__r.ChargentSFA__Billing_Phone__c;
                } else if (utils.defined(dataItem, "Opportunity__r.Shipping_Phone_No__c")) {
                    phone = dataItem.Opportunity__r.Shipping_Phone_No__c;
                }

                let address1 = '';
                let address2 = '';
                let city = '';
                let state = '';
                let zip = '';
                const phoneSet = false;
                const countrySet = false;
                // Opp Billing
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Address__c") && utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_City__c")) {
                    const arrNames = dataItem.Opportunity__r.ChargentSFA__Billing_Address__c.split('\n');
                    if (arrNames.length > 0) {
                        address1 = arrNames[0].replace("\r", "");
                    }
                    if (arrNames.length > 1) {
                        address2 = arrNames[1].replace("\r", "");
                    }
                }
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_City__c")) {
                    city = dataItem.Opportunity__r.ChargentSFA__Billing_City__c;
                }
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_State__c")) {
                    state = dataItem.Opportunity__r.ChargentSFA__Billing_State__c;
                    let fnd = _.findWhere(utils.STATES.Countries[0].s, {n: state});
                    if (!utils.defined(fnd)) {
                        fnd = _.findWhere(utils.STATES.Countries[1].s, {n: state});
                    }
                    if (!utils.defined(fnd)) {
                        fnd = _.findWhere(utils.STATES.Countries[2].s, {n: state});
                    }
                    if (utils.defined(fnd)) {
                        state = fnd.v;
                    }
                }
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Zip__c")) {
                    zip = dataItem.Opportunity__r.ChargentSFA__Billing_Zip__c;
                }
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Country__c")) {
                    country = dataItem.Opportunity__r.ChargentSFA__Billing_Country__c;
                }
                if (utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_Phone__c")) {
                    phone = dataItem.Opportunity__r.ChargentSFA__Billing_Phone__c;
                }
                // Opp Shipping
                if (address1 === '' && utils.defined(dataItem, "Opportunity__r.Shipping_Street__c")) {
                    const arrNames = dataItem.Opportunity__r.Shipping_Street__c.split('\n');
                    if (arrNames.length > 0) {
                        address1 = arrNames[0].replace("\r", "");
                    }
                    if (arrNames.length > 1) {
                        address2 = arrNames[1].replace("\r", "");
                    }
                }
                if (city === '' && utils.defined(dataItem, "Opportunity__r.Shipping_City__c")) {
                    city = dataItem.Opportunity__r.Shipping_City__c;
                }
                if (state === '' && utils.defined(dataItem, "Opportunity__r.ChargentSFA__Billing_State__c")) {
                    state = dataItem.Opportunity__r.Shipping_State__c;
                }
                if (zip === '' && utils.defined(dataItem, "Opportunity__r.Shipping_Postal_Code__c")) {
                    zip = dataItem.Opportunity__r.Shipping_Postal_Code__c;
                }
                if (!countrySet && utils.defined(dataItem, "Opportunity__r.Shipping_Country__c")) {
                    country = dataItem.Opportunity__r.Shipping_Country__c;
                }
                if (!phoneSet && utils.defined(dataItem, "Opportunity__r.Opportunity__r.Shipping_Phone_No__c")) {
                    phone = dataItem.Opportunity__r.Shipping_Phone_No__c;
                }

                // Member Mailing
                if (address1 === '' && utils.defined(dataItem, "Member__r.MailingStreet")) {
                    const arrNames = dataItem.Member__r.MailingStreet.split('\n');
                    if (arrNames.length > 0) {
                        address1 = arrNames[0].replace("\r", "");
                    }
                    if (arrNames.length > 1) {
                        address2 = arrNames[1].replace("\r", "");
                    }
                }
                if (city === '' && utils.defined(dataItem, "Member__r.MailingCity")) {
                    city = dataItem.Member__r.MailingCity;
                }
                if (state === '' && utils.defined(dataItem, "Member__r.MailingState")) {
                    state = dataItem.Member__r.MailingState;
                }
                if ( zip === '' && utils.defined(dataItem, "Member__r.MailingPostalCode")) {
                    zip = dataItem.Member__r.MailingPostalCode;
                }
                if (!countrySet && utils.defined(dataItem, "Member__r.MailingCountry")) {
                    country = dataItem.Member__r.MailingCountry;
                }
                if (!phoneSet && (utils.defined(dataItem, "Member__r.Phone") || utils.defined(dataItem, "Member__r.OtherPhone") || utils.defined(dataItem, "Member__r.HomePhone"))) {
                    if (utils.defined(dataItem, "Member__r.Phone")) {
                        phone = dataItem.Member__r.Phone;
                    } else if (utils.defined(dataItem, "Member__r.OtherPhone")) {
                        phone = dataItem.Member__r.OtherPhone;
                    } else if (utils.defined(dataItem, "Member__r.HomePhone")) {
                        phone = dataItem.Member__r.HomePhone;
                    }
                }

                // Account Billing
                if (address1 === '' && utils.defined(dataItem, "Account.BillingStreet")) {
                    const arrNames = dataItem.Opportunity__r.Account.BillingStreet.split('\n');
                    if (arrNames.length > 0) {
                        address1 = arrNames[0].replace("\r", "");
                    }
                    if (arrNames.length > 1) {
                        address2 = arrNames[1].replace("\r", "");
                    }
                }
                if (city === '' && utils.defined(dataItem, "Account.BillingCity")) {
                    city = dataItem.Opportunity__r.Account.BillingCity;
                }
                if ( state === '' && utils.defined(dataItem, "Account.BillingState")) {
                    state = dataItem.Opportunity__r.Account.BillingState;
                }
                if ( zip === '' && utils.defined(dataItem, "Account.BillingPostalCode")) {
                    zip = dataItem.Opportunity__r.Account.BillingPostalCode;
                }
                if (!countrySet && utils.defined(dataItem, "Account.BillingCountry")) {
                    country = dataItem.Opportunity__r.Account.BillingCountry;
                }
                // Fix Address
                if (country === 'USA' || country.indexOf('United State') > -1 && phone.length === 11) {
                    phone = phone.substring(1);
                }

                if (city.length > 32) {
                    city = city.substring(0, 32);
                }

                if (firstName.indexOf('GARPQA') > -1 || lastName.indexOf('GARPQA') > -1) {
                    continue;
                }
                while (utils.defined(clientCandidateId, "length") && clientCandidateId.length < 8) {
                    clientCandidateId = "0" + clientCandidateId;
                }
                if (utils.defined(country)) {
                    const matchItem = _.find(utils.cc, {country: country});

                    if (utils.defined(matchItem)) {
                        country = matchItem.code;
                        countryCode = matchItem.phoneCode;
                    } else {
                        country = 'USA';
                        countryCode = '1';
                    }
                } else {
                    country = 'USA';
                    countryCode = '1';
                }
                const newline = util.format('%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n',
                            clientCandidateId,
                            isNull(firstName),
                            isNull(lastName),
                            isNull(middleName),
                            isNull(suffix),
                            isNull(salutation),
                            isNull(dataItem.Member__r.Email),
                            updateDate,
                            isNull(addressLimit(address1)),
                            isNull(addressLimit(address2)),
                            isNull(addressLimit(city)),
                            isNull(addressLimit(state)),
                            isNull(addressLimit(zip)),
                            country,
                            isNull(phone),
                            isNull(''),
                            isNull(''),
                            countryCode,
                            isNull(dataItem.Member__r.Company__c)
                        );
                lines += newline;
            }
        } catch (e) {
            console.log(e);
        }
        try {
            const fileDate = now.getFullYear() + '-' + month + '-' + day + '.' + hours + '.' + min + '.' + sec;
            fs.writeFile("/home/ec2-user/ICBRR/cdd." + fileDate + ".dat", lines, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                    res.send(lines);
                }
            });
        } catch (e) {
            console.log(e);
        }
        res.send(lines);
    } catch (e) {
        res.json(500).send({
            error: e
        });
    }
};
// In use
export let getSFDCICBRRead = async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    let year: any;
    let month: any = now.getMonth() + 1;
    let day: any;
    let hours: any;
    let min: any;
    let sec: any;
    // const lines = 'ClientCandidateId\tAuthorizationTransactionType\tExamAuthorizationCount\tEligibilityApptDateFirst\tExamSeriesCode\tEligibilityApptDateLast\tClientAuthorizationID\tLastUpdate\n';
    let lines = 'AuthorizationTransactionType\tClientAuthorizationID\tClientCandidateId\tExamAuthorizationCount\tExamSeriesCode\tEligibilityApptDateFirst\tEligibilityApptDateLast\tLastUpdate\n';

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        // const folder = req.body.folder;
        // sfdcService.getICBRRead((err: any, data: any) => {
        const data = await sfdcService.getICBRRActiveRegistrationsAuth();
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }

        try {
            let updateDate = '';
            month = now.getMonth() + 1;
            if (String(month).length === 1) {
                month = "0" + month;
            }
            day = now.getDate();
            if (String(day).length === 1) {
                day = "0" + day;
            }
            year = now.getFullYear();
            hours = now.getHours();
            if (String(hours).length === 1) {
                hours = "0" + hours;
            }
            min = now.getMinutes();
            if (String(min).length === 1) {
                min = "0" + min;
            }

            sec = now.getSeconds();
            if (String(sec).length === 1) {
                sec = "0" + sec;
            }

            updateDate = now.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
        for (let i = 0; i < data.records.length; i++) {

                const dataItem = data.records[i];
                const firstName = dataItem.Member__r.FirstName;
                const lastName = dataItem.Member__r.LastName;

                if (firstName.indexOf('GARPQA') > -1 || lastName.indexOf('GARPQA') > -1) {
                    continue;
                }

                const dt3 = dataItem.Candidate_Commitment__r.StartDate + ' 00:00:00';
                const dt5 = dataItem.Candidate_Commitment__r.EndDate + ' 00:00:00';
                let clientCandidateId = dataItem.Garp_Id__c;
                while (utils.defined(clientCandidateId, "length") && clientCandidateId.length < 8) {
                    clientCandidateId = "0" + clientCandidateId;
                }

                let method = 'Add';
                if (utils.defined(dataItem, "ICBRR_Authorization_Status__c")
                    && (dataItem.ICBRR_Authorization_Status__c === 'Successful'
                    || dataItem.ICBRR_Authorization_Status__c === 'Force Update')) {
                    method = 'Update';
                }

                let examSeriesCode = '2010-777';
                if (utils.defined(dataItem, "Program_Abbrev__c") && dataItem.Program_Abbrev__c === 'FRR') {
                    examSeriesCode = '2016-FRR';
                }

                lines += util.format('%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n',
                        method,
                        isNull(dataItem.ClientAuthorizationID__c),
                        clientCandidateId,
                        isNull('3'),
                        examSeriesCode,
                        dt3,
                        dt5,
                        updateDate);
            }
        } catch (e) {
            console.log(e);
        }

        try {
            // fs.writeFile("/home/ec2-user/ICBRR/icbrr_ead.csv", lines, function(err) {
            const fileDate = now.getFullYear() + '-' + month + '-' + day + '.' + hours + '.' + min + '.' + sec;
            fs.writeFile("/home/ec2-user/ICBRR/ead." + fileDate + ".dat", lines, (err: any) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                    res.send(lines);
                }
            });
        } catch (e) {
            console.log(e);
        }
        res.send(lines);
    } catch (e) {
        res.json(500).send({
            error: e
        });
   }
};

// In use
export let getActiveExamSites = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getActiveExamSites";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getActiveExamSites();
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
export let getExamVenues = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getExamVenues:" + req.params.examDate;
    const examDate = moment(req.params.examDate).format("YYYY-MM-DD");

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getExamVenues(examDate);
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
export let createWebcastRegistration = async (req: Request, res: Response, next: NextFunction) => {

    const con = await sfdccomp.getToken();
    const sfdcService = new SFDCService(con);
    try {
        const data = await sfdcService.createWebcastRegistration(req.params.userId, req.params.webcastId);
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
export let getSFDCChapters = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCChapters";
    // console.log('controller - get conn'));
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getChapters();
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

export let getSFDCChapter = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCChapter:" + req.params.id;

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getChapter(req.params.id);
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
export let getSFDCCPDActivities = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCCPDActivities";
    // console.log('controller - get conn'));
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getCPDActivities();
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
export let getMembershipOfferByOfferId = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getMembershipOfferByOfferId";

    try {
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const data = await sfdcService.getMembershipOffer();

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
export let getCCInternships = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getCCInternships";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getCCInternships();
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
export let getHighlightedJobs = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getHighlightedJobs";

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getHighlightedJobs();
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

export let getCertifiedCandidatesByExam = async (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const exam = req.params.exam;
    const cacheKey = "getCertifiedCandidatesByExam" + ':' + utils.toLower(exam) + ':' + startDate + ':' + endDate;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getCertifiedCandidatesByExam(exam, startDate, endDate);
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

export let getPassedCandidatesByExam = async (req: Request, res: Response, next: NextFunction) => {
    const exam = req.params.exam;
    let examDate = req.params.examDate;
    const cacheKey = "getPassedCandidatesByExam" + ':' + utils.toLower(exam);

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);

        examDate = moment(examDate).format("YYYY-MM-DD");
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getPassedCandidatesByExam(exam, examDate);
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
export let getCertifiedCandidates = async (req: Request, res: Response, next: NextFunction) => {
    // if(CACHE) {
    //   const cacheKey = "getCertifiedCandidates" + ':' + req.params.startDate + ':' + req.params.endDate;
    //   console.log('**Get key:' + cacheKey);
    //   const cacheVal = localStorage.getItem(cacheKey);
    //   console.log('**cacheVal:' + utils.defined(cacheVal));
    // }
    // if(utils.defined(cacheVal)) {
        //   res.json(JSON.parse(cacheVal));
        // } else {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const data = await sfdcService.getCertifiedCandidates(startDate, endDate);
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
export let getSFDCAcademicPartners = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCAcademicPartners";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getAcademicPartners();
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

// export let getSFDCcontentAnalytics = async (req: Request, res: Response, next: NextFunction) => {

//   sfdccomp.getToken((err: any, conn: any) => {
//     if (err) return next(err);

//     // console.log('controller - get conn');
//  );


//     const id = req.params.id;

//     sfdcService.getcontentAnalytics(id, (err: any, data: any) => {
//       if (err) return next(err);
//       if (!data) return next(new Error('Failed to load data'));
//       return res.json(data);
//     });
//   });
// };

// In use
export let getSFDCautoQA = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.email;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const data = await sfdcService.getautoQA(email);
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
export let getSFDCCPDProviders = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getSFDCCPDProviders";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getCPDProviders();
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
export let getSFDCContentDoc = async (req: Request, res: Response, next: NextFunction) => {
    const rnd = Math.floor(Math.random() * 90000) + 10000;
    const url = PORTAL_URL + '/ContentAnalytics?contentId=' + req.params.id + '&x=' + rnd;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        requestPromise.get(url)
        .then((response: any) => {
            console.log('The associated Content Analytics record has been updated for the Content record with the given ID ' + req.params.id);
            console.log(response);
        })
        .catch((error: any) => {
            console.log(error);
        });

        const cacheKey = "getSFDCContentDoc" + ':' + req.params.id;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data: any = await sfdcService.getContentDoc(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        if (utils.defined(data, "records.length") && data.records.length > 0) {
            const docData = data;
            const rec = docData.records[0];

            if (utils.defined(rec, "Primary_Author__c")) {
                const docObj = data;

                const response1 = await sfdcService.getContentDocAuthor(rec.Primary_Author__c);
                if (utils.defined(response1, "records.length") && response1.records.length > 0) {
                    rec.Primary_Author__r = response1.records[0];
                }
                client.set(cacheKey, docData);
                res.json(docData);
            } else {
                client.set(cacheKey, JSON.stringify(data));
                return res.json(data);
            }
        } else {
            client.set(cacheKey, JSON.stringify(data));
            return res.json(data);
        }
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


async function getRelatedContact(req: Request, res: Response, next: NextFunction, catRec: any) {

    const id = req.params.id;
    const cacheKey = "getSFDCRelatedContent" + ':' + id;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getRelatedContent(id, catRec);
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
}
// In use
export let getSFDCRelatedContent = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = 'getSFDCRelatedContent:allCatSubCat';
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);

        if (oldValue) {
            getRelatedContact(req, res, next, JSON.parse(oldValue));
        }
        const data = await sfdcService.getContentCatSubCat();
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data.records));
        getRelatedContact(req, res, next, data.records);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getSFDCRecordTypes = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getSFDCRecordTypes";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getRecordTypes();
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
export let getSFDCContentSiteMap = async (req: Request, res: Response, next: NextFunction) => {

    const folder = req.body.folder;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        let xml = '';
        const data: any = await sfdcService.getContentRecords(folder, ['all'], ['all'], ['all'], 999, 0);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        for (const rec of data.records) {
            xml += "<url>";
            if (utils.defined(rec, "Vanity_URL__c")) {
                xml += "<loc>" + ROOT_URL + "/#!/risk-intelligence/detail/" + rec.Id + "/" + rec.Vanity_URL__c + "</loc>";
            } else {
                xml += "<loc>" + ROOT_URL + "/#!/risk-intelligence/detail/" + rec.Id + "</loc>";
            }

            xml += "<changefreq>daily</changefreq>";
            xml += "<priority>1.0</priority>";
            xml += "</url>";
        }

        try {
            if (process.env.NODE_ENV === 'production') {
                fs.writeFile("/home/ftpdev02/microsites/sitemap.content.xml", xml, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log("The file was saved!");
                        utils.merge(fs, outStream, "/home/ftpdev02/microsites/sitemap.fixed.xml", () => {
                            utils.merge(fs, outStream, "/home/ftpdev02/microsites/sitemap.content.xml", () => {
                                utils.merge(fs, outStream, "/home/ftpdev02/microsites/sitemap.end.xml", () => {
                                    console.log("All done!");
                                });
                            });
                        });
                    }
                });

                const outStream = fs.createWriteStream("/home/ftpdev02/microsites/sitemap.xml", {
                    flags: "w",
                    encoding: null,
                    mode: 666
                });
            }
        } catch (e) {
            // console.dir(e);
            return next(new Error(e.TypeError));
        }
        res.send(xml);
    } catch (error) {
        console.log('getSFDCContentSiteMap error: ', error);
        return res.status(500).json({
            error: error
        });
    }
};

// In use
export let getSFDCContent = async (req: Request, res: Response, next: NextFunction) => {

    // name, contentTypes, topics, recordTypes
    const folder = req.body.folder;
    const contentTypes = req.body.contentTypes;
    const topics = req.body.topics;
    const recordTypes = req.body.recordTypes;
    let limit = 20;
    let offset = 0;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        if (utils.defined(req, "body.limit")) {
            limit = req.body.limit;
        }
        if (utils.defined(req, "body.offset")) {
            offset = req.body.offset;
        }

        const cacheKey = "getSFDCContent" + ':' + folder + ':' + contentTypes + ':' + topics + ':' + recordTypes + ':' + limit + ':' + offset;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getContentRecords(folder, contentTypes, topics, recordTypes, limit, offset);
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
export let getSFDCContentByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let limit = 20;
        let offset = 0;
        let category = '';
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        if (utils.defined(req, "body.limit")) {
            limit = req.body.limit;
        }
        if (utils.defined(req, "body.offset")) {
            offset = req.body.offset;
        }
        if (utils.defined(req, "body.category")) {
            category = req.body.category;
        }

        const cacheKey = "getSFDCContentByCategory" + ':' + utils.toLower(category) + ':' + limit + ':' + offset;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getContentRecordsByCategory(category, limit, offset);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
        // res.json({});
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getSFDCEmailSubscription = async (req: Request, res: Response, next: NextFunction) => {
    let email = '';
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        if (utils.defined(req, "body.email")) {
            email = req.body.email;
        }
        // console.log(email);
        const cacheKey = "getSFDCEmailSubscription" + ':' + email;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getMemberOrLeadByEmail(email);
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
export let getSFDCContentBySubcategory = async (req: Request, res: Response, next: NextFunction) => {
    let limit = 20;
    let offset = 0;
    let subcategory = '';
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        if (utils.defined(req, "body.limit")) {
            limit = req.body.limit;
        }
        if (utils.defined(req, "body.offset")) {
            offset = req.body.offset;
        }
        subcategory = req.body.subcategory;
        const cacheKey = "getSFDCContentBySubcategory" + ':' + utils.toLower(subcategory) + ':' + limit + ':' + offset;
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getContentRecordsBySubcategory(subcategory, limit, offset);
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
export let getSFDCContentAds = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCContentAds";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getContentAds();
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
export let getSFDCRiskArticlesByViewCount = async (req: Request, res: Response, next: NextFunction) => {

    const category = req.params.category;
    const cacheKey = "getSFDCRiskArticlesByViewCount" + ':' + utils.toLower(category);
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCRiskArticlesByViewCount(category);
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
export let getSFDCRiskArticlesByShareCount = async (req: Request, res: Response, next: NextFunction) => {

    const category = req.params.category;
    const cacheKey = "getSFDCRiskArticlesByShareCount" + ':' + utils.toLower(category);
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getRiskArticlesByShareCount(category);
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
export let getSFDCRiskTrendingArticles = async (req: Request, res: Response, next: NextFunction) => {

    const category = req.params.category;
    const cacheKey = "getSFDCRiskTrendingArticles" + ':' + utils.toLower(category);
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCRiskTrendingArticles(category);
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
export let getSFDCRiskFeaturedArticles = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCRiskFeaturedArticles";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCRiskFeaturedArticles();
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
export let getUpcomingWebcasts = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getUpcomingWebcasts";
    // const sfdccomp = new SFDCComponent();k
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getUpcomingWebcasts();
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
export let getOndemandWebcasts = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getOndemandWebcasts";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = sfdcService.getOndemandWebcasts();
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
export let getSFDCBoardofTrustees = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCBoardofTrustees";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCBoardofTrustees();
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
export let getSFDCRiskManagerOfTheYear = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCRiskManagerOfTheYear";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCRiskManagerOfTheYear();
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
export let getSFDCTestimonial = async (req: Request, res: Response, next: NextFunction) => {

    const examType = req.params.examType;
    const cacheKey = "getSFDCTestimonial" + ':' + utils.toLower(examType);
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCTestimonial(examType);
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
export let getSFDCfaq = async (req: Request, res: Response, next: NextFunction) => {

    const category = req.params.category;
    const cacheKey = "getSFDCfaq" + ':' + utils.toLower(category);
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCfaq(category);
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
export let getSFDCfaqById = async (req: Request, res: Response, next: NextFunction) => {

    const faqId = req.params.id;
    const cacheKey = "getSFDCfaqById" + ':' + faqId;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getSFDCfaqById(faqId);
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
export let getSFDCRiskArticlesByCategory = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCRiskArticlesByCategory" + ':' + utils.toLower(req.params.category) + ':' + req.params.numberofarticles + ':' + req.params.offset;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getSFDCRiskArticlesByCategory(req.params.category, req.params.numberofarticles, req.params.offset);
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
export let getSFDCQuantCorner = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCQuantCorner" + ':' + req.params.numberofarticles + ':' + req.params.offset;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCQuantCorner(req.params.numberofarticles, req.params.offset);
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
export let getSFDCRiskArticlesByColumn = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCRiskArticlesByColumn" + ':' + utils.toLower(req.params.column) + ':' + req.params.numberofarticles + ':' + req.params.offset;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getSFDCRiskArticlesByColumn(req.params.column, req.params.numberofarticles, req.params.offset);
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
export let getSFDCColumns = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCColumns" + ':' + req.params.numberofarticles + ':' + req.params.offset;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCColumns(req.params.numberofarticles, req.params.offset);
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
export let getSFDCFRMCorner = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCFRMCorner" + ':' + req.params.numberofarticles + ':' + req.params.offset;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCFRMCorner(req.params.numberofarticles, req.params.offset);
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
export let getSFDCFeaturedContent = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCFeaturedContent" + ':' + req.params.type;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSFDCFeaturedContent(req.params.type);
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
export let getSFDCWebcasts = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCWebcasts";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getWebCasts();
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
export let getSFDCVideos = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const data = await sfdcService.getVideos();
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
export let getSFDCVideoCat = async (req: Request, res: Response, next: NextFunction) => {

    const folderName = req.params.id;
    const cacheKey = "getSFDCVideoCat:" + folderName;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getVideosByFolder(folderName);
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
export let getSFDCChapterMeetings = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCChapterMeetings";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getChapterMeetings();
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
export let getSFDCChapterMeeting = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCChapterMeeting:" + req.params.id;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getChapterMeeting(req.params.id);
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
export let getSFDCChapterPresentations = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCChapterPresentations";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getChapterPresentations();
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
export let getSFDCStudyTopics = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCStudyTopics : " + req.params.exam + ':' + req.params.year;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getStudyTopics(req.params.exam, req.params.year);
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
export let getContentFolder = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getContentFolder : " + req.params.folder;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getContentFolder(req.params.folder);
        if (!data) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }

        const response: any = {};
        response.records = [];
        _.each(data.records, (collection: any) => {
            collection.Content__r.Sort_Number__c = collection.Sort_Number__c;
            response.records.push(collection.Content__r);
        });

        client.set(cacheKey, JSON.stringify(response));
        res.json(response);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getSFDCStudyProducts = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSFDCStudyProducts : " + req.params.mode;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getStudyProducts(req.params.mode);
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
export let getContentFolderById = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getContentFolderById : " + req.params.id;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getContentFolderById(req.params.id);
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
export let getStudyMaterialsFolderById = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "getStudyMaterialsFolderById : " + req.params.id;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);

        if (oldValue) {
            res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getStudyMaterialsFolderById(req.params.id);
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
export let getSliderData = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSliderData : " + req.params.sliderfoldername;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getSliderData(req.params.sliderfoldername);
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
export let getSlideShowData = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getSlideShowData : " + req.params.slideshowid;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getSlideShowData(req.params.slideshowid);
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
export let getHighlightedContent = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getHighlightedContent";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);

        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }
        const data = await sfdcService.getHighlightedContent();
        if (!utils.defined(data, 'records')) {
            return res.status(404).json({
                error: 'Failed to load data'
            });
        }
        data.records = _.sortBy(data.records, 'Sort_Number__c');
        client.set(cacheKey, JSON.stringify(data));
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getOneWireJobs = async (req: Request, res: Response, next: NextFunction) => {

    let cleanUpJobs: any;
    const con = await sfdccomp.getToken();
    const sfdcService = new SFDCService(con);

    cleanUpJobs = async (kwargs: any) => {
        try {
            const deletedJobs = await sfdcService.deleteOneWireJobs(kwargs.keys);
            return { createdJobs: kwargs.createdJobs, deletedJobs: deletedJobs };
        } catch (error) {
            console.log('Error in getting deletedJobs', error);
        }
    };

    const sendAllRequests = async (kwargs: any) => {

        return Promise.all(kwargs.requests)
            .then(function(createdJobs) {
                return new Promise(function(resolve, reject) {
                    resolve({ keys: kwargs.keys, createdJobs: createdJobs });
                });
            });
    };

    const parseXML = (body: any) => {

        return new Promise((resolve, reject) => {

            const $ = cheerio.load(body.trim(), {
            xmlMode: true
            });

            const requests: any = [];

            const jobs: any = [];
            const keys: any = [];

            $('job').each((i, elem) => {
                console.log('Parsing Job #: ' + (i + 1));
                const job: any = {};

                job.Country__c					  = $(this).find($('country')).text();
                job.City__c					      = $(this).find($('city')).text();
                job.State__c				      = $(this).find($('state')).text();
                job.Postal_Code__c			  = $(this).find($('postalcode')).text();
                job.Salary__c				      = $(this).find($('salary')).text();
                job.Experience__c			    = $(this).find($('experience')).text();
                job.Company__c				    = $(this).find($('company')).text();
                job.Job_Type__c				    = $(this).find($('jobtype')).text();
                job.Category__c				    = $(this).find($('category')).text();
                job.Sponsored__c		  	  = $(this).find($('sponsored')).text();
                job.Title__c				      = $(this).find($('title')).text();
                job.URL__c					      = $(this).find($('url')).text();
                job.Reference_Number__c		= $(this).find($('referencenumber')).text();
                job.Description__c			  = $(this).find($('description')).text();
                job.Published_Date__c		  = $(this).find($('date')).text();

                jobs.push(job);
                keys.push(job.Reference_Number__c);

                if (jobs.length === 200) {
                    requests.push(sfdcService.insertOneWireJobs(jobs));
                    jobs.length = 0;
                }
            });
            if (jobs.length) {
                requests.push(sfdcService.insertOneWireJobs(jobs));
            }

            resolve({ requests: requests, keys: keys });
        });
    };

    const wrapper: any = {};

    requestPromise.get('https://www.onewire.com/garpfeed/feed.xml')
        .then(parseXML)
        .then(sendAllRequests)
        .then(cleanUpJobs)
        .then((kwargs: any) => {
            wrapper.createdJobs = kwargs.createdJobs;
            wrapper.deletedJobs = kwargs.deletedJobs;
        })
        .catch((error: any) => {
            wrapper.error = error;
        })
        .finally(() => {
            const sendmail = require('sendmail')();
            sendmail({
                from: 'no-reply@garp.com',
                to: 'alberto.garcia@garp.com',
                subject: 'OneWire Job Data Refresh',
                html: '<pre>' + JSON.stringify(wrapper, null, 4) + '</pre>'
                }, (err: any, reply: any) => {
                    console.log(err && err.stack);
            });
        });

    res.json({ message : 'Starting Processing of jobs from https://www.onewire.com/garpfeed/feed.xml' });
};
// In use
export let oneWireLocationSearch = async (req: Request, res: Response, next: NextFunction) => {
    request({
        url: 'https://www.onewire.com/Geography/SearchCities2',
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            "Content-Type" : "application/json"
        }
    }, (err, response, body) => {
        res.json(JSON.parse(body));
    });
};

// In use
export let webToRequest = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        if (req.body.inquiryType === 'Case' || req.body.inquiryType !== 'Lead') {

            const constructRequest = (recordType: any) => {

                return new Promise((resolve, reject) => {
                    if (!recordType.records) {
                        reject();
                    }

                    const requestObj = {
                        SuppliedEmail: req.body.email,
                        SuppliedName: req.body.firstName + ' ' + req.body.lastName,
                        Description: req.body.message,
                        Subject: req.body.message.substring(0, (req.body.message.length > 20) ? 20 : req.body.message.length),
                        Origin: req.body.context,
                        RecordTypeId: recordType.records[0].Id
                    };
                    resolve(requestObj);
                });
            };
            sfdcService.getRecordTypeByName('Case', 'Customer')
                .then(constructRequest)
                .then(sfdcService.webToCase.bind(SFDCService))
                .then((data: any) => {
                    res.json({
                        success: true,
                        response: data
                    });
                })
                .catch((error: any) => {
                    res.json({
                        success: false,
                        message: error
                    });
                });
        } else if (req.body.inquiryType === 'Lead') {

            const requestObj = {
                Eail: req.body.email,
                Company: req.body.company,
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                LeadSource: req.body.context,
                Description: req.body.message,
            };

            sfdcService.webToLead(requestObj)
                .then((data: any) => {
                    console.log(data);
                    res.json({
                        success: true,
                        response: data
                    });
                })
                .catch((error: any) => {
                    console.log(error);
                    res.json({
                        success: false,
                        message: error
                    });
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getCompanies = async (req: Request, res: Response) => {

    const name = req.body.name;
    const cacheKey = "getCompanies:" + name;
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getCompanies(name);
        const response = {
            success: true,
            response: data
        };
        client.set(cacheKey, JSON.stringify(response));
        res.json(response);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
// In use
export let getAcademicFellowships = async (req: Request, res: Response, next: NextFunction) => {

    const cacheKey = "getAcademicFellowships";
    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const oldValue = await getAsync(cacheKey);
        if (oldValue) {
            return res.json(JSON.parse(oldValue));
        }

        const data = await sfdcService.getAcademicFellowships();
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
