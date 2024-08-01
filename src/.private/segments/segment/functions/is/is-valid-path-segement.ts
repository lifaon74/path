import type { IUncheckedPathSegment } from '../../../../../types/segments/segment/unchecked-path-segment.type.js';

// TODO improve later
// https://stackoverflow.com/questions/4814040/allowed-characters-in-filename

/**
 * Returns true if segment is valid (must not be empty nor contain some reserved characters)
 */
export function isValidPathSegment(
  segment: IUncheckedPathSegment,
  invalidPathSegmentRegExp: RegExp = /[<>:"\/\\|?*]/,
): boolean {
  return segment !== '' && !invalidPathSegmentRegExp.test(segment);
}
