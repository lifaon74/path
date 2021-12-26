import { SLASH_PATTERN } from './slash-regexp.constant';
import { IPathPlatformConfig } from '../types/path-platform-config.type';
import { POSIX_DELIMITER_PATTERN, POSIX_ROOT_PATTERN, POSIX_SEPARATOR } from './posix-path-platform-config.constants';
import { WINDOWS_DELIMITER_PATTERN, WINDOWS_ROOT_PATTERN } from './windows-path-platform-config.constants';

export const ROOT_PATTERN: string = `(?:${WINDOWS_ROOT_PATTERN}|${POSIX_ROOT_PATTERN})`;
export const ROOT_REGEXP: RegExp = new RegExp(`^(${ROOT_PATTERN})(${SLASH_PATTERN}|$)`);
export const DELIMITER_PATTERN: string = `(?:${WINDOWS_DELIMITER_PATTERN}|${POSIX_DELIMITER_PATTERN})`;
export const DELIMITER_REGEXP: RegExp = new RegExp(`(${DELIMITER_PATTERN})`);

export const GENERIC_PATH_PLATFORM_CONFIG: Readonly<IPathPlatformConfig> = Object.freeze({
  rootPattern: ROOT_PATTERN,
  rootRegExp: ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: DELIMITER_PATTERN,
  delimiterRegExp: DELIMITER_REGEXP,
});
