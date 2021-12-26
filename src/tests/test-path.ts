import { runTest } from '../../misc/test-tools/run-test';
import { testPathInvalid } from './test-path-invalid';
import { testPathIsAbsolute } from './test-path-is-absolute';
import { testPathIsRoot } from './test-path-is-root';
import { testPathIsSubPathOf } from './test-path-is-sub-path-of';
import { testPathToString } from './test-path-to-string';
import { testPathEquals } from './test-path-equals';
import { testPathDirname } from './test-path-dirname';
import { testPathBasename } from './test-path-basename';
import { testPathStemAndExt } from './test-path-stem-and-ext';
import { testPathCommonBase } from './test-path-common-base';
import { testPathConcat } from './test-path-concat';
import { testPathRelative } from './test-path-relative';
import { testPathResolve } from './test-path-resolve';
import { testPathMakeAbsolute } from './test-path-make-absolute';
import { testPathMakeRelative } from './test-path-make-relative';

export function testPath() {
  return runTest('testPath', async () => {
    await testPathInvalid();
    await testPathIsAbsolute();
    await testPathIsRoot();
    await testPathIsSubPathOf();
    await testPathToString();
    await testPathEquals();
    await testPathDirname();
    await testPathBasename();
    await testPathStemAndExt();
    await testPathCommonBase();
    await testPathRelative();
    await testPathConcat();
    await testPathResolve();
    await testPathMakeAbsolute();
    await testPathMakeRelative();
  });
}
