import { runTest } from '../../misc/test-tools/run-test';
import { assert } from '../../misc/test-tools/assert';
import { Path } from '../class/path.class';
import { IStemAndExtTuple } from '../segments/segment/functions/get/get-stem-and-ext-entry-path-segment';

export function testPathStemAndExt() {
  return runTest('testPathStemAndExt', async () => {
    await assert(() => ((new Path('a.b').stemAndExt() as IStemAndExtTuple).ext === '.b'));
    await assert(() => ((new Path('a.b.c').stemAndExt() as IStemAndExtTuple).ext === '.c'));
    await assert(() => ((new Path('a.').stemAndExt() as IStemAndExtTuple).ext === '.'));
    await assert(() => ((new Path('a').stemAndExt() as IStemAndExtTuple).ext === ''));
    await assert(() => ((new Path('.a').stemAndExt() as IStemAndExtTuple).ext === ''));

    await assert(() => ((new Path('a.b').stemAndExt() as IStemAndExtTuple).stem === 'a'));
  });
}
