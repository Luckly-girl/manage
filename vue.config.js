const path = require("path");
// const PrerenderSpaPlugin = require('prerender-spa-plugin')
// const Renderer = require('prerender-spa-plugin').PuppeteerRenderer;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // outputDir: 'cdn-manager-vue',
  devServer: {
    port: 8888,
    host: "0.0.0.0",
    https: false,
    open: true,
    proxy: {

      "/api": {
        // 目标服务器地址, 代理访问
        target: "http://csmanage.bxyun.cn",
        // target: "http://localhost:8077",
        changeOrigin: true, // 开启代理服务器
        // pathRewrite: {
        secure: false,
        //   "^/api": "/"
        // }
      }
    },
  },
  publicPath: '/',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]', // 提示compression-webpack-plugin@3.0.0的话asset改为filename
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      // new PrerenderSpaPlugin({
      //   staticDir: path.join(__dirname, 'dist'),
      //   routes: [ '/', '/login', '/regist'],
      //   renderer: new Renderer({
      //     inject: {},
      //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //     renderAfterDocumentEvent: 'render-event'
      //   })
      // })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
        }),
      ]
    },
    externals: {
      // 'vue': 'Vue',
      // 'element-ui': 'ELEMENT',
      // 'vue-router': 'VueRouter',
      // 'vuex': 'store'
    },
    resolve: {
      alias: {
        "@assets": resolve("src/assets"),
        "@components": resolve("src/components"),
        "@views": resolve("src/views"),
        "@css": resolve("src/assets/css"),
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  }
};