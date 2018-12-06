export interface IBook {
  name: string;
  description: string;
  imageUrl: string;
  downloadUrl: string;
}

export const FAKE_BOOKS: Array<IBook> = [
  {
    name: 'Test Book 1',
    description: 'Approximate subject weightings, curriculum readings, and objectives show the skills you will master while earning the certification.',
    imageUrl: 'https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/a1Z1W000003rOpPUAU/a2r1W000000qfAIQAY_FRM2018_LOangled.png',
    downloadUrl: 'http://go.garp.org/l/39542/2017-11-01/7v526v',
  },
  {
    name: 'Test Book 2',
    description: 'Primary topics and required readings for the current curriculum to help you formulate your study plan.',
    imageUrl: 'https://s3-us-west-2.amazonaws.com/garpsalesforcepublic/Content__c/a1Z1W000003rOpPUAU/a2r1W000000qfAIQAY_FRM2018_LOangled.png',
    downloadUrl: 'http://go.garp.org/l/39542/2017-11-01/7v526v',
  },
];
