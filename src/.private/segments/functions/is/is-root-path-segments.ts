import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';

export interface IIsRootPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

export function isRootPathSegments(
  segments: IPathSegments,
  { rootRegExp }: IIsRootPathSegmentsOptions,
): boolean {
  return segments.length === 1 && isRootPathSegment(segments[0], rootRegExp);
}
