type LineTitleTypeFrm = 'frm';
type LineTitleTypeErp = 'erp';
type LineTitleTypeCourses = 'courses';
type LineTitleTypeMember = 'member';
type LineTitleTypeEvents = 'events';
type LineTitleTypeCpd = 'cpd';
type LineTitleTypeCorp = 'corp';
type LineTitleTypeGri = 'gri';

export type LineTitleTypes =  'frm' | 'erp' | 'courses' | 'member' | 'events' | 'cpd' | 'corp' | 'gri';

export interface ILineTitleTypes {
  frm: LineTitleTypeFrm;
  erp: LineTitleTypeErp;
  courses: LineTitleTypeCourses;
  member: LineTitleTypeMember;
  events: LineTitleTypeEvents;
  cpd: LineTitleTypeCpd;
  corp: LineTitleTypeCorp;
  gri: LineTitleTypeGri;
}

export const LINE_TITLE_TYPES: ILineTitleTypes = Object.freeze({
  frm: 'frm' as LineTitleTypeFrm,
  erp: 'erp' as LineTitleTypeErp,
  courses: 'courses' as LineTitleTypeCourses,
  member: 'member' as LineTitleTypeMember,
  events: 'events' as LineTitleTypeEvents,
  cpd: 'cpd' as LineTitleTypeCpd,
  corp: 'corp' as LineTitleTypeCorp,
  gri: 'gri' as LineTitleTypeGri,
});
