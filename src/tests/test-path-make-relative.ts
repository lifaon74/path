import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathMakeRelative() {
  return runTest('testPathMakeRelative', async () => {
    await assert(() => (new Path('/').makeRelative().toString() === '.'));
    await assert(() => (new Path('/a').makeRelative().toString() ===  './a'));
    await assert(() => (new Path('c:/a').makeRelative().toString() ===  './a'));
  });
}
