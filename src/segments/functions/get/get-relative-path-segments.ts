import { IPathSegments } from '../../types/path-segments.type';
import { getCommonBaseOfManyPathSegments } from './get-common-base-of-many-path-segments';
import {
  IPushSegmentIntoMutablePathSegmentsOptions, pushSegmentIntoMutablePathSegments,
} from '../mutate/push-segment-into-mutable-path-segments';
import { IMutablePathSegments } from '../../types/mutable-path-segments.type';

export interface IGetRelativePathSegmentsOptions extends IPushSegmentIntoMutablePathSegmentsOptions {
}

/**
 * Returns the relative PathSegments between 'from' and 'to'
 *  - if no common base path => []
 *  - else ['..' | '.', ...]
 */
export function getRelativePathSegments(
  from: IPathSegments,
  to: IPathSegments,
  options: IGetRelativePathSegmentsOptions,
): IPathSegments | null {
  const commonBase: IPathSegments | null = getCommonBaseOfManyPathSegments([from, to]);
  if (commonBase === null) {
    return null;
  } else {
    const relativePath: IMutablePathSegments = ['.'];
    for (let i = commonBase.length, l = from.length; i < l; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, '..', options);
    }
    for (let i = commonBase.length, l = to.length; i < l; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, to[i], options);
    }
    return relativePath;
  }
}
