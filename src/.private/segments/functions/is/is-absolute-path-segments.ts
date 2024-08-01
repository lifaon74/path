import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IIsAbsolutePathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Returns `true` if the path is absolute.
 */
export function isAbsolutePathSegments(
  segments: IPathSegments,
  { rootRegExp }: IIsAbsolutePathSegmentsOptions,
): boolean {
  return isRootPathSegment(segments[0], rootRegExp);
}
