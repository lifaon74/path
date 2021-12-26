import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathIsSubPathOf() {
  return runTest('testPathIsSubPathOf', async () => {
    await assert(() => (new Path('a/b/').isSubPathOf('a/')));
    await assert(() => (!new Path('/a/b/').isSubPathOf('a/')));
    await assert(() => (!new Path('a/b/').isSubPathOf('a/c')));
  });
}
