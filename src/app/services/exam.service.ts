import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

/* Services */
import { UtilitiesService } from './utilities.service';
import { RegStatus } from '../modules/shared/enums/reg-status.enum';
import { ExamMonth } from '../modules/shared/enums/exam-month.enum';

export interface IExamInfo {
  may: any;
  nov: any;
  examRegOpenedMonth: string;
  examRegNextMonth: string;
  examRegistrationMonth: string;
  examMaterialsMonth: string;
  examDec1Month: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'sfdc/exam';

  constructor(private http: HttpClient,
    private utilitiesservice: UtilitiesService) { }

  public getExamInfo(): Observable<IExamInfo> {
    return this.http.get<any>(`${this.apiUrl}/info`)
      .pipe(
        map(data => {
          const examObj: IExamInfo = {
            may: data.examInfo.may,
            nov: data.examInfo.nov,
            examRegOpenedMonth: '',
            examRegNextMonth: '',
            examRegistrationMonth: '',
            examMaterialsMonth: '',
            examDec1Month: '',
          };

          examObj.nov.status = this.getRegStatus(examObj.nov);
          examObj.may.status = this.getRegStatus(examObj.may);

          examObj.nov.regWindow = this.getRegWindow(examObj.nov);
          examObj.may.regWindow = this.getRegWindow(examObj.may);

          examObj.nov.fees = this.getFees(data.products, 5);
          examObj.may.fees = this.getFees(data.products, 11);

          if (examObj.may.status === RegStatus.OPENED) {
            examObj.examRegOpenedMonth = ExamMonth.MAY;
            examObj.examRegNextMonth = ExamMonth.NOVEMBER;
          } else if (examObj.nov.status === RegStatus.OPENED) {
            examObj.examRegOpenedMonth = ExamMonth.NOVEMBER;
            examObj.examRegNextMonth = ExamMonth.MAY;
          } else {
            examObj.examRegOpenedMonth = null;
            if (examObj.may.status === RegStatus.COMING) {
              examObj.examRegNextMonth = ExamMonth.MAY;
            } else if (examObj.nov.status === RegStatus.COMING) {
              examObj.examRegNextMonth = ExamMonth.NOVEMBER;
            } else {
              examObj.examRegNextMonth = null;
            }
          }
          console.log(examObj);
          /**
           * Exam Windows
           * Use May from Nov Closed - May Open
           * Else use Nov
           */
          if (examObj.nov.status === RegStatus.CLOSED ||
            examObj.nov.status === RegStatus.EXAMDAY ||
            examObj.nov.status === RegStatus.POSTEXAM ||
            examObj.may.status === RegStatus.COMING ||
            examObj.may.status === RegStatus.OPENED) {
            examObj.examRegistrationMonth = ExamMonth.MAY;
          } else {
            examObj.examRegistrationMonth = ExamMonth.NOVEMBER;
          }

          /**
           * Study Materials
           * Use May from Nov post - May Exam Day
           */
          if (examObj.nov.status === RegStatus.POSTEXAM ||
            examObj.may.status === RegStatus.OPENED ||
            examObj.may.status === RegStatus.CLOSED ||
            examObj.may.status === RegStatus.EXAMDAY) {
            examObj.examMaterialsMonth = ExamMonth.MAY;
          } else {
            examObj.examMaterialsMonth = ExamMonth.NOVEMBER;
          }

          /**
           * FAQs
           * Use May from Open through Exam Day
           * Else use Nov
           */
          if (examObj.may.status === RegStatus.OPENED ||
            examObj.may.status === RegStatus.CLOSED ||
            examObj.may.status === RegStatus.EXAMDAY) {
            examObj.examDec1Month = ExamMonth.MAY;
          } else {
            examObj.examDec1Month = ExamMonth.NOVEMBER;
          }
          return examObj;
        })
      );
  }

