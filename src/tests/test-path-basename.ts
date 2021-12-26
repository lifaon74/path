import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathBasename() {
  return runTest('testPathBasename', async () => {
    await assert(() => (new Path('/').basename() === null));
    await assert(() => (new Path('/').basename(void 0, ['root'] as ['root']) === '/'));
    await assert(() => (new Path('/a').basename() === 'a'));
    await assert(() => (new Path('a/b').basename() === 'b'));
  });
}
