import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';
import { assertFails } from '../../misc/test-tools/assert-fails';

export function testPathConcat() {
  return runTest('testPathConcat', async () => {
    await assert(() => (new Path('a/b/').concat('c/d').toString() === './a/b/c/d'));
    await assert(() => (new Path('a/b/').concat('c/d').toString() === './a/b/c/d'));
    await assert(() => (new Path('/').concat('c/d').toString() === '/c/d'));
    await assertFails(() => (new Path('/a/b/').concat('/c/d')));
  });
}
