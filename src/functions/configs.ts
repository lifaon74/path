/**
 * GLOBAL CONFIGS TO PARSE AND BUILD PATHS
 */

export interface IPlatformConfig {
  rootPattern: string;
  rootRegExp: RegExp;
  separator: string;
  delimiterPattern: string;
  delimiterRegExp: RegExp;
}

// on windows, root startsWith 'letter:';
export const WINDOWS_ROOT_PATTERN: string = '(?:[a-zA-Z]:)';
export const WINDOWS_ROOT_REGEXP: RegExp = new RegExp('^(' + WINDOWS_ROOT_PATTERN + ')([\\\/]|$)');
export const WINDOWS_SEPARATOR: string = '\\';
export const WINDOWS_DELIMITER_PATTERN: string = ';';
export const WINDOWS_DELIMITER_REGEXP: RegExp = new RegExp(WINDOWS_DELIMITER_PATTERN);

export const WINDOWS_CONFIG: Readonly<IPlatformConfig> = Object.freeze({
  rootPattern: WINDOWS_ROOT_PATTERN,
  rootRegExp: WINDOWS_ROOT_REGEXP,
  separator: WINDOWS_SEPARATOR,
  delimiterPattern: WINDOWS_DELIMITER_PATTERN,
  delimiterRegExp: WINDOWS_DELIMITER_REGEXP,
});


// on posix, root startsWith '/', so the part before is the empty string
export const POSIX_ROOT_PATTERN: string = '';
export const POSIX_ROOT_REGEXP: RegExp = new RegExp('^(' + POSIX_ROOT_PATTERN + ')([\\\/]|$)');
export const POSIX_SEPARATOR: string = '/';
export const POSIX_DELIMITER_PATTERN: string = ':';
export const POSIX_DELIMITER_REGEXP: RegExp = new RegExp(POSIX_DELIMITER_PATTERN);

export const POSIX_CONFIG: Readonly<IPlatformConfig> = Object.freeze({
  rootPattern: POSIX_ROOT_PATTERN,
  rootRegExp: POSIX_ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: POSIX_DELIMITER_PATTERN,
  delimiterRegExp: POSIX_DELIMITER_REGEXP,
});

export const ROOT_PATTERN: string = WINDOWS_ROOT_PATTERN + '|' + POSIX_ROOT_PATTERN;
export const ROOT_REGEXP: RegExp = new RegExp('^(' + ROOT_PATTERN + ')([\\\/]|$)');
export const DELIMITER_PATTERN: string = WINDOWS_DELIMITER_PATTERN + '|' + POSIX_DELIMITER_PATTERN;
export const DELIMITER_REGEXP: RegExp = new RegExp('(' + DELIMITER_PATTERN + ')');

export const GENERIC_CONFIG: Readonly<IPlatformConfig> = Object.freeze({
  rootPattern: ROOT_PATTERN,
  rootRegExp: ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: DELIMITER_PATTERN,
  delimiterRegExp: DELIMITER_REGEXP,
});
