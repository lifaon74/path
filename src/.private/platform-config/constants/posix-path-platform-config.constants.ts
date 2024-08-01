import type { IPathPlatformConfig } from '../../../types/platform-config/path-platform-config.type.js';
import { SLASH_PATTERN } from './slash-regexp.constant.js';

// on posix, root startsWith '/', so the part before is the empty string
export const POSIX_ROOT_PATTERN: string = '';
export const POSIX_ROOT_REGEXP: RegExp = new RegExp(`^(${POSIX_ROOT_PATTERN})(${SLASH_PATTERN}|$)`);
export const POSIX_SEPARATOR: string = '/';
export const POSIX_DELIMITER_PATTERN: string = ':';
export const POSIX_DELIMITER_REGEXP: RegExp = new RegExp(POSIX_DELIMITER_PATTERN);

export const POSIX_INVALID_PATH_SEGMENT_PATTERN_PATTERN: string = '[<>:"/\\|?*]';
export const POSIX_INVALID_PATH_SEGMENT_PATTERN_REGEXP: RegExp = new RegExp(
  `${POSIX_INVALID_PATH_SEGMENT_PATTERN_PATTERN}`,
);

export const POSIX_PATH_PLATFORM_CONFIG: IPathPlatformConfig = Object.freeze({
  rootPattern: POSIX_ROOT_PATTERN,
  rootRegExp: POSIX_ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: POSIX_DELIMITER_PATTERN,
  delimiterRegExp: POSIX_DELIMITER_REGEXP,
  invalidPathSegmentPattern: POSIX_INVALID_PATH_SEGMENT_PATTERN_PATTERN,
  invalidPathSegmentRegExp: POSIX_INVALID_PATH_SEGMENT_PATTERN_REGEXP,
});
