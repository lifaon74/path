import { getProcess } from '../.private/functions/get-process.js';
import { isObject } from '../.private/functions/is-object.js';
import { GENERIC_PATH_PLATFORM_CONFIG } from '../.private/platform-config/constants/generic-path-platform-config.constants.js';
import { POSIX_PATH_PLATFORM_CONFIG } from '../.private/platform-config/constants/posix-path-platform-config.constants.js';
import { WINDOWS_PATH_PLATFORM_CONFIG } from '../.private/platform-config/constants/windows-path-platform-config.constants.js';
import { getCurrentPathPlatformConfig } from '../.private/platform-config/functions/get-current-path-platform-config.js';
import { arePathSegmentsEquivalent } from '../.private/segments/functions/compare/are-path-segments-equivalent.js';
import { convertPathSegmentsToStringPath } from '../.private/segments/functions/convert/convert-path-segments-to-string-path.js';
import { convertStringPathToPathSegments } from '../.private/segments/functions/convert/convert-string-path-to-path-segments.js';
import { convertUncheckedPathSegmentsIntoPathSegments } from '../.private/segments/functions/convert/convert-unchecked-path-segments-into-path-segments.js';
import { getBasenameOfPathSegments } from '../.private/segments/functions/get/get-basename-of-path-segments.js';
import { getCommonBaseOfManyPathSegments } from '../.private/segments/functions/get/get-common-base-of-many-path-segments.js';
import { getDirnameOfPathSegments } from '../.private/segments/functions/get/get-dirname-of-path-segments.js';
import { getProcessPathSegments } from '../.private/segments/functions/get/get-process-path-segments.js';
import { getRelativePathSegments } from '../.private/segments/functions/get/get-relative-path-segments.js';
import { getStemAndExtOfPathSegments } from '../.private/segments/functions/get/get-stem-and-ext-of-path-segments.js';
import { isAbsolutePathSegments } from '../.private/segments/functions/is/is-absolute-path-segments.js';
import { isRootPathSegments } from '../.private/segments/functions/is/is-root-path-segments.js';
import { isSubPathOfPathSegments } from '../.private/segments/functions/is/is-sub-path-of-path-segments.js';
import { joinManyPathSegments } from '../.private/segments/functions/join/join-many-path-segments.js';
import { makePathSegmentsAsAbsolute } from '../.private/segments/functions/make/make-path-segments-as-absolute.js';
import { makePathSegmentsAsRelative } from '../.private/segments/functions/make/make-path-segments-as-relative.js';
import { resolvePathSegmentsWithOptionalRoot } from '../.private/segments/functions/resolve/resolve-path-segments-with-optional-root.js';

import type { IPathPlatformConfig } from '../types/platform-config/path-platform-config.type.js';
import type { IWindowsPathPlatformConfig } from '../types/platform-config/windows-path-platform-config.type.js';
import type { ISpecialSegmentsAllowedForBasename } from '../types/segments/special-segments-allowed-for-basename.type.js';

import type { IPathInput } from '../types/path-input.type.js';
import type { IPathSegments } from '../types/segments/path-segments.type.js';
import type { IStemAndExtTuple } from '../types/stem-and-ext-tuple.type.js';
import { isPath } from './functions/is-path.js';

let BYPASS_PATH_CONSTRUCT: boolean = false;

function createPathFromPathInstance(
  instance: Path,
  segments: IPathSegments = instance.segments,
  config: IPathPlatformConfig = instance.config,
): Path {
  BYPASS_PATH_CONSTRUCT = true;
  const path: Path = new Path(segments, config);
  BYPASS_PATH_CONSTRUCT = false;
  return path;
}

/* CLASS */

/**
 * A class to manipulate Paths.
 */
export class Path {
  static get posix(): IPathPlatformConfig {
    return POSIX_PATH_PLATFORM_CONFIG;
  }

  static get windows(): IWindowsPathPlatformConfig {
    return WINDOWS_PATH_PLATFORM_CONFIG;
  }

  static get generic(): IPathPlatformConfig {
    return GENERIC_PATH_PLATFORM_CONFIG;
  }

  static get currentPlatform(): IPathPlatformConfig | never {
    return getCurrentPathPlatformConfig();
  }

  /**
   * Returns the current process working directory as a `Path`.
   */
  static process(config?: IPathPlatformConfig): Path | never {
    return new Path(getProcess().cwd(), config);
  }

  /**
   * If `path` is a `Path`, returns `path`,
   * else creates a `Path` from `path`.
   *  => useful if you want to accept many types as the `path` input of a function without sacrificing performances
   */
  static of(path: IPathInput, config?: IPathPlatformConfig): Path {
    return isPath(path) ? path : new Path(path, config);
  }

  readonly segments: IPathSegments;
  readonly config: IPathPlatformConfig;

