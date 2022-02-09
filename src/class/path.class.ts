import { IPathPlatformConfig } from '../platform-config/types/path-platform-config.type';
import { IPathInput } from './types/path-input.type';
import { IPathSegments } from '../segments/types/path-segments.type';
import { convertUncheckedPathSegmentsIntoPathSegments } from '../segments/functions/convert/convert-unchecked-path-segments-into-path-segments';
import { isPath } from './functions/is-path';
import { convertStringPathToPathSegments } from '../segments/functions/convert/convert-string-path-to-path-segments';
import { IWindowsPathPlatformConfig } from '../platform-config/types/windows-path-platform-config.type';
import { POSIX_PATH_PLATFORM_CONFIG } from '../platform-config/constants/posix-path-platform-config.constants';
import { WINDOWS_PATH_PLATFORM_CONFIG } from '../platform-config/constants/windows-path-platform-config.constants';
import { GENERIC_PATH_PLATFORM_CONFIG } from '../platform-config/constants/generic-path-platform-config.constants';
import { getCurrentPathPlatformConfig } from '../platform-config/functions/get-current-path-platform-config';
import { isObject } from '../functions/is-object';
import { isAbsolutePathSegments } from '../segments/functions/is/is-absolute-path-segments';
import { isRootPathSegments } from '../segments/functions/is/is-root-path-segments';
import { convertPathSegmentsToStringPath } from '../segments/functions/convert/convert-path-segments-to-string-path';
import { getDirnameOfPathSegments } from '../segments/functions/get/get-dirname-of-path-segments';
import { getBasenameOfPathSegments } from '../segments/functions/get/get-basename-of-path-segments';
import { ISpecialSegmentsAllowedForBasename } from '../segments/segment/functions/get/get-basename-of-path-segment';
import { getStemAndExtOfPathSegments } from '../segments/functions/get/get-stem-and-ext-of-path-segments';
import { IStemAndExtTuple } from '../segments/segment/functions/get/get-stem-and-ext-entry-path-segment';
import { isSubPathOfPathSegments } from '../segments/functions/is/is-sub-path-of-path-segments';
import { areSamePathSegments } from '../segments/functions/compare/are-same-path-segments';
import { getCommonBaseOfManyPathSegments } from '../segments/functions/get/get-common-base-of-many-path-segments';
import { joinManyPathSegments } from '../segments/functions/join/join-many-path-segments';
import { getRelativePathSegments } from '../segments/functions/get/get-relative-path-segments';
import { resolvePathSegmentsWithOptionalRoot } from '../segments/functions/resolve/resolve-path-segments-with-optional-root';
import { getProcessPathSegments } from '../segments/functions/get/get-process-path-segments';
import { makePathSegmentsAsAbsolute } from '../segments/functions/make/make-path-segments-as-absolute';
import { makePathSegmentsAsRelative } from '../segments/functions/make/make-path-segments-as-relative';
import { getProcess } from '../functions/get-process';


let BYPASS_PATH_CONSTRUCT: boolean = false;

function createPathFromPathInstance(
  instance: Path,
  segments: IPathSegments = instance.segments,
  config: Readonly<IPathPlatformConfig> = instance.config,
): Path {
  BYPASS_PATH_CONSTRUCT = true;
  const path: Path = new Path(segments, config);
  BYPASS_PATH_CONSTRUCT = false;
  return path;
}

/** CLASS **/

export class Path {

  static get posix(): Readonly<IPathPlatformConfig> {
    return POSIX_PATH_PLATFORM_CONFIG;
  }

  static get windows(): Readonly<IWindowsPathPlatformConfig> {
    return WINDOWS_PATH_PLATFORM_CONFIG;
  }

  static get generic(): Readonly<IPathPlatformConfig> {
    return GENERIC_PATH_PLATFORM_CONFIG;
  }

  static get currentPlatform(): Readonly<IPathPlatformConfig> | never {
    return getCurrentPathPlatformConfig();
  }

  /**
   * Returns the current process working directory as Path
   */
  static process(
    config?: IPathPlatformConfig,
  ): Path | never {
    return new Path(getProcess().cwd(), config);
  }

  /**
   * If 'path' is a Path, returns 'path',
   * Else creates a Path from 'path'
   *  => useful if you want to accept many types as the 'path' input of a function without sacrificing performances:
   */
  static of(
    path: IPathInput,
    config?: Readonly<IPathPlatformConfig>,
  ): Path {
    return isPath(path)
      ? path
      : new Path(path, config);
  }

