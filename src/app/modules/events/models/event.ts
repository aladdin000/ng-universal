import { Model, Alias } from 'tsmodels';
import * as moment from 'moment-timezone';

const DEFAULT_IMG_URL = '/assets/images/NoImage_NAVY.jpg';

interface ICloudImage {
  Id: string;
  cdrive__File_Name__c: string;
}

export class Event extends Model {
  @Alias('Id') public id: string;
  @Alias('Content_Name__c') public name: string;
  @Alias('Description__c') public description?: string;
  @Alias('Image__c') public imageName?: string;
  @Alias('Event_Start_Date_Time__c') public dateStart: string;
  @Alias('Event_End_Date_Time__c') public dateEnd: string;
  @Alias('Location__c') public location?: string;
  @Alias('RecordTypeId') public recordTypeId: string;
  @Alias('Record_Type_Name__c') public recordTypeName: string;
  @Alias('Status__c') public status: string;
  @Alias('Chapter_Meetings__r') public chapterMeetings?: object;
  @Alias('Events__r') public events?: object;
  @Alias('Webcasts__r') public webcasts?: object;
  @Alias('Third_Party_URL__c') public thirdPartyUrl?: string;

  public imageUrl: string;
  public momentDateStart: moment.Moment;
  public momentDateEnd: moment.Moment;
  public ribbonDate: string;
  public nYDate: string;
  public type: string;

  public defineAdditionalFields(cloudImages: Array<ICloudImage>): void {
    this.defineImage(cloudImages);
    this.defineDate();
    this.defineType();
  }

  private defineImage(cloudImages: Array<ICloudImage>): void {
    if (!this.imageName) {
      this.imageUrl = DEFAULT_IMG_URL;
      return;
    }

    if (this.imageName.toLowerCase().indexOf('http') === 0) {
      return;
    }

    const cloudContent = cloudImages.find(
      content => content.cdrive__File_Name__c === this.imageName
    );

    if (cloudContent) {
      this.imageUrl = `https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/${this.id}/${cloudContent.Id}_${this.imageName}`;
    } else {
      this.imageUrl = DEFAULT_IMG_URL;
    }
  }

  private defineDate(): void {
    this.momentDateStart = moment(this.dateStart);
    this.momentDateEnd = moment(this.dateEnd);
    this.ribbonDate = this.momentDateStart.format('MMM DD');
    this.nYDate = this.momentDateStart.tz('America/New_York').format('MMMM Do, YYYY | h:mm A');
  }

  private defineType(): void {
    this.type = this.chapterMeetings
      ? 'Chapter Meeting'
      : this.events
        ? 'Conference'
        : this.webcasts
          ? 'Webcast'
          : 'Event'
    ;
  }
}
