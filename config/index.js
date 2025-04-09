import path from 'path';
import Components from 'unplugin-vue-components/webpack';

import NutUIResolver from '@nutui/nutui-taro/dist/resolver';

const config = {
  projectName: 'vue_taroapp',
  date: '2023-12-20',
  designWidth(input) {
    // 配置 NutUI 375尺寸，1px=2rpx
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375;
    }
    // 全局使用Taro默认的750尺寸，1px=1rpx
    return 750;
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-html',
    [
      '@dcasia/mini-program-tailwind-webpack-plugin/dist/taro',
      {
        enableRpx: true,
        enableDebugLog: true,
        designWidth: 375, // windicss的设计稿宽度rem转为rpx，1px = 2rpx
      },
    ],
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/api': path.resolve(__dirname, '..', 'src/api'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
  },
  mini: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [NutUIResolver({ taro: true })],
        })
      );
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true, // 关闭相同样式引入顺序不同的警告提示，nutUI自动引入样式无冲突
    },
  },
  h5: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [NutUIResolver({ taro: true })],
        })
      );
    },
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro', 'icons-vue-taro'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
