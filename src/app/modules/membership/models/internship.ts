import { Alias, Model } from 'tsmodels';

class RecordType extends Model {
  @Alias('Name') public name: string;
}

export class Internship extends Model {
  @Alias('Applicant_Academic_Year__c') public academicYear: string;
  @Alias('Applicant_Education_Level__c') public educationLevel: any;
  @Alias('City__c') public city: string;
  @Alias('Company__c') public company: string;
  @Alias('Country__c') public country: string;
  @Alias('Description__c') public description: string;
  @Alias('Industry__c') public industry: string;
  @Alias('Internship_Length_Units__c') public unitsLength: any;
  @Alias('Internship_Length__c') public length: any;
  @Alias('Link__c') public link: string;
  @Alias('Name') public name: string;
  @Alias('Postal_Code__c') public postalCode: string;
  @Alias('Program__c') public program: string;
  @Alias('Published_Date__c') public publishedDate: any;
  @Alias('RecordType', RecordType) public recordType: RecordType;
  @Alias('RecordTypeId') public recordTypeId: string;
  @Alias('State__c') public state: any;
  @Alias('Status__c') public status: string;
}
