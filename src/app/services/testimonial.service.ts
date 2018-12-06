import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICommonAPIResponse } from '../modules/shared/models/common-api-response';
import { Testimonial } from '../models/testimonial';
import { TestimonialFaq } from '../models/testimonial-faq';

interface ITestimonialsResponse {
  files: ICommonAPIResponse;
  testimonials: ICommonAPIResponse;
  testimonialsQandA: ICommonAPIResponse;
}

interface ITestimonialsByTypeResponse {
  testimonials: Array<Testimonial>;
  testimonialsFAQ: Array<TestimonialFaq>;
}

interface ITestimonialByTypeAndIdResponse {
  testimonial: Testimonial;
  testimonialFAQ: Array<TestimonialFaq>;
}

@Injectable()
export class TestimonialService {
  private apiUrl = 'sfdc/testimonial';

  constructor(private http: HttpClient) {}

  public getTestimonials(type: string = 'member'): Observable<Array<Testimonial>> {
    return this.http.get<ITestimonialsResponse>(`${this.apiUrl}/${type}`)
      .pipe(
        map(data => (
          (data.testimonials.records || []).map(
            testimonial => Testimonial.new(Testimonial, testimonial)
          )
        ))
      );
  }

  public getTestimonialsByType(type: string): Observable<ITestimonialsByTypeResponse> {
    return this.http.get<ITestimonialsResponse>(`${this.apiUrl}/${type}`)
      .pipe(
        map(data => ({
          testimonials: (data.testimonials.records || []).map(
            testimonial => Testimonial.new(Testimonial, testimonial)
          ),
          testimonialsFAQ: (data.testimonialsQandA.records || []).map(
            testimonial => TestimonialFaq.new(TestimonialFaq, testimonial)
          ),
        }))
      );
  }

  public getTestimonialByTypeAndId(type: string, id: string): Observable<ITestimonialByTypeAndIdResponse> {
    return this.http.get<ITestimonialsResponse>(`${this.apiUrl}/${type}`)
      .pipe(map(data => {
        const testimonialData = (data.testimonials.records || [])
          .find(testimonial => testimonial['Id'] === id);

        return {
          testimonial: testimonialData ? Testimonial.new(Testimonial, testimonialData) : null,
          testimonialFAQ: (data.testimonialsQandA.records || [])
            .filter(
              testimonialFAQ => testimonialFAQ['Testimonial__c'] === id
            )
            .map(
              testimonialFAQ => TestimonialFaq.new(TestimonialFaq, testimonialFAQ)
            ),
        };
      }));
  }
}
