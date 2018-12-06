import { Alias, Model } from 'tsmodels';

export class Offer extends Model {
  @Alias('Id') public id: string;
  @Alias('Info_Link__c') public infoLink: string;
  @Alias('Memb_Offer_Description__c') public description: string;
  @Alias('Memb_Offer_External_Link__c') public externalLink: string;
  @Alias('Memb_Offer_Hashtag__c') public hashtag: string;
  @Alias('Memb_Offer_Logo__c') public logo: string;
  @Alias('Memb_Offer_Portal_Route__c') public portalRoute: string;
  @Alias('Memb_Offer_Promo_Code__c') public promoCode: string;
  @Alias('Memb_Offer_Public_Button_Text__c') public buttonText: string;
  @Alias('Memb_Offer_Status__c') public status: string;
  @Alias('Memb_Offer_Title__c') public title: string;
  @Alias('Name') public name: string;
  @Alias('Values_List__c') public htmlList: string;
  @Alias('Analytics_Label__c') public analyticLabel?: string;
}
