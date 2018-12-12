import { Model, Alias } from 'tsmodels';

export class EPP extends Model {
  @Alias('Id') public id: string;
  @Alias('EPP_Contact_Phone__c') public contactphone: string;
  @Alias('EPP_ERP__c') public eppERP: boolean;
  @Alias('EPP_FBR__c') public eppFBR: boolean;
  @Alias('EPP_FRM__c') public eppFRM: boolean;
  @Alias('EPP_ICBRR__c') public eppICBR: boolean;
  @Alias('EPP_Location_Description__c') public description: string;
  @Alias('EPP_Location__c') public location: string;
  @Alias('EPP_Logo__c') public logo: string;
  @Alias('EPP_Overview__c') public overview: string;
  @Alias('EPP_Regions__c') public regions: string;
  @Alias('EPP_Registration_Status__c') public registrationStatus: string;
  @Alias('EPP_Website__c') public website: string;
  @Alias('Name') public name: string;
}
