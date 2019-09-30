import { Path } from '../class/implementation';
import { TPathInput } from '../class/interfaces';

function writeFileExample() {
  const fs = require('fs').promises;

  function writeFile(path: TPathInput, content: Uint8Array): Promise<void> {
    const _path = Path.of(path);
    const _parent = _path.dirname();
    if (_parent === null) {
      return Promise.reject(new Error(`path is not a file`));
    } else {
      return fs.mkdir(_parent.toString())
        .then(() => {
          return fs.writeFile(_path.toString(), content);
        });
    }
  }
}
