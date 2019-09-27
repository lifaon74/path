const makeUglify = require('./make-uglify');

makeUglify('dist/global/path.esnext.umd.js', {
  compress: {
    inline: false
  },
});
