import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { isPureParentDirectoryPathSegments } from '../is/is-pure-parent-directory-path-segments.js';

/**
 * Returns the parent directory of `segments`:
 *  - returns null if path has no parent directory (if path is `['.']` or `[root]`)
 */
export function getDirnameOfPathSegments(segments: IPathSegments): IPathSegments | null {
  if (isPureParentDirectoryPathSegments(segments)) {
    // path is ['..', ...'..']
    return [...segments, '..'];
  } else if (segments.length === 1) {
    // path is ['.'] or [root]
    return segments[0] === '.' ? ['..'] : null;
  } else {
    // path is [start, entry, ...entries]
    return segments.slice(0, -1);
  }
}
