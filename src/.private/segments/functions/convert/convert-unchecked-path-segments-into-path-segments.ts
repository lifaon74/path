import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';
import type { IUncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.type.js';
import type { IUncheckedPathSegments } from '../../../../types/segments/unchecked-path-segments.type.js';
import { isRootPathSegment } from '../../segment/functions/is/is-root-path-segement.js';
import {
  IPushUncheckedSegmentIntoMutablePathSegmentsOptions,
  pushUncheckedSegmentIntoMutablePathSegments,
} from '../mutate/push-unchecked-segment-into-mutable-path-segments.js';

export interface IConvertUncheckedPathSegmentsIntoPathSegments
  extends IPushUncheckedSegmentIntoMutablePathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Ensures every segment from `segments` is correct and optimizes the result.
 * See`IPathSegments` for more details.
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
      if (segments[i] !== '') {
        // removes ending / or //
        pushUncheckedSegmentIntoMutablePathSegments(normalized, segments[i], options);
      }
    }

    return normalized;
  }
}
