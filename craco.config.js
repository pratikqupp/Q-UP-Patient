const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true
          }
        }
      }
    },
  ],
  env: {
    production: {
      webpack: {
        configure: (webpackConfig, { env, paths }) => {
          // Exclude React Refresh runtime from production builds
          webpackConfig.optimization.runtimeChunk = false;
          webpackConfig.optimization.splitChunks = undefined;
          return webpackConfig;
        },
      },
    },
  },
};
