import { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { IPathSegment } from '../../../../types/segments/segment/path-segment.type.js';
import {
  forcePathSegmentsAsAbsolute,
  IForcePathSegmentsAsAbsoluteOptions,
} from '../mutate/force-path-segments-as-absolute.js';

export interface IMakePathSegmentsAsAbsoluteOptions extends IForcePathSegmentsAsAbsoluteOptions {}

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
