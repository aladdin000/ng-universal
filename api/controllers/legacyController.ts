import { Request, Response, NextFunction } from 'express';
import * as request from 'request';

import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
// Init SFDC service
const sfdccomp = new SFDCComponent();
sfdccomp.init();

export let authLegacyUser = (req: Request, res: Response, next: NextFunction) => {

    console.log('Try Legacy');

    request.post(
      'http://www.garp.org/ExamInfo/api/exam',
      { form: { Email: req.body.userName, Password: req.body.password } },
      (error, response, body) => {
        // if (!error && body) {
        if (!error) {
            console.dir('Try Legacy:' + error + ':' + response + ':' + body);

            const legacyRes = {
                Lreg: [
                    { Productid: "1148", SiteID: "126", sitename: "USA, Louisiana, New Orleans", siteaddress: "", examDate: "" },
                    { Productid: "1149", SiteID: "126", sitename: "USA, Louisiana, New Orleans", siteaddress: "", examDate: "" }
                ],
                GarpId: 279195,
                Email: "modipan.uibe@gmail.com",
                FirstName: "MODI",
                LastName: "PAN"
            };

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

            const examData = [];
            for (let i = 0; i < legacyRes.Lreg.length; i++) {
                const ld = legacyRes.Lreg[i];
                const ed = {
                    Id: ld.Productid,
                    Name: ld.sitename,
                    Member__C: legacyRes.GarpId,
                    Exam_Site__r: {
                        Site__r: {
                        Id: ld.SiteID,
                        Name: ld.sitename,
                        Display_Address__c: ld.sitename
                        },
                        Exam__r: {
                        Id: ld.Productid,
                        Exam_Date__c: ld.examDate
                        }
                    }
                };
                examData.push(ed);
            }

            exam.registrations = {};
            exam.registrations.records = examData;

            const contact: any = {
                Id: legacyRes.GarpId,
                Name: legacyRes.FirstName + ' ' + legacyRes.LastName,
                FirstName: legacyRes.FirstName,
                LastName: legacyRes.LastName,
                Email: legacyRes.Email,
                GARP_Member_ID__c: legacyRes.GarpId,
                MailingCity: 'Brooklyn',
                MailingCountry: 'United States',
                MailingPostalCode: '11215',
                MailingState: 'New York',
                MailingStreet: '25A Jackson Pl',
                AccountId: legacyRes.GarpId,
                GARP_ID__c: legacyRes.GarpId,
                Membership_Type__c: 'Individual',
                Name_As_it_Appears_On_ID__c: null,
                ID_Number__c: null,
                ID_Type__c: null,
                GARP_Directory_Opt_In__c: true,
                examRegistrations: exam
            };

            const user = {
                Id: legacyRes.GarpId,
                Email: legacyRes.Email,
                ContactId: legacyRes.GarpId,
                FirstName: legacyRes.FirstName,
                LastName: legacyRes.LastName,
                Profile: {
                    Name: legacyRes.FirstName + ' ' + legacyRes.LastName
                },
                Username: legacyRes.Email,
                IsActive: true
            };

            const returnData: any = user;
            returnData.contact = contact;
            res.json(returnData);

        } else {
          return next(new Error('Failed to authenticate'));
        }
      }
    );
};
  // Setup connection with given username and password
  /*
  var conn = sfdccomp.initUser(req.body.userName,req.body.password, function(err, data) {
    if(err) {
      next(401, {err: "Unable to authenticate"});
      return;
    }

    var connUser = sfdccomp.getUser();
    console.log('fetch identity:', connUser.userInfo.id)

    // Save access data to mongoDB
    userSecuritySchema.save(connUser.userInfo.id, {accessToken: connUser.accessToken, instanceUrl: connUser.instanceUrl}, function(err, data) {
      if (err) return next(err);
      console.dir('done setting data in mongo', data)
      var SFDCService = new Services(connUser);
      SFDCService.getUser(connUser.userInfo.id, function(err, user) {
        if (err) return next(err);
        if (!user || !user.done || user.records.length != 1) return next(new Error('Failed to load account'));
        res.json(user.records[0]);
      });
    });
  });
};
  */


/**
 * Get SFDC Users
 */
export let getSFDCUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const con = await sfdccomp.getToken();
        const sfdcService = new SFDCService(con);
        const users = await sfdcService.getUsers();
        if (!users) {
            res.json(404).send({
                error: 'Failed to load data'
            });
        }
        res.json(users);
    } catch (error) {
        res.json(500).send({
            error: error
        });
    }
};
