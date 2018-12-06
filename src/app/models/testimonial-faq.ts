import { Alias, Model } from 'tsmodels';

export class TestimonialFaq extends Model {
  @Alias('Id') public id: string;
  @Alias('Name') public name: string;
  @Alias('Question__c') public question: string;
  @Alias('Answer__c') public answer: string;
  @Alias('Testimonial__c') public testimonialId: string;
}
