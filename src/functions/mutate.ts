import { IPathSegmentsSharedOptions, TNormalizedPathSegments } from './interfaces';
import { IsEntryNamePathSegment, IsRootPathSegment, IsValidPathSegment } from './segment';
import { ErrorWithCode } from '../helpers/ErrorWithCode';

/**
 * Inserts 'segment' at the end of the path.
 *  - may insert '..' if path is not a single root
 *  - cannot insert a root
 *  - 'path' remains normalized
 */
export function PathSegmentsPush(path: TNormalizedPathSegments, segment: string, options: IPathSegmentsSharedOptions): void {
  if (IsValidPathSegment(segment)) {
    if (segment === '.') {
      // nothing to do
      /* segment is not . */
    } else if (segment === '..') {
      const lastSegment: string = path[path.length - 1];
      if (lastSegment === '.') { // path is ['.']
        path[0] = segment; // path becomes ['..']
        /* lastSegment is not . */
      } else if (lastSegment === '..') { // path is ['..', or more '..']
        path.push(segment); // path becomes [...'..', '..']
        /* lastSegment is not .. */
      } else if (IsRootPathSegment(lastSegment, options.rootRegExp)) { // path is [root]
        throw new ErrorWithCode(`Cannot push '..' into a path with only one segment of type root`, 'POP_ROOT');
        /* lastSegment is not a root */
      } else { // path contains at least one entry [start, ...entries?, entry]
        path.pop(); // path becomes [start, ...entries?]
      }
      /* segment not .. */
    } else if (IsRootPathSegment(segment, options.rootRegExp)) {
      throw new ErrorWithCode(`Cannot push a root into a path`, 'PUSH_ROOT');
      /* segment is not a root */
    } else { // segment is an entry
      path.push(segment);
    }
  } else {
    throw new ErrorWithCode(`Segment ${ JSON.stringify(segment) } is invalid`, `INVALID_NAME`);
  }
}

/**
 * Removes one segment at the end of the path.
 *  - if the path contains only one segment, path becomes '.'
 *  - this function is not equivalent to push('..')
 *  - 'path' remains normalized
 */
export function PathSegmentsPop(path: TNormalizedPathSegments): void {
  if (path.length === 1) { // path is ['.'], ['..'] or [root]
    path[0] = '.';
  } else {
    path.pop();
  }
}

/**
 * Inserts 'segment' at the beginning of the path.
 *  - may insert a root if path starts with '.'
 *  - cannot insert if path starts with root (absolute path)
 *  - 'path' remains normalized
 */
export function PathSegmentsUnshift(path: TNormalizedPathSegments, segment: string, options: IPathSegmentsSharedOptions): void {
  if (IsValidPathSegment(segment)) {
    const firstSegment: string = path[0];
    if (firstSegment === '.') { // path is ['.', ...entries?]
      if (IsEntryNamePathSegment(segment, options.rootRegExp)) {
        path.splice(1, 0, segment); // path becomes ['.', segment, ...entries?]
      } else {
        path[0] = segment; // path becomes [segment, ...entries?]
      }
      /* firstSegment is not . */
    } else if (firstSegment === '..') { // path is ['..', ...'..'?, ...entries?]
      if (segment === '.') {
        // nothing to do
        /* segment is not . */
      } else if (segment === '..') {
        path.unshift(segment); // path becomes ['..', '..', ...'..'?, ...entries?]
        /* segment is not .. */
      } else if (IsRootPathSegment(segment, options.rootRegExp)) {
        throw new ErrorWithCode(`Cannot unshift a root into a path starting with '..'`, 'UNSHIFT_ROOT');
        /* segment is not a root */
      } else { // segment is an entry
        if (path.length === 1) { // path is ['..']
          path[0] = '.'; // [entry, '..'] becomes ['.']
        } else {
          path.shift(); // path becomes [...'..'{1,n}, ...entries?]
        }
      }
      /* firstSegment is not .. */
    } else if (IsRootPathSegment(firstSegment, options.rootRegExp)) {
      throw new ErrorWithCode(`Cannot unshift into an absolute path`, 'ABSOLUTE_PATH');
      /* firstSegment is not a root */
    } else {
      throw new Error(`Path is not normalized`);
    }
  } else {
    throw new ErrorWithCode(`Segment ${ JSON.stringify(segment) } is invalid`, `INVALID_NAME`);
  }
}


/**
 * Removes one segment at the beginning of the path.
 *  - if the path contains only one segment, path become '.'
 *  - this function is not equivalent to push('..')
 *  - 'path' remains normalized
 */
export function PathSegmentsShift(path: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): void {
  if (IsRootPathSegment(path[0], options.rootRegExp)) { // path is [root, ...entries?]
    path[0] = '.'; // path becomes ['.', ...entries?]
    /* firstSegment not a root */
  } else { // path is ['.', ...entries?] or ['..', ...'..'?, ...entries?]
    path.shift();
  }
}

/**
 * Converts a relative path to an absolute path, by appending 'rootSegment' at the beginning of the path
 */
export function ForcePathSegmentsAsAbsolute(path: TNormalizedPathSegments, rootSegment: string, options: IPathSegmentsSharedOptions): void {
  if (IsRootPathSegment(rootSegment, options.rootRegExp)) {
    const firstSegment: string = path[0];
    if (firstSegment === '.') {
      path[0] = rootSegment;
    } else if (firstSegment === '..') {
      while (path[0] === '..') {
        path.shift();
      }
      path.unshift(rootSegment);
    } else if (IsRootPathSegment(firstSegment, options.rootRegExp)) {
      // do nothing
    } else {
      throw new Error(`Path is not normalized`);
    }
  } else {
    throw new ErrorWithCode(`Root is invalid`, `INVALID_ROOT`);
  }
}

/**
 * Converts an absolute path to a relative path: replace the root by '.'
 */
export function ForcePathSegmentsAsRelative(path: TNormalizedPathSegments, options: IPathSegmentsSharedOptions): void {
  if (IsRootPathSegment(path[0], options.rootRegExp)) {
    path[0] = '.';
  }
}




