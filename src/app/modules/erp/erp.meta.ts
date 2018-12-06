import { IMetaObject } from '../shared/models/meta-data';

const common = {
  title: 'Global Association of Risk Professionals | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

const overview = {
  title: 'Energy Risk Professional (ERP) | GARP',
  description: 'Earning the Energy Risk Professional (ERP) designation is a great way to differentiate yourself and demonstrate to employers that you possess the knowledge and skills necessary to assess threats and opportunities across the energy value chain.',
};

const programExams = common;

const feesPayments = common;

export const ERP_META: IMetaObject = Object.freeze({
  overview: {
    title: overview.title,
    description: overview.description,
    og: {
      title: overview.title,
      description: overview.description,
    },
    twitter: {
      title: overview.title,
      description: overview.description,
    },
  },
  programExams: {
    title: programExams.title,
    description: programExams.description,
    og: {
      title: programExams.title,
      description: programExams.description,
    },
    twitter: {
      title: programExams.title,
      description: programExams.description,
    },
  },
  feesPayments: {
    title: feesPayments.title,
    description: feesPayments.description,
    og: {
      title: feesPayments.title,
      description: feesPayments.description,
    },
    twitter: {
      title: feesPayments.title,
      description: feesPayments.description,
    },
  },
});
