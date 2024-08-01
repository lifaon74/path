import type { IUncheckedPathSegment } from './segment/unchecked-path-segment.type.js';

/**
 * IPathSegments, but this one could be invalid
 */
export type IUncheckedPathSegments = readonly IUncheckedPathSegment[];
