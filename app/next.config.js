const withTM = require('next-transpile-modules')(['eth-hooks']);

const withPlugins = require('next-compose-plugins');

const nextConfig = {
  modern: true,
};

module.exports = withPlugins([withTM], nextConfig);
