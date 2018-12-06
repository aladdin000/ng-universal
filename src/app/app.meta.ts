import { IMetaObject } from './modules/shared/models/meta-data';

const common = {
  title: 'Global Association of Risk Professionals | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

const home = common;

const riskInstitute = common;

const cpd = common;

const testimonial = {
  title: 'testimonials | GARP',
  description: common.description,
};

export const APP_META: IMetaObject = Object.freeze({
  home: {
    title: home.title,
    description: home.description,
    og: {
      title: home.title,
      description: home.description,
    },
    twitter: {
      title: home.title,
      description: home.description,
    },
  },
  riskInstitute: {
    title: riskInstitute.title,
    description: riskInstitute.description,
    og: {
      title: riskInstitute.title,
      description: riskInstitute.description,
    },
    twitter: {
      title: riskInstitute.title,
      description: riskInstitute.description,
    },
  },
  cpd: {
    title: cpd.title,
    description: cpd.description,
    og: {
      title: cpd.title,
      description: cpd.description,
    },
    twitter: {
      title: cpd.title,
      description: cpd.description,
    },
  },
  testimonial: {
    title: testimonial.title,
    description: testimonial.description,
    og: {
      title: testimonial.title,
      description: testimonial.description,
    },
    twitter: {
      title: testimonial.title,
      description: testimonial.description,
    },
  },
});
