export interface IPathPlatformConfig {
  readonly rootPattern: string;
  readonly rootRegExp: RegExp;
  readonly separator: string;
  readonly delimiterPattern: string;
  readonly delimiterRegExp: RegExp;
  readonly invalidPathSegmentPattern: string;
  readonly invalidPathSegmentRegExp: RegExp;
}
