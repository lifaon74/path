import { IPathSegments } from '../../types/path-segments.type';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement';

export interface IIsRootPathSegmentsOptions {
  rootRegExp: RegExp;
}

export function isRootPathSegments(
  segments: IPathSegments,
  {
    rootRegExp,
  }: IIsRootPathSegmentsOptions,
): boolean {
  return (segments.length === 1)
    && isRootPathSegment(segments[0], rootRegExp);
}
