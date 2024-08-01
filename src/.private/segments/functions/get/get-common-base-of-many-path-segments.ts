import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import type { IPathSegment } from '../../../../types/segments/segment/path-segment.type.js';

/**
 * Extracts the common base from many `IPathSegments`:
 * - if no common base, returns `[]`
 * - if common base is _absolute_, returns `['', ...]`
 * - if common base is _relative_, returns `['..' | '.', ...]`
 */
export function getCommonBaseOfManyPathSegments(
  paths: readonly IPathSegments[],
): IPathSegments | null {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error('Expected at least one path');
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
          if (path.length <= commonBaseLength || path[commonBaseLength] !== segment) {
            return commonBaseLength === 0 ? null : commonBase;
          }
        }
        commonBase.push(segment);
      }
    }
  }
}
