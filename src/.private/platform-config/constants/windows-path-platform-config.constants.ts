import type { IWindowsPathPlatformConfig } from '../../../types/platform-config/windows-path-platform-config.type.js';
import { SLASH_PATTERN, SLASH_UNWRAPPED_PATTERN } from './slash-regexp.constant.js';

// on windows, root startsWith 'letter:';
export const WINDOWS_DRIVE_LETTER_PATTERN: string = '(?:[a-zA-Z]:)';
export const WINDOWS_DRIVE_LETTER_REGEXP: RegExp = new RegExp(
  `^(${WINDOWS_DRIVE_LETTER_PATTERN})(${SLASH_PATTERN}|$)`,
);
export const WINDOWS_NETWORK_PATTERN: string = `(?:\\\\\\\\[^${SLASH_UNWRAPPED_PATTERN}]+)`;
export const WINDOWS_NETWORK_REGEXP: RegExp = new RegExp(
  `^(${WINDOWS_NETWORK_PATTERN})(${SLASH_PATTERN}|$)`,
);
export const WINDOWS_ROOT_PATTERN: string = `(?:${WINDOWS_DRIVE_LETTER_PATTERN}|${WINDOWS_NETWORK_PATTERN})`;
export const WINDOWS_ROOT_REGEXP: RegExp = new RegExp(
  `^(${WINDOWS_ROOT_PATTERN})(${SLASH_PATTERN}|$)`,
);
export const WINDOWS_SEPARATOR: string = '\\';
export const WINDOWS_DELIMITER_PATTERN: string = ';';
export const WINDOWS_DELIMITER_REGEXP: RegExp = new RegExp(WINDOWS_DELIMITER_PATTERN);

export const WINDOWS_INVALID_PATH_SEGMENT_PATTERN_PATTERN: string = '[<>:"/\\|?*]';
export const WINDOWS_INVALID_PATH_SEGMENT_PATTERN_REGEXP: RegExp = new RegExp(
  `${WINDOWS_INVALID_PATH_SEGMENT_PATTERN_PATTERN}`,
);

export const WINDOWS_PATH_PLATFORM_CONFIG: IWindowsPathPlatformConfig = Object.freeze({
  driveLetterPattern: WINDOWS_DRIVE_LETTER_PATTERN,
  driveLetterRegEx: WINDOWS_DRIVE_LETTER_REGEXP,
  networkPattern: WINDOWS_NETWORK_PATTERN,
  networkRegEx: WINDOWS_NETWORK_REGEXP,
  rootPattern: WINDOWS_ROOT_PATTERN,
  rootRegExp: WINDOWS_ROOT_REGEXP,
  separator: WINDOWS_SEPARATOR,
  delimiterPattern: WINDOWS_DELIMITER_PATTERN,
  delimiterRegExp: WINDOWS_DELIMITER_REGEXP,
  invalidPathSegmentPattern: WINDOWS_INVALID_PATH_SEGMENT_PATTERN_PATTERN,
  invalidPathSegmentRegExp: WINDOWS_INVALID_PATH_SEGMENT_PATTERN_REGEXP,
});
