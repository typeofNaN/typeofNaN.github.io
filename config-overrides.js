const { 
  override, 
  fixBabelImports,
} = require('customize-cra');

// 使用ant-design搭建React+ts项目，可在此重重定义antd全局样式
const overConfig  = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  })
);

module.exports = function (config, env) {
  return overConfig(config, env)
}