  constructor(path: IPathInput, config?: IPathPlatformConfig) {
    if (BYPASS_PATH_CONSTRUCT) {
      this.segments = path as IPathSegments;
      this.config = config as IPathPlatformConfig;
    } else {
      if (config === undefined) {
        this.config = isPath(path) ? path.config : GENERIC_PATH_PLATFORM_CONFIG;
      } else if (isObject(config)) {
        this.config = Object.isFrozen(config) ? config : Object.freeze({ ...config });
      } else {
        throw new TypeError('Expected IPathPlatformConfig or void as second input.');
      }

      if (typeof path === 'string') {
        this.segments = convertStringPathToPathSegments(path, this.config);
      } else if (Array.isArray(path)) {
        this.segments = convertUncheckedPathSegmentsIntoPathSegments(path, this.config);
      } else if (isPath(path)) {
        this.segments = path.segments.slice();
      } else {
        throw new TypeError('Expected string, string[] or Path as first input.');
      }
    }
  }

  /* IS */

  /**
   * Returns `true` if this Path is absolute.
   */
  isAbsolute(): boolean {
    return isAbsolutePathSegments(this.segments, this.config);
  }

  /**
   * Returns `true` if this Path is a pure root (ex: `c:` or `/`).
   */
  isRoot(): boolean {
    return isRootPathSegments(this.segments, this.config);
  }

  /**
   * Returns true if this Path is a sub-path of `path` (after normalization).
   *
   * @example:
   *  `new Path('a/b/').isSubPathOf('a/')` => `true`
   */
  isSubPathOf(parentPath: IPathInput): boolean {
    return isSubPathOfPathSegments(this.segments, Path.of(parentPath, this.config).segments);
  }

  /* COMPARISON */

  /**
   * Returns `true` if this Path is equal to `path` (after normalization).
   *
   * @example:
   *  `new Path('a/b/').equals('a/c/../b')` => `true`
   */
  equals(path: IPathInput): boolean {
    return arePathSegmentsEquivalent(this.segments, Path.of(path, this.config).segments);
  }

  /* GET */

  /**
   * Returns the parent directory's Path of this Path.
   * If this operation cannot be performed (ex: this Path is a "root"), the function throws.
   *
   * @example:
   *  `new Path('a/b').dirname()` => `./a`
   *  `new Path('c:/').dirname()` => throws
   */
  dirname(): Path | never {
    const dirname: Path | null = this.dirnameOptional();
    if (dirname === null) {
      throw new Error("This path doesn't accept '.dirname()'.");
    } else {
      return dirname;
    }
  }

  /**
   * Like `.dirname()`, but returns `null` instead of throwing.
   *
   * @see dirname
   */
  dirnameOptional(): Path | null {
    const dirname: IPathSegments | null = getDirnameOfPathSegments(this.segments);
    return dirname === null ? null : createPathFromPathInstance(this, dirname);
  }

  /**
   * Returns the basename of this Path:
   *  - if `ext` is provided, `ext` is removed from the basename
   *  - the function throws if the basename is special (ex: relative or root) and `allowedSpecialSegments` doesn't include it
   *
   * @param ext - default: `''`
   * @param allowedSpecialSegments - default: `new Set()`
   *
   * @example:
   *  `new Path('/a/b').basename()` => 'b'
   *  `new Path('/').basename()` => throws
   */
  basename(
    ext?: string,
    allowedSpecialSegments?: Iterable<ISpecialSegmentsAllowedForBasename>,
  ): string | never {
    const basename: string | null = this.basenameOptional(ext, allowedSpecialSegments);
    if (basename === null) {
      throw new Error("This path doesn't accept '.basename(...)'.");
    } else {
      return basename;
    }
  }

  /**
   * Like `.basename(...)`, but returns `null` instead of throwing.
   *
   * @see basename
   */
  basenameOptional(
    ext?: string,
    allowedSpecialSegments?: Iterable<ISpecialSegmentsAllowedForBasename>,
  ): string | null {
    return getBasenameOfPathSegments(
      this.segments,
      ext,
      allowedSpecialSegments === undefined
        ? this.config
        : {
            ...this.config,
            allowedSpecialSegments: new Set<ISpecialSegmentsAllowedForBasename>(
              allowedSpecialSegments,
            ),
          },
    );
  }

  /**
   * Returns a tuple composed of the stem and the extension of the basename of this Path.
   * If this operation cannot be performed (ex: this Path is a "root"), the function throws.
   */
  stemAndExt(): IStemAndExtTuple | never {
    const stemAndExt: IStemAndExtTuple | null = this.stemAndExtOptional();
    if (stemAndExt === null) {
      throw new Error("This path doesn't accept '.stemAndExt(...)'.");
    } else {
      return stemAndExt;
    }
  }

