import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

/* Services */
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class StudyMaterialsService {
  private apiUrl = 'sfdc/content/study-materials';

  constructor(private http: HttpClient,
    private utilitiesService: UtilitiesService) { }

  public getStudyMaterials(studyProductsFolderId) {
    return this.http.get<any>(`${this.apiUrl}/${studyProductsFolderId}`)
      .pipe(
        map(products => {
          const materials: any = {
            candidateGuide: {},
            learningObjectives: {},
            studyGuides: [],
            books: [],
            eBooks: [],
            practiceExams: [],

          };
          materials.candidateGuide = this.getMaterialsByName(products.records, 'Candidate Guide')[0];
          materials.learningObjectives = this.getMaterialsByName(products.records, 'Learning Objectives')[0];
          materials.studyGuides = this.getMaterialsByName(products.records, 'Study Guide');
          materials.books = this.getMaterialsByName(products.records, 'I Books');
          materials.eBooks = _.uniqBy(this.getMaterialsByName(products.records, 'I eBooks'), (product) => {
            return product.Id;
          });
          materials.practiceExams = this.getMaterialsByName(products.records, 'Practice Exam');
          return materials;
        })
      );
  }

  private getMaterialsByName(array, query) {
    return _.filter(array, (product) => {
      if (this.utilitiesService.defined(product.Name)) {
        return product.Name.indexOf(query) > -1;
      } else {
        return false;
      }
    });
  }

  public showStudyModuleLeadGen(exam: string, examInfo) {
    try {
      const leadgenfieldkey = exam.toLowerCase() === 'frm' ?
        'FRM_Study_Module_Lead_Gen_URL__c' :
        'ERP_Study_Module_Lead_Gen_URL__c';
      return this.utilitiesService.defined(examInfo, leadgenfieldkey);
    } catch (e) {
      console.log("Error in showStudyModuleLeadGen", e);
      return false;
    }
  }

  public showFreeReadingLeadGen(exam, examInfo) {
    try {
      const leadgenfieldkey = exam.toLowerCase() === 'frm' ?
        'FRM_Free_Reading_Lead_Gen_URL__c' :
        'ERP_Free_Reading_Lead_Gen_URL__c';
      return this.utilitiesService.defined(examInfo, leadgenfieldkey);
    } catch (e) {
      console.log("Error in showFreeReadingLeadGen", e);
      return false;
    }
  }

  public isProductAvailable(item) {
    if (!this.utilitiesService.defined(item, 'product')) {
      return false;
    }

    try {
      return this.utilitiesService.isAfterDate(item.Start_Date__c) && !this.isProductOutOfStock(item);
    } catch (e) {
      console.log("Error in isProductAvailable: ", e);
      return false;
    }
  }

  public isProductOutOfStock(item) {
    if (!this.utilitiesService.defined(item, 'product.Inventory__c')) {
      return false;
    }

    try {
      return item.product.Inventory__c <= 0;
    } catch (e) {
      console.log("Error in isProductOutOfStock: ", e);
      return false;
    }
  }

  public isProductComingSoonPeriod(item) {
    if (!this.utilitiesService.defined(item, 'product')) {
      return true;
    }

    try {
      return (!this.utilitiesService.defined(item, 'product.Pre_Order_Date__c') ||
      this.utilitiesService.isBeforeDate(item.product.Pre_Order_Date__c)) &&
      this.utilitiesService.isBeforeDate(item.Start_Date__c);
    } catch (e) {
      console.log("Error in isProductComingSoonPeriod: ", e);
      return false;
    }
  }

  public isProductPreorderPeriod(item) {
    if (!this.utilitiesService.defined(item, 'product.Pre_Order_Date__c')) {
      return false;
    }

    try {
      return this.utilitiesService.isAfterDate(item.product.Pre_Order_Date__c) && this.utilitiesService.isBeforeDate(item.Start_Date__c);
    } catch (e) {
      console.log("Error in isProductPreorderPeriod: ", e);
      return false;
    }
  }

  public isProductDigital(item) {
    if (!this.utilitiesService.defined(item, 'product.Electronic_Delivery__c')) {
      return false;
    }

    try {
      return item.product.Electronic_Delivery__c;
    } catch (e) {
      console.log("Error in isProductDigital: ", e);
      return false;
    }
  }
}
