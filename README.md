[![npm (scoped)](https://img.shields.io/npm/v/@lifaon/path.svg)](https://www.npmjs.com/package/@lifaon/path)
![npm](https://img.shields.io/npm/dm/@lifaon/path.svg)
![NPM](https://img.shields.io/npm/l/@lifaon/path.svg)
![npm type definitions](https://img.shields.io/npm/types/@lifaon/path.svg)
![npm size](https://img.shields.io/bundlephobia/minzip/@lifaon/path)

## Path

This library provides a `Path` class to manage paths, somehow like the [URL class](https://developer.mozilla.org/en-US/docs/Web/API/URL).
You'll be able to normalize, mutate, contact, etc... your paths,
and extract some useful information like the basename, dirname, stem and ext, etc...

It supports multiple configurations and environments (windows and posix style),
and give you fine details and tuning on your paths.


**Example:**

```ts
import fs from 'fs/promises';

const ROOT = Path.process();
const TMP_DIR = ROOT.concat('tmp');
const DEMO_FILE = TMP_DIR.concat('demo.txt');

function rename(
  path: Path,
  newName: string,
): Promise<void> {
  const newPath: Path | null = path.dirname();
  if (newPath === null) {
    return Promise.reject(new Error(`Cannot rename a <root>`));
  } else {
    return fs.rename(
      newPath.concat(newName).toString(),
    );
  }
}

await rename(DEMO_FILE, 'demo.js');

```

You may have a legitimate question: *But [path](https://nodejs.org/api/path.html) already exists on NodeJS 🤨 !?*

Yes sure ! However, this library has many advantages:

- it works immediately in any environment (both browser and NodeJs, where `path` only works on `node` or using some polyfills)
- when you use a `Path` object, you're guaranteed to have a normalized and functional path,
  instead of a simple string which could contain an invalid path or anything else.
- this library covers some edge cases like: `dirname` or `basename` on a root path,
  or normalization of *strange* paths like: `/a/../../j`, `c:/d:`, `/..`, which are not well handled by NodeJs' `path`
  - with this library, like the `URL` class, if the path is invalid it will throw, instead of silently returning another invalid path
  => the NodeJS implementation has a lot of holes not covered.

**UNLIKE NODEJS' PATH, this library throws if a path is or becomes invalid.**
This prevents many unexpected behaviours on wrong paths.
For example `new Path('/home').concat('/etc/')` will throw because the resulting Path is invalid (you cannot concat a *root* to another one).
On NodeJS, `path.join('/home', '/etc')` gives `'/home/etc'` which is probably not what you're expecting.
And it gets worse when you mix windows and posix paths...

In conclusion, **this library is more resilient and offers better tools** than the classical NodeJS' one.


## 📦 Installation

```bash
yarn add @lifaon/path
# or
npm install @lifaon/path --save
```

This library supports:

- **common-js** (require): transpiled as es5, with .cjs extension, useful for old nodejs versions
- **module** (esm import): transpiled as esnext, with .mjs extension

CDN: [https://cdn.skypack.dev/@lifaon/path](https://cdn.skypack.dev/@lifaon/path)

## Table of contents
<!-- toc -->
- [Documentation](#documentation)
- [Comparision with NodeJS's path](#comparision-with-nodejss-path)
  + [Windows vs. POSIX](#windows-vs-posix)
  + [path.basename(path[, ext])](#pathbasenamepath-ext)
  + [path.delimiter](#pathdelimiter)
  + [path.dirname(path)](#pathdirnamepath)
  + [path.extname(path)](#pathextnamepath)
  + [path.isAbsolute(path)](#pathisabsolutepath)
  + [path.join([...paths])](#pathjoinpaths)
  + [path.normalize(path)](#pathnormalizepath)
  + [path.posix](#pathposix)
  + [path.relative(from, to)](#pathrelativefrom-to)
  + [path.resolve([...paths])](#pathresolvepaths)
  + [path.sep](#pathsep)
  + [path.win32](#pathwin32)


## Documentation 

```ts
/** TYPES **/

export type IPathInput =
  string // the path as a string
  | IUncheckedPathSegments // the path as string segments (kind of .split('/'))
  | Path // a Path
;

/** INTERFACES **/

export interface PathConstructor {
  readonly posix: Readonly<PathPlatformConfig>; // returns the posix configuration to provide to Path
  readonly windows: Readonly<IWindowsPathPlatformConfig>; // returns the windows configuration to provide to Path
  readonly generic: Readonly<PathPlatformConfig>; // returns a generic configuration to provide to Path
  readonly currentPlatform: Readonly<PathPlatformConfig> | never; // returns the current platform configuration to provide to Path (only on NodeJs)

  /**
   * Returns the current process working directory as Path
   */
  process(
    config?: PathPlatformConfig,
  ): Path | never;

  /**
   * If 'path' is a Path, returns 'path',
   * Else creates a Path from 'path'
   *  => useful if you want to accept many types as the 'path' input of a function without sacrificing performances:
   */
  of(
    path: IPathInput,
    config?: PathPlatformConfig,
  ): Path;

  /**
   * Creates a new Path, with a specific config (or default to <generic>)
   *  When creating a path, the input is always normalized.
   */
  new(
    path: IPathInput,
    config?: PathPlatformConfig,
  ): Path;
}


export interface Path {
  readonly segments: PathSegments; // the list of segments composing the path
  readonly config: Readonly<PathPlatformConfig>; // the current config of the Path

  /* IS */

  /**
   * Returns true if this Path is absolute
   */
  isAbsolute(): boolean;

  /**
   * Returns true if this Path is a pure root (ex: 'c:' or '/')
   */
  isRoot(): boolean;
  
  /**
   * Returns true if this Path is a sub-path of 'path' (after normalization)
   * @example:
   *  new Path('a/b/').isSubPathOf('a/') => true
   */
  isSubPathOf(
    parentPath: IPathInput,
  ): boolean;

  /* COMPARISON */

  /**
   * Returns true if this Path is equal to 'path' (after normalization)
   * @example:
   *  new Path('a/b/').equals('a/c/../b') => true
   */
  equals(
    path: IPathInput,
  ): boolean;


  /* GET */

  /**
   * Returns the parent directory's Path of this Path. If this Path is a pure root, returns null
   * @example:
   *  new Path('a/b').dirname() => './a'
   *  new Path('c:/').dirname() => null
   */
  dirname(): Path | null;

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
  ): string | null;

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
  commonBase(
    ...paths: IPathInput[]
  ): Path | null;
  

  /**
   * Returns the relative Path from this Path to 'path' (after normalization)
   *  - returns null if we cannot reach 'path' from this Path
   * @example:
   *  new Path('a/b/').relative('a/d') => '../d
   *  new Path('a/b/').relative('/a/d') => null
   */
  relative(
    path: IPathInput,
  ): Path | null;

  /**
   * Returns a new Path composed of this Path followed by 'paths'
   *  - equivalent of path.join() of NodeJS
   */
  concat(
    ...paths: IPathInput[]
  ): Path;
  
  /**
   * Returns a new absolute Path from this Path
   * - if this Path is absolute, returns a cloned path,
   * - else appends 'root' before this Path
   * @param root - default: process.cwd()
   */
  resolve(root?: IPathInput): Path;

  /**
   * Clones the path. Kind of new Path(this, config) but faster
   */
  clone(
    config?: Readonly<IPathPlatformConfig>,
  ): Path;


  /* MUTATE */

  /**
   * Forces this Path to mutate to an absolute Path IF it is not already absolute
   * @param root - default: process.cwd()
   */
  makeAbsolute(
    root?: IPathInput,
  ): Path;

  /**
   * Forces this Path to mutate to a relative path IF it is not already relative
   *  => replaces Path's first segment (the root) with '.'
   */
  makeRelative(): Path;


  /* TO */

  /**
   * Returns the concatenated string of the different segments of this Path, separated by 'separator'
   * @param separator - default: config.separator
   */
  toString(
    separator?: string,
  ): string;
  
  /**
   * Returns a 'file://' url having this Path as pathname
   */
  toURL(): URL;

}
```


## Comparision with NodeJS's path ##

[NodeJS's path doc](https://nodejs.org/api/path.html)

#### Windows vs. POSIX ####

*Path* supports both *windows* and *posix* by default.

By using a specific config you can custom the behaviour: ex - to support only windows style paths -
```ts
new Path('C:\\temp\\myfile.html', Path.windows);
```

The config is transmitted to the descendants (ex: using `concat`).


#### path.basename(path[, ext]) ####

```ts
new Path(path).basename(ext?);
```

#### path.delimiter ####

```ts
Path.currentPlatform.delimiterPattern;
```

#### path.dirname(path) ####

```ts
new Path(path).dirname();
```

#### path.extname(path) ####

```ts
new Path(path).stemAndExt().ext;
```

#### path.isAbsolute(path) ####

```ts
new Path(path).isAbsolute();
```

#### path.join([...paths]) ####

```ts
new Path(path).concat(...paths);
```

#### path.normalize(path) ####

```ts
new Path(path); // because the input is always normalized in the constructor
```

#### path.posix ####

```ts
new Path(path, Path.posix);
```

#### path.relative(from, to) ####

```ts
new Path(from).relative(to);
```


#### path.resolve([...paths]) ####

**WARN:** `new Path(path1).resolve(path2);` is not equivalent to `path.resolve([...paths])`.
NodeJS has a strange behaviour: it processes the arguments from right to left.
This library processes them from left to right.

`new Path(path1).resolve(path2);` may be translated to:
- if `path1` is absolute, returns this path
- else concacts (*path.join* in NodeJS) `path2` and `path1`

If `path2` is omitted, like NodeJS, `process.cwd` is used instead.

This is the correct equivalent:

```ts
// in NodeJS
path.resolve('/foo', '/bar', 'baz') // => would return /bar/baz

// with Path
new Path('baz') // './baz'
  .resolve('/bar') // '/bar/baz'
  .resolve('/foo'); // '/bar/baz' => there is no modification because the path is already absolute
```

#### path.sep ####

```ts
Path.currentPlatform.separator;
```

#### path.win32 ####

```ts
new Path(path, Path.windows);
```