  /**
   * Like `.stemAndExt(...)`, but returns `null` instead of throwing.
   *
   * @see stemAndExt
   */
  stemAndExtOptional(): IStemAndExtTuple | null {
    return getStemAndExtOfPathSegments(this.segments, this.config);
  }

  /**
   * Returns the common base between this Path, and each `paths`:
   *  - if no common base are found, the function throws.
   *
   * @example:
   *  `new Path('a/b/').commonBase('a/c')` => `./a`
   *  `new Path('/a/b/').commonBase('d/e')` => throws
   */
  commonBase(...paths: IPathInput[]): Path | never {
    const commonBase: Path | null = this.commonBaseOptional(...paths);
    if (commonBase === null) {
      throw new Error('These paths have no common bases.');
    } else {
      return commonBase;
    }
  }

  /**
   * Like `.commonBase(...)`, but returns `null` instead of throwing.
   * @see commonBase
   */
  commonBaseOptional(...paths: IPathInput[]): Path | null {
    const commonBase: IPathSegments | null = getCommonBaseOfManyPathSegments([
      this.segments,
      ...paths.map<IPathSegments>(
        (path: IPathInput): IPathSegments => Path.of(path, this.config).segments,
      ),
    ]);
    return commonBase === null ? null : createPathFromPathInstance(this, commonBase);
  }

  /**
   * Returns the relative Path from this Path to `path` (after normalization)
   *  - the function throw if it's not possible to reach `path` from this Path.
   *
   * @example:
   *  `new Path('a/b/').relative('a/d')` => `../d`
   *  `new Path('a/b/').relative('/a/d')` => throws
   */
  relative(path: IPathInput): Path | never {
    const relativePath: Path | null = this.relativeOptional(path);
    if (relativePath === null) {
      throw new Error('Cannot reach `path` from this Path.');
    } else {
      return relativePath;
    }
  }

  /**
   * Like `.relative(...)`, but returns `null` instead of throwing.
   * @see relative
   */
  relativeOptional(path: IPathInput): Path | null {
    const relativePath: IPathSegments | null = getRelativePathSegments(
      this.segments,
      Path.of(path, this.config).segments,
      this.config,
    );
    return relativePath === null ? null : createPathFromPathInstance(this, relativePath);
  }

  /* MISC */

  /**
   * Returns a new Path composed of this Path followed by 'paths'
   *  - equivalent of path.join() of NodeJS
   *
   * @example:
   *  - `new Path('./a').concat('b')` => `./a/b`
   */
  concat(...paths: IPathInput[]): Path {
    return createPathFromPathInstance(
      this,
      joinManyPathSegments(
        [
          this.segments,
          ...paths.map<IPathSegments>(
            (path: IPathInput): IPathSegments => Path.of(path, this.config).segments,
          ),
        ],
        this.config,
      ),
    );
  }

  /**
   * Returns a new absolute Path from this Path:
   * - if this Path is absolute, this function returns a cloned path,
   * - else it appends `root` before this Path
   *
   * @param root - default: `process.cwd()`
   */
  resolve(root?: IPathInput): Path {
    return createPathFromPathInstance(
      this,
      resolvePathSegmentsWithOptionalRoot(
        this.segments,
        root === undefined ? undefined : Path.of(root, this.config).segments,
        this.config,
      ),
    );
  }

  /**
   * Clones the path. Kind of new Path(this, config) but faster.
   */
  clone(config?: IPathPlatformConfig): Path {
    return createPathFromPathInstance(this, this.segments.slice(), config);
  }

  /* CONVERT */

  /**
   * Forces this Path to be converted to an absolute Path IF it is not already absolute.
   *
   * @param root - default: `process.cwd()`
   */
  makeAbsolute(root?: IPathInput): Path {
    const _root: IPathSegments =
      root === undefined
        ? getProcessPathSegments(this.config)
        : Path.of(root, this.config).segments;

    return createPathFromPathInstance(
      this,
      makePathSegmentsAsAbsolute(this.segments, _root[0], this.config),
    );
  }

  /**
   * Forces this Path to be converted to a relative path IF it is not already relative.
   *  => it replaces Path's first segment (the root) with '.'
   */
  makeRelative(): Path {
    return createPathFromPathInstance(this, makePathSegmentsAsRelative(this.segments, this.config));
  }

  /* TO */

  /**
   * Returns the concatenated string of the different segments of this Path, separated by `separa
   * tor`.
   * @param separator - default: `config.separator`
   */
  toString(separator?: string): string {
    let config: IPathPlatformConfig;

    if (separator === undefined) {
      config = this.config;
    } else if (typeof separator === 'string') {
      config = separator === this.config.separator ? this.config : { ...this.config, separator };
    } else {
      throw new TypeError('Expected string as separator');
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
