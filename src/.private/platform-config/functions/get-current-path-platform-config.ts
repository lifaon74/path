import type { IPathPlatformConfig } from '../../../types/platform-config/path-platform-config.type.js';
import { getProcess } from '../../functions/get-process.js';
import { POSIX_PATH_PLATFORM_CONFIG } from '../constants/posix-path-platform-config.constants.js';
import { WINDOWS_PATH_PLATFORM_CONFIG } from '../constants/windows-path-platform-config.constants.js';

export function getCurrentPathPlatformConfig(): IPathPlatformConfig | never {
  return getProcess().platform === 'win32'
    ? WINDOWS_PATH_PLATFORM_CONFIG
    : POSIX_PATH_PLATFORM_CONFIG;
}
