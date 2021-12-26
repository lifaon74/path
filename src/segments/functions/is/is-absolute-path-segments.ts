import { IPathSegments } from '../../types/path-segments.type';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement';

export interface IIsAbsolutePathSegmentsOptions {
  rootRegExp: RegExp;
}

/**
 * Returns true if the path is absolute
 */
export function isAbsolutePathSegments(
  segments: IPathSegments,
  {
    rootRegExp,
  }: IIsAbsolutePathSegmentsOptions,
): boolean {
  return isRootPathSegment(
    segments[0],
    rootRegExp,
  );
}
