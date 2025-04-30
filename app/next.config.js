/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: !isProd,
});

module.exports = withPWA({
  reactStrictMode: true,
});
