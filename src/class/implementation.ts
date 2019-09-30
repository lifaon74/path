import { IsObject } from '../helpers/helpers';
import { IPath, IPathConstructor, TPathConstructorArgs, TPathInput } from './interfaces';
import { ConstructClassWithPrivateMembers } from '../helpers/factory/ClassWithPrivateMembers';
import { Constructor, HasFactoryWaterMark, MakeFactory } from '../helpers/factory/factory';
import {
  GENERIC_CONFIG, IPlatformConfig, IWindowsPlatformConfig, POSIX_CONFIG, WINDOWS_CONFIG
} from '../core/configs';
import {
  CommonBasePathSegments, JoinPathSegments, RelativePathSegments,
  ResolvePathSegmentsWithOptionalRoot
} from '../core/operations';
import { IStemAndExtTuple, TAllowedSpecialSegments, TNormalizedPathSegments } from '../core/interfaces';
import { PathSegmentsToStringPath, StringPathToPathSegments } from '../core/convert';
import {
  AreSamePathSegments, BaseNamePathSegments, DirNamePathSegments, IsAbsolutePathSegments, IsRootPathSegments,
  IsSubPathSegments, StemAndExtTuplePathSegments
} from '../core/infos';
import {
  ForcePathSegmentsAsAbsolute, ForcePathSegmentsAsRelative, PathSegmentsPop, PathSegmentsPush
} from '../core/mutate';
import { GetProcessPathSegments } from '../core/others';
import { NormalizePathSegments } from '../core/normalize';


export const PATH_PRIVATE = Symbol('path-private');

export interface IPathPrivate {
  path: TNormalizedPathSegments;
  config: Readonly<IPlatformConfig>;
}

export interface IPathInternal extends IPath {
  [PATH_PRIVATE]: IPathPrivate;
}

let CHECK_PATH_CONSTRUCT: boolean = true;

export function NewPath(path: TNormalizedPathSegments, config: Readonly<IPlatformConfig>, constructor: IPathConstructor = Path): IPath {
  CHECK_PATH_CONSTRUCT = false;
  const _path: IPath = new constructor(path, config);
  CHECK_PATH_CONSTRUCT = true;
  return _path;
}

export function NewPathFromInstance(
  instance: IPath,
  path: TNormalizedPathSegments = instance.toArray(),
  config: Readonly<IPlatformConfig> = instance.config
): IPath {
  return NewPath(path, config, instance.constructor as IPathConstructor);
}


export function ConstructPath(
  instance: IPath,
  path: TPathInput,
  config?: IPlatformConfig,
): void {
  ConstructClassWithPrivateMembers(instance, PATH_PRIVATE);
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];

  if (CHECK_PATH_CONSTRUCT) {
    if (config === void 0) {
      privates.config = IsPath(path)
        ? path[PATH_PRIVATE].config
        : GENERIC_CONFIG;
    } else if (IsObject(config)) {
      privates.config = Object.isFrozen(config) ? config : Object.freeze({ ...config });
    } else {
      throw new TypeError(`Expected PlatformConfig or void as config`);
    }

    if (typeof path === 'string') {
      privates.path = StringPathToPathSegments(path, privates.config);
    } else if (Array.isArray(path)) {
      privates.path = NormalizePathSegments(path, privates.config);
    } else if (IsPath(path)) {
      privates.path = path[PATH_PRIVATE].path.slice();
    } else if (typeof path.toString === 'function') {
      privates.path = StringPathToPathSegments(path.toString(), privates.config);
    } else {
      throw new TypeError(`Expected string, string[], Path or object with toString() method as path`);
    }
  } else {
    privates.path = path as TNormalizedPathSegments;
    privates.config = config as Readonly<IPlatformConfig>;
  }
}

export function IsPath(value: any): value is IPath {
  return IsObject(value)
    && value.hasOwnProperty(PATH_PRIVATE as symbol);
}

const IS_PATH_CONSTRUCTOR = Symbol('is-path-constructor');

