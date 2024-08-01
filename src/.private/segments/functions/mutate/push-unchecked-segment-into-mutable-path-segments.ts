import type { IMutablePathSegments } from '../../../../types/segments/mutable-path-segments.type.js';
import type { IUncheckedPathSegment } from '../../../../types/segments/segment/unchecked-path-segment.type.js';
import { isValidPathSegment } from '../../segment/functions/is/is-valid-path-segement.js';
import {
  type IPushSegmentIntoMutablePathSegmentsOptions,
  pushSegmentIntoMutablePathSegments,
} from './push-segment-into-mutable-path-segments.js';

export interface IPushUncheckedSegmentIntoMutablePathSegmentsOptions
  extends IPushSegmentIntoMutablePathSegmentsOptions {
  readonly invalidPathSegmentRegExp: RegExp;
}

/**
 * @see pushSegmentIntoMutablePathSegments
 */
export function pushUncheckedSegmentIntoMutablePathSegments(
  segments: IMutablePathSegments,
  segment: IUncheckedPathSegment,
  options: IPushUncheckedSegmentIntoMutablePathSegmentsOptions,
): void {
  if (isValidPathSegment(segment, options.invalidPathSegmentRegExp)) {
    return pushSegmentIntoMutablePathSegments(segments, segment, options);
  } else {
    throw new Error(`Segment ${JSON.stringify(segment)} is invalid`);
  }
}
