import {
  IPathSegmentsSharedOptions, IPathSegmentsToStringPathOptions, TNormalizedPathSegments, TPathSegments
} from './interfaces';
import { IsRootPathSegments } from './infos';
import { NormalizePathSegments } from './normalize';
import { SLASH_REGEXP } from './configs';

/**
 * CONVERTERS TO AND FROM PATH SEGMENTS
 */


/**
 * Converts a string path to a PathSegments
 */
export function StringPathToPathSegments(path: string, options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  return NormalizePathSegments(StringPathToRawPathSegments(path, options), options);
}

export function StringPathToRawPathSegments(path: string, options: IPathSegmentsSharedOptions): TPathSegments {
  if (path === '') {
    return [];
  } else {
    options.rootRegExp.lastIndex = 0;

    const match: RegExpExecArray | null = options.rootRegExp.exec(path);
    // console.log(options.rootRegExp);
    // console.log(path);
    // console.log(match);

    if (match === null) {
      return path.split(SLASH_REGEXP);
    } else {
      path = path.slice(match[0].length);
      return [match[1], ...path.split(SLASH_REGEXP)];
    }
  }
  // return (path === '')
  //   ? []
  //   : path.split(/[\\\/]/);
}

/**
 * Converts a PathSegments to a string path
 */
export function PathSegmentsToStringPath(path: TNormalizedPathSegments, options: IPathSegmentsToStringPathOptions): string {
  return IsRootPathSegments(path, options)
    ? (path[0] + options.separator)
    : path.join(options.separator);
}


