import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  type IIsAbsolutePathSegmentsOptions,
  isAbsolutePathSegments,
} from '../is/is-absolute-path-segments.js';
import { pushSegmentIntoMutablePathSegments } from '../mutate/push-segment-into-mutable-path-segments.js';

export interface IJoinManyPathSegmentsOptions extends IIsAbsolutePathSegmentsOptions {
  readonly strict?: boolean;
}

/**
 * Joins many PathSegments
 *  - pretty close to convertUncheckedPathSegmentsIntoPathSegments(['a'].concat(['b']))
 */
export function joinManyPathSegments(
  paths: readonly IPathSegments[],
  { strict = true, ...options }: IJoinManyPathSegmentsOptions,
): IPathSegments {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error('Expected at least one path');
  } else {
    const joined: IMutablePathSegments = paths[0].slice();
    for (let i: number = 1; i < pathsLength; i++) {
      const path: IPathSegments = paths[i];
      let j: number = 0;
      if (isAbsolutePathSegments(path, options) && i > 0) {
        if (strict) {
          throw new Error('Only the first path can be absolute.');
        } else {
          j = 1;
        }
      }
      for (; j < path.length; j++) {
        pushSegmentIntoMutablePathSegments(joined, path[j], options);
      }
    }
    return joined;
  }
}
