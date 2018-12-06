export interface IAcademic {
  image: string;
  name: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export const ACADEMICS: Array<IAcademic> = [
  {
    image: '/assets/images/DeGroote-McMaster.png',
    name: 'McMaster University - Master of Finance (MFin) Program',
    description: 'The Master of Finance (MFin) program offered by the DeGroote School of Business at McMaster University provides students with the skills and knowledge they need to succeed in an increasingly complex and technical work environment of the financial industry. The 16-month program includes a unique blend of economics, finance, and quantitative methods that financial industry employers are seeking in the workforce. Graduates of the program will be specialists with highly developed analytical skills and a deep understanding of financial concepts.',
    linkText: 'Visit McMaster University - Master of Finance (MFin) Program page',
    linkUrl: 'https://mfin.degroote.mcmaster.ca/',
  }, {
    image: '/assets/images/kent-business.jpg',
    name: 'University of Kent - MSc Finance (Finance,Investment and Risk)',
    description: 'The MSc Finance (Finance, Investment and Risk) at Kent Business School, University of Kent provides a solid background to modern financial theory and practice. The programme provides a comprehensive framework of knowledge and understanding in the function of financial markets and their instruments, with particular emphasis on investment practices and risk management.',
    linkText: 'Visit University of Kent - MSc Finance (Finance,Investment and Risk) page',
    linkUrl: 'https://www.kent.ac.uk/courses/postgraduate/1703/finance-investment-and-risk',
  }, {
    image: '/assets/images/Tapmi.jpg',
    name: 'T.A. Pai Management Institute (TAPMI)',
    description: 'The PGDM (BKFS) program offered by TAPMI is a two year full time residential post graduate program that focuses on the fast growing banking and financial services industry and is built on a unique curriculum structure that hones the skills of students in Finance. Aided by the state of the art Finance lab, this course enables the students to pursue a managerial career in the area of banking and financial services. Leading national and multinational banks and financial institutions participate in the placement process every year to take the best pick from the BKFS cohort.',
    linkText: 'Visit T.A. Pai Management Institute (TAPMI) page',
    linkUrl: 'https://www.tapmi.edu.in/programs/bkfs/',
  }, {
    image: '/assets/images/Logotype_Final_RVB EMLyon.jpg',
    name: 'emLyon Business School',
    description: 'MSc in Management - Grande Ecole \n' +
      ' The Right Programme To Tailor Your Career Plans.......Every day, around the world, young graduates face the challenge of showing future employers their added value. When it is your turn to find your dream job, ask yourself if you have what it takes to face this challenge.\n' +
      'By joining the MSc in Management - Grande Ecole, you will learn how to think, manage and operate effectively in today\'s global business environment, and along the way acquire the tangible evidence to show it.\n' +
      'You will be taking general management classes with international students from over 70 nationalities, and spend a minimum of 6 months in a country other than your own. The programme offers 12 months of internships in international companies, and has over 160 international exchange partners. In short, all you need to get your career in international management started off on the right foot!\n' +
      '\n' +
      'Fast Facts\n' +
      '•\t2-to 3-year general management programme\n' +
      '•\tOver 200 electives to tailor to your career ambitions\n' +
      '•\tFreely alternate academic periods with in-company internships\n' +
      '•\tStudy in France, China, or go on one of the 160 international exchanges\n' +
      '•\tTaught in English / French\n' +
      '•\tYearly intake: September\n' +
      '•\tTuition Fees for the 2018 intake 17,500€ per year',
    linkText: 'Visit emLyon Business School page',
    linkUrl: 'http://www.em-lyon.com/fr',
  },
];
