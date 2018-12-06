import { IMetaObject } from '../shared/models/meta-data';

const foundation = {
  title: 'Foundations of Financial Risk | GARP',
  description: 'Foundations of Financial Risk (Foundations) is a self-guided e-learning course that provides an introduction to the fundamental areas of financial risk. The course pays special attention to the ways in which financial institutions operate and the impact of international regulations.',
};

const financial = {
  title: 'Financial Risk and Regulation | GARP',
  description: 'Risk and Regulation is a four-part, self-study course designed with mid-level risk professionals in mind, and builds upon the concepts covered in the Foundations course. The course offers a detailed analysis of the industry’s current methodologies, and gives a comprehensive review of governance structures, market, credit, operational risk, and asset and liability management.',
};

export const COURSES_META: IMetaObject = Object.freeze({
  foundation: {
    title: foundation.title,
    description: foundation.description,
    og: {
      title: foundation.title,
      description: foundation.description,
    },
    twitter: {
      title: foundation.title,
      description: foundation.description,
    },
  },
  financial: {
    title: financial.title,
    description: financial.description,
    og: {
      title: financial.title,
      description: financial.description,
    },
    twitter: {
      title: financial.title,
      description: financial.description,
    },
  },
});
