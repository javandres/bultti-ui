const { override, addBabelPlugins } = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')

module.exports = override(
  // Add some babel plugins
  ...addBabelPlugins("polished", "styled-components"),
  addReactRefresh()
)
