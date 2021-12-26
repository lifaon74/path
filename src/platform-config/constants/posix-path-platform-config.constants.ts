import { SLASH_PATTERN } from './slash-regexp.constant';
import { IPathPlatformConfig } from '../types/path-platform-config.type';

// on posix, root startsWith '/', so the part before is the empty string
export const POSIX_ROOT_PATTERN: string = '';
export const POSIX_ROOT_REGEXP: RegExp = new RegExp(`^(${POSIX_ROOT_PATTERN})(${SLASH_PATTERN}|$)`);
export const POSIX_SEPARATOR: string = '/';
export const POSIX_DELIMITER_PATTERN: string = ':';
export const POSIX_DELIMITER_REGEXP: RegExp = new RegExp(POSIX_DELIMITER_PATTERN);

export const POSIX_PATH_PLATFORM_CONFIG: Readonly<IPathPlatformConfig> = Object.freeze({
  rootPattern: POSIX_ROOT_PATTERN,
  rootRegExp: POSIX_ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: POSIX_DELIMITER_PATTERN,
  delimiterRegExp: POSIX_DELIMITER_REGEXP,
});
