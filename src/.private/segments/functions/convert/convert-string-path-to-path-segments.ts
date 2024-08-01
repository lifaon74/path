import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { convertStringPathToUncheckedPathSegments } from './convert-string-path-to-unchecked-path-segments.js';
import {
  convertUncheckedPathSegmentsIntoPathSegments,
  type IConvertUncheckedPathSegmentsIntoPathSegments,
} from './convert-unchecked-path-segments-into-path-segments.js';

export interface IConvertStringPathToPathSegmentsOptions
  extends IConvertUncheckedPathSegmentsIntoPathSegments {}

/**
 * Converts a string path to some `IPathSegments`.
 */
export function convertStringPathToPathSegments(
  path: string,
  options: IConvertStringPathToPathSegmentsOptions,
): IPathSegments {
  return convertUncheckedPathSegmentsIntoPathSegments(
    convertStringPathToUncheckedPathSegments(path, options),
    options,
  );
}
