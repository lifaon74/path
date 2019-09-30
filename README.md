[![npm (scoped)](https://img.shields.io/npm/v/@lifaon/path.svg)](https://www.npmjs.com/package/@lifaon/path)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@lifaon/path.svg)
![npm](https://img.shields.io/npm/dm/@lifaon/path.svg)
![NPM](https://img.shields.io/npm/l/@lifaon/path.svg)
![npm type definitions](https://img.shields.io/npm/types/@lifaon/path.svg)


# Path #

Provides a *Path* class to manage paths:
- normalization
- mutation
- dirname, basename, stem and ext, ...
- comparision
- etc...

Supports multiple configs and environments (windows and posix style).

Allows you to pass paths as normalized reference instead of string that you need to parse and normalize many times.

Allows you to inspect and modify specific segments of the path.

To install:
```bash
yarn add @lifaon/path
# or 
npm i @lifaon/path --save
```

Entry point: `index.js`. I recommend you to use rollup to import/bundle the package,
but you may use an already bundled version in `bundles/`.

You may also use unpkg: `https://unpkg.com/@lifaon/path`

The bundled esnext minzipped core is around 3KB in size (`path.esnext.core.umd.min.js`).

**Example:**
```ts
function writeFileExample() {
  const fs = require('fs').promises;
  
  function writeFile(path: TPathInput, content: Uint8Array): Promise<void> {
    const _path = Path.of(path);
    const _parent = _path.dirname();
    if (_parent === null) {
      return Promise.reject(new Error(`path is not a file`));
    } else {
      return fs.mkdir(_parent.toString())
        .then(() => {
          return fs.writeFile(_path.toString(), content);
        });
    }
  }
}
```

**But [path](https://nodejs.org/api/path.html) already exists on NodeJS 🤨 !?**

Yes sure ! But the NojeJS's path library has some limitations:
- it is not native to the browser (you'll need to use browserify for example)
- it doesn't support fine tuning of the path: specific segment modification
- it provides only basic functions
- if path is incorrect by nature (ex: '/a/../../j', 'c:/d:', '/..') some strange/non well defined behaviours may occur
- it forces you to pass paths as strings (primitive copy) instead of references, and parse/normalize them almost each time.

With this lib, you are sure than every *'Path'* you'll received is normalized and ready for usage.

Moreover, if your path is not well formed (contains invalid segment's names, includes more than one root, goes upper than root, etc.),
*Path* doesn't hesitate to throw or return null.
This avoids unwanted behaviour like invalid paths magically transforming into valid ones after a `path.normalize` for example.

Give it a try, and to hesitate to share your feedback into the *issues* section of github 😉

## Table of contents ##
<!-- toc -->
- [Usage](#usage)
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


## Usage ##

```ts
/** TYPES **/

export type TPathInput =
  string // the path as a string
  | TPathSegments // the path as spited segments (kind of .split('/'))
  | IPath // a Path
  | { toString(): string } // an object castable to string
;

/** INTERFACES **/

export interface IPathConstructor {
  readonly posix: Readonly<IPlatformConfig>; // returns the posix configuration to provide to Path
  readonly windows: Readonly<IPlatformConfig>; // returns the windows configuration to provide to Path
  readonly generic: Readonly<IPlatformConfig>; // returns a generic configuration to provide to Path
  readonly currentPlatform: Readonly<IPlatformConfig> | never; // returns the current platform configuration to provide to Path (only on NodeJs)

  /**
   * Returns the current process working directory as Path
   */
  process(): IPath | never;

  /**
   * If 'path' is a Path, returns 'path',
   * Else creates a Path from 'path'
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
   *  new Path('a/b').dirname() as IPath) => './a'
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
   * Removes one segment at the end of ths Path.
   *  - mutates this Path
   *  - if this Path contains only one segment, it becomes '.'
   *  - this function is not strictly equivalent to push('..')
   *  - this Path remains normalized
   */
  pop(): this;

  /**
   * Forces this Path to mutate to an absolute Path IF not already absolute
   *  - mutates this Path
   * @param root - default: process.cwd()
   */
  forceAbsolute(root?: TPathInput): this;

  /**
   * Forces this Path to mutate to a relative path IF not already relative
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

**WARN:** `new Path(path1).resolve(path2);` is not equivalent to `path.resolve([...paths])`,
because NodeJS process the arguments from right to left where *Path* doesn't need such a strange trick.

`new Path(path1).resolve(path2);` may be translated to:
 - if `path1` is absolute, returns this path
 - else concats (*path.join* in NodeJS) `path2` and `path1`

If `path2` is omitted, like NodeJS, `process.cwd` is used instead.

This is the correct equivalent:
```ts
// in NodeJS
path.resolve('/foo', '/bar', 'baz') // => would return /bar/baz

// with Path
new Path('baz') // './baz'
    .resolve('/bar') // '/bar/baz'
    .resolve('/foo'); // '/bar/baz' => no modification because already absolute
```

#### path.sep ####
```ts
Path.currentPlatform.separator;
```

#### path.win32 ####
```ts
new Path(path, Path.windows);
```









