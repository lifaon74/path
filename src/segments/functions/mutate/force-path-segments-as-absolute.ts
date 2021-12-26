import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement';
import { IPathSegment } from '../../segment/types/path-segment.type';

export interface IForcePathSegmentsAsAbsoluteOptions {
  rootRegExp: RegExp;
}
/**
 * Converts a relative path to an absolute path, by appending 'rootSegment' at the beginning of the path
 */
export function forcePathSegmentsAsAbsolute(
  segments: IMutablePathSegments,
  rootSegment: IPathSegment,
  {
    rootRegExp,
  }: IForcePathSegmentsAsAbsoluteOptions,
): void {
  if (isRootPathSegment(rootSegment, rootRegExp)) {
    const firstSegment: IPathSegment = segments[0];
    if (firstSegment === '.') {
      segments[0] = rootSegment;
    } else if (firstSegment === '..') {
      while (segments[0] === '..') {
        segments.shift();
      }
      segments.unshift(rootSegment);
    } else if (isRootPathSegment(firstSegment, rootRegExp)) {
      // do nothing
    } else {
      throw new Error(`Path is not normalized`);
    }
  } else {
    throw new Error(`Root is invalid`);
  }
}
