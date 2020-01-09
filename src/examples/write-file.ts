import { Path } from '../class/implementation';
import { IPath, TPathInput } from '../class/interfaces';

function writeFileExample() {
  const fs = require('fs').promises;

  function writeFile(path: TPathInput, content: Uint8Array): Promise<void> {
    const _path: IPath = Path.of(path); // 'path' may be both a Path or a string, or something similar, so we use Path.of
    const _parent: IPath | null = _path.dirname(); // gets the parent's Path of '_path'
    if (_parent === null) {
      return Promise.reject(new Error(`path is not a file`));
    } else {
      return fs.mkdir(_parent.toString(), { recursive: true }) // creates the parent directory
        .then(() => {
          return fs.writeFile(_path.toString(), content); // write the file
        });
    }
  }
}
