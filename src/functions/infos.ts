import {
  IPathSegmentBaseNameOptions, IPathSegmentsSharedOptions, IStemAndExtTuple, TNormalizedPathSegments
} from './interfaces';
import {
  ALLOWED_SPECIAL_SEGMENTS_NONE,
  BaseNamePathSegmentImpure,
  BaseNamePathSegmentToStemAndExtTuple,
  IsRootPathSegment
} from './segment';

/**
 * RETURNS SOME INFORMATION ABOUT A PATH
 */


/**
 * Returns true if the path is absolute
 */
export function IsAbsolutePathSegments(path: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): boolean {
  return IsRootPathSegment(path[0], options.rootRegExp);
}


/**
 * Returns true if the path is the root.
 */
export function IsRootPathSegments(path: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): boolean {
  return (path.length === 1)
    && IsRootPathSegment(path[0], options.rootRegExp);
}


/**
 * Returns true if the path contains only '..'
 */
export function IsPureParentDirectoryPathSegments(path: TNormalizedPathSegments): boolean {
  return path.every(segment => (segment === '..'));
}

/**
 * Returns true if 'path1' is the same as 'path2'.
 */
export function AreSamePathSegments(path1: TNormalizedPathSegments, path2: TNormalizedPathSegments): boolean {
  const length: number = path1.length;
  if (path2.length === length) {
    for (let i = 0; i < length; i++) {
      if (path1[i] !== path2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}


/**
 * Returns true if 'path' is a sub-path of 'parentPath' or equals it (if 'equals' is true)
 * @example:
 *  - IsSubPathSegments('/a/b/c', '/a/b/c/d') => false
 *  - IsSubPathSegments('/a/b/c/d', '/a/b/c') => true
 */
export function IsSubPathSegments(path: TNormalizedPathSegments, parentPath: TNormalizedPathSegments, equals: boolean = false): boolean {
  if (parentPath.length >= (path.length + (equals ? 1 : 0))) {
    return false;
  } else {
    for (let i = 0, l = parentPath.length; i < l; i++) {
      if (path[i] !== parentPath[i]) {
        return false;
      }
    }
    return true;
  }
}

/*-----------------------------------------*/

/**
 * Returns the parent directory of 'path'
 *  - returns null if path has no parent directory (if path is ['.'] or [root])
*/
export function DirNamePathSegments(path: TNormalizedPathSegments): TNormalizedPathSegments | null {
  if (IsPureParentDirectoryPathSegments(path)) {  // path is ['..', ...'..']
    return [...path, '..'];
  } else if (path.length === 1) {  // path is ['.'] or [root]
    return (path[0] === '.')
      ? ['..']
      : null;
  } else { // path is [start, entry, ...entries]
    return path.slice(0, -1);
  }
}

/**
 *  Returns the basename of 'path'
 */
export function BaseNamePathSegments(path: TNormalizedPathSegments, ext: string | undefined, options: IPathSegmentBaseNameOptions): string | null {
  return BaseNamePathSegmentImpure(path[path.length - 1], ext, options.rootRegExp, options.allowedSpecialSegments);
}

/**
 *  Returns the stem and ext tuple of the basename of 'path'
 */
export function StemAndExtTuplePathSegments(path: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): IStemAndExtTuple | null {
  return BaseNamePathSegmentToStemAndExtTuple(
    BaseNamePathSegments(path, void 0, { ...options, allowedSpecialSegments: ALLOWED_SPECIAL_SEGMENTS_NONE }) as string
  );
}

