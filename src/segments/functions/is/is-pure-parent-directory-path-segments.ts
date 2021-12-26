import { IPathSegments } from '../../types/path-segments.type';
import { IPathSegment } from '../../segment/types/path-segment.type';

/**
 * Returns true if the path contains only '..'
 */
export function isPureParentDirectoryPathSegments(
  segments: IPathSegments,
): boolean {
  return segments.every((segment: IPathSegment): boolean => (segment === '..'));
}
