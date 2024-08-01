import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegment } from '../../../../types/segments/segment/path-segment.type.js';
import type { IUncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.type.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IPushSegmentIntoMutablePathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Inserts `segment` at the end of the path.
 *  - may insert `..` if the path is not a single root
 *  - cannot insert a root
 *  - the path remains valid
 */
export function pushSegmentIntoMutablePathSegments(
  segments: IMutablePathSegments,
  segment: IUncheckedPathSegment,
  { rootRegExp }: IPushSegmentIntoMutablePathSegmentsOptions,
): void {
  if (segment === '.') {
    // nothing to do
    /* segment is not . */
  } else if (segment === '..') {
    const lastSegment: IPathSegment = segments[segments.length - 1];
    if (lastSegment === '.') {
      // path is ['.']
      segments[0] = segment; // path becomes ['..']
      /* lastSegment is not . */
    } else if (lastSegment === '..') {
      // path is ['..', or more '..']
      segments.push(segment); // path becomes [...'..', '..']
      /* lastSegment is not .. */
    } else if (isRootPathSegment(lastSegment, rootRegExp)) {
      // path is [root]
      throw new Error("Cannot push '..' into a path with only one segment of type root");
      /* lastSegment is not a root */
    } else {
      // path contains at least one entry [start, ...entries?, entry]
      segments.pop(); // path becomes [start, ...entries?]
    }
    /* segment not .. */
  } else if (isRootPathSegment(segment, rootRegExp)) {
    throw new Error('Cannot push a root into a path');
    /* segment is not a root */
  } else {
    // segment is an entry
    segments.push(segment);
  }
}
