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
}
