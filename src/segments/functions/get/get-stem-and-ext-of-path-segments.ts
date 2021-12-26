import { IPathSegments } from '../../types/path-segments.type';
import { getBasenameOfPathSegments } from './get-basename-of-path-segments';
import {
  getStemAndExtEntryPathSegment, IStemAndExtTuple
} from '../../segment/functions/get/get-stem-and-ext-entry-path-segment';

export interface IGetStemAndExtOfPathSegmentsOptions {
  rootRegExp: RegExp;
}

/**
 *  Returns the stem and ext tuple of the basename of 'segments'
 */
export function getStemAndExtOfPathSegments(
  segments: IPathSegments,
  {
    rootRegExp,
  }: IGetStemAndExtOfPathSegmentsOptions,
): IStemAndExtTuple | null {
  const basename: string | null = getBasenameOfPathSegments(
    segments,
    void 0,
    {
      rootRegExp,
    },
  );

  return (basename === null)
    ? null
    : getStemAndExtEntryPathSegment(basename);
}
