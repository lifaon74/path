import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import {
  getProcessPathSegments,
  type IGetProcessPathSegmentsOptions,
} from '../get/get-process-path-segments.js';
import {
  type IIsAbsolutePathSegmentsOptions,
  isAbsolutePathSegments,
} from '../is/is-absolute-path-segments.js';
import { type IResolvePathSegmentsOptions, resolvePathSegments } from './resolve-path-segments.js';

export interface IResolvePathSegmentsWithOptionalRootOptions
  extends IGetProcessPathSegmentsOptions,
    IIsAbsolutePathSegmentsOptions,
    IResolvePathSegmentsOptions {}

/**
 * Converts a path to an absolute path
 */
export function resolvePathSegmentsWithOptionalRoot(
  segments: IPathSegments,
  root: IPathSegments | undefined,
  options: IResolvePathSegmentsWithOptionalRootOptions,
): IPathSegments {
  if (root === undefined) {
    root = getProcessPathSegments(options);
  }

  if (isAbsolutePathSegments(root, options)) {
    return resolvePathSegments(segments, root, options);
  } else {
    throw new Error("Argument 'root' is not a valid root");
  }
}
