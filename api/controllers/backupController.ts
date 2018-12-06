import { Request, Response, NextFunction } from 'express';
import * as request from 'request';

import * as _ from 'underscore';
import { Registration } from '../models/BackUpRegistration';
import { Message } from '../models/Message';

const PAYPALDATA1 = process.env.PAYPALDATA1;
const PAYPALDATA2 = process.env.PAYPALDATA2;
const PAYPALDATA3 = process.env.PAYPALDATA3;
const PAYPALURL = process.env.PAYPALURL;

const DEBUG = process.env.DEBUG;

export let createcreditcardregistration = (req: Request, res: Response) => {

    const ACCT = req.body.ccnumber;
    const EXPMONTH = req.body.ccmonth;
    const EXPYEAR = req.body.ccyear.slice(2, 4);
    const AMT = req.body.totalCost;
    const paypalData1 = PAYPALDATA1;
    const paypalData2 = PAYPALDATA2;
    const paypalData3 = PAYPALDATA3;
    const dataString = paypalData1 + ACCT + paypalData2 + EXPMONTH + EXPYEAR + paypalData3 + AMT;

    const options = {
        url: PAYPALURL,
        method: 'POST',
        body: dataString
    };

    console.log('Registering via credit card');

    if (DEBUG) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.dir(ACCT);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.dir(EXPMONTH);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.dir(EXPYEAR);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.dir(AMT);
    }

    const callback: any = (error: any, response: Response, body: any) => {
        if (!error && response.statusCode === 200) {
            let transBody: any = [];
            const transResponse = body.split('&');
            let userExamList: any;

            for (let i = 0; i < transResponse.length; i++) {
                const transactionItem = transResponse[i].split('=');
                transBody.push(transactionItem);
            }
            transBody = _.object(transBody);

            const newRegistration: any = new Registration({
                fname: req.body.fname,
                lname: req.body.lname,
                exam: req.body.exam,
                examDate: req.body.examDate,
                examsite: req.body.examsite,
                email: req.body.email,
                company: req.body.company,
                addr1: req.body.addr1,
                addr2: req.body.addr2,
                addr3: req.body.addr3,
                country: req.body.country,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                phone: req.body.phone,
                payment: req.body.payment,
                regType: req.body.regType,
                totalCost: req.body.totalCost,
                RESULT: transBody.RESULT,
                PNREF: transBody.PNREF,
                RESPMSG: transBody.RESPMSG,
                AUTHCODE: transBody.AUTHCODE,
                PREFPSMSG: transBody.PREFPSMSG,
                POSTFPSMSG: transBody.POSTFPSMSG,
                idname: req.body.idname,
                idnum: req.body.idnum,
                idtype: req.body.idtype,
                idexpr: req.body.idexpr,
                isworking: req.body.isworking,
                inschool: req.body.inschool,
                school: req.body.school,
                degree: req.body.degree,
                chinesename: req.body.chinesename,
                gender: req.body.gender,
                birthdate: req.body.birthdate,
                purchaseDate: req.body.purchaseDate,
                frmOneCost: req.body.frmOneCost,
                frmTwoCost: req.body.frmTwoCost,
                enrollFee: req.body.enrollFee,
                chinaFee: req.body.chinaFee
            });

            const sendDuplicateErrorMsg = (exam: any) => {
                // create reponse message for duplicate registration attempt
                const msg = new Message({
                    title: 'Duplicate',
                    body: '\'' + req.body.email + ' is already registered for ' + exam + '\'',
                    email: req.body.email
                });
                res.json(msg);
            };

            const sendErrorMsg = (respmsg: any) => {
                // create reponse message for duplicate registration attempt
                const err = respmsg || 'Please try a different credit card';
                const msg = new Message({
                    title: 'Error',
                    body: 'Error: ' + err,
                    email: req.body.email
                });
                res.json(msg);
            };

            const sortDuplicateExamRegistrations = (userData: any) => {
                userExamList = _.pluck(userData, 'exam');

                if (userExamList.length) {
                    // Handle each type of duplicate registration scenario
                        for (let i = 0; i < userExamList.length; i++) {
                            const oldExam = userExamList[i];
                            if (oldExam === newRegistration.exam) {
                                // Check for EXACT match
                                return sendDuplicateErrorMsg(newRegistration.exam);
                            } else if (oldExam.indexOf('and') > -1) {
                                // Check for existing TWO-PART registration
                                // i.e. TWO-PART scenario: registering for 'FRM Exam Part I' when 'FRM Exam Part I & FRM Exam Part II' already exists
                                return sendDuplicateErrorMsg(newRegistration.exam);
                            } else if ((newRegistration.exam.indexOf(oldExam) > -1) && (newRegistration.exam.indexOf('and') > -1)) {
                                // Check if TWO-PART registration attempt conflicts with existing SINGLE-PART registration
                                // e.g. registering for 'FRM Exam Part I & FRM Exam Part II' when 'FRM Exam Part I' already exists
                                return sendDuplicateErrorMsg(oldExam);
                            }
                        }
                        if (newRegistration.RESPMSG !== 'Approved') {
                            return sendErrorMsg(newRegistration.RESPMSG);
                        } else {
                            newRegistration.save((err: any) => {
                                if (err) {
                                    throw err;
                                }
                                res.json(newRegistration);
                            });
                        }
                } else {
                    // Again, user is found to have no actual exam registrations (despite having userData)
                    if (newRegistration.RESPMSG !== 'Approved') {
                        return sendErrorMsg(newRegistration.RESPMSG);
                    } else {
                        newRegistration.save((err: any) => {
                            if (err) {
                                throw err;
                            }
                            res.json(newRegistration);
                        });
                    }
                }
            };

            // Duplicate registration handler
            Registration.find({ email: newRegistration.email}, (err, userData) => {
                if (err) {
                    throw err;
                } else if (userData.length) {
                    console.log('userExamList', userExamList);
                    // user has registration data obj
                    return sortDuplicateExamRegistrations(userData);

                } else {
                    if (newRegistration.RESPMSG !== 'Approved') {
                        return sendErrorMsg(newRegistration.RESPMSG);
                    } else {
                        newRegistration.save((e: any) => {
                            if (e) {
                                throw e;
                            }
                            res.json(newRegistration);
                        });
                    }
                }
            });
        } else {
            console.log('request Error:' + error);
            console.dir(options);
        }
    };
    request(options, callback);
};

