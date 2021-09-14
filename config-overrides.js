const {
  override,
  fixBabelImports,
  adjustStyleLoaders,
  addWebpackModuleRule
} = require('customize-cra')
const path = require('path')

// 使用ant-design搭建React+ts项目，可在此重重定义antd全局样式
const overConfig = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: ['./src/assets/styles/common.scss'] //这里是你自己放公共scss变量的路径
        }
      })
    }
  }),
  addWebpackModuleRule({
    test: /\.svg$/,
    include: [path.join(__dirname, 'src/icons')],
    use: [{
      loader: 'svg-sprite-loader',
      options: {
        symbolId: "icon-[name]"
      }
    }]
  })
)

module.exports = function (config, env) {
  return overConfig(config, env)
}