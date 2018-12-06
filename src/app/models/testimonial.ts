import { Model, Alias } from 'tsmodels';

export class Testimonial extends Model {
  @Alias('Id') public id: string;
  @Alias('City__c') public city: string;
  @Alias('Contact__c') public contact: string;
  @Alias('Country__c') public country: string;
  @Alias('Current_Job__c') public job: string;
  @Alias('ERP_Summary__c') public eRPSummary: string;
  @Alias('ERP_Certified__c') public eRPCertified: string;
  @Alias('External_Video_URL__c') public videoUrl: string;
  @Alias('FRM_Summary__c') public fRMSummary: string;
  @Alias('FRM_Certified__c') public fRMCertified: string;
  @Alias('Member_Photo__c') public memberPhoto: string;
  @Alias('Member_Summary__c') public memberSummary: string;
  @Alias('Member_Since__c') public memberSince: string;
  @Alias('Member__c') public isMember: boolean;
  @Alias('Name') public name: string;
  @Alias('Publish_Date__c') public publishDate: string;
  @Alias('Vanity_URL__c') public vanityUrl: string;
}
