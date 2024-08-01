import type { IUncheckedPathSegments } from '../../../../types/segments/unchecked-path-segments.type.js';
import { SLASH_REGEXP } from '../../../platform-config/constants/slash-regexp.constant.js';

export interface IConvertStringPathToUncheckedPathSegmentsOptions {
  readonly rootRegExp: RegExp;
}

/**
 * Converts a string path to an `IUncheckedPathSegments`.
 */
export function convertStringPathToUncheckedPathSegments(
  path: string,
  { rootRegExp }: IConvertStringPathToUncheckedPathSegmentsOptions,
): IUncheckedPathSegments {
  if (path === '') {
    return [];
  } else {
    rootRegExp.lastIndex = 0;
    const match: RegExpExecArray | null = rootRegExp.exec(path);

    if (match === null) {
      return path.split(SLASH_REGEXP);
    } else {
      path = path.slice(match[0].length);
      return [match[1], ...path.split(SLASH_REGEXP)];
    }
  }
}
