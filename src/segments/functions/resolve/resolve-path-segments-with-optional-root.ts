import { IPathSegments } from '../../types/path-segments.type';
import { getProcessPathSegments, IGetProcessPathSegmentsOptions } from '../get/get-process-path-segments';
import { IIsAbsolutePathSegmentsOptions, isAbsolutePathSegments } from '../is/is-absolute-path-segments';
import { IResolvePathSegmentsOptions, resolvePathSegments } from './resolve-path-segments';

export interface IResolvePathSegmentsWithOptionalRootOptions extends IGetProcessPathSegmentsOptions, IIsAbsolutePathSegmentsOptions, IResolvePathSegmentsOptions {

}

/**
 * Converts a path to an absolute path
 */
export function resolvePathSegmentsWithOptionalRoot(
  segments: IPathSegments,
  root: IPathSegments | undefined,
  options: IResolvePathSegmentsWithOptionalRootOptions,
): IPathSegments {
  if (root === void 0) {
    root = getProcessPathSegments(options);
  }

  if (isAbsolutePathSegments(root, options)) {
    return resolvePathSegments(segments, root, options);
  } else {
    throw new Error(`Argument 'root' is not a valid root`);
  }
}