  readonly segments: IPathSegments;
  readonly config: Readonly<IPathPlatformConfig>;

  constructor(
    path: IPathInput,
    config?: Readonly<IPathPlatformConfig>,
  ) {
    if (BYPASS_PATH_CONSTRUCT) {
      this.segments = path as IPathSegments;
      this.config = config as Readonly<IPathPlatformConfig>;
    } else {
      if (config === void 0) {
        this.config = isPath(path)
          ? path.config
          : GENERIC_PATH_PLATFORM_CONFIG;
      } else if (isObject(config)) {
        this.config = Object.isFrozen(config)
          ? config
          : Object.freeze({ ...config });
      } else {
        throw new TypeError(`Expected PathPlatformConfig or void as config`);
      }

      if (typeof path === 'string') {
        this.segments = convertStringPathToPathSegments(path, this.config);
      } else if (Array.isArray(path)) {
        this.segments = convertUncheckedPathSegmentsIntoPathSegments(path, this.config);
      } else if (isPath(path)) {
        this.segments = path.segments.slice();
      } else {
        throw new TypeError(`Expected string, string[], Path or object with toString() method as path`);
      }
    }
  }

  /* IS */

  /**
   * Returns true if this Path is absolute
   */
  isAbsolute(): boolean {
    return isAbsolutePathSegments(this.segments, this.config);
  }

  /**
   * Returns true if this Path is a pure root (ex: 'c:' or '/')
   */
  isRoot(): boolean {
    return isRootPathSegments(this.segments, this.config);
  }

  /**
   * Returns true if this Path is a sub-path of 'path' (after normalization)
   * @example:
   *  new Path('a/b/').isSubPathOf('a/') => true
   */
  isSubPathOf(
    parentPath: IPathInput,
  ): boolean {
    return isSubPathOfPathSegments(
      this.segments,
      Path.of(parentPath, this.config).segments,
    );
  }

  /* COMPARISON */

  /**
   * Returns true if this Path is equal to 'path' (after normalization)
   * @example:
   *  new Path('a/b/').equals('a/c/../b') => true
   */
  equals(
    path: IPathInput,
  ): boolean {
    return areSamePathSegments(
      this.segments,
      Path.of(path, this.config).segments,
    );
  }

  /* GET */

  /**
   * Returns the parent directory's Path of this Path. If this Path is a pure root, returns null
   * @example:
   *  new Path('a/b').dirname() => './a'
   *  new Path('c:/').dirname() => null
   */
  dirname(): Path | null {
    const dirname: IPathSegments | null = getDirnameOfPathSegments(this.segments);
    return (dirname === null)
      ? null
      : createPathFromPathInstance(this, dirname);
  }

  /**
   * Like .dirname but throws if the returned value is null (in case the path is a pure root)
   * @see dirname
   */
  dirnameOrThrow(): Path | never {
    const dirname: Path | null = this.dirname();
    if (dirname === null) {
      throw new Error(`Cannot use .dirname on this path`);
    } else {
      return dirname;
    }
  }

  /**
   * Returns the basename of this Path
   *  - if 'ext' is provided, removes 'ext' from the basename
   *  - returns null if basename is special (relative or root) and allowedSpecialSegments doesn't include it
   *  @param ext - default: ''
   *  @param allowedSpecialSegments - default: new Set()
   *
   *  @example:
   *    new Path('/a/b').basename() => 'b'
   *    new Path('/').basename() => null
   */
  basename(
    ext?: string,
    allowedSpecialSegments?: Iterable<ISpecialSegmentsAllowedForBasename>,
  ): string | null {
    return getBasenameOfPathSegments(
      this.segments,
      ext,
      (allowedSpecialSegments === void 0)
        ? this.config
        : {
          ...this.config,
          allowedSpecialSegments: new Set<ISpecialSegmentsAllowedForBasename>(allowedSpecialSegments),
        },
    );
  }

  /**
   * Like .basename but throws if the returned value is null (in case basename is special)
   * @see basename
   */
  basenameOrThrow(
    ext?: string,
    allowedSpecialSegments?: Iterable<ISpecialSegmentsAllowedForBasename>,
  ): string | never {
    const basename: string | null = this.basename();
    if (basename === null) {
      throw new Error(`Cannot use .basename on this path`);
    } else {
      return basename;
    }
  }

  /**
   * Returns a tuple composed of the stem and the extension of the basename of this Path
   */
  stemAndExt(): IStemAndExtTuple | null {
    return getStemAndExtOfPathSegments(this.segments, this.config);
  }

