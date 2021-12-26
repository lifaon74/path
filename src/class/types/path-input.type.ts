import { IUncheckedPathSegments } from '../../segments/types/unchecked-path-segments.type';
import { Path } from '../path.class';

export type IPathInput =
  string // the path as a string
  | IUncheckedPathSegments // the path as split segments (kind of .split('/'))
  | Path // a Path
  ;
