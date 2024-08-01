import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  type IIsRootPathSegmentsOptions,
  isRootPathSegments,
} from '../is/is-root-path-segments.js';

export interface IPathSegmentsToStringPathOptions extends IIsRootPathSegmentsOptions {
  readonly separator: string;
}

/**
 * Converts some`IPathSegments` into a string path.
 */
export function convertPathSegmentsToStringPath(
  segments: IPathSegments,
  { separator, ...options }: IPathSegmentsToStringPathOptions,
): string {
  return isRootPathSegments(segments, options) ? segments[0] + separator : segments.join(separator);
}
