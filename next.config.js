const { ASSET_HOST } = process.env;

// for those who using CDN
const assetPrefix = ASSET_HOST || "";
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);

module.exports = withTM({
  trailingSlash: true,
  assetPrefix,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  webpack: (config, { dev }) => {
    config.output.publicPath = `${assetPrefix}${config.output.publicPath}`;

    return config;
  },
});
