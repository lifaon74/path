import { IPathSegments } from '../../types/path-segments.type';
import {
  getBasenameOfPathSegment, ISpecialSegmentsAllowedForBasename
} from '../../segment/functions/get/get-basename-of-path-segment';

export interface IGetBasenameOfPathSegmentsOptions {
  rootRegExp: RegExp;
  allowedSpecialSegments?: Set<ISpecialSegmentsAllowedForBasename>;
}


/**
 *  Returns the basename of 'segments'
 */
export function getBasenameOfPathSegments(
  segments: IPathSegments,
  ext: string | undefined,
  {
    rootRegExp,
    allowedSpecialSegments,
  }: IGetBasenameOfPathSegmentsOptions
): string | null {
  return getBasenameOfPathSegment(
    segments[segments.length - 1],
    ext,
    rootRegExp,
    allowedSpecialSegments,
  );
}
