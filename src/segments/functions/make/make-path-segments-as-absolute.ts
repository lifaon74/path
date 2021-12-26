import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import {
  forcePathSegmentsAsAbsolute, IForcePathSegmentsAsAbsoluteOptions,
} from '../mutate/force-path-segments-as-absolute';
import { IPathSegments } from '../../types/path-segments.type';
import { IPathSegment } from '../../segment/types/path-segment.type';

export interface IMakePathSegmentsAsAbsoluteOptions extends IForcePathSegmentsAsAbsoluteOptions {
}

/**
 * @see forcePathSegmentsAsAbsolute
 */
export function makePathSegmentsAsAbsolute(
  segments: IPathSegments,
  rootSegment: IPathSegment,
  options: IMakePathSegmentsAsAbsoluteOptions,
): IPathSegments {
  const _segments: IMutablePathSegments = segments.slice();
  forcePathSegmentsAsAbsolute(_segments, rootSegment, options);
  return _segments;
}
