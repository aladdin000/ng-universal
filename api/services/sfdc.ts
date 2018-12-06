import * as util from 'util';
import * as https from 'https';
import * as _ from 'underscore';
import * as moment from 'moment';

import * as utils from '../util/utils';
import config from '../config/config';

const riskFolderId = config.RISKFOLDERID;

export class SFDCService {

    constructor (con: any) {
        this.con = con;
    }

    con: any; // salesforce connection
    getGBIResearchUpdates = () => {
        const query = util.format('Select Id, Name, Title__c, Intro_Description__c, Description__c, Publish_Date__c, Status__c, Visibility__c from GBI_Update__c order by Publish_Date__c DESC');
        // console.log("Query: " + query);

        return this.con.query(query);
    }

    getGBIResearchUpdate = (updateId: any) => {
        const query = util.format("Select Id, Name, Title__c, Intro_Description__c, Description__c, Publish_Date__c, Status__c, Visibility__c from GBI_Update__c where Id = '%s'", updateId);
        // console.log("Query: " + query);

        return this.con.query(query);
    }

    getReportsData = (reportId: any) => {
        const report = this.con.analytics.report(reportId);
        // execute report synchronously
        return new Promise((resolve, reject) => {
            report.execute((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                console.log(result.reportMetadata);
                console.log(result.factMap);
                console.log(result.factMap["T!T"]);
                console.log(result.factMap["T!T"].aggregates);
                resolve(result);
            });
        });
    }

    setICBRRstatus = async (garpId: any, procType: any, status: any, examDate: any, result: any, score: any, regErrorText: any, authErrorText: any) => {
        let query = util.format(
            "select Id, Name, ICBRR_Submission_Status__c, ICBRR_Submission_Error__c, ICBRR_Authorization_Status__c,"
            + " ICBRR_Authorization_Error__c, Garp_Id__c, Icbrr_Exam_Date__c, Result__c, Score__c from Exam_Attempt__c where Section__c = "
            + " 'ICBRR' and Cancelled__c = False and ((Contract_Status__c like 'Activ%' and (ICBRR_Submission_Status__c = null OR ICBRR_Submission_Status__c = "
            + " 'Failure to Pick Up' OR ICBRR_Submission_Status__c = 'Retry Submission' OR ICBRR_Submission_Status__c = 'Ready for Pickup' OR ICBRR_Submission_Status__c ="
            + " 'Data Sent')) OR (Icbrr_Exam_Date__c = null)) and Garp_Id__c = '%s'",
            garpId);

        if (garpId.indexOf('CAI') > -1) {
            query = util.format("select Id, Name, ClientAuthorizationID__c, ICBRR_Submission_Status__c, ICBRR_Submission_Error__c, ICBRR_Authorization_Status__c,"
                + " ICBRR_Authorization_Error__c, Garp_Id__c, Icbrr_Exam_Date__c, Result__c, Score__c from Exam_Attempt__c where ClientAuthorizationID__c = '%s'",
                garpId);
        }
        const response = await this.con.query(query);
        const items = response.records;
        let matches;

        if (items.length > 0) {
            matches = _.where(items, {
                Garp_Id__c: garpId
            });
            if (garpId.indexOf('CAI') > -1) {
                matches = _.where(items, {
                    ClientAuthorizationID__c: garpId
                });
            }

            for (const match of matches) {
                const obj: any = {
                    Id: match.Id
                };

                if (examDate === 'x') {
                    examDate = '';
                }
                if (result === 'x') {
                    result = '';
                }
                if (score === 'x') {
                    score = '';
                }
                if (status === 'x') {
                    status = '';
                }
                if (utils.defined(examDate, '') && examDate !== '') {
                    obj.Icbrr_Exam_Date__c = examDate;
                }
                if (utils.defined(result, '') && result !== '') {
                    obj.Result__c = result;
                }
                if (utils.defined(score, '') && score !== '') {
                    obj.Score__c = score;
                }
                if (utils.defined(regErrorText, '') && regErrorText !== '') {
                    obj.ICBRR_Submission_Error__c = regErrorText;
                }
                if (utils.defined(authErrorText, '') && authErrorText !== '') {
                    obj.ICBRR_Authorization_Error__c = authErrorText;
                }
                if (procType === 'register' && utils.defined(status, '') && status !== '') {
                    obj.ICBRR_Submission_Status__c = status;
                }
                if (procType === 'auth' && utils.defined(status, '') && status !== '') {
                    obj.ICBRR_Authorization_Status__c = status;
                }

                const ret: any = await this.con.sobject("Exam_Attempt__c").update(obj);
                if (!ret.success) {
                    console.log('Error: ', ret);
                }
                console.log('Updated Successfully : ' + ret.id);
                return matches.length;
            }
        } else {
            return null;
        }
    }

    getICBRRActiveRegistrationsAuth = () => {
        const query = "select Id, Name, CreatedDate, ICBRR_Submission_Status__c, ICBRR_Authorization_Status__c, Member__r.MailingStreet,"
            + " Member__r.MailingCity, Member__r.MailingState, Member__r.MailingPostalCode, Member__r.MailingCountry, Member__r.Company__c,"
            + " Opportunity__r.Account.BillingStreet, Opportunity__r.Account.BillingCity, Opportunity__r.Account.BillingState, Opportunity__r.Account.BillingPostalCode,"
            + " Opportunity__r.Account.BillingCountry, Opportunity__r.ChargentSFA__Billing_Address__c, Opportunity__r.ChargentSFA__Billing_City__c,"
            + " Opportunity__r.ChargentSFA__Billing_State__c, Opportunity__r.ChargentSFA__Billing_Zip__c, Opportunity__r.ChargentSFA__Billing_Country__c,"
            + " Opportunity__r.ChargentSFA__Billing_Phone__c, Opportunity__r.Shipping_Street__c, Opportunity__r.Shipping_City__c, Opportunity__r.Shipping_State__c,"
            + " Opportunity__r.Shipping_Postal_Code__c, Opportunity__r.Shipping_Country__c, Opportunity__r.Shipping_Phone_No__c, Member__r.Suffix__c, Member__r.Salutation,"
            + " Member__r.FirstName, Member__r.LastName, Member__r.Phone, Member__r.OtherPhone, Member__r.HomePhone, Member__r.Email, Garp_Id__c,"
            + " ClientAuthorizationID__c, Candidate_Commitment__r.StartDate, Candidate_Commitment__r.Enddate, Member__c,"
            + " Program_Name__c, Program_Abbrev__c from Exam_Attempt__c where Section__c = 'ICBRR' and Contract_Status__c like 'Activ%' and Score__c = NULL and Cancelled__c = "
            + " False and (ICBRR_Authorization_Status__c=null OR ICBRR_Authorization_Status__c = 'Retry Submission' OR ICBRR_Authorization_Status__c = 'Ready for Pickup'"
            + " OR ICBRR_Authorization_Status__c = 'Error' OR ICBRR_Authorization_Status__c = 'Force Update')";

        return this.con.query(query);
    }

    getSFDCExamInfo = async () => {
        let year = moment().year();
        // Get Current Year Nov Exam Group
        let query =  util.format(
            "select Id, Exam_Date__c, Registration_Start_Date__c, Last_Date_For_Early_Registration__c, Last_Date_For_Standard_Registration__c,"
            + " Last_Date_For_Late_Registration__c, FRM_FAQ_Category__c, FRM_Study_Materials_Folder__c, ERP_FAQ_Category__c, ERP_Study_Materials_Folder__c,"
            + " FRM_I_Number_of_Questions__c, FRM_II_Number_of_Questions__c, ERP_I_Number_of_Questions__c, ERP_II_Number_of_Questions__c, Common_FAQ__c,"
            + " FRM_Study_Module_Lead_Gen_URL__c, ERP_Study_Module_Lead_Gen_URL__c, FRM_Free_Reading_Lead_Gen_URL__c, ERP_Free_Reading_Lead_Gen_URL__c from Exam_Group__c where Month__c"
            + " = 'Nov' and Year__c = '%s'", year);

        const res = await this.con.query(query);

        if (!utils.defined(res, "records.length") || res.records.length <= 0) {
            console.log('Error in getSFDCExamInfo');
            return null;
        }

        const retObj = {
            nov: res.records[0],
            may: {}
        };
        const lastDayNovReg = moment(res.records[0].Last_Date_For_Late_Registration__c);
        const today = moment();
        if (today.diff(lastDayNovReg, 'days') > 0) {
            year++;
        }
        query = util.format(
            "select Id, Exam_Date__c, Registration_Start_Date__c, Last_Date_For_Early_Registration__c, Last_Date_For_Standard_Registration__c,"
            + " Last_Date_For_Late_Registration__c, FRM_FAQ_Category__c, FRM_Study_Materials_Folder__c, ERP_FAQ_Category__c, ERP_Study_Materials_Folder__c,"
            + " FRM_I_Number_of_Questions__c, FRM_II_Number_of_Questions__c, ERP_I_Number_of_Questions__c, ERP_II_Number_of_Questions__c, Common_FAQ__c,"
            + " FRM_Study_Module_Lead_Gen_URL__c, ERP_Study_Module_Lead_Gen_URL__c, FRM_Free_Reading_Lead_Gen_URL__c,"
            + " ERP_Free_Reading_Lead_Gen_URL__c from Exam_Group__c where Month__c = 'May' and Year__c = '%s'", year);
        console.log("Query1: " + query);

        const res1 = await this.con.query(query);
        if (!utils.defined(res1, "records.length") || res1.records.length <= 0) {
            console.log('Error in getSFDCExamInfo');
            return null;
        }
        retObj.may = res1.records[0];
        return retObj;
    }