export let createwirecheckregistration = (req: Request, res: Response) => {
    console.log('Registering via wire/check');

    const saveWireCheckForm = () => {
        const newRegistration: any = new Registration({
            exam: req.body.exam,
            examDate: req.body.examDate,
            examsite: req.body.examsite,
            examCost: req.body.examCost,
            purchaseDate: req.body.purchaseDate,
            enrollFee: req.body.enrollFee,
            chinaFee: req.body.chinaFee,
            totalCost: req.body.totalCost,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            company: req.body.company,
            addr1: req.body.addr1,
            addr2: req.body.addr2,
            addr3: req.body.addr3,
            country: req.body.country,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
            payment: req.body.payment,
            regType: req.body.regType,
            idname: req.body.idname,
            idnum: req.body.idnum,
            idtype: req.body.idtype,
            idexpr: req.body.idexpr,
            isworking: req.body.isworking,
            inschool: req.body.inschool,
            school: req.body.school,
            degree: req.body.degree,
            chinesename: req.body.chinesename,
            gender: req.body.gender,
            birthdate: req.body.birthdate
        });

        const sendDuplicateErrorMsg = (exam: any) => {
                // create reponse message for duplicate registration attempt
                console.log('sendDuplicateErrorMsg() - exam', exam);
                const msg = new Message({
                    title: 'Duplicate',
                    body: '\'' + req.body.email + ' is already registered for ' + exam + '\'',
                    email: req.body.email
                });
                res.json(msg);
        };

        const sortDuplicateExamRegistrations = (userData: any) => {
            console.log('sortDuplicateExamRegistrations() called');
            const userExamList = _.pluck(userData, 'exam');
            if (userExamList.length) {
                // Other exam registrations exists
                console.log('userExamList', userExamList);
                // Check for exam string in each of user's existing registration objects
                for (let i = 0; i < userExamList.length; i++) {
                    const oldExam = userExamList[i];
                    if (oldExam === newRegistration.exam) {
                        // Check for EXACT match
                        return sendDuplicateErrorMsg(newRegistration.exam);
                    } else if (oldExam.indexOf('and') > -1) {
                        // Check for existing TWO-PART registration
                        // i.e. TWO-PART scenario: registering for 'FRM Exam Part I' when 'FRM Exam Part I & FRM Exam Part II' already exists
                        return sendDuplicateErrorMsg(newRegistration.exam);
                    } else if ((newRegistration.exam.indexOf(oldExam) > -1) && (newRegistration.exam.indexOf('and') > -1)) {
                        // Check if TWO-PART registration attempt conflicts with existing SINGLE-PART registration
                        // e.g. registering for 'FRM Exam Part I & FRM Exam Part II' when 'FRM Exam Part I' already exists
                        return sendDuplicateErrorMsg(oldExam);
                    }
                }
                newRegistration.save((err: any) => {
                    if (err) {
                        throw err;
                    }
                    res.json(newRegistration);
                });
            } else {
                // if user has no exam registrations
                // Then save the new registration
                newRegistration.save((err: any) => {
                    res.json(newRegistration);
                    if (err) {
                        throw err;
                    }
                });
            }
        };

        Registration.find({ email: newRegistration.email}, function(err, userData) {
            if (err) {
                throw err;
            } else if (userData) { // user has registered before
                // console.log('userData', userData);
                return sortDuplicateExamRegistrations(userData);
            } else { // user is registering for the first time (since no account with this e-mail exists in the Mongo DB)
                newRegistration.save((e: any) => {
                    if (e) {
                        throw e;
                    }
                    res.json(newRegistration);
                });
            }
        });
    };
    saveWireCheckForm();
};

export let fetchallregistrations = (req: Request, res: Response) => {
    const email = req.params.email;
    Registration.find({ email: email}, (err: any, docs: any) => {
        res.json(docs);
    });
};

export let fetchregistration = (req: Request, res: Response) => {
    const email = req.params.email;
    Registration.findOne({ email: email}, (err, userData) => {
        if (err) {
            throw err;
        }
        res.json(userData);
    });
};
