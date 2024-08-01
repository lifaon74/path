import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IForcePathSegmentsAsRelativeOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Converts an absolute path to a relative path: replace the root by `.`.
 */
export function forcePathSegmentsAsRelative(
  segments: IMutablePathSegments,
  { rootRegExp }: IForcePathSegmentsAsRelativeOptions,
): void {
  if (isRootPathSegment(segments[0], rootRegExp)) {
    segments[0] = '.';
  }
}
