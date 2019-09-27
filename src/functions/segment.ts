import { IStemAndExtTuple, TAllowedSpecialSegments } from './interfaces';

/**
 * Returns true if 'segment' is a root segment.
 */
export function IsRootPathSegment(segment: string, rootRegExp: RegExp): boolean {
  return rootRegExp.test(segment);
}

/**
 * Returns true if 'segment' is a relative segment
 */
export function IsRelativePathSegment(segment: string): boolean {
  return (
    (segment === '.')
    || (segment === '..')
  );
}

/**
 * Returns true if 'segment' is an entry name (not a root nor a relative path)
 * INFO: segment must be valid
 */
export function IsEntryNamePathSegment(segment: string, rootRegExp: RegExp): boolean {
  return !IsRootPathSegment(segment, rootRegExp)
    && !IsRelativePathSegment(segment);
}

/**
 * Returns true if segment is valid (must not be empty nor contain some reserved characters)
 */
export function IsValidPathSegment(segment: string): boolean {
  return (segment !== '')
    && !(/[<>:"\/\\|?*]/g.test(segment));
}

/**
 * Returns true if segment is a valid entry name
 */
export function IsValidEntryNamePathSegment(segment: string, rootRegExp: RegExp): boolean {
  return IsValidPathSegment(segment)
    && IsEntryNamePathSegment(segment, rootRegExp);
}


/**
 * Returns the basename of a segment, without 'ext' if provided
 * INFO: 'basename' must be a valid entry name (must not be root or relative)
 */
export function BaseNamePathSegment(segment: string, ext: string = ''): string {
  return ((ext !== '') && segment.endsWith(ext))
    ? segment.slice(0, -ext.length)
    : segment;
}

/**
 * Returns the basename of a segment, without 'ext' if provided
 *  - returns null if segment is special (relative or root) and options.allowedSpecialSegments doesn't include it
 * INFO: 'basename' must be a valid entry, including relative and root
 */
export const ALLOWED_SPECIAL_SEGMENTS_NONE: Set<TAllowedSpecialSegments> = new Set<TAllowedSpecialSegments>();

export function BaseNamePathSegmentImpure(
  segment: string,
  ext: string | undefined,
  rootRegExp: RegExp,
  allowedSpecialSegments: Set<TAllowedSpecialSegments> = ALLOWED_SPECIAL_SEGMENTS_NONE
): string | null {
  if (IsRelativePathSegment(segment)) {
    return allowedSpecialSegments.has(segment as ('.' | '..')) ? segment : null;
  } else if (IsRootPathSegment(segment, rootRegExp)) {
    return allowedSpecialSegments.has('root')
      ? (segment === '') ? '/' : ''
      : null;
  } else {
    return BaseNamePathSegment(segment, ext);
  }
}


/**
 * Returns the stem (file name without extension) and extension of 'basename'
 * INFO: 'basename' must not be a special segment (from root or relative)
 */
export function BaseNamePathSegmentToStemAndExtTuple(basename: string): IStemAndExtTuple {
  const segments: string[] = basename.split('.');
  if ((segments.length === 1) || (segments[0].length === 0)) {
    return {
      stem: segments[0],
      ext: '',
    };
  } else {
    const ext: string = '.' + segments.pop();
    return {
      stem: segments.join('.'),
      ext: ext,
    };
  }
}

/**
 * Returns the stem (file name without extension) and extension of 'basename'
 *  - returns null if segment is special (relative or root)
 * INFO: 'basename' must be a valid entry, including relative and root
 */
export function BaseNamePathSegmentImpureToStemAndExtTuple(basename: string, rootRegExp: RegExp): IStemAndExtTuple | null {
  return IsEntryNamePathSegment(basename, rootRegExp)
    ? BaseNamePathSegmentToStemAndExtTuple(basename)
    : null;
}

