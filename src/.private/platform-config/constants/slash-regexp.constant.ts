export const SLASH_UNWRAPPED_PATTERN: string = '\\\\\\/'; // \ or /
export const SLASH_PATTERN: string = `[${SLASH_UNWRAPPED_PATTERN}]`;
export const SLASH_REGEXP: RegExp = new RegExp(SLASH_PATTERN);
