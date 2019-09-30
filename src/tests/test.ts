// import * as $path from 'path';
import { Path } from '../class/implementation';
import { assert, assertFails } from './asserts';
import { IStemAndExtTuple } from '../core/interfaces';
import { IPath } from '../class/interfaces';

export async function testPath() {

  await assert(() => new Path('c:').isAbsolute());
  await assert(() => new Path('/').isAbsolute());
  await assert(() => new Path('c:/').isAbsolute());
  await assert(() => new Path('c:\\').isAbsolute());
  await assert(() => new Path('c:/a/').isAbsolute());
  await assert(() => new Path('\\\\network\\g').isAbsolute());
  await assert(() => new Path('/a').isAbsolute());
  await assert(() => !new Path('c').isAbsolute());
  await assertFails(() => new Path('c:a').isAbsolute());

  await assert(() => new Path('c:').isRoot());
  await assert(() => new Path('/').isRoot());
  await assert(() => new Path('c:/').isRoot());
  await assert(() => new Path('\\\\network').isRoot());
  await assert(() => !new Path('c:/a/').isRoot());
  await assert(() => !new Path('\\\\network\\a').isRoot());
  await assert(() => !new Path('/a').isRoot());

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

  await assert(() => ((new Path('a/./b/').commonBase('./a/b') as IPath).toString() === './a/b'));
  await assert(() => ((new Path('a/b/').commonBase('a/c') as IPath).toString() === './a'));
  await assert(() => ((new Path('/a/b/').commonBase('/a/c') as IPath).toString() === '/a'));
  await assert(() => ((new Path('a/b').commonBase('c/d') as IPath).toString() === '.'));
  await assert(() => ((new Path('/a/b').commonBase('/c/d') as IPath).toString() === '/'));
  await assert(() => (new Path('/a/b/').commonBase('a/c') === null));

  await assert(() => (new Path('a/b/').isSubPathOf('a/')));
  await assert(() => (!new Path('/a/b/').isSubPathOf('a/')));
  await assert(() => (!new Path('a/b/').isSubPathOf('a/c')));

  await assert(() => (new Path('a/b/').concat('c/d').toString() === './a/b/c/d'));
  await assert(() => (new Path('a/b/').concat('c/d').toString() === './a/b/c/d'));
  await assert(() => (new Path('/').concat('c/d').toString() === '/c/d'));
  await assertFails(() => (new Path('/a/b/').concat('/c/d')));

  await assert(() => ((new Path('a/b/').relative('a/d') as IPath).toString() === '../d'));
  await assert(() => (new Path('a/b/').relative('/a/d') === null));
  await assert(() => (new Path('/a/b').relative('./a') === null));
  await assert(() => ((new Path('a/b/').relative('c/d') as IPath).toString() === '../../c/d'));
  await assert(() => ((new Path('a/').relative('a/') as IPath).toString() === '.'));
  await assert(() => ((new Path('/a/b').relative('/a/c') as IPath).toString() === '../c'));
  await assert(() => ((new Path('/').relative('/d/e') as IPath).toString() === './d/e'));

  // await assert(() => (new Path('a').resolve().toString() === $path.join(process.cwd(), 'a').replace(/\\/g, '/')));
  // await assert(() => (new Path('../../').resolve().toString() === $path.join(process.cwd(), '../..').replace(/\\/g, '/')));
  await assert(() => (new Path('a').resolve('c:').toString() === 'c:/a'));
  await assert(() => (new Path('b:/a').resolve('c:').toString() === 'b:/a'));

  await assert(() => (new Path('/').dirname() === null));
  await assert(() => ((new Path('/a').dirname() as IPath).toString() === '/'));
  await assert(() => ((new Path('a/b').dirname() as IPath).toString() === './a'));

  await assert(() => (new Path('/').basename() === null));
  await assert(() => (new Path('/').basename(void 0, ['root'] as ['root']) === '/'));
  await assert(() => (new Path('/a').basename() === 'a'));
  await assert(() => (new Path('a/b').basename() === 'b'));

  await assert(() => ((new Path('a.b').stemAndExt() as IStemAndExtTuple).ext === '.b'));
  await assert(() => ((new Path('a.b.c').stemAndExt() as IStemAndExtTuple).ext === '.c'));
  await assert(() => ((new Path('a.').stemAndExt() as IStemAndExtTuple).ext === '.'));
  await assert(() => ((new Path('a').stemAndExt() as IStemAndExtTuple).ext === ''));
  await assert(() => ((new Path('.a').stemAndExt() as IStemAndExtTuple).ext === ''));

  await assert(() => ((new Path('a.b').stemAndExt() as IStemAndExtTuple).stem === 'a'));

  await assert(() => (new Path('/').forceAbsolute('/').toString() === '/'));
  await assert(() => (new Path('./a').forceAbsolute('/').toString() === '/a'));
  await assert(() => (new Path('../../a').forceAbsolute('/').toString() === '/a'));

  await assert(() => (new Path('/').forceRelative().toString() === '.'));
  await assert(() => (new Path('/a').forceRelative().toString() ===  './a'));
  await assert(() => (new Path('c:/a').forceRelative().toString() ===  './a'));
}



