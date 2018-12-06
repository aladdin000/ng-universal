export class Network {
  public name: string = null;
  public title: string = null;
  public text: string = null;
  public link: string = null;
  public linkText: string = null;

  constructor(data: { [key: string]: string }) {
    Object.keys(this).forEach(prop => {
      if (data[prop]) {
        this[prop] = data[prop];
      }
    });
  }
}

export const NETWORKS: Array<Network> = [
  new Network({
    name: 'Membership',
    title: 'CONNECT WITH THE WORLD’S LARGEST COMMUNITY OF RISK PROFESSIONALS',
    text: 'With more than 150,000 members in 190 countries and territories, GARP is the leading professional association for risk practitioners.',
    link: 'https://www.garp.org/',
    linkText: 'JOIN US',
  }),
  new Network({
    name: 'Events',
    title: 'CONNECT WITH EXPERTS AND PEERS',
    text: 'GARP events are designed to advance the practice of risk management and promote dialog, debate and understanding by bringing together risk practitioners, regulators and academics to discuss the most pressing risk issues of today.',
    link: 'https://www.garp.org/',
    linkText: 'GET EDUCATED',
  }),
  new Network({
    name: 'Career Center',
    title: 'CONNECT WITH OPPORTUNITIES',
    text: 'The perfect place to match qualified risk practitioners with new opportunities in the growing and evolving practice of risk.',
    link: 'https://www.garp.org/',
    linkText: 'FIND OPPORTUNITIES',
  }),
  new Network({
    name: 'Chapters',
    title: 'CONNECT LOCALLY',
    text: 'Local chapters are forums for learning and networking. Presentations of expert risk management information on timely topics are followed by networking with speakers and peers.',
    link: 'https://www.garp.org/',
    linkText: 'DISCOVER TOUR CHAPTER',
  }),
  new Network({
    name: 'Directory',
    title: 'CONNECT WITH THE CERTIFIED EXPERTS',
    text: 'The directory represents a community of distinguished risk professionals who have earned their Financial Risk Manager (FRM®) and/or Energy Risk Professional (ERP®) certification.',
    link: 'https://www.garp.org/',
    linkText: 'GET CONNECTED',
  }),
];
