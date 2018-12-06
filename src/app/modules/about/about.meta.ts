import { IMetaObject } from '../shared/models/meta-data';

const common = {
  title: 'Global Association of Risk Professionals | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

const aboutUs = {
  title: 'About Us | GARP',
  description: 'Enabling the risk community to make better informed risk decisions through “creating a culture of risk awareness®”. We do this by educating and informing at all levels, from those beginning their careers in risk, to those leading risk programs at the largest financial institutions across the globe, as well as, the regulators that govern them.',
};

const benchmarking = common;

const academicPartners = common;

const sideRisk = common;

const contactUs = common;

export const ABOUT_META: IMetaObject = Object.freeze({
  aboutUs: {
    title: aboutUs.title,
    description: aboutUs.description,
    og: {
      title: aboutUs.title,
      description: aboutUs.description,
    },
    twitter: {
      title: aboutUs.title,
      description: aboutUs.description,
    },
  },
  benchmarking: {
    title: benchmarking.title,
    description: benchmarking.description,
    og: {
      title: benchmarking.title,
      description: benchmarking.description,
    },
    twitter: {
      title: benchmarking.title,
      description: benchmarking.description,
    },
  },
  academicPartners: {
    title: academicPartners.title,
    description: academicPartners.description,
    og: {
      title: academicPartners.title,
      description: academicPartners.description,
    },
    twitter: {
      title: academicPartners.title,
      description: academicPartners.description,
    },
  },
  sideRisk: {
    title: sideRisk.title,
    description: sideRisk.description,
    og: {
      title: sideRisk.title,
      description: sideRisk.description,
    },
    twitter: {
      title: sideRisk.title,
      description: sideRisk.description,
    },
  },
  contactUs: {
    title: contactUs.title,
    description: contactUs.description,
    og: {
      title: contactUs.title,
      description: contactUs.description,
    },
    twitter: {
      title: contactUs.title,
      description: contactUs.description,
    },
  },
});
