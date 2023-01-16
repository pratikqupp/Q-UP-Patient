
module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => {
        return {
          url: false,
        };
      },
    },
  },
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
