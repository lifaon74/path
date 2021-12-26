import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';
import { assertFails } from '../../misc/test-tools/assert-fails';

export function testPathToString() {
  return runTest('testPathToString', async () => {
    await assert(() => (new Path('a/b/').toString() === './a/b'));
    await assert(() => (new Path('/a/b/').toString() === '/a/b'));
    await assertFails(() => (new Path('/a/../../').toString() === '/'));
    await assert(() => (new Path('./a/b/').toString() === './a/b'));
    await assert(() => (new Path('../a/b/').toString() === '../a/b'));
    await assert(() => (new Path('a/b/..').toString() === './a'));
    await assert(() => (new Path('a/b/../..').toString() === '.'));
    await assert(() => (new Path('a/./b/').toString() === './a/b'));
    await assert(() => (new Path('/').toString() === '/'));
    await assert(() => (new Path('c:/').toString() === 'c:/'));
    await assert(() => (new Path('C:/').toString() === 'C:/'));
    await assert(() => (new Path('c:\\a').toString() === 'c:/a'));
    await assert(() => (new Path('\\\\network\\a').toString() === '\\\\network/a'));
    await assert(() => (new Path('../../').toString() === '../..'));
  });
}