  /**
   * Like .stemAndExt but throws if the returned value is null
   * @see stemAndExt
   */
  stemAndExtOrThrow(): IStemAndExtTuple | never {
    const stemAndExt: IStemAndExtTuple | null = this.stemAndExt();
    if (stemAndExt === null) {
      throw new Error(`Cannot use .stemAndExt on this path`);
    } else {
      return stemAndExt;
    }
  }


  /**
   * Returns the common base between this Path, and each 'paths'
   *  - if no common base, returns null
   * @example:
   *  new Path('a/b/').commonBase('a/c') => './a'
   *  new Path('/a/b/').commonBase('d/e') => null
   */
  commonBase(
    ...paths: IPathInput[]
  ): Path | null {
    const commonBase: IPathSegments | null = getCommonBaseOfManyPathSegments([
      this.segments,
      ...paths.map<IPathSegments>((path: IPathInput): IPathSegments => Path.of(path, this.config).segments),
    ]);
    return (commonBase === null)
      ? null
      : createPathFromPathInstance(this, commonBase);
  }

  /**
   * Returns the relative Path from this Path to 'path' (after normalization)
   *  - returns null if we cannot reach 'path' from this Path
   * @example:
   *  new Path('a/b/').relative('a/d') => '../d
   *  new Path('a/b/').relative('/a/d') => null
   */
  relative(
    path: IPathInput,
  ): Path | null {
    const relativePath: IPathSegments | null = getRelativePathSegments(
      this.segments,
      Path.of(path, this.config).segments,
      this.config,
    );
    return (relativePath === null)
      ? null
      : createPathFromPathInstance(this, relativePath);
  }


  /* MISC */

  /**
   * Returns a new Path composed of this Path followed by 'paths'
   *  - equivalent of path.join() of NodeJS
   */
  concat(
    ...paths: IPathInput[]
  ): Path {
    return createPathFromPathInstance(
      this,
      joinManyPathSegments(
        [
          this.segments,
          ...paths.map<IPathSegments>((path: IPathInput): IPathSegments => Path.of(path, this.config).segments),
        ],
        this.config,
      ),
    );
  }

  /**
   * Returns a new absolute Path from this Path
   * - if this Path is absolute, returns a cloned path,
   * - else appends 'root' before this Path
   * @param root - default: process.cwd()
   */
  resolve(
    root?: IPathInput,
  ): Path {
    return createPathFromPathInstance(
      this,
      resolvePathSegmentsWithOptionalRoot(
        this.segments,
        (root === void 0)
          ? void 0
          : Path.of(root, this.config).segments,
        this.config,
      ),
    );
  }

  /**
   * Clones the path. Kind of new Path(this, config) but faster
   */
  clone(
    config?: Readonly<IPathPlatformConfig>,
  ): Path {
    return createPathFromPathInstance(
      this,
      this.segments.slice(),
      config,
    );
  }

  /* MUTATE */

  /**
   * Forces this Path to mutate to an absolute Path IF it is not already absolute
   * @param root - default: process.cwd()
   */
  makeAbsolute(
    root?: IPathInput,
  ): Path {
    const _root: IPathSegments = (root === void 0)
      ? getProcessPathSegments(this.config)
      : Path.of(root, this.config).segments;

    return createPathFromPathInstance(
      this,
      makePathSegmentsAsAbsolute(this.segments, _root[0], this.config),
    );
  }

  /**
   * Forces this Path to mutate to a relative path IF it is not already relative
   *  => replaces Path's first segment (the root) with '.'
   */
  makeRelative(): Path {
    return createPathFromPathInstance(
      this,
      makePathSegmentsAsRelative(this.segments, this.config),
    );
  }

  /* TO */

  /**
   * Returns the concatenated string of the different segments of this Path, separated by 'separator'
   * @param separator - default: config.separator
   */
  toString(
    separator?: string,
  ): string {
    let config: IPathPlatformConfig;

    if (separator === void 0) {
      config = this.config;
    } else if (typeof separator === 'string') {
      config = (separator === this.config.separator)
        ? this.config
        : { ...this.config, separator };
    } else {
      throw new TypeError(`Expected string as separator`);
    }

    return convertPathSegmentsToStringPath(this.segments, config);
  }

  /**
   * Returns a 'file://' url having this Path as pathname
   */
  toURL(): URL {
    const url: URL = new URL('file://');
    url.pathname = this.toString('/');
    return url;
  }
}





