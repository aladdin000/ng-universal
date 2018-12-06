export type HeaderWidth = 'medium' | 'large' | 'full';

interface IHeaderWidth {
  medium: HeaderWidth;
  large: HeaderWidth;
  full: HeaderWidth;
}

export const HEADER_WIDTH_TYPES: IHeaderWidth = Object.freeze({
  medium: 'medium' as HeaderWidth,
  large: 'large' as HeaderWidth,
  full: 'full' as HeaderWidth,
});