    getExamGroupDetails = () => {
        const query = "select Id, Exam_Date__c, Registration_Start_Date__c, Last_Date_For_Early_Registration__c, Last_Date_For_Standard_Registration__c,"
            + " Last_Date_For_Late_Registration__c, Next_Exam_Group__r.Exam_Date__c, Next_Exam_Group__r.Registration_Start_Date__c, Next_Exam_Group__r.Last_Date_For_Standard_Registration__c,"
            + " Next_Exam_Group__r.Last_Date_For_Early_Registration__c, Next_Exam_Group__r.Last_Date_For_Late_Registration__c from Exam_Group__c where Active__c = True";

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getMembershipOffer = () => {
        const query = util.format("select Id, Name, Values_List__c, Memb_Offer_Title__c, Memb_Offer_Status__c, Memb_Offer_Public_Button_Text__c,"
            + " Memb_Offer_Promo_Code__c, Memb_Offer_Portal_Route__c, Memb_Offer_Logo__c, Memb_Offer_Hashtag__c, Memb_Offer_External_Link__c,  Info_Link__c,"
            + " Memb_Offer_Description__c from Membership_Exclusive_Offers__c");

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getEvent = async (eventId: any) => {
        let query = "SELECT Id, Content__r.Custom_Header__c, Content__r.Custom_Footer__c, Content__r.Tagline__c, Content__r.Btn1__c,"
            + " Content__r.Btn1_Link__c, Agenda_Download_URL__c, Agenda_Features__c, Agenda_Default_Page__c, RecordType.Name, Name,"
            + " Decline_RSVP_URL__c, Invite_Only__c, Sub_Title__c, Short_Title__c, Byline__c, Address__c, Event_Background_Image__c,"
            + " Photo_Album_Link__c, DynamicNgClass__c, post_event_description__c, AddressMap_Image_URL__c, Vanity_URL__c, Cancellation_Policy__c,"
            + " Payment_Policy__c, AlreadyRegisteredLink__c, Venue_Guidelines__c, VenueName__c, RegisterNowLink__c, Credit_Info__c, Events_Photography_Release__c,"
            + " Hashtag__c, Overview__c, Program_Change__c, Description__c, End_Date__c, Start_Date__c, Title__c, Book_Hotel_Link__c, Last_Date_For_Registration__c,"
            + " Related_Content_Folder__c, Featured_Boxes_Folder__c, Can_Register__c, Convention_Sections__c, By_The_Numbers_Participants__c,"
            + " By_The_Numbers_Countries__c, By_The_Numbers_Speakers__c, By_The_Numbers_Year__c, Sponsor_Page_Overview__c, Post_Event_Sponsor_Page_Overview__c,"
            + " Post_Event_Sponsor_Message__c, FAQ_Category__c,"
            + "(SELECT Id, Name FROM Attachments)"
            + "FROM Event__c "
            + "WHERE Id = '%s'";

        const session = await this.con.query(util.format(query, eventId));
        query = util.format(
            "SELECT Id, cdrive__contextID__c, cdrive__File_Name__c FROM cdrive__Cloud_Files__c WHERE cdrive__contextID__c = '%s'",
            eventId);
        const res = await this.con.query(query);
        session.images = res;
        return session;
    }

    getRelatedEvents = (eventId: any) => {
        const query = util.format("select Id, RecordType.Name, Name, Sub_Title__c, Short_Title__c, Byline__c, Address__c, Photo_Album_Link__c,"
            + " DynamicNgClass__c, post_event_description__c, AddressMap_Image_URL__c, Vanity_URL__c, Cancellation_Policy__c, AlreadyRegisteredLink__c,"
            + " Venue_Guidelines__c, VenueName__c, RegisterNowLink__c, Credit_Info__c, Events_Photography_Release__c, Hashtag__c, Overview__c, Program_Change__c,"
            + " Description__c, End_Date__c, Start_Date__c, Title__c, Book_Hotel_Link__c, Last_Date_For_Registration__c, Related_Content_Folder__c, Featured_Boxes_Folder__c,"
            + " Can_Register__c, Convention_Sections__c, By_The_Numbers_Participants__c, By_The_Numbers_Countries__c, By_The_Numbers_Speakers__c,"
            + " Sponsor_Page_Overview__c, Post_Event_Sponsor_Page_Overview__c, Post_Event_Sponsor_Message__c from Event__c where Parent_Event__r.Id = '%s'", eventId);
          // console.log("Query: " + query);
        return this.con.query(query);
    }

    getEventScheduleItems = (eventId: any) => {
        const query = util.format("select Id, Item_Name__c, Start_Date_Time__c, End_Date_Time__c from Event_Schedule_Item__c where Event__c = '%s' order by Start_Date_Time__c ASC", eventId);
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getEventRates = (eventId: any) => {
        const query = util.format("select Id, Name, Start_Date__c, End_Date__c, Member_Rate__c, Non_Member_Rate__c,"
            + " Hide_on_Public_Site__c from Event_Rate__c where Event__c = '%s' order by Start_Date__c ASC", eventId);

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getContentCatSubCat = () => {
        const query = "select Id, Name, View_Count__c, Image__c, Bucket1__c, Bucket2__c, Trend__c, Share_Count__c, Category__c,"
        + " Subcategory__c from Content__c where Category__c != null and Subcategory__c != null";
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getRelatedContent = (docId: any, catRec: any) => {
        const emptyResponse: any = {
            "View_Count__c": [],
            "Share_Count__c": [],
            "Trend__c": [],
            "Related_Content__c": []
        };
        const fnd: any = _.findWhere(catRec, {Id: docId});
        let category = null;
        let subcategory = null;
        if (utils.defined(fnd, '')) {
            category = fnd.Category__c;
            subcategory = fnd.Subcategory__c;
        }

        if (!utils.defined(category, '') && !utils.defined(category, '')) {
            return emptyResponse;
        }

        const fndRelated: any = _.where(catRec, {Category__c: category, Subcategory__c: subcategory});
        if (!utils.defined(fndRelated, '')) {
            return emptyResponse;
        }

        const fiveViewCountArticles = _.chain(fndRelated).sortBy('View_Count__c').reverse().first(5).value();
        const notNullSharedArticles = [];
        for (let i = 0; i < fndRelated.length; i++) {
            if (fndRelated[i].Share_Count__c != null) {
                notNullSharedArticles.push(fndRelated[i]);
            }
        }
        let fiveSharedArticles: any = [];
        if (notNullSharedArticles.length > 0) {
            fiveSharedArticles = _.chain(notNullSharedArticles).sortBy('Share_Count__c').reverse().first(5).value();
        } else {
            fiveSharedArticles = [];
        }
        const getWeek = (date: any) => {
            const onejan: any = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        };
        const weekNum = getWeek(new Date());
        let bucket = 2;
        if (weekNum % 2 === 0) {
            bucket = 1;
        }
        let fiveTopTrendingArticles: any = [];
        if (bucket === 1) {
            fiveTopTrendingArticles = _.chain(fndRelated).sortBy('Bucket1__c').reverse().first(5).value();
        } else {
            fiveTopTrendingArticles = _.chain(fndRelated).sortBy('Bucket2__c').reverse().first(5).value();
        }

        const obj: any = {};
        obj['View_Count__c'] = fiveViewCountArticles;
        obj['Share_Count__c'] = fiveSharedArticles;
        obj['Trend__c'] = fiveTopTrendingArticles;
        const query = util.format("select Id, Name, Content_Related__r.Id, Content_Related__r.Category__c, Content_Related__r.Subcategory__c,"
            + " Content_Related__r.Image__c, Content_Related__r.Published_Date__c from Related_Content__c where Content_Source__c = '%s'", docId);
        console.log('query:' + query);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                obj['Related_Content__c'] = res.records;
                resolve(obj);
            });
        });
    }

    getEventSponsors = async (eventId: any) => {
        let query = util.format("select Id, Name, Description__c, Last_Updated_Date__c, Level__c, Featured_Order__c, Logo__c, Published_Date__c,"
            + " Status__c, Website__c, Group_Rank__c from Event_Sponsor__c where Event__c = '%s' and Status__c = 'Active' order by Published_Date__c DESC", eventId);
        // console.log("Query: " + query);

        const sponsors = await this.con.query(query);
        let sponsorIDs = "";
        for (let i = 0; i < sponsors.totalSize; i++) {
            if (i < sponsors.totalSize - 1) {
                sponsorIDs += "'" + sponsors.records[i].Id + "',";
            } else {
                sponsorIDs += "'" + sponsors.records[i].Id + "'";
            }
        }
        console.log("sponsorIDs: " + sponsorIDs);
        if (sponsors.totalSize > 0) {
            query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", sponsorIDs);
            console.log("query2: " + query);
            const response = await this.con.query(query);
            console.log("CD: ");
            console.dir(response);
            for (let i = 0; i < sponsors.totalSize; i++) {
                const sponsor = sponsors.records[i];
                if (utils.defined(sponsor, "Logo__c")) {
                    if (sponsor.Logo__c.toLowerCase().indexOf('http') === -1) {
                        const fnd: any = _.findWhere(response.records, { cdrive__contextID__c: sponsor.Id, cdrive__File_Name__c: sponsor.Logo__c });
                        if (fnd != null) {
                            sponsor.Logo__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Event_Sponsor__c/" + sponsor.Id + "/" + fnd.Id + "_" + sponsor.Logo__c;
                        }
                    }
                }
            }
            return sponsors;
        } else {
            return sponsors;
        }
    }

    getEventContent = (folderName: any) => {
        const query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Description__c, SKU__c, Media_Type__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c,"
            + " End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c,"
            + " Status__c, Record_Type_Name__c from Content__c where Id in (select Content__c from Content_Folders__c where Folder_Name__c = '%s')"
            + " order by Published_Date__c DESC", folderName);
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getEventContacts = (eventId: any) => {
        const query = util.format("Select Id, Name, Email__c, First_Name__c, Last_Name__c, Phone__c, Type__c from Event_Contact__c where Event__c = '%s'", eventId);
        console.log("Query: " + query);
        return this.con.query(query);
    }

    getEventFAQs = (eventId: any) => {
        const query = util.format("Select Id, Name, Email__c, First_Name__c, Last_Name__c, Phone__c, Type__c from Event_Contact__c where Event__c = '%s'", eventId);
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getEventSessions = async (eventId: any) => {
        let query = util.format(
            "SELECT Id, Name, Title__c, Type__c, Availability__c, Description__c, Details__c, Show_in_List_View__c, Tags__c, End_Date_Time__c,"
            + " Event_Session_Track__c, Group_Name__c, Last_Updated_Date__c, Published_Date__c, Start_Date_Time__c, Show_On_Summary_Schedule__c,"
            + " Location__c, Status__c, (SELECT Id, Event_Speaker__c, Event_Speaker__r.First_Name__c, Event_Speaker__r.Last_Name__c,"
            + " Event_Speaker__r.Byline__c, Event_Speaker__r.Title__c FROM Event_Speaker_Session_Tracks__r)"
            + " FROM Event_Sessions__c where Event__c = '%s' and Status__c = 'Active' order by Published_Date__c DESC",
            eventId);

        const sessions = await this.con.query(query);
        query = util.format(
            "SELECT Id, Name, Description__c, Rank__c FROM Event_Session_Track__c WHERE Id in (SELECT Event_Session_Track__c from Event_Sessions__c"
            + " where Event__c = '%s' and Status__c = 'Active')",
            eventId
        );
        const res = await this.con.query(query);
        return {
            sessions: sessions,
            tracks: res
        };
    }

    getEventSpeakers = async (eventId: any) => {
        let query = "";
        let speakers;
        let speakerIDs = "";
        let records;
        let files;
        let presentations;

        query = util.format("Select Id, Name, Facebook__c, LinkedIn__c, Title__c, Organization__c, Twitter__c, Company_Title_1__c,"
            + " Company_Title_2__c, Company_Title_3__c, Bio__c, Byline__c, First_Name__c, Last_Name__c, Last_Updated_Date__c, Photo__c, Published_Date__c,"
            + " Status__c from Event_Speaker__c where Id in (select Event_Speaker__c from Event_Speaker_Session_Track__c where Status__c = 'Active'"
            + " and Event_Session__r.Event__c = '%s' and Event_Session__r.Status__c = 'Active') order by Published_Date__c DESC", eventId);

        speakers = await this.con.query(query);

        if (speakers.totalSize === 0) {
            return { speakers: [] };
        }

        for (let i = 0; i < speakers.totalSize; i++) {
            if (i < speakers.totalSize - 1) {
                speakerIDs += "'" + speakers.records[i].Id + "',";
            } else {
                speakerIDs += "'" + speakers.records[i].Id + "'";
            }
        }

        query = util.format("select Event_Session__c, Asset__c, Event_Session_Track__c, Event_Speaker__c, Event_Speaker__r.First_Name__c,"
            + " Event_Speaker__r.Last_Name__c, Event_Speaker__r.Bio__c, Event_Speaker__r.Byline__c, Event_Speaker__r.Title__c, Event_Speaker__r.Company_Title_1__c,"
            + " Role__c, Order_By__c, Show_Photo__c, Featured__c from Event_Speaker_Session_Track__c where Status__c = 'Active' and Event_Session__r.Event__c = '%s'"
            + " and Event_Session__r.Status__c = 'Active'", eventId);

        records = await this.con.query(query);

        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", speakerIDs);
        files = await this.con.query(query);

        for (let i = 0; i < speakers.totalSize; i++) {
            const speaker = speakers.records[i];

            if (utils.defined(speaker, "Photo__c")) {
                if (speaker.Photo__c.toLowerCase().indexOf('http') === -1) {
                    const fnd: any = _.findWhere(files.records, { cdrive__contextID__c: speaker.Id, cdrive__File_Name__c: speaker.Photo__c });
                    if (fnd != null) {
                        speaker.Photo__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Event_Speaker__c/" + speaker.Id + "/" + fnd.Id + "_" + speaker.Photo__c;
                    }
                }
            }
        }

        let assetId = _.pluck(records, 'Asset__c');
        assetId = _.compact(assetId);
        let assetIds = "";

        if (assetId.length > 0) {
            for (let i = 0; i < assetId.length; i++) {
                if (i < assetId.length - 1) {
                    assetIds += "'" + assetId[i] + "',";
                } else {
                    assetIds += "'" + assetId[i] + "'";
                }
            }

            query = util.format("Select Id, Name, Location__c, Third_Party_URL__c, Start_Date__c, Description__c, Media_Type__c from Content__c"
                + " where Id in (%s) and Status__c = 'Active'", assetIds);

            presentations = await this.con.query(query);
        } else {
            presentations = null;
        }

        const obj: any = {
            speakers: speakers,
            eventSpeakerSessionTracks: records,
            files: files,
            presentations: presentations
        };

        return obj;
    }

    getExamPrepProviders = () => {
        const query = "select Id, Name, EPP_Contact_Phone__c, EPP_Location_Description__c, EPP_Logo__c, EPP_Overview__c, EPP_Registration_Status__c, EPP_Website__c,"
            + " EPP_ERP__c, EPP_FBR__c, EPP_FRM__c, EPP_ICBRR__c, EPP_Location__c, EPP_Regions__c from Account where Exam_Prep_Provider__c = True and EPP_Registration_Status__c = 'Approved'";
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getExamPrepProviderContacts = () => {
        const query = "Select Id, AccountID, Name, Email from Contact where id in (Select ContactID from AccountContactRole where Role = 'EPP Contact')";
        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getICBRRActiveRegistrations = () => {
        const query = "select Id, Name, CreatedDate, ICBRR_Submission_Status__c, ICBRR_Authorization_Status__c, Member__r.MailingStreet,"
            + " Member__r.MailingCity, Member__r.MailingState, Member__r.MailingPostalCode, Member__r.MailingCountry, Member__r.Company__c,"
            + " Opportunity__r.Account.BillingStreet, Opportunity__r.Account.BillingCity, Opportunity__r.Account.BillingState, Opportunity__r.Account.BillingPostalCode,"
            + " Opportunity__r.Account.BillingCountry, Opportunity__r.ChargentSFA__Billing_Address__c, Opportunity__r.ChargentSFA__Billing_City__c,"
            + " Opportunity__r.ChargentSFA__Billing_State__c, Opportunity__r.ChargentSFA__Billing_Zip__c, Opportunity__r.ChargentSFA__Billing_Country__c,"
            + " Opportunity__r.ChargentSFA__Billing_Phone__c, Opportunity__r.Shipping_Street__c, Opportunity__r.Shipping_City__c, Opportunity__r.Shipping_State__c,"
            + " Opportunity__r.Shipping_Postal_Code__c, Opportunity__r.Shipping_Country__c, Opportunity__r.Shipping_Phone_No__c, Member__r.Suffix__c,"
            + " Member__r.Salutation, Member__r.FirstName, Member__r.LastName, Member__r.Phone, Member__r.OtherPhone, Member__r.HomePhone, Member__r.Email, Garp_Id__c,"
            + " ClientAuthorizationID__c, Candidate_Commitment__r.StartDate, Candidate_Commitment__r.Enddate, Member__c from Exam_Attempt__c where Section__c = 'ICBRR'"
            + " and Contract_Status__c like 'Activ%' and Score__c = NULL and Cancelled__c = False and (ICBRR_Submission_Status__c = null OR ICBRR_Submission_Status__c ="
            + " 'Retry Submission' OR ICBRR_Submission_Status__c = 'Ready for Pickup' OR ICBRR_Submission_Status__c = 'Failure to Pick Up')";
        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getCCInternships = async () => {
        let query = util.format("select Name, Program__c, RecordTypeId, RecordType.Name FROM Job__c WHERE Status__c = 'Active'");
        const records: any = await this.con.query(query);
        let RecordTypeIdForInters: any = [];

        for (let i = records.length - 1; i >= 0; i--) {
            if (records[i].RecordType.Name === 'Intern Jobs') {
                RecordTypeIdForInters = records[i].RecordTypeId;
            }
        }

        query = util.format("select Name, Program__c, RecordTypeId, RecordType.Name, Internship_Length__c, Internship_Length_Units__c,"
            + " Applicant_Education_Level__c, Applicant_Academic_Year__c, Description__c, Status__c, Company__c, Industry__c, City__c, State__c, Postal_Code__c,"
            + " Country__c, Published_Date__c, Link__c FROM Job__c WHERE Status__c = 'Active' and RecordTypeId = '%s'", RecordTypeIdForInters);

        const res = await this.con.query(query);
        return res;
    }

    getHighlightedJobs = async () => {
        let query = util.format("select Name, Program__c, RecordTypeId, RecordType.Name FROM Job__c WHERE Status__c = 'Active'");
        const records: any = await this.con.query(query);
        let RecordTypeIdForInters: any = [];

        for (let i = records.length - 1; i >= 0; i--) {
            if (records[i].RecordType.Name === 'OneWire Jobs') {
                RecordTypeIdForInters = records[i].RecordTypeId;
            }
        }

        query = util.format("select Name, Program__c, RecordTypeId, RecordType.Name, Internship_Length__c, Internship_Length_Units__c,"
            + " Applicant_Education_Level__c, Applicant_Academic_Year__c, Description__c, Status__c, Company__c, Industry__c, City__c, State__c,"
            + " Postal_Code__c, Country__c, Published_Date__c, Link__c FROM Job__c WHERE Status__c = 'Active' and RecordTypeId = '%s'"
            + " and Display_Sort_Order__c != null LIMIT 6", RecordTypeIdForInters);

        const res = await this.con.query(query);
        return res;
    }

    getICBRRcdd = () => {
        const query = "Select ClientCandidateId__c, FirstName__c, LastName__c, MiddleName__c, Suffix__c, Salutation__c, Email__c,"
            + " LastUpdate__c, Address1__c, Address2__c, City__c, State__c, PostalCode__c, Country__c, Phone__c, Fax__c, FaxCountryCode__c,"
            + " PhoneCountryCode__c, CompanyName__c from Ready_for_Icbrr_Export__c where Active__c = true and Submission_Status__c <> 'Successfully Picked Up'";

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getSFDCRiskArticlesByViewCount = (category: any) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, View_Count__c, Trend__c, RecordTypeId, Record_Type_Name__c,"
            + " Description__c, SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c,"
            + " Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Subcategory__c, Category__c,"
            + " Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c from Content__c"
            + " where Status__c = 'Active' and Is_advertisement__c != true and Category__c = '%s' and View_Count__c != null order by View_Count__c DESC Limit 20", category);

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getRiskArticlesByShareCount = (category: any) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, View_Count__c, Trend__c, Share_Count__c, RecordTypeId,"
            + " Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,"
            + " Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c,"
            + " Event_Start_Date_Time__c, Subcategory__c, Category__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c,"
            + " Visibility_Membership__c, Location__c, Vanity_URL__c from Content__c where Status__c = 'Active' and Is_advertisement__c != true and Category__c = '%s' and"
            + " Share_Count__c != null order by Share_Count__c DESC Limit 20", category);

        // console.log("Query: " + query);
        return this.con.query(query);
    }

    getSFDCRiskTrendingArticles = (category: any) => {
        const getWeek = (date: any) => {
            const onejan: any = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        };
        const weekNum = getWeek(new Date());
        let bucket = 2;
        const bucketCnt = 0;
        const viewCnt = 0;
        let query: any;
        if (weekNum % 2 === 0) {
            bucket = 1;
        }
        if (bucket === 1) {
            query = util.format("select Id, Media_Type__c, Featured_Order__c, Name, Content_Name__c, View_Count__c, Trend__c, Bucket1__c, RecordTypeId,"
                + " Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Featured__c,"
                + " Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c,"
                + " Subcategory__c, Category__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c,"
                + " Location__c, Vanity_URL__c from Content__c where Status__c = 'Active' and Is_advertisement__c != true and Category__c = '%s' and Bucket1__c != null"
                + " order by Bucket1__c DESC Limit 20", category);
        } else {
            query = util.format("select Id, Media_Type__c, Featured_Order__c, Name, Content_Name__c, View_Count__c, Trend__c, Bucket2__c, RecordTypeId,"
                + " Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Featured__c,"
                + " Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Subcategory__c,"
                + " Category__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c"
                + " from Content__c where Status__c = 'Active' and Is_advertisement__c != true and Category__c = '%s' and Bucket2__c != null order by Bucket2__c DESC Limit 20", category);
        }

        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getSFDCRiskFeaturedArticles = () => {

        const query = "select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c,"
            + " Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Subcategory__c, Category__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = 'Active' "
            + "and Is_advertisement__c != true and Featured_Order__c != null order by Featured_Order__c ASC limit 12";

        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getOndemandWebcasts = () => {

        const query = [
            "SELECT Id, Featured_Order__c, Name, Content_Name__c, Event_Start_Date_Time__c, Event_End_Date_Time__c,",
            " Record_Type_Name__c, Description__c, Image__c, Published_Date__c, Story__c, Visibility_Membership__c, Vanity_URL__c, Category__c, Subcategory__c,",
            "(SELECT Id, Content__c FROM Webcasts__r)",
            "FROM Content__c",
            "WHERE Status__c = \'Active\' AND Event_Start_Date_Time__c <= TODAY AND",
            "Id IN (SELECT Content__c FROM Webcast__c)"
        ].join(" ");

        return this.con.query(query);
    }

    getUpcomingWebcasts = () => {
        const query = [
            "SELECT Id, Featured_Order__c, Name, Content_Name__c, Event_Start_Date_Time__c, Event_End_Date_Time__c,",
            " Record_Type_Name__c, Description__c, Image__c, Published_Date__c, Story__c, Visibility_Membership__c, Vanity_URL__c, Category__c, Subcategory__c,",
            "(SELECT Id, Content__c FROM Webcasts__r)",
            "FROM Content__c",
            "WHERE Status__c = \'Active\' AND Event_Start_Date_Time__c >= TODAY AND",
            "Id IN (SELECT Content__c FROM Webcast__c)"
        ].join(" ");

        return this.con.query(query);
    }
    getSFDCBoardofTrustees = () => {

        const query = ["select Id, Name, GARP_Member_ID__c, KPI_GARP_Board_Member__c, Risk_Manager_of_the_Year_Bio__c, Image_Risk_Manager_of_the_Year__c,",
            " Board_Title__c, Qualifications_Board_Member__c from Contact where KPI_GARP_Board_Member__c = true"].join(" ");
        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getSFDCRiskManagerOfTheYear = () => {

        const query = "select Id, Name, Risk_Manager_of_the_Year_Bio__c, Year_For_Risk_Manager_of_the_Year__c, Image_Risk_Manager_of_the_Year__c,"
        + " Qualifications_Risk_Manager_of_the_Year__c from Contact where Risk_Manager_of_the_Year__c != false";
        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getSFDCTestimonial = async (examType: any) => {
        let query;
        let testimonials;
        let testimonialIDs;

        if (examType === 'erp') {
            query = util.format("select Id, Name, City__c, Contact__c, Vanity_URL__c, ERP_Certified__c, ERP_Order__c, Country__c, Current_Job__c,"
            + " External_Video_URL__c, FRM_Summary__c, Member_Photo__c, Member_Summary__c, ERP_Summary__c, Publish_Date__c from Testimonial__c where ERP_Certified__c = true");
        } else if (examType === 'frm') {
            query = util.format("select Id, Name, City__c, Contact__c, Vanity_URL__c, FRM_Certified__c, FRM_Order__c, Country__c, Current_Job__c,"
            + " External_Video_URL__c, FRM_Summary__c, Member_Photo__c, Member_Summary__c, ERP_Summary__c, Publish_Date__c from Testimonial__c where FRM_Certified__c = true");
        } else {
            query = util.format("select Id, Name, City__c, Contact__c, Vanity_URL__c, Member__c, Country__c, Current_Job__c, External_Video_URL__c,"
            + " FRM_Summary__c, Member_Photo__c, Member_Summary__c, Member_since__c, ERP_Summary__c, Publish_Date__c from Testimonial__c where Member__c = true");
        }
        // console.log("Query: " + query);
        const res = await this.con.query(query);
        // console.dir(res);
        if (res.totalSize === 0) {
            return { testimonials: [] };
        }
        testimonials = res;
        testimonialIDs = '';
        for (let i = 0; i < res.totalSize; i++) {
            if (i < res.totalSize - 1) {
                testimonialIDs += "'" + res.records[i].Id + "',";
            } else {
                testimonialIDs += "'" + res.records[i].Id + "'";
            }
        }

        if (examType === 'erp') {
            query = util.format("select Id, Name, Question__c, Answer__c, Testimonial__c from TestimonialQandA__c where Testimonial__r.erp_Certified__c = true order by Name");
        } else if (examType === 'frm') {
            query = util.format("select Id, Name, Question__c, Answer__c, Testimonial__c from TestimonialQandA__c where Testimonial__r.frm_Certified__c = true order by Name");
        } else {
            query = util.format("select Id, Name, Question__c, Answer__c, Testimonial__c from TestimonialQandA__c where Testimonial__r.Member__c = true order by Name");
        }

        const res1 = await this.con.query(query);
        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", testimonialIDs);

        const res2 = await this.con.query(query);
        for (let i = 0; i < testimonials.totalSize; i++) {
            const testimonial = testimonials.records[i];

            if (utils.defined(testimonial, "Member_Photo__c")) {
                if (testimonial.Member_Photo__c.toLowerCase().indexOf('http') === -1) {
                    const fnd: any = _.findWhere(res2.records, { cdrive__contextID__c: testimonial.Id, cdrive__File_Name__c: testimonial.Member_Photo__c });
                    if (fnd != null) {
                        testimonial.Member_Photo__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Testimonial__c/"
                        + testimonial.Id + "/" + fnd.Id + "_" + testimonial.Member_Photo__c;
                    }
                }
            }
        }

        return {
            testimonials: testimonials,
            testimonialsQandA: res1,
            files: res2
        };
    }

    getSFDCfaq = async (category: any) => {
        let query = util.format("select Id, Name, FAQ_Category__c from FAQ_Category__c where Name='%s'", category);
        // console.log("Query: " + query);
        const res = await this.con.query(query);
        // console.dir(res);
        if (res.totalSize === 0) {
            return { FAQCategory: [] };
        }

        const FAQCategory = res;
        let FAQCategoryIDs = "";
        for (let i = 0; i < res.totalSize; i++) {
            if (i < res.totalSize - 1) {
                FAQCategoryIDs += "'" + res.records[i].Id + "',";
            } else {
                FAQCategoryIDs += "'" + res.records[i].Id + "'";
            }
        }

        // console.log("FAQCategory: " + FAQCategory);
        query = util.format("select Id, Name, FAQ_Category__c, Section_Order_Number__c, FAQ_Category__r.name from FAQ_section__c"
            + " where FAQ_Category__r.name='%s' order by Section_Order_Number__c", category);

        const res1 = await this.con.query(query);
        query = util.format("select Id, Name, FAQ_Category__c, FAQ_section__c, Subsection_Order_Number__c, FAQ_Category__r.name,"
            + " Related_Section_Order_Number__c from FAQ_subsection__c where FAQ_Category__r.name='%s' order by Subsection_Order_Number__c", category);

        const res2 = await this.con.query(query);
        query = util.format("select Id, Name, FAQ_Category__r.name, FAQ_Rank__c, FAQ_Question__c, FAQ_Answer__c, FAQ_section__r.name,"
            + " FAQ_subsection__r.name, Related_Subsection__c, LastModifiedDate from Frequently_Asked_Questions__c where FAQ_Category__r.name='%s'"
            + " order by Related_Subsection__c", category);

        const res3 = await this.con.query(query);
        return {
            FAQCategory: FAQCategory,
            FAQSection: res1,
            FAQSubSection: res2,
            FAQ: res3,
        };
    }
    getSFDCfaqById = async (id: any) => {

        let query = util.format("select Id, Name, FAQ_Category__c from FAQ_Category__c where Id='%s'", id);
        const res = await this.con.query(query);
        if (res.totalSize === 0) {
            return { FAQCategory: [] };
        }
        const FAQCategory = res;
        let FAQCategoryIDs = "";
        for (let i = 0; i < res.totalSize; i++) {
            if (i < res.totalSize - 1) {
                FAQCategoryIDs += "'" + res.records[i].Id + "',";
            } else {
                FAQCategoryIDs += "'" + res.records[i].Id + "'";
            }
        }
        // console.log("FAQCategory: " + FAQCategory);
        query = util.format("select Id, Name, FAQ_Category__c, Section_Order_Number__c, FAQ_Category__r.name from FAQ_section__c"
            + " where FAQ_Category__r.Id='%s' order by Section_Order_Number__c", id);

        const res1 = await this.con.query(query);
        query = util.format("select Id, Name, FAQ_Category__c, FAQ_section__c, Subsection_Order_Number__c, FAQ_Category__r.name,"
            + " Related_Section_Order_Number__c from FAQ_subsection__c where FAQ_Category__r.Id='%s' order by Subsection_Order_Number__c", id);
        const res2 = await this.con.query(query);
        query = util.format("select Id, Name, FAQ_Category__r.name, FAQ_Rank__c, FAQ_Question__c, FAQ_Answer__c, FAQ_section__r.name,"
            + " FAQ_subsection__r.name, Related_Subsection__c, LastModifiedDate from Frequently_Asked_Questions__c where FAQ_Category__r.Id='%s' order by Related_Subsection__c", id);

        const res3 = await this.con.query(query);
        return {
            FAQCategory: FAQCategory,
            FAQSection: res1,
            FAQSubSection: res2,
            FAQ: res3,
        };
    }

    getSFDCRiskArticlesByCategory = (category: any, numberofarticles: any, offset: any) => {

        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Subcategory__c, Category__c, Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c,"
            + " End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c,"
            + " Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c, Media_Type__c from Content__c where Status__c = 'Active' and"
            + " Is_advertisement__c != true and Featured_Order__c = null and Category__c = '%s' order by Published_Date__c DESC limit %s offset %s",
        category, numberofarticles, offset);

        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getSFDCQuantCorner = (numberofarticles: any, offset: any) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Subcategory__c, Category__c, Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c from Content__c where Status__c = 'Active' and Is_advertisement__c != true and"
            + " Featured_Order__c = null and Third_Party_Author__c = 'Joe Pimbley' order by Published_Date__c DESC limit %s offset %s", numberofarticles, offset);
        // console.log("Query: " + query);

        return this.con.query(query);
    }
    getSFDCFRMCorner = (numberofarticles: any, offset: any) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Subcategory__c, Category__c, Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c from Content__c where Status__c = 'Active' and Is_advertisement__c != true and"
            + " Featured_Order__c = null and Third_Party_Author__c = 'Marco Folpmers' order by Published_Date__c DESC limit %s offset %s", numberofarticles, offset);

        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getICBRRead = () => {
        const query = "Select FirstName__c, LastName__c, ClientCandidateId__c, AuthorizationTransactionType__c, ExamAuthorizationCount__c, EligibilityApptDateFirst__c,"
            + " ExamSeriesCode__c, EligibilityApptDateLast__c, ClientAuthorizationID__c, LastUpdate__c from Ready_for_Icbrr_Export__c where  Active__c = true"
            + " and Submission_Status__c <> 'Successfully Picked Up'";
        // console.log("Query: " + query);
        return this.con.query(query);
    }
    getExamAlertsByExamSiteId = (id: any) => {
        const query = util.format("Select Id, Exam_Alert__r.CreatedDate, Exam_Alert__c, Exam_Alert__r.Name, Exam_Alert__r.Text__c, Exam_Alert__r.Sound__c, Exam_Site__c,"
            + " Exam_Site__r.Name from Exam_Alert_Site__c where Exam_Site__c = '%s'", id);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                const returnRecords = [];
                if (utils.defined(res, "records")) {
                    for (let i = 0; i < res.records.length; i++) {
                        const rec = res.records[i];
                        // console.dir(rec);
                        const fnd: any = _.findWhere(returnRecords, {
                            id: rec.Exam_Alert__c
                        });
                        // console.log('fnd:' + fnd);
                        if (utils.defined(fnd, '')) {
                            if (!utils.defined(fnd, "sites")) {
                                fnd.sites = [];
                            }
                            const obj = {
                                id: rec.Exam_Site__c,
                                name: rec.Exam_Site__r.Name
                            };
                            fnd.sites.push(obj);
                        } else {
                            const obj = {
                                id: rec.Exam_Alert__c,
                                title: rec.Exam_Alert__r.Name,
                                body: rec.Exam_Alert__r.Text__c,
                                date: rec.Exam_Alert__r.CreatedDate,
                                sound: rec.Exam_Alert__r.Sound__c,
                                sites: [{
                                    id: rec.Exam_Site__c,
                                    name: rec.Exam_Site__r.Name
                                }]
                            };
                            returnRecords.push(obj);
                        }
                        // console.dir(returnRecords);
                    }
                }
                resolve(returnRecords);
            });
        });
    }

