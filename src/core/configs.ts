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

export interface IWindowsPlatformConfig extends IPlatformConfig {
  driveLetterPattern: string;
  driveLetterRegEx: RegExp;
  networkPattern: string;
  networkRegEx: RegExp;
}


export const SLASH_UNWRAPPED_PATTERN: string = '\\\\\\/'; // \ or /
export const SLASH_PATTERN: string = '[' + SLASH_UNWRAPPED_PATTERN + ']';
export const SLASH_REGEXP: RegExp = new RegExp(SLASH_PATTERN);

// on windows, root startsWith 'letter:';
export const WINDOWS_DRIVE_LETTER_PATTERN: string = '(?:[a-zA-Z]:)';
export const WINDOWS_DRIVE_LETTER_REGEXP: RegExp = new RegExp('^(' + WINDOWS_DRIVE_LETTER_PATTERN + ')(' + SLASH_PATTERN + '|$)');
export const WINDOWS_NETWORK_PATTERN: string = '(?:\\\\\\\\[^' + SLASH_UNWRAPPED_PATTERN + ']+)';
export const WINDOWS_NETWORK_REGEXP: RegExp = new RegExp('^(' + WINDOWS_NETWORK_PATTERN + ')(' + SLASH_PATTERN + '|$)');
export const WINDOWS_ROOT_PATTERN: string = '(?:' + WINDOWS_DRIVE_LETTER_PATTERN + '|' + WINDOWS_NETWORK_PATTERN + ')';
export const WINDOWS_ROOT_REGEXP: RegExp = new RegExp('^(' + WINDOWS_ROOT_PATTERN + ')(' + SLASH_PATTERN + '|$)');
export const WINDOWS_SEPARATOR: string = '\\';
export const WINDOWS_DELIMITER_PATTERN: string = ';';
export const WINDOWS_DELIMITER_REGEXP: RegExp = new RegExp(WINDOWS_DELIMITER_PATTERN);


export const WINDOWS_CONFIG: Readonly<IWindowsPlatformConfig> = Object.freeze({
  driveLetterPattern: WINDOWS_DRIVE_LETTER_PATTERN,
  driveLetterRegEx: WINDOWS_DRIVE_LETTER_REGEXP,
  networkPattern: WINDOWS_NETWORK_PATTERN,
  networkRegEx: WINDOWS_NETWORK_REGEXP,
  rootPattern: WINDOWS_ROOT_PATTERN,
  rootRegExp: WINDOWS_ROOT_REGEXP,
  separator: WINDOWS_SEPARATOR,
  delimiterPattern: WINDOWS_DELIMITER_PATTERN,
  delimiterRegExp: WINDOWS_DELIMITER_REGEXP,
});

export const WINDOWS_STRICT_CONFIG: Readonly<IWindowsPlatformConfig> = Object.freeze({
  ...WINDOWS_CONFIG,
  rootPattern: WINDOWS_DRIVE_LETTER_PATTERN,
  rootRegExp: WINDOWS_DRIVE_LETTER_REGEXP,
});


// on posix, root startsWith '/', so the part before is the empty string
export const POSIX_ROOT_PATTERN: string = '';
export const POSIX_ROOT_REGEXP: RegExp = new RegExp('^(' + POSIX_ROOT_PATTERN + ')(' + SLASH_PATTERN + '|$)');
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

export const ROOT_PATTERN: string = '(?:' + WINDOWS_ROOT_PATTERN + '|' + POSIX_ROOT_PATTERN + ')';
export const ROOT_REGEXP: RegExp = new RegExp('^(' + ROOT_PATTERN + ')(' + SLASH_PATTERN + '|$)');
export const DELIMITER_PATTERN: string = '(?:' + WINDOWS_DELIMITER_PATTERN + '|' + POSIX_DELIMITER_PATTERN + ')';
export const DELIMITER_REGEXP: RegExp = new RegExp('(' + DELIMITER_PATTERN + ')');

export const GENERIC_CONFIG: Readonly<IPlatformConfig> = Object.freeze({
  rootPattern: ROOT_PATTERN,
  rootRegExp: ROOT_REGEXP,
  separator: POSIX_SEPARATOR,
  delimiterPattern: DELIMITER_PATTERN,
  delimiterRegExp: DELIMITER_REGEXP,
});
