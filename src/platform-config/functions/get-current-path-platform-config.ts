import { WINDOWS_PATH_PLATFORM_CONFIG } from '../constants/windows-path-platform-config.constants';
import { getProcess } from '../../functions/get-process';
import { POSIX_PATH_PLATFORM_CONFIG } from '../constants/posix-path-platform-config.constants';
import { IPathPlatformConfig } from '../types/path-platform-config.type';

export function getCurrentPathPlatformConfig(): Readonly<IPathPlatformConfig> | never {
  return (getProcess().platform === 'win32')
    ? WINDOWS_PATH_PLATFORM_CONFIG
    : POSIX_PATH_PLATFORM_CONFIG;
}