export function IsPathConstructor(value: any, direct?: boolean): value is IPathConstructor {
  return (typeof value === 'function') && ((value === Path) || HasFactoryWaterMark(value, IS_PATH_CONSTRUCTOR, direct));
}


export function PathGetConfig(instance: IPath): Readonly<IPlatformConfig> {
  return (instance as IPathInternal)[PATH_PRIVATE].config;
}

export function PathGetLength(instance: IPath): number {
  return (instance as IPathInternal)[PATH_PRIVATE].path.length;
}

/**
 * INFORMATION
 */

export function PathIsAbsolute(instance: IPath): boolean {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return IsAbsolutePathSegments(privates.path, privates.config);
}

export function PathIsRoot(instance: IPath): boolean {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return IsRootPathSegments(privates.path, privates.config);
}

export function PathEquals(instance: IPath, path: TPathInput): boolean {
  return AreSamePathSegments(
    (instance as IPathInternal)[PATH_PRIVATE].path,
    PathOfFromInstance(instance, path)[PATH_PRIVATE].path
  );
}

export function PathIsSubPathOf(instance: IPath, parentPath: TPathInput): boolean {
  return IsSubPathSegments(
    (instance as IPathInternal)[PATH_PRIVATE].path,
    PathOfFromInstance(instance, parentPath)[PATH_PRIVATE].path
  );
}


/**
 * OPERATIONS
 */

export function PathDirname(instance: IPath): IPath | null {
  const dirname: TNormalizedPathSegments | null = DirNamePathSegments((instance as IPathInternal)[PATH_PRIVATE].path);
  return (dirname === null)
    ? null
    : NewPathFromInstance(instance, dirname);
}

export function PathBasename(instance: IPath, ext?: string, allowedSpecialSegments?: Iterable<TAllowedSpecialSegments>): string | null {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return BaseNamePathSegments(
    privates.path,
    ext,
    (allowedSpecialSegments === void 0)
      ? privates.config
      : {
        ...privates.config,
        allowedSpecialSegments: new Set(Array.from(allowedSpecialSegments))
      }
  );
}

export function PathStemAndExt(instance: IPath): IStemAndExtTuple | null {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return StemAndExtTuplePathSegments(privates.path, privates.config);
}

export function PathCommonBase(instance: IPath, paths: TPathInput[]): IPath | null {
  const commonBase: TNormalizedPathSegments | null = CommonBasePathSegments([
    (instance as IPathInternal)[PATH_PRIVATE].path,
    ...paths.map<TNormalizedPathSegments>(path => PathOfFromInstance(instance, path)[PATH_PRIVATE].path)
  ]);
  return (commonBase === null)
    ? null
    : NewPathFromInstance(instance, commonBase);
}

export function PathConcat(instance: IPath, paths: TPathInput[]): IPath {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return NewPathFromInstance(
    instance,
    JoinPathSegments(
      [
        privates.path,
        ...paths.map<TNormalizedPathSegments>(path => PathOfFromInstance(instance, path)[PATH_PRIVATE].path)
      ],
      privates.config
    )
  );
}

export function PathRelative(instance: IPath, path: TPathInput): IPath | null {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  const relativePath: TNormalizedPathSegments | null = RelativePathSegments(privates.path, PathOfFromInstance(instance, path)[PATH_PRIVATE].path, privates.config);
  return (relativePath === null)
    ? null
    : NewPathFromInstance(instance, relativePath);
}

export function PathResolve(instance: IPath, root?: TPathInput): IPath {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return NewPathFromInstance(
    instance,
    ResolvePathSegmentsWithOptionalRoot(
      privates.path,
      (root === void 0)
        ? void 0
        : PathOfFromInstance(instance, root)[PATH_PRIVATE].path,
      privates.config
    )
  );
}

export function PathClone(instance: IPath, config?: IPlatformConfig): IPath {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  return NewPathFromInstance(
    instance,
    privates.path.slice(),
    config
  );
}


/**
 * MUTATIONS
 */

