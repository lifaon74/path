import type { IPathPlatformConfig } from './path-platform-config.type.js';

export interface IWindowsPathPlatformConfig extends IPathPlatformConfig {
  readonly driveLetterPattern: string;
  readonly driveLetterRegEx: RegExp;
  readonly networkPattern: string;
  readonly networkRegEx: RegExp;
}
