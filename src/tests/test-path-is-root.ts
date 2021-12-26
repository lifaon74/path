import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathIsRoot() {
  return runTest('testPathIsRoot', async () => {
    await assert(() => new Path('c:').isRoot());
    await assert(() => new Path('/').isRoot());
    await assert(() => new Path('c:/').isRoot());
    await assert(() => new Path('\\\\network').isRoot());
    await assert(() => !new Path('c:/a/').isRoot());
    await assert(() => !new Path('\\\\network\\a').isRoot());
    await assert(() => !new Path('/a').isRoot());
  });
}