  public areCurrentStudyMaterialsNearEndOfLife(examInfo) {
    try {
      const currentMaterialsExamInfo = examInfo[ExamMonth.NOVEMBER];
      const nearDeathDateString = currentMaterialsExamInfo.regWindow.firstLateDate;

      if (examInfo.examRegNextMonth === ExamMonth.MAY && this.utilitiesservice.timeUntilDateTime(nearDeathDateString) < 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("Error in examInfo.areCurrentStudyMaterialsNearEndOfLife: ", e);
      return false;
    }
  }

  private getRegStatus(examGroupDetails) {
    const HOURS44INSEC = 158400;
    if (this.utilitiesservice.timeUntilDate(examGroupDetails.Registration_Start_Date__c) > 0) {
      return RegStatus.COMING;
    } else if (this.utilitiesservice.timeUntilDate(examGroupDetails.Registration_Start_Date__c) <= 0 &&
      this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Late_Registration__c) >= 0) {
      return RegStatus.OPENED;
    } else if (this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Late_Registration__c) <= 0 &&
      this.utilitiesservice.timeUntilDate(examGroupDetails.Exam_Date__c) >= 0) {
      return RegStatus.CLOSED;
    } else if (this.utilitiesservice.timeUntilDate(examGroupDetails.Exam_Date__c) <= 0 &&
      this.utilitiesservice.timeUntilDate(examGroupDetails.Exam_Date__c) >= (-1 * HOURS44INSEC)) {
      return RegStatus.EXAMDAY;
    } else {
      return RegStatus.POSTEXAM;
    }
  }

  private getRegWindow(examGroupDetails) {
    const retObj = {
      regWindow: null,
      firstEarlyDate: null,
      earlyWarningDate: null,
      lastEarlyDate: null,
      firstStandardDate: null,
      lastStandardDate: null,
      firstLateDate: null,
      lastLateDate: null,
      currentRegWindow: '',
    };

    retObj.firstEarlyDate = moment(examGroupDetails.Registration_Start_Date__c);
    retObj.lastEarlyDate = moment(examGroupDetails.Last_Date_For_Early_Registration__c).endOf('day');
    retObj.firstStandardDate = moment(examGroupDetails.Last_Date_For_Early_Registration__c).add(1, 'days');
    retObj.lastStandardDate = moment(examGroupDetails.Last_Date_For_Standard_Registration__c).endOf('day');
    retObj.firstLateDate = moment(examGroupDetails.Last_Date_For_Standard_Registration__c).add(1, 'days');
    retObj.lastLateDate = moment(examGroupDetails.Last_Date_For_Late_Registration__c).endOf('day');

    if (this.utilitiesservice.timeUntilDate(examGroupDetails.Registration_Start_Date__c) <= 0 &&
      this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Early_Registration__c) >= 0) {
      retObj.currentRegWindow = 'early';
    } else if (this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Early_Registration__c) <= 0 &&
      this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Standard_Registration__c) >= 0) {
      retObj.currentRegWindow = 'standard';
    } else if (this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Standard_Registration__c) <= 0 &&
      this.utilitiesservice.timeUntilEndDate(examGroupDetails.Last_Date_For_Late_Registration__c) >= 0) {
      retObj.currentRegWindow = 'late';
    } else {
      retObj.currentRegWindow = 'notopen';
    }

    const startEarlyWarningDate = moment(examGroupDetails.Last_Date_For_Early_Registration__c).subtract(2, 'week').format('YYYY-MM-DD');
    if (this.utilitiesservice.timeUntilDate(startEarlyWarningDate) <= 0 &&
      this.utilitiesservice.timeUntilDate(examGroupDetails.Registration_Start_Date__c) <= 0) {
      retObj.earlyWarningDate = true;
    }

    return retObj;
  }

  private getFees(data, monthNum) {
    const retObj = {
      enrollFee: null,
      earlyFeeFRM: null,
      stdFeeFRM: null,
      lateFeeFRM: null,
      earlyFeeERP: null,
      stdFeeERP: null,
      lateFeeERP: null,
    };

    for (let i = 0; i < data.records.length; i++) {
      const rec = data.records[i];

      if (rec.Product2.ProductCode === 'FRM1E' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.earlyFeeFRM = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'FRM1S' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.stdFeeFRM = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'FRM1L' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.lateFeeFRM = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'ENC1E' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.earlyFeeERP = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'ENC1S' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.stdFeeERP = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'ENC1L' && ((rec.Product2.GL_Code__c === '4001' && monthNum === 5) || (rec.Product2.GL_Code__c === '4002' && monthNum === 11))) {
        retObj.lateFeeERP = rec.UnitPrice;
      }
      if (rec.Product2.ProductCode === 'FRM1' && rec.Product2.GL_Code__c === '4010') {
        retObj.enrollFee = rec.UnitPrice;
      }
    }

    return retObj;
  }
}
