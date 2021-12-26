import { IPathSegments } from '../../types/path-segments.type';
import { IIsRootPathSegmentsOptions, isRootPathSegments } from '../is/is-root-path-segments';

export interface IPathSegmentsToStringPathOptions extends IIsRootPathSegmentsOptions {
  separator: string;
}

/**
 * Converts a PathSegments to a string path
 */
export function convertPathSegmentsToStringPath(
  segments: IPathSegments,
  {
    separator,
    ...options
  }: IPathSegmentsToStringPathOptions,
): string {
  return isRootPathSegments(segments, options)
    ? (segments[0] + separator)
    : segments.join(separator);
}
