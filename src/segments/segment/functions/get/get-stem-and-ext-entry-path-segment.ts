import { IPathSegment } from '../../types/path-segment.type';

export interface IStemAndExtTuple {
  stem: string;
  ext: string;
}

/**
 * Returns the stem (file name without extension) and extension of 'basename'
 * INFO: 'basename' must not be a special segment (from root or relative)
 */
export function getStemAndExtEntryPathSegment(
  segment: IPathSegment,
): IStemAndExtTuple {
  const segments: string[] = segment.split('.');
  if ((segments.length === 1) || (segments[0].length === 0)) {
    return {
      stem: segments[0],
      ext: '',
    };
  } else {
    const ext: string = '.' + segments.pop();
    return {
      stem: segments.join('.'),
      ext: ext,
    };
  }
}
