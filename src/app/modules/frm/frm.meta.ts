import { IMetaObject } from '../shared/models/meta-data';

const overview = {
  title: 'Financial Risk Manager (FRM) | GARP',
  description: 'The Financial Risk Manager (FRM) designation is the most globally respected and widely recognized certification for financial risk management.',
};

const feesPayments = {
  title: 'Global Association of Risk Professionals | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

export const FRM_META: IMetaObject = Object.freeze({
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
