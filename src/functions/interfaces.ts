import { IPlatformConfig } from './configs';

export type TPathSegments = string[];
export type TNormalizedPathSegments = string[];
export type TAllowedSpecialSegments = '..' | '.' | 'root';

/**
 * A normalized path:
 *  - starts with '.', '..' (one or many) or [root] (min length of 1)
 *  - does not contain any '..', '.' expect at the beginning (unnecessary '..', '.' are removed)
 *  - does not contain invalid entry name
 */


export interface IStemAndExtTuple {
  stem: string;
  ext: string;
}

export interface IPathSegmentsSharedOptions extends Pick<IPlatformConfig, 'rootRegExp'> {
}

export interface IPathSegmentsJoinOptions extends IPathSegmentsSharedOptions {
  strict?: boolean;
}

export interface IPathSegmentsToStringPathOptions extends IPathSegmentsSharedOptions, Pick<IPlatformConfig, 'separator'> {
}

export interface IPathSegmentBaseNameOptions extends IPathSegmentsSharedOptions {
  allowedSpecialSegments?: Set<TAllowedSpecialSegments>;
}