    getAllExamAlerts = () => {
        const query = 'Select Id, Exam_Alert__r.CreatedDate, Exam_Alert__c, Exam_Alert__r.Name, Exam_Alert__r.Text__c, Exam_Alert__r.Sound__c, Exam_Site__c,'
            + ' Exam_Site__r.Name from Exam_Alert_Site__c where Exam_Site__r.Exam__r.Exam_Group__r.Active__c = True';
        let fnd: any;
        const returnRecords = [];
        let obj: any;

        return new Promise((resolve, reject) => {
            this.con.query(query, (error: any, res: any) => {
                if (error) {
                    reject(error);
                }
                // logger.log(res);
                if (utils.defined(res, "records")) {
                    for (const rec of res.records) {
                        // console.dir(rec);
                        fnd = _.findWhere(returnRecords, {
                            id: rec.Exam_Alert__c
                        });
                        // console.log('fnd:' + fnd);
                        if (utils.defined(fnd, '')) {
                            if (!utils.defined(fnd, "sites")) {
                                fnd.sites = [];
                            }
                            obj = {
                                id: rec.Exam_Site__c,
                                name: rec.Exam_Site__r.Name
                            };
                            fnd.sites.push(obj);
                        } else {
                            obj = {
                                id: rec.Exam_Alert__c,
                                title: rec.Exam_Alert__r.Name,
                                body: rec.Exam_Alert__r.Text__c,
                                date: rec.Exam_Alert__r.CreatedDate,
                                sound: rec.Exam_Alert__r.Sound__c,
                                sites: [{
                                    id: rec.Exam_Site__c,
                                    name: rec.Exam_Site__r.Name
                                }]
                            };
                            returnRecords.push(obj);
                        }
                        // console.dir(returnRecords);
                    }
                }
                resolve(returnRecords);
            });
        });
    }
    getOppLineItems = (id: any) => {
        const dt = moment('1/1/2015').format("YYYY-MM-DD") + "T00:00:00Z";
        const query = util.format("select Id, Name, Amount, (SELECT Id,Description, PricebookEntryId, Quantity, UnitPrice, SortOrder, TotalPrice FROM"
            + " OpportunityLineItems) from Opportunity where CreatedDate > %s", dt);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                // logger.log(res);
                resolve(res);
            });
        });
    }
    getTransactions = (id: any) => {
        const dt = moment('1/1/2015').format("YYYY-MM-DD") + "T00:00:00Z";
        const query = util.format("select Id, Name, ChargentSFA__Opportunity__c, ChargentSFA__Opportunity__r.Name, ChargentSFA__Amount__c, ChargentSFA__Gateway_Date__c,"
            + " ChargentSFA__Type__c, ChargentSFA__Response_Status__c, ChargentSFA__Payment_Method__c from ChargentSFA__Transaction__c where CreatedDate > %s", dt);
        // console.log(query);
        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                // logger.log(res);
                resolve(res);
            });
        });
    }

    getExamProducts = () => {
        const query = "select Id, Name, Product2.Id, Product2.FRM_Exam__c, Product2.ERP_Exam__c, Product2.Name, Product2.ProductCode, Product2.GL_Code__c,"
            + " Product2.Description, Product2.Image__c, Product2.IsActive, Product2.Weight__c, Product2.FRM_1_Book__c, Product2.FRM_2_Book__c, Product2.ERP_Study_Center__c,"
            + " Product2.FBR_Study_Center__c, Product2.ICBRR_Study_Center__c, pricebook2.IsActive, UnitPrice, UseStandardPrice from PriceBookEntry where Pricebook2.IsActive ="
            + " true and Product2.IsActive = true and pricebook2.IsActive = true and (Product2.ProductCode like '%FRM%' or  Product2.ProductCode like '%ENC%')";
        return this.con.query(query);
    }
    getProducts = () => {
        const query = 'select Id, Name, Product2.Id, Product2.FRM_Exam__c, Product2.ERP_Exam__c, Product2.Name, Product2.ProductCode, Product2.GL_Code__c,'
            + ' Product2.Description, Product2.Image__c, Product2.IsActive, Product2.Weight__c, Product2.FRM_1_Book__c, Product2.FRM_2_Book__c, Product2.ERP_Study_Center__c,'
            + ' Product2.FBR_Study_Center__c, Product2.ICBRR_Study_Center__c, pricebook2.IsActive, UnitPrice, UseStandardPrice from PriceBookEntry where Pricebook2.IsActive ='
            + ' true and Product2.IsActive = true and pricebook2.IsActive = true';
        return this.con.query(query);
    }
    getActiveExamSites = () => {
        const query = 'Select Id, Name, Exam__r.Exam_Group__r.Active__c from Exam_Sites__c where Exam__r.Exam_Group__r.Active__c = True';

        return this.con.query(query);
    }
    sendContactUsEmail = (contactID: any, name: string, email: string, inquiry: any) => {
        const body = {
            contactID: contactID,
            name: name,
            email: email,
            inquiry: inquiry
        };

        return this.con.apex.post("/webserverService/", body);
    }

    getautoQA = (email: string) => {
        const body = { email: email };
        return this.con.apex.post("/autoQAService/", body);
    }

    getSFDCEventAlumni = (email: string) => {
        const query = util.format("select Id, Name, Alumni_Email__c from ConventionAlumni__c where Alumni_Email__c = '%s'", email);
        // console.log("Query: " + query);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                const returnObj: any = {};
                if (res.totalSize > 0) {
                    returnObj.response = true;
                } else {
                    returnObj.response = false;
                }
                resolve(returnObj);
            });
        });
    }

    getAccounts = () => {
        const query = 'SELECT Id, Name FROM Account';
        return this.con.query(query);
    }

    getContentDocAuthor = async (id: any) => {
        let query = util.format("select Id, Name, Biogrophy__c, Email__c, Image__c, Title__c from Author__c where Id = '%s'", id);

        const res = await this.con.query(query);
        if (utils.defined(res, "records.length") &&
        res.records.length > 0 &&
        utils.defined(res.records[0], "Image__c") &&
        res.records[0].Image__c.toLowerCase().indexOf('http') === -1) {

            const rec = res.records[0];
            query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c = '%s'", rec.Id);

            const res2 = await this.con.query(query);
            const fnd: any = _.findWhere(res2.records, { cdrive__contextID__c: rec.Id, cdrive__File_Name__c: rec.Image__c });
            if (fnd != null) {
                rec.Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Author__c/" + rec.Id + "/" + fnd.Id + "_" + rec.Image__c;
            }
            return res;
        } else {
            return res;
        }
    }

    getContentDoc = (id: any) => {
        const query = util.format("Select Id, Webcast__c, (SELECT Id FROM Webcasts__r), (SELECT Id FROM Events__r), (SELECT Id FROM Chapter_Meetings__r), Subcategory__c, Category__c,"
            + " Column__c, Name, View_Count__c, Bucket1__c, Bucket2__c, Primary_Author__c, Book_Author__c, Book_Publisher__c, Book_Title__c, Content_Name__c, RecordTypeId, Record_Type_Name__c,"
            + " Description__c, SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Raw_HTML__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c,"
            + " Visibility_Membership__c, Location__c, Supress_Ads__c, Vanity_URL__c, Hashtag__c, External_ID__c from Content__c where Id = '%s'", id);
        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject (err);
                }
                if (!utils.defined(res, "records")) {
                    resolve(null);
               }
               resolve(res);
            });
        });
    }

    getContentAds = () => {
        const query = util.format("Select Id, Name, Is_advertisement__c, Ad_Format__c, Content_Name__c, Image__c, Third_Party_URL__c, Raw_HTML__c, Story__c,"
            + " Vanity_URL__c, Hashtag__c from Content__c where Is_advertisement__c = True and Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c"
            + " <= Today) and (End_Date__c = NULL OR End_Date__c >= Today) and Ad_Format__c in ('300x250','728x90')");

        return this.con.query(query);
    }

    getCertifiedCandidatesByExam = (exam: any, startDate: any, endDate: any) => {

        let query;
        if (exam.toLowerCase() === 'frm') {
            query = "Select Name, FirstName, LastName, GARP_Member_ID__c, KPI_FRM_Certified__c, KPI_ERP_Certified__c, KPI_FRM_Certified_Date__c, KPI_ERP_Certified_Date__c, \
                KPI_FRM_Resume_Submission_Date__c, KPI_ERP_Resume_Submission_Date__c from Contact \
                where (KPI_FRM_Certified__c = true and KPI_FRM_Resume_Submission_Date__c >= %s and KPI_FRM_Resume_Submission_Date__c <= %s) Order By LastName";

        } else {
            query = "Select Name, FirstName, LastName, GARP_Member_ID__c, KPI_FRM_Certified__c, KPI_ERP_Certified__c, KPI_FRM_Certified_Date__c, KPI_ERP_Certified_Date__c, \
                KPI_FRM_Resume_Submission_Date__c, KPI_ERP_Resume_Submission_Date__c from Contact \
                where (KPI_ERP_Certified__c = true and KPI_ERP_Resume_Submission_Date__c >= %s and KPI_ERP_Resume_Submission_Date__c <= %s) Order By LastName";
        }
        // console.log(queryStr);
        query = util.format(query, startDate, endDate);

        return this.con.query(query);
    }

    getPassedCandidatesByExam = (exam: any, examDate: any) => {

        let query;
        if (exam.toLowerCase() === 'erp1') {
            query = "Select Id, Member_Full_Name__c, Member_First_Name__c, Member_Last_Name__c  from Exam_Attempt__c where (Exam_Date__c = %s and Result__c ="
            + " 'Pass' and Section__c='ERP Exam Part I') Order By Member_Last_Name__c ASC";
        } else if (exam.toLowerCase() === 'erp2') {
            query = "Select Id, Member_Full_Name__c, Member_First_Name__c, Member_Last_Name__c  from Exam_Attempt__c where (Exam_Date__c = %s and Result__c ="
            + " 'Pass' and Section__c='ERP Exam Part II') Order By Member_Last_Name__c ASC";
        } else if (exam.toLowerCase() === 'frm1') {
            query = "Select Id, Member_Full_Name__c, Member_First_Name__c, Member_Last_Name__c  from Exam_Attempt__c where (Exam_Date__c = %s and Result__c ="
            + " 'Pass' and Section__c='FRM Part 1') Order By Member_Last_Name__c ASC";
        } else if (exam.toLowerCase() === 'frm2') {
            query = "Select Id, Member_Full_Name__c, Member_First_Name__c, Member_Last_Name__c  from Exam_Attempt__c where (Exam_Date__c = %s and Result__c ="
            + " 'Pass' and Section__c='FRM Part 2') Order By Member_Last_Name__c ASC";
        }
        // console.log(query);
        query = util.format(query, examDate);
        console.log('query:' + query);
        return new Promise((resolve, reject) => {
            const records: any = [];
            this.con.query(query)
                .on("record", (record: any) => {
                    records.push(record);
                })
                .on("end", function() {
                    // console.log("total in database : " + query.totalSize);
                    // console.log("total fetched : " + query.totalFetched);
                    const obj = {
                        records: records
                    };
                    resolve(obj);
                })
                .on("error", (err: any) => {
                    console.error(err);
                    reject(err);
                })
                .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();
        });
    }

    getCertifiedCandidates = (startDate: any, endDate: any) => {
        let query =
            "Select Name, FirstName, LastName, GARP_Member_ID__c, KPI_FRM_Certified__c, KPI_ERP_Certified__c, KPI_FRM_Certified_Date__c, KPI_ERP_Certified_Date__c, \
            KPI_FRM_Resume_Submission_Date__c, KPI_ERP_Resume_Submission_Date__c from Contact \
            where (KPI_FRM_Certified__c = true and KPI_FRM_Certified_Date__c >= %s and KPI_FRM_Certified_Date__c <= %s) \
            or (KPI_ERP_Certified__c = true and KPI_ERP_Certified_Date__c >= %s and KPI_ERP_Certified_Date__c <= %s) Order By LastName";

        query = util.format(query, startDate, endDate, startDate, endDate);
        return this.con.query(query);
    }

    getSFDCColumns = (numberofarticles: any, offset: any) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Subcategory__c, Category__c, Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c,"
            + " Visibility_FRM__c, Visibility_Membership__c, Location__c, Column__c from Content__c where Status__c ="
            + " 'Active' and Is_advertisement__c != true and Column__c != NULL order by Published_Date__c DESC limit %s offset %s", numberofarticles, offset);
        return this.con.query(query);
    }

    getSFDCRiskArticlesByColumn = (column: any, numberofarticles: any, offset: any ) => {
        const query = util.format("select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c,"
            + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c, Subcategory__c, Category__c, Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Column__c from Content__c where Status__c = 'Active' and Is_advertisement__c"
            + " != true and Column__c = '%s' order by Published_Date__c DESC limit %s offset %s", column, numberofarticles, offset);
        return this.con.query(query);
    }

    getRecordTypes = () => {
        const query = "select Id, sobjectType, Name, DeveloperName from RecordType where sobjectType = 'Content__c'";
        return this.con.query(query);
    }
    getContentRecords = (folder: any, contentTypes: any, topics: any, recordTypes: any, limit: any, offset: any) => {
        const type = 'news';
        const folderId = riskFolderId;
        // console.log('***:' + folder + ':' + contentTypes + ':' + topics + ':' + recordTypes + ':' + folderId);
        // var recordTypesMap = res.records;
        let allContTypes = false;
        let sContTypes = null;
        let allTopics = false;
        let sTopics = null;
        let allRecordTypes = false;
        let sRecordTypes = null;
        let query: any;

        for (const contentType of contentTypes) {
            if (contentType === 'all') {
                allContTypes = true;
            } else {
                if (sContTypes === null) {
                    sContTypes = '\'' + contentType + '\'';
                } else {
                    sContTypes = sContTypes + ',\'' + contentType + '\'';
                }
            }
        }

        for (const topic of topics) {
            if (topic === 'all') {
                allTopics = true;
            } else {
                if (sTopics === null) {
                    sTopics = '\'' + topic + '\'';
                } else {
                    sTopics = sTopics + ',\'' + topic + '\'';
                }
            }
        }

        for (const recordType of recordTypes) {
            if (recordType === 'all') {
                allRecordTypes = true;
            } else {
                if (sRecordTypes === null) {
                    sRecordTypes = '\'' + recordType + '\'';
                } else {
                    sRecordTypes = sRecordTypes + ',\'' + recordType + '\'';
                }
            }
        }

        if (allTopics && allRecordTypes && contentTypes.length === 1 && contentTypes[0] === 'News') {
            query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c,"
                + " Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c,"
                + " Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c,"
                + " Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c"
                + " <= Today) and (End_Date__c = NULL OR End_Date__c >= Today) and Is_advertisement__c != true and Content_Type__c in (%s) order by Published_Date__c DESC limit %s offset %s",
                sContTypes,
                limit,
                offset);
        } else {
            if (allTopics && !allContTypes && !allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
                    + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
                    + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c,"
                    + " Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today)"
                    + " and (End_Date__c = NULL OR End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\')"
                    + " and Content_Type__c in (%s) and RecordTypeId in (%s) order by Published_Date__c DESC limit %s offset %s",
                    folderId,
                    sContTypes,
                    sRecordTypes,
                    limit,
                    offset);
            } else if (!allTopics && allContTypes && !allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
                    + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
                    + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c,"
                    + " Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today)"
                    + " and (End_Date__c = NULL OR End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\')"
                    + " and RecordTypeId in (%s) and Topic__c includes (%s) order by Published_Date__c DESC limit %s offset %s",
                    folderId,
                    sRecordTypes,
                    sTopics,
                    limit,
                    offset);
            } else if (!allTopics && !allContTypes && allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
                    + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
                    + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c,"
                    + " Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL OR"
                    + " End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\') and Content_Type__c in (%s)"
                    + " and Topic__c includes (%s) order by Published_Date__c DESC limit %s offset %s",
                    folderId,
                    sContTypes,
                    sTopics,
                    limit,
                    offset);
            } else if (allTopics && allContTypes && !allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
                    + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
                    + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c,"
                    + " Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL"
                    + " OR End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\') and RecordTypeId in (%s)"
                    + " order by Published_Date__c DESC limit %s offset %s", folderId, sRecordTypes, limit, offset);
            } else if (!allTopics && allContTypes && allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
                    + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
                    + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c,"
                    + " Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL"
                    + " OR End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\') and Topic__c includes (%s)"
                    + " order by Published_Date__c DESC limit %s offset %s", folderId, sTopics, limit, offset);
            } else if (allTopics && !allContTypes && allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c, Third_Party_Author__c,"
                    + " Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c,"
                    + " Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c,"
                    + " Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\'"
                    + " and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL OR End_Date__c >= Today) and Is_advertisement__c != true and Id in (select Content__c"
                    + " from Content_Folders__c where Folder__c = \'%s\') and Content_Type__c in (%s) order by Published_Date__c DESC limit %s offset %s", folderId, sContTypes, limit, offset);
            } else if (!allTopics && !allContTypes && !allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c, Third_Party_Author__c,"
                    + " Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c,"
                    + " Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c,"
                    + " Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL OR End_Date__c >= Today)"
                    + " and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\') and Content_Type__c in (%s) and RecordTypeId in (%s)"
                    + " and Topic__c includes (%s) order by Published_Date__c DESC limit %s offset %s", folderId, sContTypes, sRecordTypes, sTopics, limit, offset);
            } else if (allTopics && allContTypes && allRecordTypes) {
                query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c, Third_Party_Author__c,"
                    + " Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c,"
                    + " Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c,"
                    + " Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and (Start_Date__c = NULL OR Start_Date__c <= Today) and (End_Date__c = NULL OR End_Date__c >= Today)"
                    + " and Is_advertisement__c != true and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\') order by Published_Date__c DESC limit %s offset %s",
                folderId, limit, offset);
            }
        }

        return this.con.query(query);
    }
    getContentRecordsByCategory = (category: any, limit: any, offset: any) => {
        const folderId = riskFolderId;
        const query = util.format("Select Id, Name, Subcategory__c, Category__c, Media_Type__c, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c,"
            + " SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and"
            + " Is_advertisement__c != true and Category__c = \'%s\' and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\')"
            + "   order by Published_Date__c DESC limit %s offset %s", category, folderId, limit, offset);
        console.log('sharath; ' + query);
        return this.con.query(query);
    }
    getMemberOrLeadByEmail = async (email: string) => {
        let query = util.format("Select Id, Name from Contact where Email = '%s'", email);

        let response = await this.con.query(query);
        if (response.records.length === 0) {
            query = util.format("Select Id, Name from Lead where Email = '%s'", email);
            response = await this.con.query(query);
        }
        if (response.records.length === 0) {
            // console.log("Neither Lead, Nor Contact exist.");
            response = await this.con.sobject("Lead").create({
                LastName: 'My Account #1',
                Company: 'CompanyName'
            });
        } else {
            return response;
        }
    }
    getContentRecordsBySubcategory = (subcategory: any, limit: any, offset: any) => {
        const folderId = riskFolderId;
        const query = util.format("Select Id, Name, Subcategory__c, Category__c, Media_Type__c, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c,"
            + " SKU__c, Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c,"
            + " Start_Date__c, End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c,"
            + " Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\'"
            + " and Is_advertisement__c != true and subcategory__c = \'%s\' and Id in (select Content__c from Content_Folders__c where Folder__c = \'%s\')   order by"
            + " Published_Date__c DESC limit %s offset %s", subcategory, folderId, limit, offset);
        return this.con.query(query);
    }
    getSFDCFeaturedContent = (type: any) => {
        const query = "select Id, Featured_Order__c, Name, Content_Name__c, RecordTypeId, Record_Type_Name__c, Description__c, SKU__c, Is_advertisement__c, Image__c,"
            + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c, Third_Party_URL__c,"
            + " Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c, Visibility_FRM__c, Visibility_Membership__c,"
            + " Location__c, Vanity_URL__c, Hashtag__c, Category__c, Subcategory__c from Content__c where Status__c = 'Active' and Is_advertisement__c"
            + " != true and Featured_Order__c != null order by Featured_Order__c ASC limit 3";
        return this.con.query(query);
    }
    getWebCasts = () => {

        const query = [
            "SELECT Id, Featured_Order__c, Name, Content_Name__c, Event_Start_Date_Time__c, Event_End_Date_Time__c, Record_Type_Name__c, Description__c, Image__c,"
            + " Published_Date__c, Story__c, Visibility_Membership__c, Vanity_URL__c, Category__c, Subcategory__c,",
            "(SELECT Id, Content__c FROM Webcasts__r)",
            "FROM Content__c",
            "WHERE Status__c = \'Active\' AND",
            "Id IN (SELECT Content__c FROM Webcast__c)"
        ].join(" ");

        return this.con.query(query);
    }

    getContent = (id: any) => {
        const query = util.format("select Id, Name, Description__c, Start_Date__c, End_Date__c, from Content__c where Status__c = 'Active' and Id = '%s'", id);
        return this.con.query(query);
    }
    getCPDActivities = () => {
        const query = "select Id, Name, Featured_Order__c, Featured__c, Title__c, Status__c, Start_Date__c, End_Date__c, Description__c, CPE_Activity_Type__c,"
            + " Activity_Type_Description__c, Area_of_Study__c, Credit__c, Date_Description__c, Organization__c, Provider__c, Account__c, Account__r.CPE_Provider_Logo__c,"
            + " Account__r.Description, Publication__c, URL__c from CPE_Activity__c where Status__c = 'Active' and Featured__c = True Limit 10";
        // console.log(query);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                const returnData = [];
                for (let i = 0; i < res.records.length; i++) {
                    const rec = res.records[i];
                    const nowDateTime = moment().unix();
                    if (utils.defined(rec, "Start_Date__c")) {
                        rec.Start_Date__c = moment(rec.Start_Date__c).unix();
                    }
                    if (utils.defined(rec, "End_Date__c")) {
                        rec.End_Date__c = moment(rec.End_Date__c).unix();
                    }

                    let addContent = false;
                    if (!utils.defined(rec, "End_Date__c") && utils.defined(rec, "Start_Date__c") && nowDateTime >= rec.Start_Date__c) {
                        addContent = true;
                    } else if (!utils.defined(rec, "Start_Date__c") && utils.defined(rec, "End_Date__c") && nowDateTime < rec.End_Date__c) {
                        addContent = true;
                    } else if (utils.defined(rec, "Start_Date__c") && utils.defined(rec, "End_Date__c") && nowDateTime >= rec.Start_Date__c && nowDateTime < rec.End_Date__c) {
                        addContent = true;
                    } else if (!utils.defined(rec, "Start_Date__c") && !utils.defined(rec, "End_Date__c")) {
                        addContent = true;
                    }
                    if (addContent) {
                        returnData.push(rec);
                    }
                }
                res.records = returnData;
                resolve(res);
            });
        });
    }
    getAcademicPartners = () => {
        const query = "select Id, Account_Role_Published_Date__c, Account_Role_Status__c, Name, CPE_Provider_Logo__c, Description, Website from Account"
            + " where Academic_Partner__c = true and Account_Role_Status__c = 'Active' order by Account_Role_Published_Date__c DESC";
        // console.log(query);
        return this.con.query(query);
    }

    getCPDProviders = () => {
        const query = "select Id, Name, CPE_Provider_Logo__c, Description, Website from Account where CPD_Provider__c = true";
        // console.log(query);
        return this.con.query(query);
    }

    getVideos = () => {
        const query = "Select Id, Name, Subcategory__c, Category__c, Media_Type__c, Content_Name__c, RecordTypeId, Description__c, SKU__c, External_ID__c,"
            + " Is_advertisement__c, Image__c, Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c,"
            + " End_Date__c, Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c,"
            + " Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c from Content__c where Status__c = \'Active\' and Is_advertisement__c"
            + " != true and Media_Type__c = 'Wistia' order by Published_Date__c DESC";

        return this.con.query(query);
    }
    getVideosByFolder = (folderName: any) => {
        const query = util.format("Select Id, Content__r.Display_Sort_Order__c, Content__r.Id, Content__r.Name, Content__r.Content_Name__c, Content__r.Description__c,"
            + " Content__r.Subcategory__c, Content__r.Category__c, Content__r.SKU__c, Content__r.External_ID__c, Content__r.Image__c, Content__r.Third_Party_Author__c,"
            + " Content__r.Author__r.Name, Content__r.Featured__c, Content__r.Published_Date__c, Content__r.Story__c, Content__r.Duration_in_Minutes__c,"
            + " Content__r.Visibility_ERP__c, Content__r.Visibility_FRM__c, Content__r.Visibility_Membership__c, Content__r.Vanity_URL__c, Content__r.Hashtag__c"
            + " from Content_Folders__c where Folder_Name__c = '%s' and Content__r.Status__c = \'Active\' and Content__r.Is_advertisement__c != true and Content__r.Media_Type__c"
            + " = 'Wistia' order by Content__r.Published_Date__c DESC", folderName);
        console.log('query:' + query);
        return this.con.query(query);
    }
    getVideoCat = (id: any) => {
        const options = {
            hostname: 'api.wistia.com',
            port: 443,
            path: '/v1/projects/' + id + '.json?api_password=e3799e5757e935546bb68ddd768a1323ea4bb830a3019df150642f658e620ec9',
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res: any) => {
                let responseString = '';
                res.on('data', (data: any) => {
                    responseString += data;
                });
                res.on('end', () => {
                    resolve(responseString);
                });
            });
            req.end();
            req.on('error', (error: any) => {
                reject(error);
            });
        });
    }
    getChapterMeetings = () => {
        const today = new Date();
        const query = "select Id, Name, Chapter_Meeting_Name__c, Is_Sponsored__c, Sponsor_Name__c, Sponsor_Information__c, Sponsor_Logo__c, Sponsor_Website__c,"
            + " NonMemberFee__c, Payment_Policy__c, Cancellation_Policy__c, Start__c, End__c, Time_Zone__c, Time_Zone__r.Name, Synopsis__c, Ceremony__c,"
            + " Group_Formation__c, Presentation__c, Chapter__r.Name, Chapter_Meeting_Location__r.Address_Street_1__c, Chapter_Meeting_Location__r.Address_Street_2__c,"
            + " Chapter_Meeting_Location__r.Address_City__c, Chapter_Meeting_Location__r.Address_State_Provence__c, Chapter_Meeting_Location__r.Address_Postal_Code__c,"
            + " Chapter_Meeting_Location__r.Address_Country__c from Chapter_Meeting__c where Start__c >= today and Status__c = 'Active'";
        console.log('query:' + query);

        return this.con.query(query);
    }

    getChapterPresentations = () => {
        const today = new Date();
        const query = "Select Id, Name, Content__r.Id, Content__r.Name, Content__r.Description__c, Content__r.Media_Type__c, \
            Content__r.Third_Party_URL__c, \
            Chapter_Meeting__r.Name, Chapter_Meeting__r.Start__c , Chapter_Meeting__r.Chapter__r.Name, \
            Chapter_Speaker__r.Qualifications__c, Chapter_Speaker__r.Biography__c \
            from Chapter_Meeting_Speaker__c where Content__c != null order by Content__r.Id";
        console.log('query:' + query);

        return new Promise((resolve, reject) => {
            this.con.query(query, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                // console.dir(res.records);
                // Merge duplicate Presentations into a single record; We get duplicate Presentations when there are multiple Authors for a
                // Presentation, since we are driving off the Chapter_Meeting_Speaker__c object
                const speakers = res.records;
                const results = [];
                const firstSpeaker = speakers[0];
                let result: any = {};
                if (utils.defined(firstSpeaker, "Content__r.Name")) {
                    result.Name = firstSpeaker.Content__r.Name;
                }
                if (utils.defined(firstSpeaker, "Content__r.Description__c")) {
                    result.Description = firstSpeaker.Content__r.Description__c;
                }
                if (utils.defined(firstSpeaker, "Content__r.Media_Type__c")) {
                    result.MediaType = firstSpeaker.Content__r.Media_Type__c;
                }
                if (utils.defined(firstSpeaker, "Content__r.Third_Party_URL__c")) {
                    result.Location = firstSpeaker.Content__r.Third_Party_URL__c;
                }
                if (utils.defined(firstSpeaker, "Chapter_Meeting__r.Chapter__r.Name")) {
                    result.Chapter = firstSpeaker.Chapter_Meeting__r.Chapter__r.Name;
                }
                if (utils.defined(firstSpeaker, "Chapter_Meeting__r.Start__c")) {
                    result.StartTime = firstSpeaker.Chapter_Meeting__r.Start__c;
                }
                result.speakers = [];
                const obj: any = {};
                if (utils.defined(firstSpeaker, "Name")) {
                    obj.Name = firstSpeaker.Name;
                }
                if (utils.defined(firstSpeaker, "Chapter_Speaker__r.Biography__c")) {
                    obj.Biography = firstSpeaker.Chapter_Speaker__r.Biography__c;
                }
                if (utils.defined(firstSpeaker, "Chapter_Speaker__r.Qualifications__c")) {
                    obj.Qualifications = firstSpeaker.Chapter_Speaker__r.Qualifications__c;
                }

                result.speakers.push(obj);
                results.push(result);
                for (const currentSpeaker of speakers) {
                    if (result.Name !== currentSpeaker.Content__r.Name) {
                        // Processing a new Presentation
                        result = {};
                        if (utils.defined(currentSpeaker, "Content__r.Name")) {
                            result.Name = currentSpeaker.Content__r.Name;
                        }
                        if (utils.defined(currentSpeaker, "Content__r.Description__c")) {
                            result.Description = currentSpeaker.Content__r.Description__c;
                        }
                        if (utils.defined(currentSpeaker, "Content__r.Media_Type__c")) {
                            result.MediaType = currentSpeaker.Content__r.Media_Type__c;
                        }
                        if (utils.defined(currentSpeaker, "Content__r.Third_Party_URL__c")) {
                            result.Location = currentSpeaker.Content__r.Third_Party_URL__c;
                        }
                        if (utils.defined(currentSpeaker, "Chapter_Meeting__r.Chapter__r.Name")) {
                            result.Chapter = currentSpeaker.Chapter_Meeting__r.Chapter__r.Name;
                        }
                        if (utils.defined(currentSpeaker, "Chapter_Meeting__r.Start__c")) {
                            result.StartTime = currentSpeaker.Chapter_Meeting__r.Start__c;
                        }
                        result.speakers = [];
                        results.push(result);
                    }

                    const speaker: any = {};
                    if (utils.defined(currentSpeaker, "Name")) {
                        speaker.Name = currentSpeaker.Name;
                    }
                    if (utils.defined(currentSpeaker, "Chapter_Speaker__r.Biography__c")) {
                        speaker.Biography = currentSpeaker.Chapter_Speaker__r.Biography__c;
                    }
                    if (utils.defined(currentSpeaker, "Chapter_Speaker__r.Qualifications__c")) {
                        speaker.Qualifications = currentSpeaker.Chapter_Speaker__r.Qualifications__c;
                    }
                    result.speakers.push(speaker);
                }
                resolve(results);
            });
        });
    }
    getChapterMeeting = async (id: any) => {
        let query = util.format("select Id, Name, NonMemberFee__c, Last_Day_of_Registration__c, Payment_Policy__c, Cancellation_Policy__c, Is_Sponsored__c, Sponsor_Name__c,"
            + " Sponsor_Information__c, Sponsor_Logo__c, Sponsor_Website__c, Chapter_Meeting_Name__c, Start__c, End__c, Time_Zone__c, Synopsis__c, Ceremony__c, Group_Formation__c,"
            + " Presentation__c, Chapter__r.Name, Chapter__r.Id, Chapter_Meeting_Location__r.Name, Chapter_Meeting_Location__r.Building_Name__c, Chapter_Meeting_Location__r.Address_Street_1__c,"
            + " Chapter_Meeting_Location__r.Address_Street_2__c, Chapter_Meeting_Location__r.Address_City__c, Chapter_Meeting_Location__r.Address_State_Provence__c,"
            + " Chapter_Meeting_Location__r.Address_Postal_Code__c, Chapter_Meeting_Location__r.Address_Country__c from Chapter_Meeting__c where Status__c = 'Active'"
            + " and Id = '%s'", id);

        const res = await this.con.query(query);
        const retObj: any = {
            chapterMeeting: res,
            chapterSpeakers: null
        };
        // Find speakers related to chapter meetings
        query = util.format("select Id, Name, Chapter_Meeting__c, Chapter_Speaker__r.Name, Chapter_Speaker__r.First_Name__c, Chapter_Speaker__r.Last_Name__c,"
            + " Chapter_Speaker__r.Qualifications__c, Chapter_Speaker__r.Biography__c, Chapter_Speaker__r.Contact__c from Chapter_Meeting_Speaker__c where Chapter_Meeting__c"
            + " = '%s'", id);

        const res2 = await this.con.query(query);
        retObj.chapterSpeakers = res2;
        return retObj;
    }

    getChapters = async () => {
        let query = "select Id, Name, Location__c, Region__c, Type__c from Chapter__c where Status__c = 'Active'";

        const response = await this.con.query(query);
        const chapters = response.records;
        query = "select Id, Chapter__c, Contact__c, Contact__r.Name, Contact__r.Email, Title__c, Chapter_Director_Bio__c, Committee_Member__c,"
            + " Director__c from Chapter_Member__c where Director__c = true or Committee_Member__c = true";

        const res = await this.con.query(query);
        for (const record of res.records) {
            const chap: any = _.findWhere(chapters, {
                Id: record.Chapter__c
            });
            if (utils.defined(chap, '')) {
                if (!utils.defined(chap, "members")) {
                    chap.members = [];
                }
                chap.members.push(record);
            }
        }
        // logger.log(chapters);
        return chapters;
    }

    getChapter = async (id: any) => {
        let query = util.format("select Id, Name, Location__c, Region__c, Type__c from Chapter__c where Status__c = 'Active' and Id = '%s'", id);

        const res = await this.con.query(query);
        const retObj: any = {
            chapter: res,
            chapterMembers: null
        };
        // Find members related to chapter
        query = util.format("select Id, Chapter__c, Contact__c, Contact__r.Name, Contact__r.Email, Title__c, Chapter_Director_Bio__c,"
            + " Committee_Member__c, Director__c from Chapter_Member__c where (Director__c = true or Committee_Member__c = true) and Chapter__c = '%s'", id);
        const members = await this.con.query(query);
        retObj.chapterMembers = members;

        return retObj;
    }
    getQuestionsReadings = (exam: any, year: any) => {

        const query = util.format("select Id, Name, Practice_Exam_Question__c, Study_Guide_Reading__c from Question_Reading__c where Practice_Exam_Question__r.Year__c"
            + " = '%s' and Study_Guide_Reading__r.Area_of_Study__c = '%s'", year, exam);

        return this.con.query(query);
    }

    getStudyTopics = (exam: any, year: any) => {
        const query = util.format("Select Id, Name, Description__c, Week__c, (Select Id, Name, Year__c, Description__c, Is_Online__c, URL__C, Chapter__c, Pages__c, Page_Start__c,"
            + " Page_End__c, Book__c, Study_Guide_Domain__r.Name, Study_Guide_Domain__r.ID__c, Study_Guide_Readings_Group__r.Name, Study_Guide_Readings_Group__r.Description__c,"
            + " Study_Guide_Readings_Group__r.Optional_Readings__c from Study_Guide_Readings__r where Exam_Registrants_Only__c = False) from Study_App_Lesson_Plan__c"
            + " where Exam__c = '%s' and Year__c = '%s' order by Week__c", exam, year);

        return this.con.query(query);
    }

    getContentFolder = async (folderName: any) => {
        let query = util.format("select Content__c, Sort_Number__c, Content__r.Id, Content__r.Name, Content__r.Content_Name__c, Content__r.RecordTypeId, Content__r.Description__c,"
            + " Content__r.SKU__c, Content__r.External_ID__c, Content__r.Google_Tracking_Name__c, Content__r.Category__c, Content__r.Subcategory__c, Content__r.Media_Type__c,"
            + " Content__r.Is_advertisement__c, Content__r.Image__c, Content__r.Third_Party_Author__c, Content__r.Author__r.Name, Content__r.Author__c, Content__r.Book_Author__c,"
            + " Content__r.Book_Publisher__c, Content__r.Book_Title__c, Content__r.Featured__c, Content__r.Featured_Order__c, Content__r.Display_Sort_Order__c, Content__r.Column__c,"
            + " Content__r.Published_Date__c, Content__r.Story__c, Content__r.Third_Party_URL__c, Content__r.Duration_in_Minutes__c, Content__r.Event_Start_Date_Time__c, Content__r.Is_On_Demand__c,"
            + " Content__r.Moderators__c, Content__r.Presenters__c, Content__r.Start_Date__c, Content__r.End_Date__c, Content__r.Visibility_ERP__c, Content__r.Visibility_FRM__c,"
            + " Content__r.Visibility_Membership__c, Content__r.Location__c, Content__r.Vanity_URL__c, Content__r.Hashtag__c, Content__r.Status__c, Content__r.Share_Count__c,"
            + " Content__r.View_Count__c, Content__r.Lead_Gen_URL__c from Content_Folders__c where Folder_Name__c = '%s' and Content__r.Status__c = 'Active'"
            + " and (Content__r.Start_Date__c = NULL OR Content__r.Start_Date__c <= Today) and (Content__r.End_Date__c = NULL OR Content__r.End_Date__c >= Today) order by"
            + " Content__r.Published_Date__c DESC", folderName);

        const contents = await this.con.query(query);
        let contentIDs = "";
        for (let i = 0; i < contents.totalSize; i++) {
            if (i < contents.totalSize - 1) {
                contentIDs += "'" + contents.records[i].Content__c + "',";
            } else {
                contentIDs += "'" + contents.records[i].Content__c + "'";
            }
        }
        if (contentIDs === "") {
            return contents; /// return contents
        }

        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", contentIDs);

        const res1 = await this.con.query(query);
        for (const content of contents.records) {
            if (utils.defined(content, "Content__r.Image__c") &&
            (content.Content__r.Image__c.toLowerCase().indexOf('http') === -1)) {

                const fnd: any = _.findWhere(res1.records, { cdrive__contextID__c: content.Content__r.Id, cdrive__File_Name__c: content.Content__r.Image__c });
                if (fnd != null) {
                    content.Content__r.Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/"
                        + content.Content__r.Id + "/" + fnd.Id + "_" + content.Content__r.Image__c;
                }
            }
        }
        query = util.format("select Product2.Id, Product2.Name, Product2.Coming_Soon__c, Product2.Content__c, Product2.Pre_Order_Date__c, Product2.Inventory__c, UnitPrice,"
            + " Product2.Electronic_Delivery__c, Product2.Weight__c, ProductCode, Product2.GL_Code__c  from PriceBookEntry where Pricebook2.IsActive ="
            + " true and Product2.Content__c in (%s)", contentIDs);

        const res2 = await this.con.query(query);
        // logger.log(res);
        const products = [];
        for (let i = 0; i < res2.records.length; i++) {
            const rec = res2.records[i];
            const obj = {
                id: rec.Product2.Id,
                name: rec.Product2.Name,
                contentId: rec.Product2.Content__c,
                preOrderDate: rec.Product2.Pre_Order_Date__c,
                inventory: rec.Product2.Inventory__c,
                electronicDelivery: rec.Product2.Electronic_Delivery__c,
                weight: rec.Product2.Weight__c,
                productCode: rec.ProductCode,
                glCode: rec.Product2.GL_Code__c,
                unitPrice: rec.UnitPrice,
                comingSoon: rec.Product2.Coming_Soon__c
            };
            products.push(obj);
        }

        for (let i = 0; i < contents.totalSize; i++) {
            const content = contents.records[i];
            const fnd: any = _.findWhere(products, { contentId: content.Content__r.Id });
            if (fnd != null) {
                content.Content__r.product = fnd;
            }
        }
        return contents;
    }

    getStudyProducts = async (mode: any) => {
        let query;
        let subQuery: any;

        query = util.format("select Product2.Id, Product2.Name, Product2.Content__c, Product2.Pre_Order_Date__c, Product2.Inventory__c,"
            + " UnitPrice from PriceBookEntry where Product2.%s_Study_Center__c = true", mode);
        subQuery = util.format("select Content__c from Product2 where %s_Study_Center__c = true", mode);

        const products = await this.con.query(query);
        query = util.format("Select Id, Name, Content_Name__c, RecordTypeId, Description__c, SKU__c, Media_Type__c, Is_advertisement__c, Image__c,"
            + " Third_Party_Author__c, Author__r.Name, Content_Type__c,Featured__c, Published_Date__c, Story__c, Topic__c, Start_Date__c, End_Date__c,"
            + " Third_Party_URL__c, Duration_in_Minutes__c, Event_Start_Date_Time__c, Is_On_Demand__c, Moderators__c, Presenters__c, Visibility_ERP__c,"
            + " Visibility_FRM__c, Visibility_Membership__c, Location__c, Vanity_URL__c, Hashtag__c, Status__c from Content__c where Id in (%s) order by"
            + " Published_Date__c DESC", subQuery);

        const content = await this.con.query(query);
        let contentIDs = "";
        for (let i = 0; i < content.totalSize; i++) {
            if (i < content.totalSize - 1) {
                contentIDs += "'" + content.records[i].Id + "',";
            } else {
                contentIDs += "'" + content.records[i].Id + "'";
            }
        }

        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", contentIDs);
        const files = await this.con.query(query);
        return {
            products: products,
            content: content,
            files: files
        };
    }

    getContentFolderById =  async (id: any) => {
        let contents: any;
        let products: any;
        let relatedContent: any;
        let allContent: any;
        let query = util.format("select Content__c, Sort_Number__c, Content__r.Id, Content__r.Name, Content__r.Content_Name__c, Content__r.RecordTypeId,"
            + " Content__r.Record_Type_Name__c, Content__r.Description__c, Content__r.SKU__c, Content__r.External_ID__c, Content__r.Google_Tracking_Name__c,"
            + " Content__r.Category__c, Content__r.Subcategory__c, Content__r.Media_Type__c, Content__r.Is_advertisement__c, Content__r.Image__c,"
            + " Content__r.Third_Party_Author__c, Content__r.Author__r.Name, Content__r.Author__c, Content__r.Book_Author__c, Content__r.Book_Publisher__c,"
            + " Content__r.Book_Title__c, Content__r.Featured__c, Content__r.Featured_Order__c, Content__r.Display_Sort_Order__c, Content__r.Column__c,"
            + " Content__r.Published_Date__c, Content__r.Story__c, Content__r.Raw_HTML__c, Content__r.Third_Party_URL__c, Content__r.Duration_in_Minutes__c,"
            + " Content__r.Event_Start_Date_Time__c, Content__r.Is_On_Demand__c, Content__r.Moderators__c, Content__r.Presenters__c, Content__r.Start_Date__c,"
            + " Content__r.End_Date__c, Content__r.Visibility_ERP__c, Content__r.Btn1__c, Content__r.Btn1_Link__c, Content__r.Btn2__c, Content__r.Btn2_Link__c,"
            + " Content__r.Visibility_FRM__c, Content__r.Visibility_Membership__c, Content__r.Location__c, Content__r.Vanity_URL__c, Content__r.Hashtag__c,"
            + " Content__r.Status__c, Content__r.Share_Count__c, Content__r.View_Count__c, Content__r.Lead_Gen_URL__c from Content_Folders__c where Folder__c = '%s'"
            + " and Content__r.Status__c = 'Active' and (Content__r.Start_Date__c = NULL OR Content__r.Start_Date__c <= Today) and (Content__r.End_Date__c = NULL OR"
            + " Content__r.End_Date__c >= Today)", id);

        contents = await this.con.query(query);
        let contentIDs = "";
        for (let i = 0; i < contents.totalSize; i++) {
            if (i < contents.totalSize - 1) {
                contentIDs += "'" + contents.records[i].Content__c + "',";
            } else {
                contentIDs += "'" + contents.records[i].Content__c + "'";
            }
        }
        query = util.format("select Id, Name, Content_Source__c, Content_Related__r.Id, Content_Related__r.Name, Content_Related__r.Media_Type__c,"
            + " Content_Related__r.Content_Name__c, Content_Related__r.Description__c, Content_Related__r.Third_Party_URL__c, Content_Related__r.Category__c,"
            + " Content_Related__r.Subcategory__c, Content_Related__r.Image__c, Content_Related__r.Published_Date__c from Related_Content__c where Content_Source__c in (%s)", contentIDs);

        const relatedContentResponse = await this.con.query(query);

        relatedContent = relatedContentResponse.records;
        allContent = contents.records.concat(relatedContent);
        const allContentIDs = "'" + _.map(allContent, (content: any) => {
            if (utils.defined(content, "Content__r.Id")) {
                return content.Content__r.Id;
            } else {
                return content.Content_Related__r.Id;
            }
        }).join("','") + "'";
        query = util.format("select Product2.Id, Product2.Name, Product2.Coming_Soon__c, Product2.Content__c, Product2.Pre_Order_Date__c,"
            + " Product2.Inventory__c, UnitPrice, Product2.Electronic_Delivery__c, Product2.Weight__c, ProductCode, Product2.GL_Code__c  from PriceBookEntry"
            + " where Pricebook2.IsActive = true and Product2.Content__c in (%s)", allContentIDs);

        const res = await this.con.query(query);
        products = _.map(res.records, (product: any) => {
            product.Product2.unitPrice = product.UnitPrice;
            return product.Product2;
        });
        const contentWithCloudImages = _.filter(allContent, (content: any) => {
            return (utils.defined(content, "Content__r.Image__c.toLowerCase") &&
                    content.Content__r.Image__c.toLowerCase().indexOf('http') === -1) ||
                    (utils.defined(content, "Content_Related__r.Image__c.toLowerCase") &&
                    content.Content_Related__r.Image__c.toLowerCase().indexOf('http') === -1);
        });
        const idsOfContentWithCloudImages = "'" + _.map(contentWithCloudImages, (content: any) => {
            if (utils.defined(content, "Content__r.Id")) {
                return content.Content__r.Id;
            } else {
                return content.Content_Related__r.Id;
            }
        }).join("','") + "'";

        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", idsOfContentWithCloudImages);
        const cdriveImagesResponse = await this.con.query(query);

        contents.records = _.map(contents.records, (content: any) => {
            content.Content__r.Sort_Number__c = content.Sort_Number__c;
            content = content.Content__r;
            // Does the content have a product?
            content.product = _.findWhere(products, { Content__c: content.Id }) || null;
            // If there's a cloud image use it, otherwise use what's in the Image__c field already
            let fnd: any = _.findWhere(cdriveImagesResponse.records,
                                    { cdrive__contextID__c: content.Id,
                                    cdrive__File_Name__c: content.Image__c
                                    });
            if (fnd != null) {
                content.Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/" + fnd.cdrive__contextID__c + "/" + fnd.Id + "_" + fnd.cdrive__File_Name__c;
            }
            // Get all the related content and add images where appropriate
            content.relatedContents = _.filter(relatedContent, (item: any) => {
                return item["Content_Source__c"] === content.Id;
            });
            content.relatedContents = _.map(content.relatedContents, (relatedContentObj: any) => {
                relatedContentObj = relatedContentObj.Content_Related__r;
                fnd = _.findWhere(cdriveImagesResponse.records,
                    { cdrive__contextID__c: relatedContentObj.Id,
                        cdrive__File_Name__c: relatedContentObj.Image__c
                    });
                if (fnd != null) {
                    relatedContentObj
                        .Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/" + fnd.cdrive__contextID__c + "/" + fnd.Id + "_" + fnd.cdrive__File_Name__c;
                }
                return relatedContentObj;
            });
            return content;
        });

        return contents;
    }

    getStudyMaterialsFolderById = async (id: any) => {
        let products: any;
        let relatedContent: any;
        let allContent: any;
        const _this = this;
        let query = util.format("select Content__c, Sort_Number__c, Content__r.Id, Content__r.Name, Content__r.Content_Name__c, Content__r.RecordTypeId,"
            + " Content__r.Record_Type_Name__c, Content__r.Description__c, Content__r.SKU__c, Content__r.External_ID__c, Content__r.Google_Tracking_Name__c,"
            + " Content__r.Category__c, Content__r.Subcategory__c, Content__r.Media_Type__c, Content__r.Is_advertisement__c, Content__r.Image__c,"
            + " Content__r.Third_Party_Author__c, Content__r.Author__r.Name, Content__r.Author__c, Content__r.Book_Author__c, Content__r.Book_Publisher__c,"
            + " Content__r.Book_Title__c, Content__r.Featured__c, Content__r.Featured_Order__c, Content__r.Display_Sort_Order__c, Content__r.Column__c,"
            + " Content__r.Published_Date__c, Content__r.Story__c, Content__r.Raw_HTML__c, Content__r.Third_Party_URL__c, Content__r.Duration_in_Minutes__c,"
            + " Content__r.Event_Start_Date_Time__c, Content__r.Is_On_Demand__c, Content__r.Moderators__c, Content__r.Presenters__c, Content__r.Start_Date__c,"
            + " Content__r.End_Date__c, Content__r.Visibility_ERP__c, Content__r.Btn1__c, Content__r.Btn1_Link__c, Content__r.Btn2__c, Content__r.Btn2_Link__c,"
            + " Content__r.Visibility_FRM__c, Content__r.Visibility_Membership__c, Content__r.Location__c, Content__r.Vanity_URL__c, Content__r.Hashtag__c,"
            + " Content__r.Status__c, Content__r.Share_Count__c, Content__r.View_Count__c, Content__r.Lead_Gen_URL__c, Content__r.Lead_Gen_Form_Handler__c"
            + " from Content_Folders__c where Folder__c = '%s' and Content__r.Status__c = 'Active'", id);

        const contents: any = await this.con.query(query);
        let contentIDs = "";
        for (let i = 0; i < contents.totalSize; i++) {
            if (i < contents.totalSize - 1) {
                contentIDs += "'" + contents.records[i].Content__c + "',";
            } else {
                contentIDs += "'" + contents.records[i].Content__c + "'";
            }
        }
        query = util.format("select Id, Name, Content_Source__c, Content_Related__r.Id, Content_Related__r.Name, Content_Related__r.Content_Name__c,"
            + " Content_Related__r.Description__c, Content_Related__r.Third_Party_URL__c, Content_Related__r.Category__c, Content_Related__r.Subcategory__c,"
            + " Content_Related__r.Image__c, Content_Related__r.Published_Date__c, Content_Related__r.Start_Date__c, Content_Related__r.End_Date__c from Related_Content__c"
            + " where Content_Source__c in (%s) and Content_Related__r.Status__c = 'Active' and (Content_Related__r.Start_Date__c = NULL OR Content_Related__r.Start_Date__c"
            + " <= Today) and (Content_Related__r.End_Date__c = NULL OR Content_Related__r.End_Date__c >= Today)", contentIDs);
        const relatedContentResponse = await this.con.query(query);
        relatedContent = relatedContentResponse.records;
        allContent = contents.records.concat(relatedContent);
        const allContentIDs = "'" + _.map(allContent, (content: any) => {
            if (utils.defined(content, "Content__r.Id")) {
                return content.Content__r.Id;
            } else {
                return content.Content_Related__r.Id;
            }
        }).join("','") + "'";
        query = util.format("select Product2.Id, Product2.Name, Product2.Coming_Soon__c, Product2.Content__c, Product2.Pre_Order_Date__c, Product2.Inventory__c,"
            + " UnitPrice, Product2.Electronic_Delivery__c, Product2.Weight__c, ProductCode, Product2.GL_Code__c  from PriceBookEntry where Pricebook2.IsActive"
            + " = true and Product2.Content__c in (%s)", allContentIDs);

        const res = await this.con.query(query);
        products = _.map(res.records, (product: any) => {
            product.Product2.unitPrice = product.UnitPrice;
            return product.Product2;
        });
        const contentWithCloudImages: any = _.filter(allContent, (content: any) => {
            return (utils.defined(content, "Content__r.Image__c.toLowerCase") &&
                    content.Content__r.Image__c.toLowerCase().indexOf('http') === -1) ||
                    (utils.defined(content, "Content_Related__r.Image__c.toLowerCase") &&
                    content.Content_Related__r.Image__c.toLowerCase().indexOf('http') === -1);

        });

        const idsOfContentWithCloudImages = "'" + _.map(contentWithCloudImages, (content: any) => {
            if (utils.defined(content, "Content__r.Id")) {
                return content.Content__r.Id;
            } else {
                return content.Content_Related__r.Id;
            }
        }).join("','") + "'";

        const cdriveImagesQuery = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", idsOfContentWithCloudImages);
        console.log('cdriveImagesQuery:' + cdriveImagesQuery);

        const cdriveImagesResponse = await this.con.query(query);
        contents.records = _.map(contents.records, (content: any) => {
            content.Content__r.Sort_Number__c = content.Sort_Number__c;
            content = content.Content__r;
            // Does the content have a product?
            content.product = _.findWhere(products,
                                            { Content__c: content.Id
                                            }) || null;
            // If there's a cloud image use it, otherwise use what's in the Image__c field already
            let fnd: any = _.findWhere(cdriveImagesResponse.records,
                                    { cdrive__contextID__c: content.Id,
                                    cdrive__File_Name__c: content.Image__c
                                    });
            if (fnd != null) {
                content.Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/" + fnd.cdrive__contextID__c + "/" + fnd.Id + "_" + fnd.cdrive__File_Name__c;
            }
            // Get all the related content and add images where appropriate
            content.relatedContents = _.filter(relatedContent, (item: any) => {
                return item["Content_Source__c"] === content.Id;
            });
            content.relatedContents = _.map(content.relatedContents, (relatedContentObj: any) => {
                relatedContentObj = relatedContentObj.Content_Related__r;
                fnd = _.findWhere(cdriveImagesResponse.records,
                    { cdrive__contextID__c: relatedContentObj.Id,
                        cdrive__File_Name__c: relatedContentObj.Image__c
                    });
                if (fnd != null) {
                    relatedContentObj
                    .Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/" + fnd.cdrive__contextID__c + "/" + fnd.Id + "_" + fnd.cdrive__File_Name__c;
                }
                return relatedContentObj;
            });
            return content;
        });
        return contents;
    }

    getReadings = (exam: any, year: any) => {
        const query = util.format("select Id, Name, Book__c, Chapter__c, Pages__c, Area_of_Study__c, Description__c, ID__c, Is_Online__c, URL__C, Page_Start__c, Page_End__c, Study_Guide_Domain__c,"
            + " Study_Guide_Domain__r.Name, Study_Guide_Domain__r.ID__c, Study_App_Lesson_Plan__c, Study_App_Lesson_Plan__r.Week__c, Study_App_Lesson_Plan__r.Description__c,"
            + " Study_App_Lesson_Plan__r.Exam__c"
            + " from Study_Guide_Readings__c where Year__c = '%s' and Area_of_Study__c = '%s'", year, exam);

        return this.con.query(query);
    }
    getSliderData = async (sliderfoldername: any) => {
        // 1. Fetch all the fields of contents that are in sliderfoldername
        let query = util.format("select Content__r.Slider_Background_Image__c, Content__r.Id, Content__r.Label_Logo_Styling__c, Content__r.Label_Logo__c,"
            + " Content__r.Top_Right_Logo__c, Content__r.Show_Brand_Plus_Bg_Styling__c, Content__r.Btn1_Styling__c, Content__r.Raw_HTML__c, Content__r.Slide_Raw_HTML__c,"
            + " Content__r.Slide_Link__c, Content__r.Btn2_Styling__c, Content__r.Start_Date__c, Content__r.End_Date__c, Content__r.hideSlide__c, Content__r.Slide_Class_Name__c,"
            + " Content__r.Show_Brand_Plus_Bg__c, Content__r.Hashtag__c, Content__r.Label__c, Content__r.Name, Content__r.Btn1__c, Content__r.Btn1_Class__c,"
            + " Content__r.Btn2_Class__c, Content__r.Btn1_Link__c, Content__r.Btn2__c, Content__r.Btn2_Link__c, Content__r.Tagline__c, Content_Folders__c.Sort_Number__c"
            + " from Content_Folders__c where Folder_Name__c = '%s'", sliderfoldername);

        console.log('query:' + query);

        const res = await this.con.query(query);
        if (utils.defined(res, "records") && res.records.length > 0) {
            // Organize all the IDs of slides as a comma separated String, and Fetch the Cloud files.
            let iDsOfSlides = "";
            for (let i = res.records.length - 1; i >= 0; i--) {
                iDsOfSlides = iDsOfSlides + "'" + res.records[i].Content__r.Id + "',";
            }
            iDsOfSlides = iDsOfSlides.substring(0, iDsOfSlides.length - 1);

            query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where cdrive__contextID__c in (%s)", iDsOfSlides);
            const res2 = await this.con.query(query);
            for (let k = res2.records.length - 1; k >= 0; k--) {
                for (let j = res.records.length - 1; j >= 0; j--) {
                    if (res2.records[k].cdrive__contextID__c === res.records[j].Content__r.Id) {
                        if (res2.records[k].cdrive__File_Name__c === res.records[j].Content__r.Slider_Background_Image__c) {
                            res.records[j].Content__r.Slider_Background_Image__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/"
                                + res2.records[k].cdrive__contextID__c + "/" + res2.records[k].Id + "_" + res2.records[k].cdrive__File_Name__c;
                        }
                        if (res2.records[k].cdrive__File_Name__c === res.records[j].Content__r.Top_Right_Logo__c) {
                            res.records[j].Content__r.Top_Right_Logo__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/"
                                + res2.records[k].cdrive__contextID__c + "/" + res2.records[k].Id + "_" + res2.records[k].cdrive__File_Name__c;
                        }
                        if (res2.records[k].cdrive__File_Name__c === res.records[j].Content__r.Label_Logo__c) {
                            res.records[j].Content__r.Label_Logo__c = "https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/"
                                + res2.records[k].cdrive__contextID__c + "/" + res2.records[k].Id + "_" + res2.records[k].cdrive__File_Name__c;
                        }
                    }
                }
            }
            return res;
        } else {
            return res;
        }
    }

    getSlideShowData = async (slideshowid: any) => {
        let query = util.format("select Id, Name, Content_Name__c, Description__c, Vanity_URL__c, Third_Party_URL__c, Third_Party_Author__c, Status__c,"
            + " Published_Date__c, Featured__c, Featured_Order__c, Subcategory__c, Category__c, Slider_Autoplay__c, Slider_Autoplay_Speed__c, Slider_Dots__c,"
            + " Slider_Fade__c, Slider_Infinite__c, Slider_Speed__c from Content__c where id = '%s'", slideshowid);

        const res = await this.con.query(query);
        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c, Sort_Number__c, Image_Caption__c from cdrive__Cloud_Files__c"
            + " where cdrive__contextID__c = '%s'", slideshowid);
        const res1 = await this.con.query(query);
        return {
            slideshowdata: res,
            slides: res1
        };
    }

    getQuestion = (exam: any, year: any) => {
        const query = util.format("select Id, Name, Choices__c, Answer__c, Area_of_Study__c, Question__c, Rationale__c, Study_Guide_Domain__c,"
            + " Study_Guide_Domain__r.Name, Study_Guide_Domain__r.ID__c from Practice_Exam_Questions__c where Year__c = '%s' and Area_of_Study__c = '%s'", year, exam);
        console.log('query:' + query);
        return this.con.query(query);
    }
    getExamSites = () => {
        const query = util.format("select Id, Name from Site__c");
        return this.con.query(query);
    }

    getExamVenues = (examDate: any) => {
        const query = util.format("Select Id, Name, Active__c, Address1__c, Address2__c, Building_Name__c, City__c, State__c, Country__c, Institution_Name__c,"
            + " Zipcode__c, Region__c, Site__r.Exam_Date__c, Site__r.Active__c from Venue__c where Site__r.Exam_Date__c = %s", examDate);

        return this.con.query(query);
    }

    getExamSitesAlerts = () => {
        const query = util.format("Select Id, Exam_Alert__r.Name, Exam_Alert__r.Text__c, Exam_Alert__r.Sound__c, Exam_Site__c, Exam_Site__r.Name,"
            + " Exam_Site__r.Exam__r.Exam_Group__r.Active__c from Exam_Alert_Site__c");
        return this.con.query(query);
    }
    getUserByUsername = (username: string, ) => {
        const query = util.format("select user.id, user.Email, user.ContactId, user.FirstName, user.LastName, user.profile.name, user.Username, user.IsActive,"
            + " user.FullPhotoUrl FROM user, user.profile WHERE IsActive = true and Username = '%s'", username);
        return this.con.query(query);
    }

    getContact = (contactId: any) => {
        const query = util.format("SELECT Id, Name, FirstName, LastName, Email, GARP_Member_ID__c, MailingCity, MailingCountry, MailingPostalCode,"
            + " MailingState, MailingStreet, AccountId, GARP_ID__c, Membership_Type__c, Name_As_it_Appears_On_ID__c, ID_Number__c, ID_Type__c,"
            + " GARP_Directory_Opt_In__c, KPI_Current_Exam_Date__c, KPI_Current_Exam_Location__c, KPI_Current_Exam_Registration__c, KPI_Current_Exam_Registration_Type__c,"
            + " KPI_Current_Exam_Registration_Date__c, KPI_Last_Exam_Date__c, KPI_Last_Exam_Location__c, KPI_Last_Exam_Registration__c, KPI_Last_Exam_Registration_Type__c,"
            + " KPI_ERP_Candidate_Payment_Status__c, KPI_ERP_Program_Start_Date__c, KPI_ERP_Program_Expiration_Date__c, KPI_FRM_Program_Start_Date__c,"
            + " KPI_FRM_Candidate_Payment_Status__c, KPI_FRM_Program_Expiration_Date__c, Mobile_App_Administration__c FROM Contact WHERE Id = '%s'", contactId);

        return this.con.query(query);
    }

    getUser = async (userId: any) => {
        let query = util.format("SELECT Id, Name, Email, ContactId, FullPhotoUrl FROM User WHERE Id = '%s'", userId);
        const res = await this.con.query(query);
        if (!utils.defined(res, "records.length") && res.records.length <= 0) {
            console.log('Error in getUser: ', res);
            return null;
        }
        query = util.format("SELECT   LastModifiedDate, LoginType, NumSecondsValid, SessionType,UsersId FROM AuthSession where"
            + " LoginType = 'Chatter Communities External User' and SessionType = 'ChatterNetworks' and UsersId = '%s'", userId);

        const res1 = await this.con.query(query);
        query = util.format("SELECT Event__c from Event_Registration__c where Contact__c = '%s'", res.records[0].ContactId);
        const res2 = await this.con.query(query);
        query = util.format("SELECT Id, Name, Membership_Type__c from Contact where Id = '%s'", res.records[0].ContactId);
        const res3 = await this.con.query(query);

        return {
            user: res3,
            session: res1,
            eventRegistrations: res2,
            contact: res3
        };
    }

    getUsers = () => {
        return this.con.query('SELECT Id, Name, Email FROM User');
    }


    isNull(inParam: any) {
        if (inParam !== null && typeof inParam !== 'undefined') {
            return inParam;
        } else {
            return '';
        }
    }

    isNullBoolean(inParam: any) {
        if (inParam !== null && typeof inParam !== 'undefined') {
            return inParam;
        } else {
            return false;
        }
    }

    isNullGetArray(inParam: any, delim: any) {
        if (inParam !== null && typeof inParam !== 'undefined' && inParam !== '') {
            // console.log('isNullGetArray:' + inParam);

            if (delim === null || typeof delim === 'undefined') {
                delim = '\n';
            }
            const arr = inParam.split(delim);
            // console.dir(arr);
            return arr;
        } else {
            return [];
        }
    }

    isNullSetArray(inParam: any, delim: any) {
        if (inParam !== null && typeof inParam !== 'undefined' &&
            inParam.length !== null && typeof inParam.length !== 'undefined' &&
            inParam.length > 0) {

            if (delim === null || typeof delim === 'undefined') {
                delim = '\n';
            }

            if (inParam === '') {
                return inParam;
            } else {
                let ret = '';
                for (let i = 0; i < inParam.length; i++) {
                    if (ret === '') {
                        ret = inParam[i];
                    } else {
                        ret = ret + delim + inParam[i];
                    }
                }
                return ret;
            }
        } else {
            return '';
        }
    }

    getMeta = async (userId: any) => {
        const query = util.format("SELECT Id, ReadingId__c, Contact__c, Done__c, Flagged__c, Notes__c from FRM_App_Meta__c WHERE Contact__c = '%s'", userId);
        const res = await this.con.query(query);
        const data: any = {
            metaData: []
        };
        if (res.totalSize > 0) {
            for (let i = 0; i < res.totalSize; i++) {
                const resData: any = res.records[i];
                const obj = {
                    Id: resData.Id,
                    readingId: resData.ReadingId__c,
                    done: this.isNullBoolean(resData.Done__c),
                    flagged: this.isNullBoolean(resData.Flagged__c),
                    notes: this.isNullGetArray(resData.Notes__c, '~')
                };
                data.metaData.push(obj);
            }
        }
        return data;
    }

    setMeta = async (userId: any, meta: any) => {
        // console.log('In Set');
        const obj = {
            Id: meta.Id,
            ReadingId__c: meta.readingId,
            Done__c: meta.done,
            Flagged__c: meta.flagged,
            Notes__c: this.isNullSetArray(meta.notes, '~'),
            Contact__c: userId
        };
        // console.dir(obj);
        const ret = await this.con.sobject("FRM_App_Meta__c").update(obj);
        if (!ret.success) {
            console.error('Error in setMeta');
            return null;
        }
        // console.log('Updated Successfully : ' + ret.id);
        return ret;
    }
    createMeta = async (userId: any, meta: any) => {
        const obj = {
            Id: meta.Id,
            ReadingId__c: meta.readingId,
            Done__c: meta.done,
            Flagged__c: meta.flagged,
            Notes__c: this.isNullSetArray(meta.notes, '~'),
            Contact__c: userId
        };
        const ret = this.con.sobject("FRM_App_Meta__c").create(obj);
        if (!ret.success) {
            console.error('Error in createMeta: ', ret);
            return null;
        }
        // console.log('Create Successfully : ' + ret.id);
        return ret;
    }

    getSettings = async (userId: any) => {
        const query = util.format("SELECT Id, apnId__c, gcmId__c, examId__c, Organize_By__c, Reminders__c, Insirpation__c from FRM_App_Setting__c WHERE Contact__c = '%s'", userId);
        const res = await this.con.query(query);
        let data: any = {};
        if (res.totalSize > 0) {
            data = res.records[0];
        }
        return {
            settings: {
                Id: this.isNull(data.Id),
                apnId: this.isNull(data.apnId__c),
                gcmId: this.isNull(data.gcmId__c),
                examId: this.isNull(data.examId__c),
                organizeBy: this.isNull(data.Organize_By__c),
                insirpation: this.isNull(data.Insirpation__c),
                reminders: this.isNullGetArray(data.Reminders__c, null)
            }
        };
    }

    setSettings = async (userId: any, settings: any) => {
        // console.log('In Set');
        const obj = {
                Id: settings.Id,
                apnId__c: this.isNull(settings.apnId),
                gcmId__c: this.isNull(settings.gcmId),
                examId__c: this.isNull(settings.examId),
                Organize_By__c: this.isNull(settings.organizeBy),
                Insirpation__c: this.isNull(settings.insirpation),
                Reminders__c: this.isNullSetArray(settings.reminders, null),
                Contact__c: userId
            };
        // console.dir(obj);
        const ret = await this.con.sobject("FRM_App_Setting__c").update(obj);
        if (!ret.success) {
            console.error('Error in setSettings:', ret);
            return null;
        }
    }

    createSettings = async (userId: any, settings: any) => {
        const obj = {
            apnId__c: this.isNull(settings.apnId),
            gcmId__c: this.isNull(settings.gcmId),
            examId__c: this.isNull(settings.examId),
            Organize_By__c: this.isNull(settings.organizeBy),
            Insirpation__c: this.isNull(settings.insirpation),
            Reminders__c: this.isNullSetArray(settings.reminders, null),
            Contact__c: userId
        };

        const ret = await this.con.sobject("FRM_App_Setting__c").create(obj);
        if (!ret.success) {
            console.log('Error in createSettins: ', ret);
            return null;
        }
    }
    getExams = async (contactId: any) => {
        // Load User
        // var exam = {
        //     name:"FRM Part 1",
        //     address:"2130 Fulton Street",
        //     city:"San Francisco",
        //     state:"CA",
        //     zip:"94117-1080",
        //     country:"USA",
        //     day:"November 11th, 2013",
        //     time:"7:00 am",
        //     duration:"2"
        // };
        let query = util.format("SELECT Id, Name, Member__C, Session__c, Section__c, Defered__c, Room__r.Id, Room__r.Venue__r.Id, Room__r.Venue__r.Institution_Name__c,"
            + " Room__r.Venue__r.Building_Name__c, Room__r.Venue__r.Address1__c, Room__r.Venue__r.Address2__c, Room__r.Venue__r.City__c, Room__r.Venue__r.State__c,"
            + " Room__r.Venue__r.Country__c, Room__r.Venue__r.Zipcode__c, Room__r.Venue__r.Venue_Code__c, Exam_Site__c, Exam_Site__r.Site__r.Id, Exam_Site__r.Site__r.Name,"
            + " Exam_Site__r.Site__r.Display_Address__c, Exam_Site__r.Exam__r.Exam_Date__c, Exam_Site__r.Exam__r.Id FROM Exam_Attempt__c where Member__c =  '%s' and"
            + " Exam_Date__c > TODAY and Cancelled__c = False order by Exam_Site__r.Exam__r.Exam_Date__c", contactId);

        const res = await this.con.query(query);
        if (res.records.length > 0) {
            query = util.format("select Id, Name, Building_Name__c, Institution_Name__c, Address1__c, Address2__c, City__c, Country__c from Venue__c where"
                + " Site__c = '%s'", res.records[0].Exam_Site__r.Site__r.Id);

            const res1 = await this.con.query(query);
            res['venue'] = res1;
            return res;
        } else {
            return res;
        }
    }

    resetUserPassword = (id: any) => {
        return this.con.apex.delete('/services/apexrest/CustomerCommunityUser/password?email=' + id);
    }

    getHighlightedJobs1 = () => {
        const query = "SELECT Id, Title__c, Company__c, City__c, State__c, URL__c, Display_Sort_Order__c FROM Job__c WHERE Display_Sort_Order__c != null LIMIT 12";
        return this.con.query(query);
    }

    getHighlightedContent = () => {
        let query = "SELECT";
        query += " ";
        query += "Id, Name, Sort_Number__c, Folder__r.Name, Content__c, Content__r.RecordTypeId, Content__r.Third_Party_URL__c, Content__r.Name,"
            + " Content__r.Content_Name__c, Content__r.Description__c, Content__r.External_ID__c, Content__r.Published_Date__c, Content__r.Image__c";
        query += " ";
        query += "FROM Content_Folders__c";
        query += " ";
        query += "WHERE Folder__r.Name = '%s'";

        query = util.format(query, 'OneWire Content Highlighted');
        console.log(query);
        return this.con.query(query);
    }

    insertOneWireJobs = (payload: any) => {
        return this.con.apex.post("/services/apexrest/onewire/insert/jobs", payload);
    }

    deleteOneWireJobs = (payload: any) => {
        return this.con.apex.post("/services/apexrest/onewire/delete/jobs", payload);
    }

    createWebcastRegistration = (userId: any, webcastId: any) => {
        const body = {
            userId: userId,
            webcastId: webcastId
        };

        return this.con.apex.post("/services/apexrest/webcast/registration", body);
    }

    getSFDCNonAlumniList = (email: any) => {
        const body = {
            email: email
        };

        return new Promise((resolve, reject) => {
            this.con.apex.post("/services/apexrest/convention/nonalumni", body, (err: any, res: any) => {
                const response = JSON.parse(res);
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

    webToCase = async (json: any) => {

        const response = await this.con.sobject("Case").create(json);
        const ret = await this.con.sobject("CaseComment").create({ ParentId: response.id, CommentBody: json.Description });
        if (!ret.success) {
            console.log('Error in webToCase: ', ret);
            return null;
        } else {
            return ret;
        }
    }

    webToLead = (json: any) => {
        return new Promise((resolve, reject) => {
            this.con.sobject("Lead").create(json, (err: any, ret: any) => {
                if (err || !ret.success) {
                    reject(err);
                } else {
                    resolve(ret);
                }
            });
        });
    }

    getCompanies = (name: string) => {

        let query = "SELECT";
            query += " ";
            query += "Id, Name";
            query += " ";
            query += "FROM Account";
            query += " ";
            query += "WHERE Customer_Company_List__c = true AND Name LIKE '%" + name + "%'";

      return this.con.query(query);
    }

    getRecordTypeByName = (sObjectType: any, name: any) => {

        let query = "SELECT Id, sObjectType, Name, DeveloperName";
            query += " ";
            query += "FROM RecordType";
            query += " ";
            query += "WHERE sObjectType = '" + sObjectType + "' AND Name = '" + name + "' LIMIT 1";

        return this.con.query(query);
    }

    getAcademicFellowships = async () => {
        let query = util.format("select Id, name, Year__c, Season__c, Research_URL__c, Contact__r.GARP_Profile__r.Id, Contact__r.GARP_Profile__r.Bio__c,"
            + " Contact__r.GARP_Profile__r.Default_Image__c, Contact__r.GARP_Profile__r.Qualifications__c, Contact__r.name from Fellowship__c where Contact__r.Id"
            + " != null and Contact__r.GARP_Profile__r.Id != null order by Year__c DESC");
        console.log("AP Query: " + query);

        const response: any = {
            fellows: null,
            fellowshipCdriveRecords: null,
            GARPProfileCdriveRecords: null,
        };
        const fellowsResponse = await this.con.query(query);
        response.fellows = fellowsResponse;

        const GARPProfileIDs = _.map(response.fellows.records, (fellow: any) => {
            return fellow.Contact__r.GARP_Profile__r.Id;
        }).join("','");
        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where"
            + " cdrive__contextID__c in ('%s')", GARPProfileIDs);

        const GARPProfileCdriveRecordsResponse  = await this.con.query(query);
        response.GARPProfileCdriveRecords = GARPProfileCdriveRecordsResponse;

        const FellowshipsIDs = _.pluck(response.fellows.records, "Id").join("','");
        query = util.format("select Id, cdrive__contextID__c, cdrive__File_Name__c from cdrive__Cloud_Files__c where"
                    + " cdrive__contextID__c in ('%s')", FellowshipsIDs);
        const fellowshipCdriveRecordsResponse = await this.con.query(query);
        response.fellowshipCdriveRecords = fellowshipCdriveRecordsResponse;

        return response;
    }
    postMetadata = (json: any) => {
        return this.con.sobject("FRM_App_Meta__c").create(json);
    }

    getAggregateEvents = () => {
        return this.con.apex.get("/eventContent", {});
    }
}
