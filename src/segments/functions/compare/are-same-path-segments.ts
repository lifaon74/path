import { IPathSegments } from '../../types/path-segments.type';

/**
 * Returns true if 'path1' is the same as 'path2'.
 */
export function areSamePathSegments(
  segmentsA: IPathSegments,
  segmentB: IPathSegments,
): boolean {
  const length: number = segmentsA.length;
  if (segmentB.length === length) {
    for (let i = 0; i < length; i++) {
      if (segmentsA[i] !== segmentB[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
