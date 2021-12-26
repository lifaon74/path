import { IUncheckedPathSegment } from '../../types/unchecked-path-segment.type';

/**
 * Returns true if 'segment' is a relative segment
 */
export function isRelativePathSegment(
  segment: IUncheckedPathSegment,
): boolean {
  return (
    (segment === '.')
    || (segment === '..')
  );
}
