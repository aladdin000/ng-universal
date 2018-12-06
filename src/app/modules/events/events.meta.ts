import { IMetaObject } from '../shared/models/meta-data';

const common = {
  title: 'Global Association of Risk Professionals | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

const index = common;
const person = common;

const virtual = {
  title: 'Risk management in the 21st century',
  description: 'Join us as Salvatore Cucchiara, Foresight Strategist at the Government of Alberta’s Department of Energy, Alberta CoLab, argues the importance of drawing on foresight tools for better strategic risk management in the energy world.',
};

export const EVENTS_META: IMetaObject = Object.freeze({
  index: {
    title: index.title,
    description: index.description,
    og: {
      title: index.title,
      description: index.description,
    },
    twitter: {
      title: index.title,
      description: index.description,
    },
  },
  person: {
    title: person.title,
    description: person.description,
    og: {
      title: person.title,
      description: person.description,
    },
    twitter: {
      title: person.title,
      description: person.description,
    },
  },
  virtual: {
    title: virtual.title,
    description: virtual.description,
    og: {
      title: virtual.title,
      description: virtual.description,
    },
    twitter: {
      title: virtual.title,
      description: virtual.description,
    },
  },
});
