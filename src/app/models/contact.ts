import { Model, Alias } from 'tsmodels';

export class Contact extends Model {
  @Alias('FirstName') public firstName: string;
  @Alias('GARP_Member_ID__c') public garpMemberId: string;
  @Alias('KPI_ERP_Certified_Date__c') public erpCertifiedDate: string;
  @Alias('KPI_ERP_Certified__c') public erpCertified: boolean;
  @Alias('KPI_ERP_Resume_Submission_Date__c') public erpResumeSubmissionDate: string;
  @Alias('KPI_FRM_Certified_Date__c') public frmCertifiedDate: string;
  @Alias('KPI_FRM_Certified__c') public frmCertified: boolean;
  @Alias('KPI_FRM_Resume_Submission_Date__c') public frmResumeSubmissionDate: string;
  @Alias('LastName') public lastName: string;
  @Alias('Name') public name: string;
  @Alias('attributes') public attributes: any;
}
