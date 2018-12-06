import { IMetaObject } from '../shared/models/meta-data';

const common = {
  title: 'Member Offers | GARP',
  description: 'Global Association of Risk Professionals | The Only Globally Recognized Membership Association for Risk Managers.',
};

const index = {
  title: common.title,
  description: 'Being part of our risk-focused community means having access to expert knowledge and global networking opportunities not available anywhere else. In 195 countries around the world, our members work in regional and global banks, asset management firms, insurance companies, central banks, securities regulators, hedge funds, universities, large industrial corporations and multinationals.',
};

const networking = {
  title: 'Global Association of Risk Professionals | GARP',
  description: common.description,
};

const chapters = {
  title: 'Chapters | GARP',
  description: 'Our Professional and University Chapters positions you to make new contacts, gain new knowledge about important topics, and stay on the cutting edge of risk management. As a member of our community, you may attend our chapter meetings anywhere in the world and will always be welcome.',
};

const careers = {
  title: 'Career Center | GARP',
  description: 'Global Association of Risk Professionals offers the top jobs available in Risk Professionals. Search and apply to open positions or post jobs on Global Association of Risk Professionals now.',
};

const spotlight = {
  title: common.title,
  description: common.description,
};

const student = {
  title: 'Global Association of Risk Professionals | GARP',
  description: common.description,
};

const chapterMeetingDetail = {
  title: 'Student Membership | GARP',
  description: common.description,
};

const listing = {
  title: 'Chapters | GARP',
  description: common.description,
};

export const MEMBERSHIP_META: IMetaObject = Object.freeze({
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
  networking: {
    title: networking.title,
    description: networking.description,
    og: {
      title: networking.title,
      description: networking.description,
    },
    twitter: {
      title: networking.title,
      description: networking.description,
    },
  },
  chapters: {
    title: chapters.title,
    description: chapters.description,
    og: {
      title: chapters.title,
      description: chapters.description,
    },
    twitter: {
      title: chapters.title,
      description: chapters.description,
    },
  },
  chapterMeetingDetail: {
    title: chapterMeetingDetail.title,
    description: chapterMeetingDetail.description,
    og: {
      title: chapterMeetingDetail.title,
      description: chapterMeetingDetail.description,
    },
    twitter: {
      title: chapterMeetingDetail.title,
      description: chapterMeetingDetail.description,
    },
  },
  careers: {
    title: careers.title,
    description: careers.description,
    og: {
      title: careers.title,
      description: careers.description,
    },
    twitter: {
      title: careers.title,
      description: careers.description,
    },
  },
  spotlight: {
    title: spotlight.title,
    description: spotlight.description,
    og: {
      title: spotlight.title,
      description: spotlight.description,
    },
    twitter: {
      title: spotlight.title,
      description: spotlight.description,
    },
  },
  student: {
    title: student.title,
    description: student.description,
    og: {
      title: student.title,
      description: student.description,
    },
    twitter: {
      title: student.title,
      description: student.description,
    },
  },
  listing: {
    title: listing.title,
    description: listing.description,
    og: {
      title: listing.title,
      description: listing.description,
    },
    twitter: {
      title: listing.title,
      description: listing.description,
    },
  },
});
