import { IPathSegments } from '../../types/path-segments.type';
import { IPathSegment } from '../../segment/types/path-segment.type';
import { IMutablePathSegments } from '../../types/mutable-path-segments.type';


/**
 * Extracts the common base from many PathSegments
 * - if no common base, returns []
 * - if common base is absolute, returns ['', ...]
 * - if common base is relative, returns ['..' | '.', ...]
 */
export function getCommonBaseOfManyPathSegments(
  paths: readonly IPathSegments[],
): IPathSegments | null {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error(`Expected at least one path`);
  } else {
    if (pathsLength === 1) {
      return paths[0].slice();
    } else {
      const commonBase: IMutablePathSegments = [];

      let segment: IPathSegment;
      let path: IPathSegments;
      let commonBaseLength: number;
      while (true) {
        commonBaseLength = commonBase.length;
        path = paths[0];
        segment = path[commonBaseLength];
        for (let i = 1; i < pathsLength; i++) {
          path = paths[i];
          if (
            (path.length <= commonBaseLength)
            || (path[commonBaseLength] !== segment)
          ) {
            return (commonBaseLength === 0)
              ? null
              : commonBase;
          }
        }
        commonBase.push(segment);
      }
    }
  }
}
