const withTM = require('next-transpile-modules')(['eth-hooks']);

const withPlugins = require('next-compose-plugins');

const nextConfig = {
  modern: true,
  swcMinify: false,
};

module.exports = withPlugins([withTM], nextConfig);
