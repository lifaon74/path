import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { isRelativePathSegment } from '../../segment/functions/is/is-relative-path-segement.js';
import type { IGetProcessPathSegmentsOptions } from '../get/get-process-path-segments.js';
import type { IIsAbsolutePathSegmentsOptions } from '../is/is-absolute-path-segments.js';
import { joinManyPathSegments } from '../join/join-many-path-segments.js';

export interface IResolvePathSegmentsOptions
  extends IGetProcessPathSegmentsOptions,
    IIsAbsolutePathSegmentsOptions {}

/**
 * Converts a path to an absolute path
 * INFO: root must be an absolute path
 */
export function resolvePathSegments(
  segments: IPathSegments,
  root: IPathSegments,
  options: IResolvePathSegmentsOptions,
): IPathSegments {
  if (isRelativePathSegment(segments[0])) {
    return joinManyPathSegments([root, segments], options);
  } else {
    return segments.slice();
  }
}
