import { Alias, Model } from 'tsmodels';

import { GarpTimeHelper } from '../../shared/helpers/garp-time.helper';

class MeetingChapter extends Model {
  @Alias('Id') public id: string;
  @Alias('Name') public name: string;
}

class MeetingTimeZone extends Model {
  @Alias('Name') public name: string;
}

class MeetingLocation extends Model {
  @Alias('Address_City__c') public city: string;
  @Alias('Address_Country__c') public country: string;
  @Alias('Address_Postal_Code__c') public postalCode: string;
  @Alias('Address_State_Provence__c') public state: string;
  @Alias('Address_Street_1__c') public street: string;
  @Alias('Address_Street_2__c') public streetAdditional: string;
  @Alias('Building_Name__c') public buildingName: string;
  @Alias('Name') public name: string;

  public get fullLocation(): string {
    let loc = '';
    if (this.buildingName) loc += this.buildingName + ' ';
    if (this.street) loc += this.street + ' ';
    if (this.streetAdditional) loc += this.streetAdditional + ' ';
    if (this.city) loc += this.city + ', ';
    if (this.state) loc += this.state + ' ';
    if (this.postalCode) loc += this.postalCode + ' ';
    if (this.country) loc += this.country + ' ';

    return loc;
  }
}

export class Meeting extends Model {
  @Alias('Cancellation_Policy__c') public cancellationPolicy: string;
  @Alias('Ceremony__c') public ceremony: string;
  @Alias('Chapter_Meeting_Location__r', MeetingLocation) public meetingLocation: MeetingLocation;
  @Alias('Chapter_Meeting_Name__c') public meetingName: string;
  @Alias('Chapter__r', MeetingChapter) public chapter: MeetingChapter;
  @Alias('End__c') public dateEnd: string;
  @Alias('Group_Formation__c') public formation: boolean;
  @Alias('Id') public id: string;
  @Alias('Is_Sponsored__c') public isSponsored: boolean;
  @Alias('Last_Day_of_Registration__c') public dateLastRegistration: string;
  @Alias('Name') public name: string;
  @Alias('NonMemberFee__c') public nonMemberFee: any;
  @Alias('Payment_Policy__c') public paymentPolicy: any;
  @Alias('Presentation__c') public presentation: boolean;
  @Alias('Sponsor_Information__c') public sponsorInfo: string;
  @Alias('Sponsor_Logo__c') public sponsorLogo: string;
  @Alias('Sponsor_Name__c') public sponsorName: string;
  @Alias('Sponsor_Website__c') public sponsorWebsite: string;
  @Alias('Start__c') public dateStart: string;
  @Alias('Synopsis__c') public synopsis: any;
  @Alias('Time_Zone__c') public timeZoneId: string;
  @Alias('Time_Zone__r', MeetingTimeZone) public timeZone: MeetingTimeZone;

  public hoursTime: string;
  public fullFormattedDate: string;

  public get isRegistrationOpen(): boolean {
    if (this.dateLastRegistration) {
      return GarpTimeHelper.timeUntilDateTime(this.dateLastRegistration) >= 0;
    }

    return GarpTimeHelper.timeUntilDateTime(this.dateStart) >= 0;
  }

  public defineAdditionalFields(): Meeting {
    this.defineDate();

    return this;
  }

  private defineDate(): void {
    this.hoursTime = GarpTimeHelper.formatEastern(this.dateStart, 'h:mm a');
    this.fullFormattedDate = GarpTimeHelper.formatEastern(this.dateStart, 'dddd, MMMM DD, YYYY');
  }
}
