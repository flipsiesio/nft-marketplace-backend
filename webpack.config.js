const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

function copyFiles(paths) { // { path_from: path_to }
  const path_default = path.join(__dirname, 'dist/apps');
  const copies = [];
  Object.keys(paths).forEach((path_from) => {
    const path_to = paths[path_from];
    if (fs.existsSync(path_from)) {
      copies.push({
        from: path_from,
        to: path_to || path_default,
        force: true,
      });
    } else {
      console.log(`Doesn't exist ${path_from}`);
    }
  });
  return { patterns: copies };
}

module.exports = {
  plugins: [
    new CopyPlugin(
      copyFiles({
        '.env': '',
        '.env.local': '',
        'apps/cards-cli/src/cards/original': path.join(
          __dirname,
          'dist/apps/cards-cli/original',
        ),
      }),
    ),
  ],
};
