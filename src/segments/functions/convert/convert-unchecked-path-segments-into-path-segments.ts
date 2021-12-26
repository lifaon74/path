import { IUncheckedPathSegments } from '../../types/unchecked-path-segments.type';
import { IPathSegments } from '../../types/path-segments.type';
import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { IUncheckedPathSegment } from '../../segment/types/unchecked-path-segment.type';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement';
import { pushUncheckedSegmentIntoMutablePathSegments } from '../mutate/push-unchecked-segment-into-mutable-path-segments';

export interface IConvertUncheckedPathSegmentsIntoPathSegments {
  rootRegExp: RegExp;
}

/**
 * Ensures every segments in 'segments' are correct and reduces it.
 * See IPathSegments for more details
 */
export function convertUncheckedPathSegmentsIntoPathSegments(
  segments: IUncheckedPathSegments,
  options: IConvertUncheckedPathSegmentsIntoPathSegments,
): IPathSegments {
  const length: number = segments.length;
  if (length === 0) {
    return ['.'];
  } else {
    const normalized: IMutablePathSegments = [];
    const firstSegment: IUncheckedPathSegment = segments[0];
    let i: number = 0;
    if (isRootPathSegment(firstSegment, options.rootRegExp)) {
      normalized.push(firstSegment);
      i++;
    } else {
      normalized.push('.');
    }

    for (; i < length; i++) {
      if (segments[i] !== '') { // removes ending / or //
        pushUncheckedSegmentIntoMutablePathSegments(normalized, segments[i], options);
      }
    }

    return normalized;
  }
}


