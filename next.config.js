const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    localeDetection: false,
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
      },
      {
        domain: 'example.ar',
        defaultLocale: 'ar',
      },
    ],
  },
  images: {
    domains: [
      'flagcdn.com',
      "res.cloudinary.com"
    ],
  },
  env: {
    NEXTAUTH_SECRET: '2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8',
    NEXTAUTH_URL: 'http://localhost:3000/'
  },
};

module.exports = nextConfig;
