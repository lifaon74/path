import {
  IPathSegmentsSharedOptions, IPathSegmentsToStringPathOptions, TNormalizedPathSegments, TPathSegments
} from './interfaces';
import { IsRootPathSegments } from './infos';
import { NormalizePathSegments } from './normalize';

/**
 * CONVERTERS TO AND FROM PATH SEGMENTS
 */


/**
 * Converts a string path to a PathSegments
 */
export function StringPathToPathSegments(path: string, options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  return NormalizePathSegments(StringPathToRawPathSegments(path), options);
}

export function StringPathToRawPathSegments(path: string): TPathSegments {
  return (path === '')
    ? []
    : path.split(/[\\\/]/);
}

/**
 * Converts a PathSegments to a string path
 */
export function PathSegmentsToStringPath(path: TNormalizedPathSegments, options: IPathSegmentsToStringPathOptions): string {
  return IsRootPathSegments(path, options)
    ? (path[0] + options.separator)
    : path.join(options.separator);
}


