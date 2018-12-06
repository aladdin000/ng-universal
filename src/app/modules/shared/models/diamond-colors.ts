export type diamondColors = 'purple' | 'blue' | 'dark-yellow';

interface IDiamondColors {
  purple: diamondColors;
  blue: diamondColors;
  darkYellow: diamondColors;
}

export const DIAMOND_COLORS: IDiamondColors = Object.freeze({
  purple: 'purple' as diamondColors,
  blue: 'blue' as diamondColors,
  darkYellow: 'dark-yellow' as diamondColors,
});
