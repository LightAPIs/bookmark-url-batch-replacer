const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const fs = require('fs');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';
const manifestV3 = process.env.VUE_APP_MANIFEST === 'v3';

// Generate pages object
const pages = {};

const chromeName = ['background', 'index'];

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.js`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunk-vendors', 'chunk-common', name],
  };
});

const modeName = productionMode ? 'build' : 'dist';
const manifestName = manifestV3 ? 'v3' : 'v2';
const folderName = `${modeName}/${manifestName}`;
const copyFiles = [
  {
    from: path.resolve(`src/manifest/${manifestName}/manifest.${productionMode ? 'production' : 'development'}.json`),
    to: `${path.resolve(folderName)}/manifest.json`,
  },
];

copyFiles.push({
  from: path.resolve('src/assets'),
  to: path.resolve(folderName),
});

process.env.VUE_APP_VERSION = productionMode ? packageInfo.version : packageInfo.version + ' (Dev)';

module.exports = {
  outputDir: folderName,
  pages,
  filenameHashing: false,
  productionSourceMap: false,
  lintOnSave: 'warning',
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: copyFiles,
      })
    );

    if (manifestV3) {
      config.devtool = 'inline-source-map';

      config.plugins.push({
        apply: compiler => {
          compiler.hooks.done.tap('delBGFile', _compilation => {
            try {
              const bgFile = `${path.resolve(folderName)}/background.html`;
              if (fs.existsSync(bgFile)) {
                fs.unlinkSync(bgFile);
              }
            } catch (e) {
              console.log(e);
            }
          });
        },
      });
    }

    if (productionMode) {
      Object.assign(config.optimization.minimizer[0].options.terserOptions.compress, {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      });

      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_manifest-${manifestName}_v${packageInfo.version}.zip`,
        })
      );
    }

    config.performance = {
      hints: false,
    };
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
