import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import type { IStemAndExtTuple } from '../../../../types/stem-and-ext-tuple.type.js';
import { getStemAndExtEntryPathSegment } from '../../segment/functions/get/get-stem-and-ext-entry-path-segment.js';
import { getBasenameOfPathSegments } from './get-basename-of-path-segments.js';

export interface IGetStemAndExtOfPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 *  Returns the stem and ext tuple of the basename of 'segments'
 */
export function getStemAndExtOfPathSegments(
  segments: IPathSegments,
  { rootRegExp }: IGetStemAndExtOfPathSegmentsOptions,
): IStemAndExtTuple | null {
  const basename: string | null = getBasenameOfPathSegments(segments, undefined, {
    rootRegExp,
  });

  return basename === null ? null : getStemAndExtEntryPathSegment(basename);
}
