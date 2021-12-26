import { IPathSegment } from '../../types/path-segment.type';
import { isRelativePathSegment } from '../is/is-relative-path-segement';
import { isRootPathSegment } from '../is/is-root-path-segement';
import { getBasenameOfEntryPathSegment } from './get-basename-of-entry-path-segment';

export type ISpecialSegmentsAllowedForBasename = '..' | '.' | 'root';

export const DEFAULT_SPECIAL_SEGMENTS_ALLOWED_FOR_BASENAME: Set<ISpecialSegmentsAllowedForBasename> = new Set<ISpecialSegmentsAllowedForBasename>();

/**
 * Returns the basename of a segment, without 'ext' if provided
 *  - returns null if segment is special (relative or root) and options.allowedSpecialSegments doesn't include it
 * INFO: 'basename' must be a valid entry, including relative and root
 */
export function getBasenameOfPathSegment(
  segment: IPathSegment,
  ext: string | undefined,
  rootRegExp: RegExp,
  allowedSpecialSegments: Set<ISpecialSegmentsAllowedForBasename> = DEFAULT_SPECIAL_SEGMENTS_ALLOWED_FOR_BASENAME,
): string | null {
  if (isRelativePathSegment(segment)) {
    return allowedSpecialSegments.has(segment as ('.' | '..')) ? segment : null;
  } else if (isRootPathSegment(segment, rootRegExp)) {
    return allowedSpecialSegments.has('root')
      ? (segment === '') ? '/' : ''
      : null;
  } else {
    return getBasenameOfEntryPathSegment(segment, ext);
  }
}
