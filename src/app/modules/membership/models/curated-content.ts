export class CuratedContent {
  public title: string = null;
  public date: string = null;
  public url: string = null;

  constructor(data: { [key: string]: string }) {
    Object.keys(this).forEach(prop => {
      if (data[prop]) {
        this[prop] = data[prop];
      }
    });
  }
}

export const CURATED_CONTENTS: Array<CuratedContent> = [
  new CuratedContent({
    title: 'The 10 Most Popular Finance Jobs this Fall [INFOGRAPHIC]',
    date: 'Tuesday, September 18, 2018',
    url: 'https://resources.onewire.com/hiring-trends/the-10-most-popular-finance-jobs-this-fall/',
  }),
  new CuratedContent({
    title: 'Every Resource 2018 Grads Need to Land Their First Finance Job',
    date: 'Thursday, May 17, 2018',
    url: 'https://resources.onewire.com/hiring-trends/the-10-most-popular-finance-jobs-this-fall/',
  }),
  new CuratedContent({
    title: '5 Ways You Can Use Your OneWire Account to Find Your Next Finance Job',
    date: 'Wednesday, February 28, 2018',
    url: 'https://resources.onewire.com/hiring-trends/the-10-most-popular-finance-jobs-this-fall/',
  }),
  new CuratedContent({
    title: 'The Best Investment Banks to Work for in 2018',
    date: 'Wednesday, December 27, 2017',
    url: 'https://resources.onewire.com/hiring-trends/the-10-most-popular-finance-jobs-this-fall/',
  }),
  new CuratedContent({
    title: 'SEC and FINRA 2018 Exam Priorities: Continuity and Change',
    date: 'Wednesday, December 27, 2017',
    url: 'https://resources.onewire.com/hiring-trends/the-10-most-popular-finance-jobs-this-fall/',
  }),
];
