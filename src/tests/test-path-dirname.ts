import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathDirname() {
  return runTest('testPathDirname', async () => {
    await assert(() => (new Path('/').dirname() === null));
    await assert(() => ((new Path('/a').dirname() as Path).toString() === '/'));
    await assert(() => ((new Path('a/b').dirname() as Path).toString() === './a'));
    await assert(() => ((new Path('./a/b/c').dirname() as Path).toString() === './a/b'));
  });
}
