import { IMutablePathSegments } from '../../types/mutable-path-segments.type';
import { isValidPathSegment } from '../../segment/functions/is/is-valid-path-segement';
import { IUncheckedPathSegment } from '../../segment/types/unchecked-path-segment.type';
import {
  IPushSegmentIntoMutablePathSegmentsOptions, pushSegmentIntoMutablePathSegments,
} from './push-segment-into-mutable-path-segments';

export interface IPushUncheckedSegmentIntoMutablePathSegmentsOptions extends IPushSegmentIntoMutablePathSegmentsOptions {
}

/**
 * @see pushSegmentIntoMutablePathSegments
 */
export function pushUncheckedSegmentIntoMutablePathSegments(
  segments: IMutablePathSegments,
  segment: IUncheckedPathSegment,
  options: IPushUncheckedSegmentIntoMutablePathSegmentsOptions,
): void {
  if (isValidPathSegment(segment)) {
    return pushSegmentIntoMutablePathSegments(
      segments,
      segment,
      options,
    );
  } else {
    throw new Error(`Segment ${JSON.stringify(segment)} is invalid`);
  }
}


