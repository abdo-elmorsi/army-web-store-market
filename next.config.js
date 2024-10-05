const il8nextConfig = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: il8nextConfig.i18n,
};

module.exports = nextConfig;
