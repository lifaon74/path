import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';

export function testPathRelative() {
  return runTest('testPathRelative', async () => {
    await assert(() => ((new Path('a/b/').relative('a/d') as Path).toString() === '../d'));
    await assert(() => (new Path('a/b/').relative('/a/d') === null));
    await assert(() => (new Path('/a/b').relative('./a') === null));
    await assert(() => ((new Path('a/b/').relative('c/d') as Path).toString() === '../../c/d'));
    await assert(() => ((new Path('a/').relative('a/') as Path).toString() === '.'));
    await assert(() => ((new Path('/a/b').relative('/a/c') as Path).toString() === '../c'));
    await assert(() => ((new Path('/').relative('/d/e') as Path).toString() === './d/e'));
  });
}
