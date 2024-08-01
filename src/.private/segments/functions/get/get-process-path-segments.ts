import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import { getProcess } from '../../../functions/get-process.js';
import {
  convertStringPathToPathSegments,
  type IConvertStringPathToPathSegmentsOptions,
} from '../convert/convert-string-path-to-path-segments.js';

export interface IGetProcessPathSegmentsOptions extends IConvertStringPathToPathSegmentsOptions {}

/**
 * Returns the `IPathSegments` of the current process.
 */
export function getProcessPathSegments(options: IGetProcessPathSegmentsOptions): IPathSegments {
  return convertStringPathToPathSegments(getProcess().cwd(), options);
}
