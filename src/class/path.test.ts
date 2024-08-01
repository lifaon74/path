import { describe, expect, it } from '@jest/globals';
import { Path } from './path.class.js';

describe('Path', () => {
  describe('constructor', () => {
    it('should throw if path is invalid', () => {
      expect(() => new Path('><')).toThrow();
      expect(() => new Path('/a/h/g"/')).toThrow();
      expect(() => new Path('c:a')).toThrow();
    });
  });

  describe('methods', () => {
    describe('isAbsolute', () => {
      it('should return true with windows root', () => {
        expect(new Path('c:').isAbsolute()).toBe(true);
        expect(new Path('c:/').isAbsolute()).toBe(true);
        expect(new Path('c:\\').isAbsolute()).toBe(true);
        expect(new Path('c:/a/').isAbsolute()).toBe(true);
      });

      it('should return true with windows network root', () => {
        expect(new Path('\\\\network\\g').isAbsolute()).toBe(true);
      });

      it('should return true with posix root', () => {
        expect(new Path('/').isAbsolute()).toBe(true);
        expect(new Path('/a').isAbsolute()).toBe(true);
      });

      it('should return false with relative path', () => {
        expect(new Path('a').isAbsolute()).toBe(false);
        expect(new Path('.').isAbsolute()).toBe(false);
        expect(new Path('..').isAbsolute()).toBe(false);
      });
    });

    describe('isRoot', () => {
      it('should return true with windows root', () => {
        expect(new Path('c:').isRoot()).toBe(true);
        expect(new Path('c:/').isRoot()).toBe(true);
        expect(new Path('c:\\').isRoot()).toBe(true);
      });

      it('should return false with windows non root path', () => {
        expect(new Path('c:/a/').isRoot()).toBe(false);
      });

      it('should return true with windows network root', () => {
        expect(new Path('\\\\network\\g').isRoot()).toBe(false);
      });

      it('should return false with windows non root network path', () => {
        expect(new Path('\\\\network\\g').isRoot()).toBe(false);
      });

      it('should return true with posix root', () => {
        expect(new Path('/').isRoot()).toBe(true);
      });

      it('should return true with posix non root path', () => {
        expect(new Path('/a').isRoot()).toBe(false);
      });

      it('should return false with relative path', () => {
        expect(new Path('a').isRoot()).toBe(false);
        expect(new Path('.').isRoot()).toBe(false);
        expect(new Path('..').isRoot()).toBe(false);
      });
    });

    describe('isSubPathOf', () => {
      it('should works', () => {
        expect(new Path('a/b/').isSubPathOf('a/')).toBe(true);
        expect(new Path('/a/b/').isSubPathOf('a/')).toBe(false);
        expect(new Path('a/b/').isSubPathOf('a/c')).toBe(false);
      });
    });

    describe('equals', () => {
      it('should be true for identical paths', () => {
        expect(new Path('/').equals('/')).toBe(true);
      });

      it('should be true for identical normalized paths', () => {
        expect(new Path('/a/b/../c').equals('/a/c')).toBe(true);
      });

      it('should be false for different paths', () => {
        expect(new Path('/a/b/c').equals('/a/b')).toBe(false);
      });
    });

    describe('dirname', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').dirname()).toThrow();
      });

      it('should return null with a root', () => {
        expect(new Path('/').dirnameOptional()).toBe(null);
      });

      it('should works with absolute path', () => {
        expect(new Path('/a').dirname().toString()).toBe('/');
      });

      it('should works with relative path', () => {
        expect(new Path('a/b').dirname().toString()).toBe('./a');
        expect(new Path('./a/b/c').dirname().toString()).toBe('./a/b');
      });
    });

    describe('basename', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').basename()).toThrow();
      });

      it('should return null with a root', () => {
        expect(new Path('/').basenameOptional()).toBe(null);
      });

      it('should not throw with a root with proper allowedSpecialSegments', () => {
        expect(new Path('/').basename(void 0, ['root'])).toBe('/');
      });

      it('should works with absolute path', () => {
        expect(new Path('/a').basename()).toBe('a');
      });

      it('should works with relative path', () => {
        expect(new Path('a/b').basename()).toBe('b');
      });
    });

    describe('stemAndExt', () => {
      it('should throw with a root', () => {
        expect(() => new Path('/').stemAndExt()).toThrow();
      });

      it('should return correct values', () => {
        expect(new Path('a.b').stemAndExt()).toEqual({ stem: 'a', ext: '.b' });
        expect(new Path('a.b.c').stemAndExt()).toEqual({ stem: 'a.b', ext: '.c' });
        expect(new Path('a.').stemAndExt()).toEqual({ stem: 'a', ext: '.' });
        expect(new Path('a').stemAndExt()).toEqual({ stem: 'a', ext: '' });
        expect(new Path('.a').stemAndExt()).toEqual({ stem: '.a', ext: '' });
      });
    });

    describe('commonBase', () => {
      it('should throw if no common base', () => {
        expect(() => new Path('/a/b/').commonBase('a/c')).toThrow();
      });

      it('should return correct values', () => {
        expect(new Path('a/./b/').commonBase('./a/b').toString()).toBe('./a/b');
        expect(new Path('a/b/').commonBase('a/c').toString()).toBe('./a');
        expect(new Path('/a/b/').commonBase('/a/c').toString()).toBe('/a');
        expect(new Path('a/b').commonBase('c/d').toString()).toBe('.');
        expect(new Path('/a/b').commonBase('/c/d').toString()).toBe('/');
      });
    });

    describe('relative', () => {
      it('should throw if not relative', () => {
        expect(() => new Path('a/b/').relative('/a/d')).toThrow();
        expect(() => new Path('/a/b').relative('./a')).toThrow();
      });

      it('should return correct values', () => {
        expect(new Path('a/b/').relative('a/d').toString()).toBe('../d');
        expect(new Path('a/b/').relative('c/d').toString()).toBe('../../c/d');
        expect(new Path('a/').relative('a/').toString()).toBe('.');
        expect(new Path('/a/b').relative('/a/c').toString()).toBe('../c');
        expect(new Path('/').relative('/d/e').toString()).toBe('./d/e');
      });
    });

    describe('concat', () => {
      it('should throw if not possible', () => {
        expect(() => new Path('/a/b/').concat('/c/d')).toThrow();
      });

      it('should return correct values', () => {
        expect(new Path('a/b/').concat('c/d').toString()).toBe('./a/b/c/d');
        expect(new Path('a/b/').concat('c/d').toString()).toBe('./a/b/c/d');
        expect(new Path('/').concat('c/d').toString()).toBe('/c/d');
      });
    });

    describe('resolve', () => {
      it('should throw in case of invalid root', () => {
        expect(() => new Path('/a/b/').resolve('a')).toThrow();
      });

      it('should return correct values', () => {
        expect(new Path('a').resolve('c:').toString()).toBe('c:/a');
        expect(new Path('b:/a').resolve('c:').toString()).toBe('b:/a');
      });
    });

    describe('makeRelative', () => {
      it('should return correct values', () => {
        expect(new Path('/').makeRelative().toString()).toBe('.');
        expect(new Path('/a').makeRelative().toString()).toBe('./a');
        expect(new Path('c:/a').makeRelative().toString()).toBe('./a');
      });
    });

    describe('makeAbsolute', () => {
      it('should return correct values', () => {
        expect(new Path('/').makeAbsolute('/').toString()).toBe('/');
        expect(new Path('./a').makeAbsolute('/').toString()).toBe('/a');
        expect(new Path('../../a').makeAbsolute('/').toString()).toBe('/a');
      });
    });

    describe('toString', () => {
      it('should return correct values', () => {
        expect(new Path('a/b/').toString()).toBe('./a/b');
        expect(new Path('/a/b/').toString()).toBe('/a/b');
        expect(() => new Path('/a/../../').toString()).toThrow();
        expect(new Path('./a/b/').toString()).toBe('./a/b');
        expect(new Path('../a/b/').toString()).toBe('../a/b');
        expect(new Path('a/b/..').toString()).toBe('./a');
        expect(new Path('a/b/../..').toString()).toBe('.');
        expect(new Path('a/./b/').toString()).toBe('./a/b');
        expect(new Path('/').toString()).toBe('/');
        expect(new Path('c:/').toString()).toBe('c:/');
        expect(new Path('C:/').toString()).toBe('C:/');
        expect(new Path('c:\\a').toString()).toBe('c:/a');
        expect(new Path('\\\\network\\a').toString()).toBe('\\\\network/a');
        expect(new Path('../../').toString()).toBe('../..');
      });
    });
  });
});
