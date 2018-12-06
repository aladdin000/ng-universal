export class Contact {
  public title: string = null;
  public address?: string = null;
  public addressAdditional?: string = null;
  public tel?: string = null;
  public fax?: string = null;
  public email?: string = null;
  public direction?: string = null;
  public image?: string = null;

  constructor(data: { [key: string]: string }) {
    Object.keys(this).forEach(prop => {
      if (data[prop]) {
        this[prop] = data[prop];
      }
    });
  }
}

export const CONTACTS: Array<Contact> = [
  new Contact({
    title: 'United States',
    address: '111 Town Square Place, 14th Floor',
    addressAdditional: 'Jersey City, New Jersey 07310 USA',
    tel: '+1 201-719-7210',
    fax: '+1 201-222-5022',
    direction: 'https://maps.google.com/?daddr=111%20Town%20Square%20Place,%20Jersey%20City,%20New%20Jersey,%2007014',
    image: '/assets/images/map-nj.png',
  }),
  new Contact({
    title: 'United Kingdom',
    address: '4th Floor, 17 Devonshire Square',
    addressAdditional: 'London EC2M 4SQ',
    tel: '+44 (0)-20-7397-9630',
    fax: '+44 (0)-20-7626-9300',
    direction: 'https://maps.google.com/?daddr=4th%20Floor,%2017%20Devonshire%20Square,%20London,%20England',
    image: '/assets/images/map-london.png',
  }),
  new Contact({
    title: 'Washington D.C.',
    address: '1001 19th Street North, #1200',
    addressAdditional: 'Arlington, Virginia 22209 USA',
    tel: '+1 703-420-0920',
    direction: 'https://maps.google.com/?daddr=1001%2019th%20Street%20North,%20#1200%20Arlington,%20Virginia%2022209%20USA',
    image: '/assets/images/map-dc.png',
  }),
  new Contact({
    title: 'Beijing',
    address: 'Unit 1010 Financial Street Centre, No 9A, Financial Street',
    addressAdditional: 'Xicheng District, Beijing 100033 P.R. China',
    tel: '+86 (010) 5737-9835',
    direction: 'https://maps.google.com/?daddr=Unit%201010%20Financial%20Street%20Centre,%20No%209A,%20Financial%20Street%20Xicheng%20District,%20Beijing%20100033%20P.R.%20China',
    image: '/assets/images/map-beijing.png',
  }),
  new Contact({
    title: 'Member services',
    email: 'memberservices@garp.com',
    tel: '+1 201-719-7210',
    fax: '+1 201-222-5022',
  }),
  new Contact({
    title: 'Career Center',
    email: 'careercenter@garp.com ',
    tel: '+1 201-719-7216',
    fax: '+1 201-222-5022',
  }),
];
