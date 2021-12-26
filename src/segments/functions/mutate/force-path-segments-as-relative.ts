import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement';

export interface IForcePathSegmentsAsRelativeOptions {
  rootRegExp: RegExp;
}

/**
 * Converts an absolute path to a relative path: replace the root by '.'
 */
export function forcePathSegmentsAsRelative(
  segments: IMutablePathSegments,
  {
    rootRegExp,
  }: IForcePathSegmentsAsRelativeOptions,
): void {
  if (isRootPathSegment(segments[0], rootRegExp)) {
    segments[0] = '.';
  }
}
