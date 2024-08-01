import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  type IPushSegmentIntoMutablePathSegmentsOptions,
  pushSegmentIntoMutablePathSegments,
} from '../mutate/push-segment-into-mutable-path-segments.js';
import { getCommonBaseOfManyPathSegments } from './get-common-base-of-many-path-segments.js';

export interface IGetRelativePathSegmentsOptions
  extends IPushSegmentIntoMutablePathSegmentsOptions {}

/**
 * Returns the relative `IPathSegments` between `from` and `to`:
 *  - if no common base path => `[]`
 *  - else `['..' | '.', ...]`
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
    for (let i: number = commonBase.length; i < from.length; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, '..', options);
    }
    for (let i: number = commonBase.length; i < to.length; i++) {
      pushSegmentIntoMutablePathSegments(relativePath, to[i], options);
    }
    return relativePath;
  }
}
