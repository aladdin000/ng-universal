import { Alias, Model } from 'tsmodels';

class Contact extends Model {
  @Alias('Name') public name: string;
  @Alias('Email') public email: string;
}

export class Member extends Model {
  @Alias('Id') public id: string;
  @Alias('Chapter_Director_Bio__c') public directorBio: any;
  @Alias('Chapter__c') public chapterId: string;
  @Alias('Committee_Member__c') public isCommitteeMember: boolean;
  @Alias('Contact__c') public contactId: string;
  @Alias('Contact__r', Contact) public contact: Contact;
  @Alias('Director__c') public isDirector: boolean;
  @Alias('Title__c') public title: any;
}
