import { IPathSegments } from '../../types/path-segments.type';
import { IIsAbsolutePathSegmentsOptions, isAbsolutePathSegments } from '../is/is-absolute-path-segments';
import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { pushSegmentIntoMutablePathSegments } from '../mutate/push-segment-into-mutable-path-segments';

export interface IJoinManyPathSegmentsOptions extends IIsAbsolutePathSegmentsOptions {
  strict?: boolean;
}

/**
 * Joins many PathSegments
 *  - pretty close to convertUncheckedPathSegmentsIntoPathSegments(['a'].concat(['b']))
 */
export function joinManyPathSegments(
  paths: IPathSegments[],
  options: IJoinManyPathSegmentsOptions,
): IPathSegments {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error(`Expected at least one path`);
  } else {
    const joined: IMutablePathSegments = paths[0].slice();
    for (let i = 1; i < pathsLength; i++) {
      const path: IPathSegments = paths[i];
      let j: number = 0;
      if (isAbsolutePathSegments(path, options) && (i > 0)) {
        if ((options.strict === void 0) || options.strict) {
          throw new Error('Only the first path can be absolute.');
        } else {
          j = 1;
        }
      }
      for (const l = path.length; j < l; j++) {
        pushSegmentIntoMutablePathSegments(joined, path[j], options);
      }
    }
    return joined;
  }
}
