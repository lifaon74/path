import { Path } from '../class/path.class.js';
import type { IUncheckedPathSegments } from './segments/unchecked-path-segments.type.js';

/**
 * Various inputs that may serve as a path.
 */
export type IPathInput =
  | string // the path as a string
  | IUncheckedPathSegments // the path as split segments (kind of .split('/'))
  | Path; // a Path
