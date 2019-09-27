import { IPathSegmentsJoinOptions, IPathSegmentsSharedOptions, TNormalizedPathSegments } from './interfaces';
import { IsRelativePathSegment } from './segment';
import { PathSegmentsPush } from './mutate';
import { IsAbsolutePathSegments } from './infos';
import { GetProcessPathSegments } from './others';


/**
 * Joins many PathSegments
 *  - pretty close to NormalizePathSegments(['a'].concat(['b']))
 */
export function JoinPathSegments(paths: TNormalizedPathSegments[], options: IPathSegmentsJoinOptions): TNormalizedPathSegments {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error(`Expected at least one path`);
  } else {
    const joined: TNormalizedPathSegments = paths[0].slice();
    for (let i = 1; i < pathsLength; i++) {
      const path: TNormalizedPathSegments = paths[i];
      let j: number = 0;
      if (IsAbsolutePathSegments(path, options) && (i > 0)) {
        if ((options.strict === void 0) || options.strict) {
          throw new Error('Only the first path can be absolute.');
        } else {
          j = 1;
        }
      }
      for (const l = path.length; j < l; j++) {
        PathSegmentsPush(joined, path[j], options);
      }
    }
    return joined;
  }
}



/**
 * Extracts the common base from many PathSegments
 * - if no common base, returns []
 * - if common base is absolute, returns ['', ...]
 * - if common base is relative, returns ['..' | '.', ...]
 */
export function CommonBasePathSegments(paths: TNormalizedPathSegments[]): TNormalizedPathSegments | null {
  const pathsLength: number = paths.length;
  if (pathsLength === 0) {
    throw new Error(`Expected at least one path`);
  } else {
    if (pathsLength === 1) {
      return paths[0].slice();
    } else {
      const commonBase: TNormalizedPathSegments = [];

      let segment: string;
      let path: TNormalizedPathSegments;
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


/**
 * Returns the relative PathSegments between 'from' and 'to'
 *  - if no common base path => []
 *  - else ['..' | '.', ...]
 */
export function RelativePathSegments(from: TNormalizedPathSegments, to: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): TNormalizedPathSegments | null {
  const commonBase: TNormalizedPathSegments | null = CommonBasePathSegments([from, to]);
  if (commonBase === null) {
    return null;
  } else {
    const relativePath: TNormalizedPathSegments = ['.'];
    for (let i = commonBase.length, l = from.length; i < l; i++) {
      PathSegmentsPush(relativePath, '..', options);
    }
    for (let i = commonBase.length, l = to.length; i < l; i++) {
      PathSegmentsPush(relativePath, to[i], options);
    }
    return relativePath;
  }
}


/**
 * Converts a path to an absolute path
 */
export function ResolvePathSegmentsWithOptionalRoot(path: TNormalizedPathSegments, root: TNormalizedPathSegments | undefined, options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  if (root === void 0) {
    root = GetProcessPathSegments(options);
  }

  if (IsAbsolutePathSegments(root, options)) {
    return ResolvePathSegments(path, root, options);
  } else {
    throw new Error(`Argument 'root' is not a valid root`);
  }
}


/**
 * Converts a path to an absolute path
 * INFO: root must be an absolute path
 */
export function ResolvePathSegments(path: TNormalizedPathSegments, root: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  if (IsRelativePathSegment(path[0])) {
    // const absolutePath: TNormalizedPathSegments = root.slice();
    // for (let i = path.length, l = path.length; i < l; i++) {
    //   PathSegmentsPush(absolutePath, path[i], options);
    // }
    // return absolutePath;
    return JoinPathSegments([root, path], options);
  } else {
    return path.slice();
  }
}