export function PathPush(instance: IPath, parts: string[]): void {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  for (let i = 0, l = parts.length; i < l; i++) {
    PathSegmentsPush(privates.path, parts[i], privates.config);
  }
}

export function PathPop(instance: IPath): void {
  PathSegmentsPop((instance as IPathInternal)[PATH_PRIVATE].path);
}

export function PathForceAbsolute(instance: IPath, root?: TPathInput): void {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  const _root: TNormalizedPathSegments = (root === void 0)
    ? GetProcessPathSegments(privates.config)
    : PathOfFromInstance(instance, root)[PATH_PRIVATE].path;
  ForcePathSegmentsAsAbsolute(privates.path, _root[0], privates.config);
}

export function PathForceRelative(instance: IPath): void {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  ForcePathSegmentsAsRelative(privates.path, privates.config);
}


/**
 * INSPECTION
 */

export function PathItem(instance: IPath, index: number): string {
  const path: TNormalizedPathSegments = (instance as IPathInternal)[PATH_PRIVATE].path;
  if ((0 <= index) && (index < path.length)) {
    return path[index];
  } else {
    throw new RangeError(`Index out of range [0, ${ path.length }[`);
  }
}

export function PathEvery(instance: IPath, callback: (value: string, index: number) => unknown): boolean {
  return (instance as IPathInternal)[PATH_PRIVATE].path.every((value: string, index: number) => {
    return callback.call(instance, value, index);
  });
}

export function PathSome(instance: IPath, callback: (value: string, index: number) => unknown): boolean {
  return (instance as IPathInternal)[PATH_PRIVATE].path.some((value: string, index: number) => {
    return callback.call(instance, value, index);
  });
}

export function PathForEach(instance: IPath, callback: (value: string, index: number) => void): void {
  return (instance as IPathInternal)[PATH_PRIVATE].path.forEach((value: string, index: number) => {
    callback.call(instance, value, index);
  });
}

export function PathToIterator(instance: IPath): IterableIterator<string> {
  return (instance as IPathInternal)[PATH_PRIVATE].path[Symbol.iterator]();
}


/**
 * CONVERSION
 */

export function PathToString(instance: IPath, separator?: string): string {
  const privates: IPathPrivate = (instance as IPathInternal)[PATH_PRIVATE];
  let config: IPlatformConfig;
  if (separator === void 0) {
    config = privates.config;
  } else if (typeof separator === 'string') {
    config = (separator === privates.config.separator)
      ? privates.config
      : { ...privates.config, separator };
  } else {
    throw new TypeError(`Expected string as separator`);
  }
  return PathSegmentsToStringPath(privates.path, config);
}

export function PathToArray(instance: IPath): TNormalizedPathSegments {
  return (instance as IPathInternal)[PATH_PRIVATE].path.slice();
}

export function PathToURL(instance: IPath): URL {
  const url: URL = new URL('file://');
  url.pathname = PathToString(instance, '/');
  return url;
}

/*------------------------------------------*/

export function PathCurrentPlatform(): Readonly<IPlatformConfig> {
  if (globalThis.process) {
    return (process.platform === 'win32')
      ? WINDOWS_CONFIG
      : POSIX_CONFIG;
  } else {
    throw new Error(`Not on a nodeJs's environment`);
  }
}


export function PathProcess(constructor: IPathConstructor, config?: IPlatformConfig): IPath {
  if (globalThis.process) {
    return new constructor(process.cwd(), config);
  } else {
    throw new Error(`Not on a nodeJs's environment`);
  }
}

export function PathOf(constructor: IPathConstructor, path: TPathInput, config?: IPlatformConfig): IPath {
  return (path instanceof constructor)
    ? path
    : new constructor(path, config);
}

export function PathOfFromInstance(
  instance: IPath,
  path: TPathInput,
  config: Readonly<IPlatformConfig> = instance.config
): IPath {
  return PathOf(instance.constructor as IPathConstructor, path, config);
}

/*------------------------------------------*/


