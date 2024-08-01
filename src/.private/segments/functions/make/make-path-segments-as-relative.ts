import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  forcePathSegmentsAsRelative,
  type IForcePathSegmentsAsRelativeOptions,
} from '../mutate/force-path-segments-as-relative.js';

export interface IMakePathSegmentsAsRelativeOptions extends IForcePathSegmentsAsRelativeOptions {}

/**
 * @see forcePathSegmentsAsRelative
 */
export function makePathSegmentsAsRelative(
  segments: IPathSegments,
  options: IMakePathSegmentsAsRelativeOptions,
): IPathSegments {
  const _segments: IMutablePathSegments = segments.slice();
  forcePathSegmentsAsRelative(_segments, options);
  return _segments;
}
