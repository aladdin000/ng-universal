export class Job {
  public title: string = null;
  public company: string = null;
  public city: string = null;
  public state: string = null;
  public url: string = null;
  public href: string;

  constructor(data: { [key: string]: string }) {
    Object.keys(this).forEach(prop => {
      if (data[prop]) {
        this[prop] = data[prop];
      }
    });

    this.defineHref();
  }

  private defineHref(): void {
    let href = this.url;

    href += (this.url.indexOf('?') + 1) ? '&' : '?';

    if (this.company) {
      const company = this.company.replace(/\s/g, '').toLowerCase();
      href += `utm_source=${company}&`;
    }

    this.href = `${href}utm_content=garp&utm_medium=referral&utm_campaign=garpcareer&utm_term=garp`;
  }
}

export const JOBS: Array<Job> = [
  new Job({
    title: 'Vice President, Enterprise Risk Management',
    company: 'Mubadala Investment Company',
    city: 'Abu Dhabi',
    state: 'Abu Dhabi',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Structured Products Analyst',
    company: 'New York State Insurance Fund',
    city: 'New York City',
    state: 'New York',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Fixed Income Credit Analyst (Corporate Credit)',
    company: 'New York State Insurance Fund',
    city: 'New York City',
    state: 'New York',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Fixed Income Credit Analyst (Financial Institutions)',
    company: 'New York State Insurance Fund',
    city: 'New York City',
    state: 'New York',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Junior Investment Analyst',
    company: 'New York State Insurance Fund',
    city: 'New York City',
    state: 'New York',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Financial Modeling Analyst',
    company: 'State Employees\' Credit Union',
    city: 'Raleigh',
    state: 'North Carolina',
    url: 'https://www.onewire.com',
  }),
  new Job({
    title: 'Director, Risk Management Oversight',
    company: 'TMX Group Inc.',
    city: 'Toronto',
    state: 'Ontario',
    url: 'https://www.onewire.com',
  }),
];
