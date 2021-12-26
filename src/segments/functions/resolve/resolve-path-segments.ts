import { IGetProcessPathSegmentsOptions } from '../get/get-process-path-segments';
import { IIsAbsolutePathSegmentsOptions } from '../is/is-absolute-path-segments';
import { isRelativePathSegment } from '../../segment/functions/is/is-relative-path-segement';
import { IPathSegments } from '../../types/path-segments.type';
import { joinManyPathSegments } from '../join/join-many-path-segments';

export interface IResolvePathSegmentsOptions extends IGetProcessPathSegmentsOptions, IIsAbsolutePathSegmentsOptions {

}

/**
 * Converts a path to an absolute path
 * INFO: root must be an absolute path
 */
export function resolvePathSegments(
  segments: IPathSegments,
  root: IPathSegments,
  options: IResolvePathSegmentsOptions,
): IPathSegments {
  if (isRelativePathSegment(segments[0])) {
    // const absolutePath: TNormalizedPathSegments = root.slice();
    // for (let i = path.length, l = path.length; i < l; i++) {
    //   PathSegmentsPush(absolutePath, path[i], options);
    // }
    // return absolutePath;
    return joinManyPathSegments([root, segments], options);
  } else {
    return segments.slice();
  }
}

