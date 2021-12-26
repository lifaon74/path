import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathCommonBase() {
  return runTest('testPathCommonBase', async () => {
    await assert(() => ((new Path('a/./b/').commonBase('./a/b') as Path).toString() === './a/b'));
    await assert(() => ((new Path('a/b/').commonBase('a/c') as Path).toString() === './a'));
    await assert(() => ((new Path('/a/b/').commonBase('/a/c') as Path).toString() === '/a'));
    await assert(() => ((new Path('a/b').commonBase('c/d') as Path).toString() === '.'));
    await assert(() => ((new Path('/a/b').commonBase('/c/d') as Path).toString() === '/'));
    await assert(() => (new Path('/a/b/').commonBase('a/c') === null));
  });
}


