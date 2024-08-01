import type { IUncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.type.js';

/**
 * Returns true if 'segment' is a root segment.
 */
export function isRootPathSegment(segment: IUncheckedPathSegment, rootRegExp: RegExp): boolean {
  return rootRegExp.test(segment);
}
