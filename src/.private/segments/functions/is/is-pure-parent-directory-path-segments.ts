import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import type { IPathSegment } from '../../../../types/segments/segment/path-segment.type.js';

/**
 * Returns true if the path contains only `..`.
 */
export function isPureParentDirectoryPathSegments(segments: IPathSegments): boolean {
  return segments.every((segment: IPathSegment): boolean => segment === '..');
}
