import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  getBasenameOfPathSegment,
  type IGetBasenameOfPathSegmentOptions,
} from '../../segment/functions/get/get-basename-of-path-segment.js';

export interface IGetBasenameOfPathSegmentsOptions extends IGetBasenameOfPathSegmentOptions {}

/**
 * Returns the basename of `segments`.
 */
export function getBasenameOfPathSegments(
  segments: IPathSegments,
  ext: string | undefined,
  options: IGetBasenameOfPathSegmentsOptions,
): string | null {
  return getBasenameOfPathSegment(segments[segments.length - 1], ext, options);
}
