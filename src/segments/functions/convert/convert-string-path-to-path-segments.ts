import {
  convertUncheckedPathSegmentsIntoPathSegments, IConvertUncheckedPathSegmentsIntoPathSegments,
} from './convert-unchecked-path-segments-into-path-segments';
import { IPathSegments } from '../../types/path-segments.type';
import { convertStringPathToUncheckedPathSegments } from './convert-string-path-to-unchecked-path-segments';

export interface IConvertStringPathToPathSegmentsOptions extends IConvertUncheckedPathSegmentsIntoPathSegments {

}

/**
 * Converts a string path to a PathSegments
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
