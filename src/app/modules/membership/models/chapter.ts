import { Alias, Model } from 'tsmodels';
import { Member } from './member';

export class Chapter extends Model {
  @Alias('Id') public id: string;
  @Alias('Location__c') public location: string;
  @Alias('Name') public name: string;
  @Alias('Region__c') public region: string;
  @Alias('Type__c') public type: string;
  @Alias('members', Member) public members?: Array<Member>;
}
