import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { uniq, flatten, sortBy } from 'lodash';

import { Event } from '../models/event';

@Injectable()
export class EventsService {
  private url = 'events';

  constructor(private http: HttpClient) {}

  public getAggregatedEvents(): Observable<Array<Event>> {
    return this.getEvents()
      .pipe(
        map(data => {
          return (<Array<any>>data['allEventContents'])
            .filter(
              event => (<Array<any>>data['featuredContentInformation']).find(
                content => content['Content__c'] === event['Id']
              )
            )
            .map(
              event => {
                const model = Event.new(Event, event);
                model.defineAdditionalFields(data['cloudImages']);

                return model;
              }
            )
            .sort(
              (a: Event, b: Event) => {
                if (new Date(a.dateStart) > new Date(b.dateStart)) {
                  return 1;
                } else if (new Date(a.dateStart) < new Date(b.dateStart)) {
                  return -1;
                }

                return 0;
              }
            );
        })
      );
  }

  public getAggregatedEventsByType(types: Array<string>): Observable<Array<Event>> {
    return this.getEvents()
      .pipe(
        map(data => {
          const events: Array<any> = data['allEventContents'];

          return sortBy(
            uniq(
              flatten(
                types.map(
                  eventObjectType => events.filter(
                    event => {
                      if (Object.prototype.hasOwnProperty.call(event, eventObjectType)) {
                        return true;
                      } else if (event['Webcasts__r'] === undefined && event['Chapter_Meetings__r'] === undefined && event['Events__r'] === undefined) {
                        return true;
                      }

                      return false;
                    }
                  )
                )
              )
            )
            .filter(
              event => (event['Event_Start_Date_Time__c'] && event['Status__c'] === 'Active')
            ),
            'Event_Start_Date_Time__c'
          )
          .reverse()
          .map(
            event => {
              const model = Event.new(Event, event);
              model.defineAdditionalFields(data['cloudImages']);

              return model;
            }
          );
        })
      );
  }

  private getEvents(): Observable<any> {
    return this.http.get(this.url);
  }
}
