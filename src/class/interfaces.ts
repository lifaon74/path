import { IPlatformConfig, IWindowsPlatformConfig } from '../core/configs';
import { IStemAndExtTuple, TAllowedSpecialSegments, TNormalizedPathSegments, TPathSegments } from '../core/interfaces';


/** TYPES **/

export type TPathInput =
  string // the path as a string
  | TPathSegments // the path as split segments (kind of .split('/'))
  | IPath // a Path
  | { toString(): string } // an object castable to string
;

export type TPathConstructorArgs = [TPathInput, IPlatformConfig?];

/** INTERFACES **/

export interface IPathConstructor {
  readonly posix: Readonly<IPlatformConfig>; // returns the posix configuration to provide to Path
  readonly windows: Readonly<IWindowsPlatformConfig>; // returns the windows configuration to provide to Path
  readonly generic: Readonly<IPlatformConfig>; // returns a generic configuration to provide to Path
  readonly currentPlatform: Readonly<IPlatformConfig> | never; // returns the current platform configuration to provide to Path (only on NodeJs)

  /**
   * Returns the current process working directory as Path
   */
  process(): IPath | never;

  /**
   * If 'path' is a Path, returns 'path',
   * Else creates a Path from 'path'
   *  => useful if you want to accept many types as the 'path' input of a function without sacrificing performances:
   */
  of(path: TPathInput, config?: IPlatformConfig): IPath;

  /**
   * Creates a new Path, with a specific config (or default to <generic>)
   *  When creating a path, the input is always normalized.
   */
  new(path: TPathInput, config?: IPlatformConfig): IPath;
}


export interface IPath {

  readonly config: Readonly<IPlatformConfig>; // the current config of the Path
  readonly length: number; // the number of segments composing the Path

  /**
   * INFORMATION: returns some properties about this Path
   */

  /**
   * Returns true if this Path is absolute
   */
  isAbsolute(): boolean;

  /**
   * Returns true if this Path is a pure root (ex: 'c:' or '/')
   */
  isRoot(): boolean;

  /**
   * Returns true if this Path is equal to 'path' (after normalization)
   * @example:
   *  new Path('a/b/').equals('a/c/../b') => true
   */
  equals(path: TPathInput): boolean;

  /**
   * Returns true if this Path is a sub-path of 'path' (after normalization)
   * @example:
   *  new Path('a/b/').isSubPathOf('a/') => true
   */
  isSubPathOf(parentPath: TPathInput): boolean;


  /**
   * OPERATIONS: creates new Path after doing some operation on this Path
   */

  /**
   * Returns the parent directory's Path of this Path. If this Path is a pure root, returns null
   * @example:
   *  new Path('a/b').dirname() => './a'
   *  new Path('c:/').dirname() => null
   */
  dirname(): IPath | null;

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
  basename(ext?: string, allowedSpecialSegments?: Iterable<TAllowedSpecialSegments>): string | null;

  /**
   * Returns a tuple composed of the stem and the extension of the basename of this Path
   */
  stemAndExt(): IStemAndExtTuple | null;

  /**
   * Returns the common base between this Path, and each 'paths'
   *  - if no common base, returns null
   * @example:
   *  new Path('a/b/').commonBase('a/c') => './a'
   *  new Path('/a/b/').commonBase('d/e') => null
   */
  commonBase(...paths: TPathInput[]): IPath | null;

  /**
   * Returns a new Path composed of this Path followed by 'paths'
   *  - equivalent of path.join() of NodeJS
   */
  concat(...paths: TPathInput[]): IPath;

  /**
   * Returns the relative Path from this Path to 'path' (after normalization)
   *  - returns null if we cannot reach 'path' from this Path
   * @example:
   *  new Path('a/b/').relative('a/d') => '../d
   *  new Path('a/b/').relative('/a/d') => null
   */
  relative(path: TPathInput): IPath | null;

  /**
   * Returns a new absolute Path from this Path
   * - if this Path is absolute, returns a cloned path,
   * - else appends 'root' before this Path
   * @param root - default: process.cwd()
   */
  resolve(root?: TPathInput): IPath;

  /**
   * Clones the path. Kind of new Path(this, config) but faster
   */
  clone(config?: IPlatformConfig): IPath;


  /**
   * MUTATIONS: mutates the content of this Path
   */

  /**
   * Inserts 'parts', as an array of path's segments at the end of this Path.
   *  - mutates this Path
   *  - may insert '..' if this Path is not a pure root
   *  - cannot insert a root
   *  - this Path remains normalized
   */
  push(...parts: string[]): this;

  /**
   * Removes one segment at the end of this Path.
   *  - mutates this Path
   *  - if this Path contains only one segment, it becomes '.'
   *  - this function is not strictly equivalent to push('..')
   *  - this Path remains normalized
   */
  pop(): this;

  /**
   * Forces this Path to mutate to an absolute Path IF it is not already absolute
   *  - mutates this Path
   * @param root - default: process.cwd()
   */
  forceAbsolute(root?: TPathInput): this;

  /**
   * Forces this Path to mutate to a relative path IF it is not already relative
   *  => replaces Path's first segment (the root) with '.'
   *  - mutates this Path
   */
  forceRelative(): this;


  /**
   * INSPECTION: reads and explores the different segments of this Path
   */

  /**
   * Returns the segment at position 'index'
   */
  item(index: number): string;


  /**
   * Following functions iterates over the segments of this Path
   */

  every(callback: (this: this, value: string, index: number) => unknown): boolean;

  some(callback: (this: this, value: string, index: number) => unknown): boolean;

  forEach(callback: (this: this, value: string, index: number) => void): void;

  [Symbol.iterator](): IterableIterator<string>;


  /**
   * CONVERSION: converts this Path to different formats
   */

  /**
   * Returns the concatenated string of the different segments of this Path, separated by 'separator'
   * @param separator - default: config.separator
   */
  toString(separator?: string): string;

  /**
   * Returns the segments composing this Path
   */
  toArray(): TNormalizedPathSegments;

  /**
   * Equivalent of 'toString'
   */
  toJSON(): string;

  /**
   * Returns a 'file://' url having this Path as pathname
   */
  toURL(): URL;

}
