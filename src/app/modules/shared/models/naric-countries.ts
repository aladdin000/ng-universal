export interface INaricCountry {
  name: string;
  degreeLevel: string;
  flag: string;
}

export const NARIC_COUNTRIES: Array<INaricCountry> = [
  {
    name: "United States",
    degreeLevel: "American master's degree standard",
    flag: '/assets/icons/flags/united-states.png'
  },
  {
    name: "Canada",
    degreeLevel: "Ontario Qualifications Framework Level 12",
    flag: '/assets/icons/flags/canada.png'
  },
  {
    name: "United Kingdom",
    degreeLevel: "Regulated Qualifications Framework Level 7",
    flag: '/assets/icons/flags/united-kingdom.png'
  },
  {
    name: "European Union",
    degreeLevel: "European Qualifications Framework Level 7",
    flag: '/assets/icons/flags/european-union.png'
  },
  {
    name: "Hong Kong",
    degreeLevel: "Hong Kong Qualifications Framework Level 6",
    flag: '/assets/icons/flags/hong-kong.png'
  },
  {
    name: "Taiwan",
    degreeLevel: "Taiwanese master's degree standard",
    flag: '/assets/icons/flags/taiwan.png'
  },
  {
    name: "Singapore",
    degreeLevel: "Singaporean master's degree standard",
    flag: '/assets/icons/flags/singapore.png'
  },
  {
    name: "Australia",
    degreeLevel: "Australian Qualifications Framework Level 9",
    flag: '/assets/icons/flags/australia.png'
  },
  {
    name: 'India',
    degreeLevel: "Indian master's degree standard / National Qualifications Framework Level 9",
    flag: '/assets/icons/flags/india.png'
  },
  {
    name: 'South Africa',
    degreeLevel: 'National Qualifications Framework Level 9',
    flag: '/assets/icons/flags/south-africa.png'
  }
];
