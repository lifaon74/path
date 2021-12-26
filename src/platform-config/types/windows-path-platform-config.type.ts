import { IPathPlatformConfig } from './path-platform-config.type';

export interface IWindowsPathPlatformConfig extends IPathPlatformConfig {
  driveLetterPattern: string;
  driveLetterRegEx: RegExp;
  networkPattern: string;
  networkRegEx: RegExp;
}
