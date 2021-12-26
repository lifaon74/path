import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { IForcePathSegmentsAsRelativeOptions } from '../mutate/force-path-segments-as-relative';
import { IPathSegments } from '../../types/path-segments.type';
import { forcePathSegmentsAsRelative } from '../mutate/force-path-segments-as-relative';

export interface IMakePathSegmentsAsRelativeOptions extends IForcePathSegmentsAsRelativeOptions {
}

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
