import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';
import { assertFails } from '../../misc/test-tools/assert-fails';

export function testPathIsAbsolute() {
  return runTest('testPathIsAbsolute', async () => {
    await assert(() => new Path('c:').isAbsolute());
    await assert(() => new Path('/').isAbsolute());
    await assert(() => new Path('c:/').isAbsolute());
    await assert(() => new Path('c:\\').isAbsolute());
    await assert(() => new Path('c:/a/').isAbsolute());
    await assert(() => new Path('\\\\network\\g').isAbsolute());
    await assert(() => new Path('/a').isAbsolute());
    await assert(() => !new Path('c').isAbsolute());
    await assertFails(() => new Path('c:a').isAbsolute());
  });
}
