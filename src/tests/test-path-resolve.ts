import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathResolve() {
  return runTest('testPathResolve', async () => {
    await assert(() => (new Path('a').resolve('c:').toString() === 'c:/a'));
    await assert(() => (new Path('b:/a').resolve('c:').toString() === 'b:/a'));
  });
}
