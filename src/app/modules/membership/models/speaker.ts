import { Alias, Model } from 'tsmodels';

class SpeakerAdditional extends Model {
  @Alias('Biography__c') public bio: string;
  @Alias('Contact__c') public contact: string;
  @Alias('First_Name__c') public firstName: string;
  @Alias('Last_Name__c') public lastName: string;
  @Alias('Name') public fullName: string;
  @Alias('Qualifications__c') public qualifications: string;
}

export class Speaker extends Model {
  @Alias('Id') public id: string;
  @Alias('Chapter_Meeting__c') public meetingId: string;
  @Alias('Name') public name: string;
  @Alias('Chapter_Speaker__r', SpeakerAdditional) public additional: SpeakerAdditional;
}
