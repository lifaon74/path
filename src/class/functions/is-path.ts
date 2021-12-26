import { Path } from '../path.class';

export function isPath(
  value: unknown,
): value is Path {
  return (value instanceof Path);
}
