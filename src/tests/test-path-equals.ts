import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathEquals() {
  return runTest('testPathEquals', async () => {
    await assert(() => (new Path('/').equals('/')));
    await assert(() => (new Path('/a/b/../c').equals('/a/c')));
    await assert(() => (!new Path('/a/b/c').equals('/a/b')));
  });
}
