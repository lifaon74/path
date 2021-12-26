import {
  convertStringPathToPathSegments, IConvertStringPathToPathSegmentsOptions,
} from '../convert/convert-string-path-to-path-segments';
import { getProcess } from '../../../functions/get-process';
import { IPathSegments } from '../../types/path-segments.type';

export interface IGetProcessPathSegmentsOptions extends IConvertStringPathToPathSegmentsOptions {

}

/**
 * Returns the PathSegments of the process
 */
export function getProcessPathSegments(
  options: IGetProcessPathSegmentsOptions,
): IPathSegments {
  return convertStringPathToPathSegments(getProcess().cwd(), options);
}

