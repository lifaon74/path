import { IPathSegmentsSharedOptions, TNormalizedPathSegments, TPathSegments } from './interfaces';
import { IsRootPathSegment } from './segment';
import { PathSegmentsPush } from './mutate';

/**
 * Ensures every segments in 'path' are correct and reduce it.
 * See TNormalizedPathSegments for more details
 */
export function NormalizePathSegments(path: TPathSegments, options: IPathSegmentsSharedOptions): TNormalizedPathSegments {
  const length: number = path.length;
  if (length === 0) {
    return ['.'];
  } else {
    const normalized: TNormalizedPathSegments = [];
    const firstSegment: string = path[0];
    let i: number = 0;
    if (IsRootPathSegment(firstSegment, options.rootRegExp)) {
      normalized.push(firstSegment);
      i++;
    } else {
      normalized.push('.');
    }

    for (; i < length; i++) {
      if (path[i] !== '') { // removes end / or //
        PathSegmentsPush(normalized, path[i], options);
      }
    }

    return normalized;
  }
}
