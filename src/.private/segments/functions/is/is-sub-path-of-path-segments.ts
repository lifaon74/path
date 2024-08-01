import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';

/**
 * Returns true if `path` is a sub-path of `parentPath` or equals it (if `equals` is true)
 *
 * @example:
 *  `isSubPathOfPathSegments('/a/b/c', '/a/b/c/d')` => `false`
 *  `isSubPathOfPathSegments('/a/b/c/d', '/a/b/c')` => `true`
 */
export function isSubPathOfPathSegments(
  path: IPathSegments,
  parentPath: IPathSegments,
  equals: boolean = false,
): boolean {
  if (parentPath.length >= path.length + (equals ? 1 : 0)) {
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
