import { IPathSegmentsSharedOptions, TNormalizedPathSegments } from './interfaces';
import { StringPathToPathSegments } from './convert';

/**
 * Returns the PathSegments of the process
 */
export function GetProcessPathSegments(options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  return StringPathToPathSegments(process.cwd(), options);
}
