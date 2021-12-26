import { runTest } from '../../misc/test-tools/run-test';
import { assertFails } from '../../misc/test-tools/assert-fails';
import { Path } from '../class/path.class';

export function testPathInvalid() {
  return runTest('testPathInvalid', async () => {
    await assertFails(() => new Path('><'));
    await assertFails(() => new Path('/a/h/g"/'));
    await assertFails(() => new Path('c:a'));
  });
}