function PurePathFactory<TBase extends Constructor>(superClass: TBase) {
  return class Path extends superClass implements IPath {

    static get posix(): Readonly<IPlatformConfig> {
      return POSIX_CONFIG;
    }

    static get windows(): Readonly<IWindowsPlatformConfig> {
      return WINDOWS_CONFIG;
    }

    static get generic(): Readonly<IPlatformConfig> {
      return GENERIC_CONFIG;
    }


    static get currentPlatform(): Readonly<IPlatformConfig> | never {
      return PathCurrentPlatform();
    }

    static process(config?: IPlatformConfig): IPath | never {
      return PathProcess(this, config);
    }

    static of(path: TPathInput, config?: IPlatformConfig): IPath {
      return PathOf(this, path, config);
    }


    constructor(...args: any[]) {
      const [path, config]: TPathConstructorArgs = args[0];
      super(...args.slice(1));
      ConstructPath(this, path, config);
    }

    get config(): Readonly<IPlatformConfig> {
      return PathGetConfig(this);
    }

    get length(): number {
      return PathGetLength(this);
    }

    /**
     * INFORMATION
     */

    isAbsolute(): boolean {
      return PathIsAbsolute(this);
    }

    isRoot(): boolean {
      return PathIsRoot(this);
    }

    equals(path: TPathInput): boolean {
      return PathEquals(this, path);
    }

    isSubPathOf(parentPath: TPathInput): boolean {
      return PathIsSubPathOf(this, parentPath);
    }


    /**
     * OPERATIONS
     */

    dirname(): IPath | null {
      return PathDirname(this);
    }

    basename(ext?: string, allowedSpecialSegments?: Iterable<TAllowedSpecialSegments>): string | null {
      return PathBasename(this, ext, allowedSpecialSegments);
    }

    stemAndExt(): IStemAndExtTuple | null {
      return PathStemAndExt(this);
    }

    commonBase(...paths: TPathInput[]): IPath | null {
      return PathCommonBase(this, paths);
    }

    concat(...paths: TPathInput[]): IPath {
      return PathConcat(this, paths);
    }

    relative(path: TPathInput): IPath | null {
      return PathRelative(this, path);
    }

    resolve(root?: TPathInput): IPath {
      return PathResolve(this, root);
    }

    clone(config?: IPlatformConfig): IPath {
      return PathClone(this, config);
    }

    /**
     * MUTATIONS
     */

    push(...parts: string[]): this {
      PathPush(this, parts);
      return this;
    }

    pop(): this {
      PathPop(this);
      return this;
    }

    forceAbsolute(root?: TPathInput): this {
      PathForceAbsolute(this, root);
      return this;
    }

    forceRelative(): this {
      PathForceRelative(this);
      return this;
    }


    /**
     * INSPECTION
     */

    item(index: number): string {
      return PathItem(this, index);
    }

    every(callback: (this: this, value: string, index: number) => unknown): boolean {
      return PathEvery(this, callback);
    }

    some(callback: (this: this, value: string, index: number) => unknown): boolean {
      return PathSome(this, callback);
    }

    forEach(callback: (this: this, value: string, index: number) => void): void {
      return PathForEach(this, callback);
    }

    [Symbol.iterator](): IterableIterator<string> {
      return PathToIterator(this);
    }


    /**
     * CONVERSION
     */

    toString(separator?: string): string {
      return PathToString(this);
    }

    toArray(): TNormalizedPathSegments {
      return PathToArray(this);
    }

    toJSON(): string {
      return PathToString(this);
    }

    toURL(): URL {
      return PathToURL(this);
    }

  };
}

export let Path: IPathConstructor;

export function PathFactory<TBase extends Constructor>(superClass: TBase) {
  return MakeFactory<IPathConstructor, [], TBase>(PurePathFactory, [], superClass, {
    name: 'Path',
    instanceOf: Path,
    waterMarks: [IS_PATH_CONSTRUCTOR]
  });
}

Path = class Path extends PathFactory<ObjectConstructor>(Object) {
  constructor(path: TPathInput, config?: IPlatformConfig) {
    super([path, config]);
  }
} as IPathConstructor;

