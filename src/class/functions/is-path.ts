import { Path } from '../path.class.js';

export function isPath(value: unknown): value is Path {
  return value instanceof Path;
}
