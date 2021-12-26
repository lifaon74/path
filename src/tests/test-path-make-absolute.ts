import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathMakeAbsolute() {
  return runTest('testPathMakeAbsolute', async () => {
    await assert(() => (new Path('/').makeAbsolute('/').toString() === '/'));
    await assert(() => (new Path('./a').makeAbsolute('/').toString() === '/a'));
    await assert(() => (new Path('../../a').makeAbsolute('/').toString() === '/a'));
  });
}
