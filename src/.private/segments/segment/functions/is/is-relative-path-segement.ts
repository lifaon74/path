import type { IUncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.type.js';

/**
 * Returns true if 'segment' is a relative segment
 */
export function isRelativePathSegment(segment: IUncheckedPathSegment): boolean {
  return segment === '.' || segment === '..';
}
