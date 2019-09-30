import { IPathSegmentsSharedOptions, TNormalizedPathSegments } from './interfaces';
import { StringPathToPathSegments } from './convert';
import { GetProcess } from '../helpers/helpers';

/**
 * Returns the PathSegments of the process
 */
export function GetProcessPathSegments(options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  return StringPathToPathSegments(GetProcess().cwd(), options);
}
