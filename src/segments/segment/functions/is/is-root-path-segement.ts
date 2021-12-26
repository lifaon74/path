import { IUncheckedPathSegment } from '../../types/unchecked-path-segment.type';

/**
 * Returns true if 'segment' is a root segment.
 */
export function isRootPathSegment(
  segment: IUncheckedPathSegment,
  rootRegExp: RegExp,
): boolean {
  return rootRegExp.test(segment);
}
