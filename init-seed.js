

const $fs = require('fs').promises;
const $path = require('path');

const config = {
  githubPage: 'lifaon74/path',
  packageName: '@lifaon/path',
  libName: 'path',
  author: 'Valentin Richard',
};

const ROOT = $path.normalize(__dirname);
const DEST = $path.join(ROOT, '..', config.libName);


const tags = Object.entries({
  'lifaon74/path': config.githubPage,
  '@lifaon/path': config.packageName,
  'path': config.libName,
  'Valentin Richard': config.author,
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceTagsInContent(buffer) {
  return tags.reduce((previousValue, [key, value]) => {
    return previousValue.replace(new RegExp(escapeRegExp(key), 'g'), value);
  }, buffer.toString());
}

function replaceTagsInFile(path) {
  console.log('read', path);
  return $fs.readFile(path)
    .then((buffer) => {
      const dest = $path.join(DEST, $path.relative(ROOT, path));
      return $fs.mkdir($path.dirname(dest), { recursive: true })
        .then(() => {
          return $fs.writeFile(dest, replaceTagsInContent(buffer));
        });
    });
}

function searchAndReplaceTags(path) {
  return $fs.readdir(path, { withFileTypes: true })
    .then((entries) => {
      return Promise.all(
        entries.map((entry) => {
          const entryPath = $path.join(path, entry.name);
          if (entry.isFile()) {
            return replaceTagsInFile(entryPath);
          } else if (entry.isDirectory()) {
            return searchAndReplaceTags(entryPath);
          } else {
            console.log(`Unexpected type '${ entryPath }'`);
          }
        })
      );

    });
}

function make() {
  return $fs.stat(DEST)
    .then(() => {
      throw new Error(`Destination '${DEST}' already exists`);
    }, () => {
      return searchAndReplaceTags(ROOT);
    });
}

make()
  .catch((error) => {
    console.error(error);
  });


