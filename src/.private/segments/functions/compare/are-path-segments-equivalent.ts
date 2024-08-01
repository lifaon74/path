import type { IPathSegments } from '../../../../types/segments/path-segments.type.js';

/**
 * Returns `true` if `segmentsA` and `segmentB` are equivalent.
 */
export function arePathSegmentsEquivalent(
  segmentsA: IPathSegments,
  segmentB: IPathSegments,
): boolean {
  const length: number = segmentsA.length;
  if (segmentB.length === length) {
    for (let i: number = 0; i < length; i++) {
      if (segmentsA[i] !== segmentB[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
