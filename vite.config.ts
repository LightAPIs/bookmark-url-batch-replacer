import { defineConfig, type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import copyPack from 'rollup-plugin-copy';
import zipPack from 'vite-plugin-zip-pack';
import path from 'path';
import packageInfo from './package.json';

const productionMode = process.env.NODE_ENV === 'production';
const browserMode = process.env.BROWSER === 'ff' ? 'firefox' : 'chrome';
const zipMode = process.env.ZIP_MODE === 'true';
const modeDir = productionMode ? 'build' : 'dist';

const htmlNames = ['index'];
const jsNames = ['background'];
const pages = {};

htmlNames.forEach(name => {
  pages[name] = `src/${name}/index.html`;
});
jsNames.forEach(name => {
  pages[name] = `src/${name}/index.ts`;
});

const destDir = `${modeDir}/${browserMode}`;
const outDir = `${path.resolve(__dirname, destDir)}`;

const plugins: PluginOption[] = [
  vue(),
  Components({
    dts: true,
    resolvers: [
      AntDesignVueResolver({
        importStyle: false,
      }),
    ],
  }),
  copyPack({
    targets: [
      {
        src: `src/manifest/${browserMode}/manifest.json`,
        dest: destDir,
        rename: 'manifest.json',
      },
    ],
    hook: 'writeBundle',
  }),
];

if (zipMode) {
  plugins.push(
    zipPack({
      inDir: 'build',
      outDir: 'archive',
      outFileName: `${packageInfo.name}-manifest-${browserMode}_v${packageInfo.version}.zip`,
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: pages,
      output: {
        entryFileNames: 'js/[name].js',
      },
    },
    outDir,
    sourcemap: !productionMode,
    chunkSizeWarningLimit: 1024,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'src/assets',
  plugins,
});
